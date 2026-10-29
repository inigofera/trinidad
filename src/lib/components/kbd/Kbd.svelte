<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    key?: string | undefined;
    children?: Snippet | undefined;
    class?: string | undefined;
  }

  let { key, children, class: className = '', ...rest }: KbdProps = $props();
</script>

<kbd
  class="inline-flex items-center justify-center font-mono text-[0.8em] font-bold px-1.5 py-0.5 rounded-[var(--radius-control)] bg-surface-muted border border-border-subtle text-fg-primary select-none shadow-[0_1px_0_1px_var(--border-subtle)] align-baseline {className}"
  {...rest}
>
  {#if children}
    {@render children()}
  {:else if key}
    [{key}]
  {/if}
</kbd>
