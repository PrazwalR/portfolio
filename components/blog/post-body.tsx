import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a markdown post body with the site's design tokens (no typography
 * plugin). Element -> class map keeps prose on-theme: muted body text, accent
 * links + list markers, mono inline code. Server-rendered (static, ships no JS).
 * `node` is destructured out of every mapping so it never leaks onto the DOM.
 */
const components: Components = {
  h2: ({ node, ...props }) => (
    <h2
      className="mt-12 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-5 leading-relaxed text-muted-foreground" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="mb-5 ml-5 list-disc space-y-2 text-muted-foreground marker:text-accent"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="mb-5 ml-5 list-decimal space-y-2 text-muted-foreground marker:text-muted-foreground"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mb-5 border-l-2 border-accent pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: ({ node, ...props }) => (
    <code
      className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      {...props}
    />
  ),
  a: ({ node, href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-4 transition-opacity hover:opacity-80"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  },
};

export function PostBody({ content }: { content: string }) {
  return (
    <div className="text-[1.05rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
