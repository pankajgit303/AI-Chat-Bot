import React, { useState } from "react";
import { Maximize2, Minimize2, Check, Copy } from "lucide-react";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let text = "";
    React.Children.forEach(children, (child) => {
      if (typeof child === "string") text += child;
      // Handle case where children might be an array or other react nodes,
      // but usually react-markdown passes a single string to the `code` component for block code
    });

    // Better way to get text:
    const node = e.currentTarget.parentElement?.querySelector("code");
    if (node) {
      text = node.textContent || "";
    } else if (typeof children === "string") {
      text = children;
    } else if (Array.isArray(children)) {
      text = children.join("");
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const codeContent = (
    <div
      className={`relative group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 my-4 shadow-sm ${isFullscreen ? "h-full flex flex-col my-0" : ""}`}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-green-600 dark:text-green-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
      {language && !isFullscreen && (
        <div className="absolute left-4 top-2 text-xs font-mono text-slate-400 dark:text-slate-500 select-none">
          {language}
        </div>
      )}
      <pre
        className={`overflow-x-auto m-0 p-0 bg-transparent ${isFullscreen ? "flex-1 overflow-y-auto p-6" : "pt-10 pb-4 px-4"}`}
      >
        <code className={`${className || ""} block`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        {/* Render original in place but invisible to maintain layout if needed, or just let it collapse. Let's let it collapse or render a placeholder */}
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={toggleFullscreen}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full h-full max-w-7xl max-h-full rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                {language || "Code"}
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Minimize2 size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-hidden prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:m-0 prose-pre:h-full prose-pre:rounded-none prose-pre:bg-transparent">
              {/* Wrapping in pre to keep typography styles consistent */}
              <pre className="h-full overflow-auto p-6">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          </div>
        </div>
        {/* Placeholder in document */}
        <div
          className="relative group rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 text-center text-slate-500 dark:text-slate-400 italic cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleFullscreen}
        >
          Click to close fullscreen view
        </div>
      </>
    );
  }

  // Normally we would just return codeContent, but ReactMarkdown wraps `code` in `pre`.
  // If we want relative positioning, we might need to rely on the parent `pre`.
  // But we can just render our own wrapper.
  return codeContent;
}
