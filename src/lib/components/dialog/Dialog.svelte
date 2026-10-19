<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DialogState } from './dialog.svelte.js';
  import { useFocusTrap } from '../../actions/focus-trap.svelte.js';

  export interface DialogProps {
    open?: boolean | undefined;
    title: string;
    description?: string | undefined;
    trigger?: Snippet<[{ onclick: () => void }]> | undefined;
    children: Snippet;
    footer?: Snippet | undefined;
    class?: string | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
  }

  let {
    open = $bindable(false),
    title,
    description,
    trigger,
    children,
    footer,
    class: className = '',
    onOpenChange
  }: DialogProps = $props();

  const generatedId = $props.id();
  const titleId = $derived(`${generatedId}-title`);
  const descId = $derived(`${generatedId}-desc`);

  let dialogNode = $state<HTMLDialogElement | null>(null);
  let triggerWrapper = $state<HTMLSpanElement | null>(null);

  const logic = new DialogState({
    open: () => open,
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    }
  });

  $effect(() => {
    logic.dialogElement = dialogNode;
    if (triggerWrapper) {
      const button = triggerWrapper.querySelector<HTMLElement>('button, [tabindex="0"]');
      if (button) logic.triggerElement = button;
    }
  });

  $effect(() => {
    if (!dialogNode) return;

    if (open) {
      logic.saveActiveElement();
      if (!dialogNode.open) {
        dialogNode.showModal();
      }
      logic.lockScroll();
    } else {
      if (dialogNode.open) {
        dialogNode.close();
      }
      logic.unlockScroll();
      logic.restoreFocus();
    }

    return () => {
      logic.unlockScroll();
    };
  });

  function handleTriggerClick() {
    logic.setOpen(true);
  }

  function handleCloseClick() {
    logic.setOpen(false);
  }
</script>

{#if trigger}
  <span bind:this={triggerWrapper} class="inline-block">
    {@render trigger({ onclick: handleTriggerClick })}
  </span>
{/if}

<dialog
  bind:this={dialogNode}
  use:useFocusTrap={() => open}
  aria-labelledby={titleId}
  aria-describedby={description ? descId : undefined}
  onclick={logic.handleBackdropClick}
  oncancel={logic.handleCancel}
  class="fixed inset-0 m-auto max-w-lg w-[calc(100%-2rem)] p-0 bg-surface-elevated text-fg-primary border border-border-subtle shadow-2xl backdrop:bg-surface-canvas/80 backdrop:backdrop-blur-xs font-mono text-xs focus-visible:outline-none open:animate-in open:fade-in-0 {className}"
>
  <div class="flex flex-col max-h-[85vh]">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-border-subtle p-4 gap-4">
      <div class="space-y-1">
        <h2 id={titleId} class="text-sm font-bold tracking-tight text-fg-primary">
          // {title}
        </h2>
        {#if description}
          <p id={descId} class="text-fg-muted text-[11px] leading-relaxed">
            {description}
          </p>
        {/if}
      </div>

      <button
        type="button"
        onclick={handleCloseClick}
        aria-label="Close dialog"
        class="text-fg-muted hover:text-fg-primary p-1 rounded-none border border-border-subtle hover:bg-surface-muted transition-colors select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 overflow-y-auto space-y-4">
      {@render children()}
    </div>

    <!-- Footer -->
    {#if footer}
      <div
        class="flex items-center justify-end gap-2 border-t border-border-subtle p-4 bg-surface-canvas/50"
      >
        {@render footer()}
      </div>
    {/if}
  </div>
</dialog>
