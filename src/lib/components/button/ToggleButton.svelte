<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { ButtonVariant } from './button.svelte.js';

  type BaseToggleProps = {
    variant?: ButtonVariant | undefined;
    pressed?: boolean | undefined;
    shortcut?: string | undefined;
    children: Snippet;
    class?: string | undefined;
    onPressedChange?: ((pressed: boolean) => void) | undefined;
  };

  type AccessibleConstraint =
    | ({ iconOnly: true; 'aria-label': string } & Omit<HTMLButtonAttributes, 'children' | 'class'>)
    | ({ iconOnly?: false | undefined; 'aria-label'?: string | undefined } & Omit<
        HTMLButtonAttributes,
        'children' | 'class'
      >);

  export type ToggleButtonProps = BaseToggleProps & AccessibleConstraint;

  let {
    pressed = $bindable(false),
    variant = 'secondary',
    shortcut,
    children,
    class: className = '',
    type = 'button',
    disabled = false,
    iconOnly = false,
    'aria-label': ariaLabel,
    onPressedChange,
    onclick,
    ...rest
  }: ToggleButtonProps = $props();

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (disabled) return;
    pressed = !pressed;
    onPressedChange?.(pressed);
    onclick?.(e);
  }

  const variantClass = $derived.by(() => {
    switch (variant) {
      case 'primary':
        return pressed
          ? 'bg-accent-interactive text-accent-contrast border-transparent'
          : 'bg-surface-elevated text-fg-primary border-border-subtle hover:bg-surface-muted';
      case 'secondary':
        return pressed
          ? 'bg-surface-muted text-fg-primary border-accent-interactive'
          : 'bg-surface-elevated text-fg-primary border-border-subtle hover:bg-surface-muted';
      case 'ghost':
        return pressed
          ? 'bg-surface-elevated text-fg-primary border-border-subtle'
          : 'bg-transparent text-fg-muted border-transparent hover:text-fg-primary hover:bg-surface-elevated';
      case 'danger':
        return pressed
          ? 'bg-status-critical text-white border-transparent'
          : 'bg-surface-elevated text-status-critical border-status-critical/30 hover:bg-surface-muted';
      default:
        return 'bg-surface-elevated text-fg-primary border-border-subtle hover:bg-surface-muted';
    }
  });
</script>

<button
  {type}
  {disabled}
  aria-pressed={pressed}
  aria-label={ariaLabel}
  onclick={handleClick}
  class="relative inline-flex items-center justify-center rounded-[var(--radius-control)] border font-medium select-none cursor-pointer transition-transform active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive h-[var(--control-height)] px-[var(--control-px)] text-[length:var(--font-size-ui)] {variantClass} {className}"
  {...rest}
>
  <span class="inline-flex items-center gap-2">
    {#if pressed}
      <span
        class="w-1.5 h-1.5 rounded-full bg-accent-interactive shrink-0 animate-pulse"
        aria-hidden="true"
      ></span>
    {/if}
    {@render children()}
    {#if shortcut}
      <kbd class="font-semibold text-[0.8em]">[{shortcut}]</kbd>
    {/if}
  </span>
</button>
