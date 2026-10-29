<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface StatGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    cols?: 1 | 2 | 3 | 4 | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let { cols = 3, children, class: className = '', ...rest }: StatGridProps = $props();

  const colsClasses: Record<NonNullable<StatGridProps['cols']>, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
</script>

<div class="grid gap-4 {colsClasses[cols]} {className}" {...rest}>
  {@render children()}
</div>
