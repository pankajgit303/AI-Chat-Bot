import React, { useState } from "react";
import { User, Bot, Check, Copy, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";
import { CodeBlock } from "./CodeBlock";

interface ChatMessageProps {
  message: Message;
  isLastModelMessage: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function ChatMessage({
  message,
  isLastModelMessage,
  onRegenerate,
  isRegenerating,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full py-6 px-4 md:px-8 ${isUser ? "bg-transparent" : "bg-slate-50 dark:bg-slate-900/50"}`}
    >
      <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 w-full group">
        {/* Avatar */}
        <div
          className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm border ${
            isUser
              ? "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              : "bg-blue-600 border-blue-700 text-white"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {isUser ? "You" : "AI Assistant"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-ol:text-slate-700 dark:prose-ol:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-code:text-slate-900 dark:prose-code:text-slate-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre({ node, children, ...props }: any) {
                  // We handle the block wrapping inside the CodeBlock component itself
                  // to avoid invalid HTML nesting (e.g., div inside pre).
                  // So we just pass the children (which is the code element) through.
                  // But we need to extract the language from the child's className if possible,
                  // or just let CodeBlock handle everything.
                  const childProps = children?.props || {};
                  return (
                    <CodeBlock
                      inline={false}
                      className={childProps.className}
                      {...childProps}
                    >
                      {childProps.children}
                    </CodeBlock>
                  );
                },
                code({ node, inline, className, children, ...props }: any) {
                  // This is for inline code only now, as block code is intercepted at the `pre` level
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Action buttons (only show for model messages, on hover or if it's the last message) */}
          {!isUser && (
            <div
              className={`flex items-center gap-2 mt-4 transition-opacity ${isLastModelMessage ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>

              {isLastModelMessage && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  title="Regenerate response"
                >
                  <RefreshCw
                    size={14}
                    className={isRegenerating ? "animate-spin" : ""}
                  />
                  Regenerate
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
