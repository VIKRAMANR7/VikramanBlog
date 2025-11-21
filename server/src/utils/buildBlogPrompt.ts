export function buildBlogPrompt(prompt: string) {
  const trimmed = prompt.trim();

  const system = `You are an expert blog writer who creates engaging, well-structured articles with proper formatting.`;

  const user = `Write a complete blog article about: "${trimmed}"

CRITICAL FORMATTING RULES:
1. Write ONLY in Markdown format (no HTML tags)
2. Start with ONE main H1 heading: # Title
3. Include 3-5 H2 sections: ## Section Title
4. Use H3 for subsections where needed: ### Subsection
5. LISTS - Include both unordered and numbered
6. Add 2-3 real links
7. Use **bold**, *italics*, and > blockquotes
8. 700-1000 words total
9. No AI disclaimers or meta text
10. Keep paragraphs short and conversational`;

  return { system, user };
}
