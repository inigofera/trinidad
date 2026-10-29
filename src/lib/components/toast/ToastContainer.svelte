<script lang="ts">
  import { toast, type ToastItem } from './toast.svelte.js';

  export interface ToastContainerProps {
    position?: 'top-right' | 'bottom-right' | 'bottom-center' | undefined;
    class?: string | undefined;
  }

  let { position = 'bottom-right', class: className = '' }: ToastContainerProps = $props();

  const positionClasses = {
    'top-right': 'top-4 right-4 flex-col-reverse',
    'bottom-right': 'bottom-4 right-4 flex-col',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col'
  };

  const variantBorderClasses = {
    nominal: 'border-status-nominal',
    warning: 'border-status-warning',
    critical: 'border-status-critical',
    info: 'border-border-subtle'
  };

  const variantDotClasses = {
    nominal: 'bg-status-nominal',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical',
    info: 'bg-fg-muted'
  };

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && toast.items.length > 0) {
      const last = toast.items[toast.items.length - 1];
      if (last) {
        toast.dismiss(last.id);
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<aside
  aria-label="Notifications"
  class="fixed z-50 pointer-events-none flex gap-2 max-w-sm w-full p-4 font-sans {positionClasses[
    position
  ]} {className}"
>
  {#each toast.items as item (item.id)}
    <div
      role={item.variant === 'critical' ? 'alert' : 'status'}
      class="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-card)] border bg-surface-canvas text-fg-primary shadow-floating transition-all duration-200 {variantBorderClasses[
        item.variant
      ]}"
    >
      <div class="flex items-center gap-2.5 text-xs font-mono">
        <span
          class="w-2 h-2 rounded-full shrink-0 {variantDotClasses[item.variant]}"
          aria-hidden="true"
        ></span>
        <span class="leading-normal">{item.message}</span>
      </div>

      <button
        type="button"
        onclick={() => toast.dismiss(item.id)}
        aria-label="Dismiss notification"
        class="text-fg-muted hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive rounded p-0.5 cursor-pointer shrink-0 font-mono text-xs"
      >
        ✕
      </button>
    </div>
  {/each}
</aside>
