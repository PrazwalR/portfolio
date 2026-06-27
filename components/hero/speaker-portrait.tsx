"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * Hero speaker portrait — Prazwal presenting at VIT Chennai, background removed
 * (rembg / isnet) so it's a real transparent cutout, not a masked rectangle.
 * Rendered large + semi-faded so the subject sits inside the smoke field, with a
 * soft bottom feather where the podium base would otherwise look cut, and a drop
 * shadow for depth. Scales up + bleeds toward the corner on desktop (clipped by
 * the hero's overflow-hidden). Drifts on scroll; static under reduced-motion.
 */
export function SpeakerPortrait({ className = "" }: { className?: string }) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -56]);

  return (
    <motion.div
      style={{ y }}
      className={`relative ${className}`}
      aria-hidden={false}
    >
      {/* enlarge via inner wrapper so it doesn't fight framer's transform */}
      <div className="relative mx-auto aspect-[1.45] w-full max-w-xl scale-[1.18] origin-bottom sm:scale-125 lg:max-w-2xl lg:max-w-none lg:scale-[1.06] lg:origin-bottom-left lg:translate-x-0">
        {/* accent haze pooled behind the subject, separates them from the smoke */}
        <div className="pointer-events-none absolute inset-x-8 bottom-6 top-10 -z-10 rounded-[40%] bg-accent/15 blur-3xl" />
        <Image
          src="/prazwal-speaker-cutout.png"
          alt="Prazwal Ratti speaking at a Web3 workshop at VIT Chennai"
          fill
          priority
          sizes="(min-width: 1024px) 42rem, 100vw"
          className="object-contain object-bottom opacity-[0.68] [mask-image:linear-gradient(to_top,transparent,#000_16%)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
        />
      </div>
    </motion.div>
  );
}
