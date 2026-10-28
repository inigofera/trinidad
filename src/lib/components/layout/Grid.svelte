<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface GridProps extends HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 12;
    gap?: 'density' | 'none' | 'sm' | 'md' | 'lg';
    hairline?: boolean;
    children: Snippet;
    class?: string;
  }

  let {
    cols = 3,
    gap = 'md',
    hairline = false,
    children,
    class: className = '',
    ...rest
  }: GridProps = $props();

  const colClasses: Record<NonNullable<GridProps['cols']>, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    12: 'grid-cols-1 md:grid-cols-12'
  };

  const gapClasses: Record<NonNullable<GridProps['gap']>, string> = {
    density: 'gap-[var(--gap-ui)]',
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
</script>

<div
  class="grid {colClasses[cols]} {hairline
    ? 'gap-[1px] bg-border-subtle border border-border-subtle'
    : gapClasses[gap]} {className}"
  {...rest}
>
  {@render children()}
</div>
