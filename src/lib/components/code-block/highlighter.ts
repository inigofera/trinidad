export type CodeLanguage =
  'svelte' | 'typescript' | 'ts' | 'javascript' | 'js' | 'json' | 'css' | 'bash' | 'sh' | 'text';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightCode(code: string, language: CodeLanguage = 'typescript'): string {
  if (language === 'text') {
    return escapeHtml(code);
  }

  const tokenRegex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\$(?:state|derived|props|effect|bindable|inspect)(?:\.by)?\b)|(\{#[a-zA-Z]+|\{@render|\{:[a-zA-Z]+|\{\/[a-zA-Z]+)|(<\/?[\w.-]+)|(\b(?:let|const|var|function|class|interface|type|export|import|from|return|async|await|new|this|extends|as|if|else|switch|case|default|break|continue|try|catch|finally|throw|typeof|readonly|static)\b)|(\b(?:true|false|null|undefined)\b)|(\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|Hz)?\b)/g;

  let lastIndex = 0;
  let result = '';
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }
    const [full, comment, str, rune, block, tag, kw, bool, num] = match;
    if (comment) {
      result += `<span class="text-fg-muted italic">${escapeHtml(comment)}</span>`;
    } else if (str) {
      result += `<span class="text-status-nominal">${escapeHtml(str)}</span>`;
    } else if (rune) {
      result += `<span class="text-fg-primary font-bold underline decoration-accent-interactive decoration-2">${escapeHtml(rune)}</span>`;
    } else if (block) {
      result += `<span class="text-fg-primary font-bold">${escapeHtml(block)}</span>`;
    } else if (tag) {
      result += `<span class="text-fg-primary font-bold">${escapeHtml(tag)}</span>`;
    } else if (kw) {
      result += `<span class="text-fg-primary font-bold">${escapeHtml(kw)}</span>`;
    } else if (bool) {
      result += `<span class="text-status-warning font-semibold">${escapeHtml(bool)}</span>`;
    } else if (num) {
      result += `<span class="text-status-warning">${escapeHtml(num)}</span>`;
    } else {
      result += escapeHtml(full);
    }
    lastIndex = match.index + full.length;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  return result;
}
