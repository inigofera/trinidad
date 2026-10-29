<script lang="ts">
  import { Announcer } from '$lib/actions/announcer.svelte.js';

  export interface LightboxProps {
    open: boolean;
    src: string;
    alt: string;
    caption?: string | undefined;
    kicker?: string | undefined;
    onclose: () => void;
  }

  let { open = $bindable(false), src, alt, caption, kicker, onclose }: LightboxProps = $props();

  let dialogEl = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialogEl) return;
    if (open) {
      if (!dialogEl.open) {
        dialogEl.showModal();
        Announcer.announce(`Full-resolution viewer opened for ${alt}`, 'polite');
      }
    } else {
      if (dialogEl.open) {
        dialogEl.close();
      }
    }
  });

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) {
      closeLightbox();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    }
  }

  function closeLightbox() {
    open = false;
    onclose();
    Announcer.announce('Full-resolution viewer closed', 'polite');
  }
</script>

<!-- Native Dialog Overlay -->
<dialog
  bind:this={dialogEl}
  onclick={handleBackdropClick}
  onkeydown={handleKeyDown}
  aria-modal="true"
  aria-label="Image lightbox viewer: {alt}"
  class="fixed inset-0 z-50 m-auto max-h-[92vh] max-w-[94vw] bg-transparent p-0 backdrop:bg-surface-canvas/80 backdrop:backdrop-blur-md border-0 focus:outline-none"
>
  <div
    class="relative flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas p-2 md:p-4 shadow-floating"
  >
    <!-- Top Action Header -->
    <div class="w-full flex items-center justify-between pb-3 px-2 select-none">
      <div class="font-mono text-xs uppercase tracking-wider text-fg-muted">
        {#if kicker}
          [{kicker}]
        {/if}
      </div>

      <button
        type="button"
        onclick={closeLightbox}
        class="font-mono text-xs font-bold px-2 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-fg-primary hover:bg-surface-muted hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer"
        aria-label="Close image viewer"
      >
        [Esc / Close]
      </button>
    </div>

    <!-- Image Display -->
    <div class="relative overflow-hidden rounded-[var(--radius-control)] max-h-[75vh]">
      <img {src} {alt} class="max-h-[75vh] w-auto max-w-full object-contain mx-auto" />
    </div>

    <!-- Bottom Caption Bar -->
    {#if caption}
      <div class="w-full pt-3 px-2 text-center text-sm font-sans text-fg-muted">
        {caption}
      </div>
    {/if}
  </div>
</dialog>

<style>
  dialog::backdrop {
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
