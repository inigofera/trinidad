<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { highlightCode, type CodeLanguage } from './highlighter.js';
  import { Announcer } from '$lib/actions/announcer.svelte.js';

  export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    code: string;
    language?: CodeLanguage | undefined;
    filename?: string | undefined;
    lineNumbers?: boolean | undefined;
    highlightLines?: number[] | undefined;
    maxHeight?: string | undefined;
    class?: string | undefined;
  }

  let {
    code,
    language = 'typescript',
    filename,
    lineNumbers = true,
    highlightLines = [],
    maxHeight,
    class: className = '',
    ...rest
  }: CodeBlockProps = $props();

  let copied = $state(false);

  const rawLines = $derived(code.split('\n'));
  const highlighted = $derived(highlightCode(code, language));
  const htmlLines = $derived(highlighted.split('\n'));

  async function copyCode() {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      Announcer.announce(
        `Code ${filename ? 'from ' + filename : ''} copied to clipboard`,
        'polite'
      );
      setTimeout(() => {
        copied = false;
      }, 1500);
    } catch {
      // Fallback
    }
  }
</script>

<div
  class="relative my-6 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas shadow-subtle overflow-hidden font-mono text-xs {className}"
  {...rest}
>
  <!-- Header Bar -->
  <div
    class="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-surface-elevated select-none"
  >
    <div class="flex items-center gap-2 text-fg-muted font-bold truncate">
      {#if filename}
        <span class="text-fg-primary truncate">[{filename}]</span>
      {/if}
      <span
        class="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded-[var(--radius-control)] border border-border-subtle bg-surface-muted text-fg-muted"
      >
        {language.toUpperCase()}
      </span>
    </div>

    <!-- Copy to Clipboard Button -->
    <button
      type="button"
      onclick={copyCode}
      aria-label="Copy code to clipboard"
      class="font-mono text-xs font-bold px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none transition-colors"
    >
      {#if copied}
        <span class="text-accent-interactive font-bold">✓ Copied</span>
      {:else}
        <span>Copy</span>
      {/if}
    </button>
  </div>

  <!-- Code Viewport -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre
    tabindex="0"
    role="region"
    aria-label="Code snippet: {filename ?? language}"
    style={maxHeight ? `max-height: ${maxHeight};` : ''}
    class="m-0 p-3 overflow-x-auto overflow-y-auto leading-relaxed text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"><code
      >{#each htmlLines as line, i (i)}{@const lineNum = i + 1}{@const isHighlighted =
          highlightLines.includes(lineNum)}<div
          class="flex items-baseline {isHighlighted
            ? 'bg-accent-interactive/10 -mx-3 px-3 border-l-2 border-accent-interactive'
            : ''}">{#if lineNumbers}<span
              aria-hidden="true"
              class="w-8 shrink-0 select-none text-right pr-4 text-fg-muted font-mono text-[11px]"
              >{lineNum}</span
            >{/if}<span class="flex-1 font-mono">{@html line || ' '}</span></div>{/each}</code
    ></pre>
</div>
