<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Lightbox from './Lightbox.svelte';

  export interface MediaFigureProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    src: string;
    alt: string;
    caption?: string | undefined;
    kicker?: string | undefined;
    attribution?: string | undefined;
    zoomable?: boolean | undefined;
    aspectRatio?: 'video' | 'wide' | 'photo' | 'square' | 'auto' | undefined;
    class?: string | undefined;
  }

  let {
    src,
    alt,
    caption,
    kicker,
    attribution,
    zoomable = true,
    aspectRatio = 'video',
    class: className = '',
    ...rest
  }: MediaFigureProps = $props();

  let lightboxOpen = $state(false);
  let triggerBtn = $state<HTMLButtonElement | null>(null);

  const aspectClasses: Record<NonNullable<MediaFigureProps['aspectRatio']>, string> = {
    video: 'aspect-[16/9]',
    wide: 'aspect-[21/9]',
    photo: 'aspect-[4/3]',
    square: 'aspect-[1/1]',
    auto: 'h-auto'
  };

  function openZoom() {
    if (!zoomable) return;
    lightboxOpen = true;
  }

  function handleClose() {
    lightboxOpen = false;
    triggerBtn?.focus();
  }
</script>

<figure
  class="group my-8 rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated p-2 md:p-3 {className}"
  {...rest}
>
  <!-- Media Frame -->
  <div
    class="relative overflow-hidden rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas {aspectClasses[
      aspectRatio
    ]}"
  >
    <img
      {src}
      {alt}
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
      loading="lazy"
    />

    {#if zoomable}
      <!-- Floating Zoom Trigger Button -->
      <button
        bind:this={triggerBtn}
        type="button"
        onclick={openZoom}
        class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity font-mono text-xs font-bold px-2 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas/90 text-fg-primary backdrop-blur-sm shadow-subtle hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none"
        aria-label="Open full resolution image viewer: {alt}"
      >
        [+] Fullscreen
      </button>
    {/if}
  </div>

  <!-- Caption / Footnote -->
  {#if caption || kicker}
    <figcaption
      class="pt-3 px-1 text-sm font-sans flex items-baseline justify-between gap-4 flex-wrap"
    >
      <div>
        {#if kicker}
          <span
            class="font-mono text-xs font-bold uppercase tracking-wider text-fg-muted mr-2 select-none"
          >
            [{kicker}]
          </span>
        {/if}
        {#if caption}
          <span class="text-fg-muted leading-relaxed">
            {caption}
          </span>
        {/if}
      </div>

      {#if attribution}
        <span class="font-mono text-xs text-fg-muted shrink-0">
          Source: {attribution}
        </span>
      {/if}
    </figcaption>
  {/if}
</figure>

{#if zoomable}
  <Lightbox bind:open={lightboxOpen} {src} {alt} {caption} {kicker} onclose={handleClose} />
{/if}
