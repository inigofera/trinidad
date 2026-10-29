<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
    as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';
    elevation?: 'canvas' | 'elevated' | 'muted';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bordered?: boolean;
    kicker?: string;
    children: Snippet;
    class?: string;
  }

  let {
    as = 'div',
    elevation = 'elevated',
    padding = 'md',
    bordered = true,
    kicker,
    children,
    class: className = '',
    ...rest
  }: SurfaceProps = $props();

  const elevationClasses: Record<NonNullable<SurfaceProps['elevation']>, string> = {
    canvas: 'bg-surface-canvas text-fg-primary',
    elevated: 'bg-surface-elevated text-fg-primary',
    muted: 'bg-surface-muted text-fg-primary'
  };

  const paddingClasses: Record<NonNullable<SurfaceProps['padding']>, string> = {
    none: 'p-0',
    sm: 'px-[var(--control-px)] py-[var(--control-py)]',
    md: 'p-4',
    lg: 'p-6'
  };
</script>

<svelte:element
  this={as}
  class="rounded-[var(--radius-card)] {elevationClasses[elevation]} {paddingClasses[
    padding
  ]} {bordered ? 'border border-border-subtle' : ''} {className}"
  {...rest}
>
  {#if kicker}
    <div class="font-mono text-xs text-fg-muted mb-3 select-none">
      {kicker}
    </div>
  {/if}
  {@render children()}
</svelte:element>
