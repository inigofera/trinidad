<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ButtonState, type ButtonVariant } from './button.svelte.js';

  type BaseProps = {
    variant?: ButtonVariant | undefined;
    loading?: boolean | undefined;
    shortcut?: string | undefined;
    children: Snippet;
    class?: string | undefined;
  };

  type AccessibleConstraint =
    | ({ iconOnly: true; 'aria-label': string } & Omit<HTMLButtonAttributes, 'children' | 'class'>)
    | ({ iconOnly?: false | undefined; 'aria-label'?: string | undefined } & Omit<
        HTMLButtonAttributes,
        'children' | 'class'
      >);

  export type ButtonProps = BaseProps & AccessibleConstraint;

  let {
    variant = 'primary',
    loading = false,
    shortcut,
    children,
    class: className = '',
    type = 'button',
    disabled = false,
    iconOnly = false,
    'aria-label': ariaLabel,
    ...rest
  }: ButtonProps = $props();

  const state = new ButtonState({
    loading: () => loading,
    disabled: () => Boolean(disabled)
  });

  $effect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      state.nextFrame();
    }, 120);
    return () => clearInterval(interval);
  });

  const variantClass = $derived.by(() => {
    switch (variant) {
      case 'primary':
        return 'bg-accent-interactive text-accent-contrast border-transparent hover:opacity-90';
      case 'secondary':
        return 'bg-surface-elevated text-fg-primary border-border-subtle hover:bg-surface-muted';
      case 'ghost':
        return 'bg-transparent text-fg-muted border-transparent hover:text-fg-primary hover:bg-surface-elevated';
      case 'danger':
        return 'bg-status-critical text-critical-contrast border-transparent hover:opacity-90';
      default:
        return 'bg-accent-interactive text-accent-contrast border-transparent hover:opacity-90';
    }
  });
</script>

<button
  {type}
  disabled={disabled || loading}
  aria-label={ariaLabel}
  {...state.ariaAttrs}
  class="relative inline-flex items-center justify-center rounded-[var(--radius-control)] border font-medium select-none cursor-pointer transition-transform active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive h-[var(--control-height)] px-[var(--control-px)] text-[length:var(--font-size-ui)] {variantClass} {className}"
  {...rest}
>
  {#if loading}
    <span class="opacity-0 pointer-events-none inline-flex items-center gap-1.5" aria-hidden="true">
      {@render children()}
      {#if shortcut}
        <kbd class="font-semibold text-[0.8em]">[{shortcut}]</kbd>
      {/if}
    </span>
    <span
      class="absolute inset-0 flex items-center justify-center font-mono font-bold tracking-widest pointer-events-none"
      aria-hidden="true"
    >
      {state.currentSpinner}
    </span>
  {:else}
    <span class="inline-flex items-center gap-1.5">
      {@render children()}
      {#if shortcut}
        <kbd class="font-semibold text-[0.8em]">[{shortcut}]</kbd>
      {/if}
    </span>
  {/if}
</button>
