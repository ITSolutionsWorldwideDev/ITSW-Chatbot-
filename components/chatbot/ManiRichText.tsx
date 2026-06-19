"use client";

type RichBlock =
  | { type: "heading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] };

export function ManiRichText({
  content,
  tone = "assistant",
}: {
  content: string;
  tone?: "assistant" | "user";
}) {
  const blocks = parseRichBlocks(content);
  const textClassName = tone === "assistant" ? "text-slate-700" : "text-white/96";

  return (
    <div className={`space-y-3 text-[0.98rem] leading-7 ${textClassName}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <p
              key={index}
              className={`m-0 text-[0.82rem] font-semibold uppercase tracking-[0.16em] ${
                tone === "assistant" ? "text-slate-500" : "text-white/72"
              }`}
            >
              {block.content}
            </p>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 marker:text-current">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-5 marker:text-current">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="m-0">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

function parseRichBlocks(content: string): RichBlock[] {
  const normalized = normalizeContent(content);
  if (!normalized) return [{ type: "paragraph", content: "" }];

  const rawBlocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const sourceBlocks = rawBlocks.length > 0 ? rawBlocks : [normalized];
  const parsedBlocks = sourceBlocks.flatMap(parseBlock);

  if (parsedBlocks.length === 1 && parsedBlocks[0].type === "paragraph") {
    return splitDenseParagraph(parsedBlocks[0].content);
  }

  return parsedBlocks;
}

function parseBlock(block: string): RichBlock[] {
  const lines = block
    .split("\n")
    .map((line) => cleanInlineSpacing(line))
    .filter(Boolean);

  if (lines.length === 0) return [];

  if (lines.length === 1 && isHeadingLine(lines[0])) {
    return [{ type: "heading", content: lines[0].slice(0, -1) }];
  }

  const mixedBlocks = splitMixedLines(lines);
  if (mixedBlocks) {
    return mixedBlocks;
  }

  const unorderedItems = lines.map((line) => {
    const match = line.match(/^(?:[-*]|\u2022)\s+(.+)$/);
    return match ? cleanInlineSpacing(match[1]) : null;
  });
  if (unorderedItems.every(Boolean)) {
    return [{ type: "unordered-list", items: unorderedItems as string[] }];
  }

  const orderedItems = lines.map((line) => {
    const match = line.match(/^\d+[.)]\s+(.+)$/);
    return match ? cleanInlineSpacing(match[1]) : null;
  });
  if (orderedItems.every(Boolean)) {
    return [{ type: "ordered-list", items: orderedItems as string[] }];
  }

  return [{ type: "paragraph", content: cleanInlineSpacing(lines.join(" ")) }];
}

function splitDenseParagraph(content: string): RichBlock[] {
  if (content.length < 220 || /\n/.test(content)) {
    return [{ type: "paragraph", content }];
  }

  const sentences = content
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length < 3) {
    return [{ type: "paragraph", content }];
  }

  const chunks: RichBlock[] = [];

  for (let index = 0; index < sentences.length; index += 2) {
    chunks.push({
      type: "paragraph",
      content: sentences.slice(index, index + 2).join(" "),
    });
  }

  return chunks;
}

function normalizeContent(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/(\S)\s+\*\s+(?=(?:\*\*)?[A-Z0-9])/g, "$1\n- ")
    .replace(/:\s+\*\s+(?=(?:\*\*)?[A-Z0-9])/g, ":\n- ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/(^|\n)\*\s+/g, "$1- ")
    .replace(/\s+\*(?=\s|$)/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanInlineSpacing(content: string) {
  return content
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .trim();
}

function isHeadingLine(line: string) {
  return line.endsWith(":") && line.length <= 60 && !/^\d+[.)]/.test(line);
}

function splitMixedLines(lines: string[]): RichBlock[] | null {
  const blocks: RichBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({
        type: "paragraph",
        content: cleanInlineSpacing(paragraphBuffer.join(" ")),
      });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({
        type: "unordered-list",
        items: listBuffer.map((item) => cleanInlineSpacing(item)),
      });
      listBuffer = [];
    }
  };

  let hasMixedContent = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^(?:[-*]|\u2022)\s+(.+)$/);

    if (bulletMatch) {
      flushParagraph();
      listBuffer.push(bulletMatch[1]);
      hasMixedContent = true;
      continue;
    }

    if (listBuffer.length > 0) {
      flushList();
    }

    paragraphBuffer.push(line);
    if (blocks.length > 0) {
      hasMixedContent = true;
    }
  }

  flushList();
  flushParagraph();

  return hasMixedContent ? blocks : null;
}
