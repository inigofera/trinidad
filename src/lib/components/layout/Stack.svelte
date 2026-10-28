<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    direction?: 'vertical' | 'horizontal';
    gap?: 'density' | 'none' | 'xs' | 'sm' | 'md' | 'lg';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between';
    wrap?: boolean;
    children: Snippet;
    class?: string;
  }

  let {
    direction = 'vertical',
    gap = 'density',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    children,
    class: className = '',
    ...rest
  }: StackProps = $props();

  const gapClasses: Record<NonNullable<StackProps['gap']>, string> = {
    density: 'gap-[var(--gap-ui)]',
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const alignClasses: Record<NonNullable<StackProps['align']>, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses: Record<NonNullable<StackProps['justify']>, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };
</script>

<div
  class="flex {direction === 'vertical' ? 'flex-col' : 'flex-row'} {wrap
    ? 'flex-wrap'
    : ''} {gapClasses[gap]} {alignClasses[align]} {justifyClasses[justify]} {className}"
  {...rest}
>
  {@render children()}
</div>
