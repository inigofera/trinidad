<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type CalloutVariant = 'insight' | 'constraint' | 'decision' | 'quote' | 'warning';

  export interface CalloutProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    variant?: CalloutVariant | undefined;
    title?: string | undefined;
    attribution?: string | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let {
    variant = 'insight',
    title,
    attribution,
    children,
    class: className = '',
    ...rest
  }: CalloutProps = $props();

  const variantStyles: Record<
    CalloutVariant,
    { border: string; tag: string; defaultTitle: string; icon: string }
  > = {
    insight: {
      border: 'border-l-4 border-l-accent-interactive border-y border-r border-border-subtle',
      tag: 'text-fg-primary',
      defaultTitle: 'KEY INSIGHT',
      icon: '💡'
    },
    constraint: {
      border: 'border-l-4 border-l-status-warning border-y border-r border-border-subtle',
      tag: 'text-status-warning',
      defaultTitle: 'ERGONOMIC CONSTRAINT',
      icon: '⚠️'
    },
    decision: {
      border: 'border-l-4 border-l-fg-primary border-y border-r border-border-subtle',
      tag: 'text-fg-primary',
      defaultTitle: 'DESIGN DECISION',
      icon: '📐'
    },
    quote: {
      border: 'border-l-4 border-l-border-subtle border-y border-r border-border-subtle italic',
      tag: 'text-fg-muted not-italic',
      defaultTitle: 'USER QUOTE',
      icon: '“'
    },
    warning: {
      border: 'border-l-4 border-l-status-critical border-y border-r border-border-subtle',
      tag: 'text-status-critical',
      defaultTitle: 'SYSTEM WARNING',
      icon: '🚨'
    }
  };

  const currentStyle = $derived(variantStyles[variant]);
  const displayTitle = $derived(title ?? currentStyle.defaultTitle);
</script>

<aside
  class="my-6 rounded-[var(--radius-card)] bg-surface-elevated p-4 md:p-5 {currentStyle.border} {className}"
  aria-label={displayTitle}
  {...rest}
>
  <div class="flex items-center gap-2 mb-2 select-none">
    <span class="font-mono text-xs font-bold uppercase tracking-wider {currentStyle.tag}">
      [{displayTitle}]
    </span>
  </div>

  <div class="text-sm md:text-base leading-relaxed text-fg-primary">
    {@render children()}
  </div>

  {#if attribution}
    <footer class="mt-3 text-xs font-mono text-fg-muted not-italic">
      — {attribution}
    </footer>
  {/if}
</aside>
