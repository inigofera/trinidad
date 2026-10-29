<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface StatDelta {
    value: string;
    positive?: boolean | undefined;
    neutral?: boolean | undefined;
  }

  export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    value: string;
    label: string;
    kicker?: string | undefined;
    delta?: StatDelta | undefined;
    description?: string | undefined;
    sparkline?: Snippet | undefined;
    children?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    value,
    label,
    kicker,
    delta,
    description,
    sparkline,
    children,
    class: className = '',
    ...rest
  }: StatCardProps = $props();
</script>

<div
  class="rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated p-5 flex flex-col justify-between {className}"
  {...rest}
>
  <div>
    {#if kicker}
      <div class="font-mono text-xs uppercase tracking-wider text-fg-muted mb-2 select-none">
        [{kicker}]
      </div>
    {/if}

    <div class="flex items-baseline justify-between gap-3 flex-wrap">
      <div class="font-mono text-3xl md:text-4xl font-bold text-fg-primary tracking-tight">
        {value}
      </div>

      {#if delta}
        <div
          class="font-mono text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-control)] border select-none {delta.neutral
            ? 'bg-surface-muted text-fg-muted border-border-subtle'
            : delta.positive
              ? 'bg-surface-canvas text-status-nominal border-status-nominal'
              : 'bg-surface-canvas text-status-critical border-status-critical'}"
        >
          {delta.positive ? '▲' : delta.neutral ? '■' : '▼'}
          {delta.value}
        </div>
      {/if}
    </div>

    <div class="text-sm font-medium text-fg-primary mt-1">
      {label}
    </div>

    {#if description}
      <div class="text-xs text-fg-muted mt-2 leading-relaxed">
        {description}
      </div>
    {/if}
  </div>

  {#if sparkline}
    <div class="mt-4 pt-3 border-t border-border-subtle">
      <div class="h-12 w-full">
        {@render sparkline()}
      </div>
    </div>
  {:else if children}
    <div class="mt-4 pt-3 border-t border-border-subtle">
      {@render children()}
    </div>
  {/if}
</div>
