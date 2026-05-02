import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { stripFrontmatter } from '../data/recipes';

let mermaidInitialized = false;

export function resolveMarkdownUrl(url: string, assetBaseUrl?: string) {
  if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(url) || !assetBaseUrl) {
    return url;
  }
  return new URL(url.replace(/^\.\//, ''), assetBaseUrl).toString();
}

function textFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return textFromChildren(child.props.children);
      }
      return '';
    })
    .join('');
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function scrollToArticleHeading(href: string | undefined, event: React.MouseEvent<HTMLAnchorElement>) {
  if (!href?.startsWith('#')) {
    return;
  }

  event.preventDefault();
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) {
    return;
  }

  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function MermaidDiagram({ code, index }: { code: string; index: number }) {
  const [svg, setSvg] = React.useState('');
  const [error, setError] = React.useState('');
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import('mermaid');
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'default',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            flowchart: {
              htmlLabels: true,
              curve: 'basis',
            },
          });
          mermaidInitialized = true;
        }
        const { svg: renderedSvg } = await mermaid.render(`recipe-mermaid-${index}-${Date.now()}`, code);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError('');
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : 'Unable to render diagram.');
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, index]);

  return (
    <figure className="my-8 rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_18px_50px_rgba(251,146,60,0.1)]">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Zoom out diagram"
          onClick={() => setZoom((current) => Math.max(0.6, Number((current - 0.1).toFixed(2))))}
          className="rounded-full border border-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 hover:text-pink-600"
        >
          -
        </button>
        <button
          type="button"
          aria-label="Reset diagram zoom"
          onClick={() => setZoom(1)}
          className="rounded-full border border-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 hover:text-pink-600"
        >
          Reset
        </button>
        <button
          type="button"
          aria-label="Zoom in diagram"
          onClick={() => setZoom((current) => Math.min(2, Number((current + 0.1).toFixed(2))))}
          className="rounded-full border border-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 hover:text-pink-600"
        >
          +
        </button>
      </div>
      <div className="overflow-auto">
        {error ? (
          <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            Mermaid diagram could not be rendered. Check the recipe source syntax.
          </div>
        ) : (
          <div
            className="min-w-[36rem] origin-top-left transition-transform [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none"
            style={{ transform: `scale(${zoom})`, width: `${100 / zoom}%` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </figure>
  );
}

export function MarkdownArticle({ markdown, assetBaseUrl }: { markdown: string; assetBaseUrl?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: () => null,
        h2: ({ children }) => {
          const text = textFromChildren(children);
          return <h2 id={headingId(text)} tabIndex={-1} className="scroll-mt-28 pt-12 pb-3 text-3xl font-bold text-gray-950 outline-none first:pt-0">{children}</h2>;
        },
        h3: ({ children }) => {
          const text = textFromChildren(children);
          return <h3 id={headingId(text)} tabIndex={-1} className="scroll-mt-28 pt-9 pb-2 text-2xl font-bold text-gray-950 outline-none">{children}</h3>;
        },
        h4: ({ children }) => {
          const text = textFromChildren(children);
          return <h4 id={headingId(text)} tabIndex={-1} className="scroll-mt-28 pt-7 pb-1 text-xl font-bold text-gray-950 outline-none">{children}</h4>;
        },
        p: ({ children }) => <p className="mb-5 text-lg leading-relaxed text-gray-600 last:mb-0">{children}</p>,
        a: ({ href, children }) => {
          const isAnchor = href?.startsWith('#');
          return (
            <a
              href={href}
              onClick={(event) => scrollToArticleHeading(href, event)}
              target={isAnchor ? undefined : '_blank'}
              rel={isAnchor ? undefined : 'noreferrer'}
              className="font-semibold text-orange-600 hover:text-pink-600"
            >
              {children}
            </a>
          );
        },
        em: ({ children }) => <em className="text-gray-600">{children}</em>,
        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
        blockquote: ({ children }) => (
          <blockquote className="my-8 rounded-3xl border-l-4 border-pink-400 bg-pink-50/60 p-6 text-gray-700">
            {children}
          </blockquote>
        ),
        ol: ({ children }) => <ol className="my-6 list-decimal space-y-3 pl-7 text-lg leading-relaxed text-gray-600">{children}</ol>,
        ul: ({ children }) => <ul className="my-4 list-disc space-y-3 pl-7 text-lg leading-relaxed text-gray-600">{children}</ul>,
        li: ({ children }) => <li className="pl-1 marker:text-gray-400">{children}</li>,
        hr: () => <hr className="my-14 border-orange-100" />,
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto rounded-2xl border border-orange-100 bg-white">
            <table className="min-w-full divide-y divide-orange-100 text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-orange-50/70 text-gray-950">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-orange-50 text-gray-600">{children}</tbody>,
        th: ({ children }) => <th className="px-4 py-3 font-bold">{children}</th>,
        td: ({ children }) => <td className="px-4 py-3 align-top">{children}</td>,
        img: ({ src, alt }) => (
          <figure className="my-8 overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(251,146,60,0.1)]">
            <img
              src={resolveMarkdownUrl(src ?? '', assetBaseUrl)}
              alt={alt ?? ''}
              className="w-full object-cover"
              loading="lazy"
            />
            {alt ? <figcaption className="px-5 py-3 text-sm text-gray-500">{alt}</figcaption> : null}
          </figure>
        ),
        pre: ({ children }) => <>{children}</>,
        code: ({ children, className }) => {
          const language = /language-(\w+)/.exec(className ?? '')?.[1];
          const code = String(children).replace(/\n$/, '');
          if (language === 'mermaid') {
            return <MermaidDiagram code={code} index={code.length} />;
          }
          if (language) {
            return (
              <pre className="my-7 overflow-x-auto rounded-2xl border border-orange-100 bg-slate-950 p-4 text-sm text-orange-50">
                <code>{code}</code>
              </pre>
            );
          }
          return <code className="rounded-md bg-orange-50 px-1.5 py-0.5 text-sm text-orange-700">{children}</code>;
        },
      }}
    >
      {stripFrontmatter(markdown)}
    </ReactMarkdown>
  );
}
