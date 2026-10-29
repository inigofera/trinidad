<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

  export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    text: string;
    position?: TooltipPosition | undefined;
    shortcut?: string | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let {
    text,
    position = 'top',
    shortcut,
    children,
    class: className = '',
    ...rest
  }: TooltipProps = $props();

  let visible = $state(false);
  const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  function show() {
    visible = true;
  }

  function hide() {
    visible = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && visible) {
      visible = false;
      e.stopPropagation();
    }
  }
</script>

<div
  class="relative inline-flex {className}"
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
  onkeydown={handleKeyDown}
  aria-describedby={visible ? tooltipId : undefined}
  {...rest}
>
  {@render children()}

  {#if visible}
    <div
      role="tooltip"
      id={tooltipId}
      class="absolute z-50 pointer-events-none whitespace-nowrap rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated px-2.5 py-1 text-xs font-mono text-fg-primary shadow-floating flex items-center gap-1.5 {positionClasses[
        position
      ]}"
    >
      <span>{text}</span>
      {#if shortcut}
        <kbd
          class="font-bold text-[10px] text-accent-interactive bg-surface-muted px-1 py-0.2 rounded border border-border-subtle"
        >
          [{shortcut}]
        </kbd>
      {/if}
    </div>
  {/if}
</div>
