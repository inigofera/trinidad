<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface ProseProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    as?: 'article' | 'div' | 'section' | undefined;
    size?: 'sm' | 'base' | 'lg' | undefined;
    maxWidth?: 'narrow' | 'prose' | 'wide' | 'full' | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let {
    as = 'article',
    size = 'base',
    maxWidth = 'prose',
    children,
    class: className = '',
    ...rest
  }: ProseProps = $props();

  const sizeClasses: Record<NonNullable<ProseProps['size']>, string> = {
    sm: 'text-sm leading-normal',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed'
  };

  const maxWidthClasses: Record<NonNullable<ProseProps['maxWidth']>, string> = {
    narrow: 'max-w-xl',
    prose: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-full'
  };
</script>

<svelte:element
  this={as}
  class="trinidad-prose font-sans text-fg-primary mx-auto {sizeClasses[size]} {maxWidthClasses[
    maxWidth
  ]} {className}"
  {...rest}
>
  {@render children()}
</svelte:element>

<style>
  :global(.trinidad-prose p) {
    margin-bottom: 1.25rem;
    color: var(--fg-primary);
  }

  :global(.trinidad-prose p.lead) {
    font-size: 1.15em;
    line-height: 1.6;
    color: var(--fg-muted);
    margin-bottom: 1.75rem;
  }

  :global(.trinidad-prose a) {
    color: var(--fg-primary);
    text-decoration: underline;
    text-decoration-color: var(--border-subtle);
    text-underline-offset: 3px;
    transition:
      text-decoration-color 0.15s ease,
      color 0.15s ease;
  }

  :global(.trinidad-prose a:hover) {
    color: var(--fg-primary);
    text-decoration-color: var(--accent-interactive);
  }

  :global(.trinidad-prose ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.trinidad-prose ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.trinidad-prose li) {
    line-height: 1.6;
  }

  :global(.trinidad-prose hr) {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 2.5rem 0;
  }

  :global(.trinidad-prose code:not(pre code)) {
    font-family: var(--font-mono);
    font-size: 0.875em;
    padding: 0.15rem 0.35rem;
    border-radius: var(--radius-control);
    background-color: var(--surface-muted);
    border: 1px solid var(--border-subtle);
    color: var(--fg-primary);
  }
</style>
