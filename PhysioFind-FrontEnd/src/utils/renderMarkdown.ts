const RULES: [RegExp, string][] = [
  [/\*\*(.+?)\*\*/g, '<strong>$1</strong>'], // Bold
  [/\*(.+?)\*/g, '<em>$1</em>'], // Italic
  [/~~(.+?)~~/g, '<del>$1</del>'], // Strikethrough
  [/\[(.+?)\]\((\/[^\s)]+)\)/g, '<a href="$2">$1</a>'], // Internal links
  [/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'], // Links
  [/\n/g, '<br>'], // Newlines to <br>
]

export function renderMarkdown(text: string): string {
  // Escape HTML first to prevent injection, THEN apply markdown rules
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return RULES.reduce((str, [pattern, replacement]) => str.replace(pattern, replacement), escaped)
}
