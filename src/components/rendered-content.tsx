"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface RenderedContentProps {
  content: string;
  className?: string;
}

function normalizeMathDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `$$${math}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math}$`);
}

function preprocessEconMath(text: string): string {
  // Strip internal situation codes like "(Mã tình huống: VMO01-01.)"
  const cleaned = text.replace(/\s*\(Mã tình huống:\s*[A-Z0-9-]+\.\)\s*/g, " ");

  // Protect existing math delimiters
  const mathBlocks: string[] = [];
  let result = cleaned
    .replace(/\$\$[\s\S]*?\$\$/g, (m) => { mathBlocks.push(m); return `\x00MATH${mathBlocks.length - 1}\x00`; })
    .replace(/\$[^$]+?\$/g, (m) => { mathBlocks.push(m); return `\x00MATH${mathBlocks.length - 1}\x00`; });

  // E_chéo, E_thu nhập, E_d, E_s → $E_{\text{subscript}}$
  // Match E_ followed by letters/Vietnamese chars (with optional spaces) until a digit, =, or punctuation
  result = result.replace(/E_([a-zA-Zà-ỹ]+(?:\s[a-zA-Zà-ỹ]+)*)/g, (_, sub) => `$E_{\\text{${sub}}}$`);

  // |E|, |ED| → $|E|$, $|ED|$
  result = result.replace(/\|([A-Z]{1,3})\|/g, (_, v) => `$|${v}|$`);

  // Q* = 50, P* = 140 → $Q^* = 50$, $P^* = 140$ (variable with asterisk followed by = and number)
  result = result.replace(/([A-Z])\*\s*=\s*([\d,.]+)/g, (_, v, n) => `$${v}^* = ${n}$`);

  // Standalone Q*, P* → $Q^*$, $P^*$
  result = result.replace(/(?<![a-zA-Z])([QP])\*(?![a-zA-Z])/g, (_, v) => `$${v}^*$`);

  // U = x^0.7y^0.3 → $U = x^{0.7}y^{0.3}$ (utility functions with exponents)
  result = result.replace(/([A-Z])\s*=\s*([a-z])\^([\d.]+)([a-z])\^([\d.]+)/g, (_, u, v1, e1, v2, e2) => `$${u} = ${v1}^{${e1}}${v2}^{${e2}}$`);

  // MR = MC, MR > MC → $MR = MC$, $MR > MC$
  result = result.replace(/(?<![a-zA-Z])(MR\s*[=<>]\s*MC)(?![a-zA-Z])/g, (_, m) => `$${m}$`);

  // Restore protected math
  result = result.replace(/\x00MATH(\d+)\x00/g, (_, i) => mathBlocks[parseInt(i)]);
  return result;
}

export function RenderedContent({ content, className }: RenderedContentProps) {
  const normalized = normalizeMathDelimiters(preprocessEconMath(content));
  return (
    <div
      className={`prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_table]:my-2 [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_td]:border ${className ?? ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
