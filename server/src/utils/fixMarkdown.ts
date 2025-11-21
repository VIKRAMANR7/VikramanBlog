export function fixMarkdown(prompt: string, content: string): string {
  let output = content;
  const trimmed = prompt.trim();

  const hasH1 = /^#\s+.+/m.test(output);
  const hasH2 = /^##\s+.+/m.test(output);
  const hasBullets = /(^|\n)[-*]\s+.+/m.test(output);
  const hasNumbered = /(^|\n)\d+\.\s+.+/m.test(output);
  const hasLink = /\[.+?\]\(https?:\/\/.+?\)/.test(output);

  if (!hasH1) output = `# ${trimmed}\n\n${output}`;
  if (!hasH2) {
    output += `\n\n## Overview\n\nThis section provides insights on ${trimmed}.`;
  }
  if (!hasBullets) {
    output += `\n\n- Key ideas\n- Common use cases\n- Best practices`;
  }
  if (!hasNumbered) {
    output += `\n\n1. Learn\n2. Practice\n3. Implement\n4. Refine`;
  }
  if (!hasLink) {
    const topic = trimmed.replace(/\s+/g, "_");
    output += `\n\n> **Further Reading:** [${trimmed} on Wikipedia](https://en.wikipedia.org/wiki/${topic})`;
  }

  return output;
}
