<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
    theme?: 'paper' | 'industrial';
    density?: 'comfortable' | 'compact';
    motion?: 'full' | 'reduced';
    children: Snippet;
    class?: string;
  }

  let {
    theme,
    density,
    motion,
    children,
    class: className = '',
    ...rest
  }: ThemeScopeProps = $props();
</script>

<div
  data-theme={theme}
  data-density={density}
  data-motion={motion}
  class="bg-surface-canvas text-fg-primary transition-colors {className}"
  {...rest}
>
  {@render children()}
</div>
