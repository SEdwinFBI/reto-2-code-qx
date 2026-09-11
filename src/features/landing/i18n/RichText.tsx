import React from "react";

/**
 * Lets translated dictionary strings carry the handful of inline emphasis
 * styles this page actually uses, without needing per-locale JSX:
 *   **text**  -> dark bold        __text__ -> plain bold
 *   !!text!!  -> red bold         ++text++ -> green bold
 *   ##text##  -> brand-blue bold  \n       -> <br/>
 */
const MARKER_PATTERN = /\*\*(.+?)\*\*|__(.+?)__|!!(.+?)!!|\+\+(.+?)\+\+|##(.+?)##/g;

function renderLine(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;
  MARKER_PATTERN.lastIndex = 0;

  while ((match = MARKER_PATTERN.exec(line))) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const [full, dark, plain, negative, positive, brand] = match;
    const [content, className] =
      dark !== undefined
        ? [dark, "font-semibold text-slate-900"]
        : plain !== undefined
          ? [plain, "font-semibold"]
          : negative !== undefined
            ? [negative, "font-semibold text-red-700"]
            : positive !== undefined
              ? [positive, "font-semibold text-emerald-700"]
              : [brand, "font-semibold text-brand-600"];

    nodes.push(
      <strong key={`${keyPrefix}-${matchIndex++}`} className={className}>
        {content}
      </strong>
    );
    lastIndex = match.index + full.length;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

interface RichTextProps {
  text: string;
}

export function RichText({ text }: RichTextProps) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {renderLine(line, `l${index}`)}
        </React.Fragment>
      ))}
    </>
  );
}
