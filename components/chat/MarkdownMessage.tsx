"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  readonly content: string;
  readonly isUser?: boolean;
}

/**
 * Componente para renderizar mensagens com suporte a Markdown
 * Sanitiza HTML para prevenir XSS
 * Adiciona syntax highlighting para blocos de código
 */
export function MarkdownMessage({
  content,
  isUser = false,
}: MarkdownMessageProps) {
  return (
    <div
      className={cn(
        "markdown-content text-[15px] leading-relaxed break-words",
        isUser ? "text-white" : "text-gray-900 dark:text-white",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          // Estilização customizada para elementos Markdown
          h1: (props) => (
            <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-lg font-bold mt-3 mb-2 first:mt-0" {...props} />
          ),
          h3: (props) => (
            <h3
              className="text-base font-bold mt-2 mb-1 first:mt-0"
              {...props}
            />
          ),
          p: (props) => <p className="mb-2 last:mb-0" {...props} />,
          ul: (props) => (
            <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
          ),
          ol: (props) => (
            <ol
              className="list-decimal list-inside mb-2 space-y-1"
              {...props}
            />
          ),
          li: (props) => <li className="ml-2" {...props} />,
          code: (props) => {
            const { className, children, ...rest } = props;
            const isInline = !className;
            return isInline ? (
              <code
                className={cn(
                  "px-1.5 py-0.5 rounded text-sm font-mono",
                  isUser
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                )}
                {...rest}
              >
                {children}
              </code>
            ) : (
              <code
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-mono overflow-x-auto",
                  isUser
                    ? "bg-white/10 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                )}
                {...rest}
              >
                {children}
              </code>
            );
          },
          pre: (props) => <pre className="mb-2 last:mb-0" {...props} />,
          a: (props) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "underline hover:no-underline",
                isUser ? "text-white/90" : "text-primary",
              )}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className={cn(
                "border-l-4 pl-3 my-2 italic",
                isUser
                  ? "border-white/40"
                  : "border-gray-300 dark:border-gray-700",
              )}
              {...props}
            />
          ),
          hr: () => (
            <hr
              className={cn(
                "my-3 border-t",
                isUser
                  ? "border-white/20"
                  : "border-gray-200 dark:border-gray-700",
              )}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
