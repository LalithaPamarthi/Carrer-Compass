/**
 * Tiny, dependency-free renderer for the small markdown subset the coach uses
 * (headings, bullets, bold, inline code). Input is treated as text, never HTML.
 */
export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, bi) => {
        const rows = block.split("\n");
        const isList = rows.every((r) => /^\s*([-*•]|\d+\.)\s+/.test(r));
        if (isList) {
          return (
            <ul key={bi} className="ml-4 list-disc space-y-1.5">
              {rows.map((r, ri) => (
                <li key={ri}>{inline(r.replace(/^\s*([-*•]|\d+\.)\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (/^#{1,4}\s/.test(rows[0] ?? "")) {
          return (
            <p key={bi} className="font-semibold text-foreground">
              {inline((rows[0] ?? "").replace(/^#{1,4}\s/, ""))}
            </p>
          );
        }
        return (
          <p key={bi}>
            {rows.map((r, ri) => (
              <span key={ri}>
                {inline(r)}
                {ri < rows.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
