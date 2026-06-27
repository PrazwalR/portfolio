"use client";

import { useEffect, useRef } from "react";

/**
 * Hero smoke field — raw WebGL (no three.js). A domain-warped fbm value-noise
 * cloud animated on the GPU, tinted with the accent (--acc-rgb), additively
 * blended so it reads as luminous drifting smoke over the dark background.
 *
 * Keeps the dot-field's interaction model: cursor adds a soft glow that the
 * smoke leans toward, and a pointer-down fires an expanding shockwave ring.
 * DPR is capped (1.5 desktop / 1.0 mobile) and octaves drop on mobile for perf.
 * Under prefers-reduced-motion it renders a single static frame (no RAF).
 * If WebGL is unavailable it renders nothing — HeroBackground still paints the
 * grid + accent glow, so the hero degrades gracefully.
 */

const MAX_BURSTS = 6;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const frag = (octaves: number) => `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uAcc;      // accent rgb, 0..1
uniform vec2  uMouse;    // px, y-down (canvas space); -9999 when absent
uniform vec3  uBursts[${MAX_BURSTS}]; // (x_px, y_px, ageSeconds)
uniform int   uBurstCount;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < ${octaves}; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  // canvas-space coords (y-down) so px-based uniforms line up
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = frag / uRes.y;          // aspect-correct, scaled by height
  float t = uTime * 0.16;

  // organic warp bends the curtains so they ripple instead of striping
  float warp = fbm(vec2(uv.x * 1.3 + t * 0.5, uv.y * 0.5 - t * 0.6));
  float x = uv.x + warp * 0.38;

  // stacked aurora curtains: sharp filaments where the sine crosses zero
  float c1 = pow(1.0 - abs(sin(x * 3.0  + warp * 2.5 + t)),       2.0);
  float c2 = pow(1.0 - abs(sin(x * 6.0  - warp * 1.8 - t * 1.3)), 2.4);
  float c3 = pow(1.0 - abs(sin(x * 12.0 + warp * 3.2 + t * 0.7)), 2.8);
  float curtains = c1 * 0.52 + c2 * 0.34 + c3 * 0.22;

  // upward shimmer; brighter toward the top, calmer down by the CTAs
  float flow = fbm(vec2(uv.x * 2.0 - t * 0.4, uv.y * 1.2 + t * 0.5));
  float vmask = 0.5 + 0.5 * smoothstep(0.0, 1.0, uv.y);
  float aurora = curtains * (0.72 + 0.75 * flow) * vmask;

  // cursor glow: curtains bloom toward the pointer
  float glow = 0.0;
  if (uMouse.x > -9000.0) {
    float md = distance(frag, uMouse);
    glow = (1.0 - smoothstep(0.0, 240.0, md)) * 0.6;
  }

  // pointer-down shockwave rings
  float ring = 0.0;
  for (int i = 0; i < ${MAX_BURSTS}; i++) {
    if (i >= uBurstCount) break;
    vec3 b = uBursts[i];
    float age = b.z;
    float rr = age * 540.0;
    float bd = distance(frag, b.xy);
    float prox = 1.0 - min(abs(bd - rr) / 80.0, 1.0);
    float fade = max(0.0, 1.0 - age / 0.85);
    ring += prox * fade * 0.6;
  }

  float intensity = clamp(aurora + glow * 0.8 + ring * 0.7, 0.0, 1.0);

  // dim toward the left so the headline / CTAs keep contrast
  float readGuard = smoothstep(0.0, 0.55, uv.x * uRes.y / uRes.x);
  float alpha = intensity * (0.62 + glow * 0.5 + ring * 0.5) * (0.55 + 0.45 * readGuard);

  // cool palette: accent blue deepening to cyan in the hottest filaments
  vec3 cyan = mix(uAcc, vec3(0.45, 0.95, 1.0), 0.6);
  vec3 col = mix(uAcc * 0.85, cyan, smoothstep(0.2, 1.0, intensity));
  col += (glow * 0.3 + ring * 0.4) * cyan;

  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export function SmokeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const octaves = isMobile ? 4 : 5;

    const accStr =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--acc-rgb")
        .trim() || "54, 183, 243";
    const acc = accStr.split(",").map((n) => parseFloat(n) / 255);

    // --- compile ---
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("SmokeField shader:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, frag(octaves));
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("SmokeField link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // full-screen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAcc = gl.getUniformLocation(prog, "uAcc");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uBursts = gl.getUniformLocation(prog, "uBursts");
    const uBurstCount = gl.getUniformLocation(prog, "uBurstCount");

    gl.uniform3f(uAcc, acc[0] ?? 0.21, acc[1] ?? 0.72, acc[2] ?? 0.95);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive -> luminous smoke

    let w = 0,
      h = 0,
      dpr = 1;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    fit();

    // pointer state (in device px to match gl_FragCoord)
    let mx = -9999,
      my = -9999;
    const bursts: { x: number; y: number; t: number }[] = [];

    const localXY = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
    };
    const onMove = (e: PointerEvent) => {
      const p = localXY(e);
      mx = p.x;
      my = p.y;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const p = localXY(e);
      if (p.x >= 0 && p.x <= canvas.width && p.y >= 0 && p.y <= canvas.height) {
        bursts.push({ x: p.x, y: p.y, t: performance.now() });
        if (bursts.length > MAX_BURSTS) bursts.shift();
      }
    };
    const onResize = () => fit();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onResize);

    const t0 = performance.now();
    let raf = 0;
    const burstBuf = new Float32Array(MAX_BURSTS * 3);

    const render = () => {
      const now = performance.now();
      const time = (now - t0) / 1000;

      for (let k = bursts.length - 1; k >= 0; k--) {
        if ((now - bursts[k].t) / 1000 > 0.85) bursts.splice(k, 1);
      }
      for (let i = 0; i < bursts.length; i++) {
        burstBuf[i * 3] = bursts[i].x;
        burstBuf[i * 3 + 1] = bursts[i].y;
        burstBuf[i * 3 + 2] = (now - bursts[i].t) / 1000;
      }

      gl.uniform1f(uTime, reduce ? 0 : time);
      gl.uniform2f(uMouse, mx, reduce ? -9999 : my);
      gl.uniform1i(uBurstCount, bursts.length);
      gl.uniform3fv(uBursts, burstBuf);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduce) raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
