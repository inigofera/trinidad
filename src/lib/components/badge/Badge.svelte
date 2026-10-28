<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'neutral' | 'accent' | 'nominal' | 'warning' | 'critical';
    pulse?: boolean;
    children: Snippet;
    class?: string;
  }

  let {
    variant = 'neutral',
    pulse = false,
    children,
    class: className = '',
    ...rest
  }: BadgeProps = $props();

  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    neutral: 'bg-surface-muted text-fg-muted border-border-subtle',
    accent: 'bg-surface-elevated text-fg-primary border-accent-interactive',
    nominal: 'bg-surface-elevated text-status-nominal border-status-nominal',
    warning: 'bg-surface-elevated text-status-warning border-status-warning',
    critical: 'bg-surface-elevated text-status-critical border-status-critical'
  };
</script>

<span
  class="inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[11px] leading-tight uppercase tracking-wider select-none {variantClasses[
    variant
  ]} {className}"
  {...rest}
>
  {#if pulse}
    <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true"></span>
  {/if}
  {@render children()}
</span>
