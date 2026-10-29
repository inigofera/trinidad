<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type BenchmarkMetric = 'fps' | 'bundle' | 'vitals' | 'a11y' | 'custom';
  export type BenchmarkStatus = 'nominal' | 'warning' | 'critical';

  export interface BenchmarkBadgeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    metric?: BenchmarkMetric | undefined;
    value: string;
    label?: string | undefined;
    status?: BenchmarkStatus | undefined;
    class?: string | undefined;
  }

  let {
    metric = 'custom',
    value,
    label,
    status = 'nominal',
    class: className = '',
    ...rest
  }: BenchmarkBadgeProps = $props();

  const statusDotClasses: Record<BenchmarkStatus, string> = {
    nominal: 'bg-status-nominal',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical'
  };

  const metricPrefixes: Record<BenchmarkMetric, string> = {
    fps: 'FRAME_RATE',
    bundle: 'GZIP_WEIGHT',
    vitals: 'WEB_VITALS',
    a11y: 'ACCESSIBILITY',
    custom: 'AUDIT'
  };
</script>

<div
  class="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated font-mono text-xs shadow-subtle select-none {className}"
  {...rest}
>
  <!-- Pulsing Status Dot -->
  <span class="w-2 h-2 rounded-full {statusDotClasses[status]} shrink-0" aria-hidden="true"></span>

  <!-- Prefix / Type -->
  <span class="text-[10px] uppercase font-bold text-fg-muted tracking-wider">
    [{metricPrefixes[metric]}]
  </span>

  <!-- Metric Value -->
  <span class="font-bold text-fg-primary">
    {value}
  </span>

  <!-- Context / Target Label -->
  {#if label}
    <span class="text-[10px] text-fg-muted border-l border-border-subtle pl-2">
      {label}
    </span>
  {/if}
</div>
