import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  block?: boolean;
  className?: string;
  children?: string;
}

/**
 * Parses text containing $...$ or $$...$$ and renders LaTeX parts with KaTeX,
 * leaving regular text as standard HTML spans.
 */
export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '', children }) => {
  const content = math || children || '';

  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // If whole string is passed without $, or is explicit block math
    if (block) {
      try {
        const cleanFormula = content.replace(/^(\$\$|\$)|(\$\$|\$)$/g, '').trim();
        return katex.renderToString(cleanFormula, {
          displayMode: true,
          throwOnError: false,
        });
      } catch {
        return content;
      }
    }

    // Split text by $$...$$ or $...$
    // Regex matches $$...$$ or $...$
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return parts
      .map((part) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const raw = part.slice(2, -2).trim();
          try {
            return katex.renderToString(raw, { displayMode: true, throwOnError: false });
          } catch {
            return part;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const raw = part.slice(1, -1).trim();
          try {
            return katex.renderToString(raw, { displayMode: false, throwOnError: false });
          } catch {
            return part;
          }
        }
        // Escape standard HTML characters for regular text
        return part
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br/>');
      })
      .join('');
  }, [content, block]);

  return (
    <span
      className={`math-render-container ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
