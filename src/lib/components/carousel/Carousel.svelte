<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { CarouselState } from './carousel.svelte.js';

  export interface CarouselProps<T> extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    items: T[];
    children: Snippet<[item: T, index: number]>;
    label?: string | undefined;
    loop?: boolean | undefined;
    autoplay?: boolean | undefined;
    intervalMs?: number | undefined;
    aspectRatio?: 'video' | 'wide' | 'photo' | 'square' | 'auto' | undefined;
    class?: string | undefined;
  }

  let {
    items = [],
    children,
    label = 'Media carousel',
    loop = true,
    autoplay = false,
    intervalMs = 4000,
    aspectRatio = 'video',
    class: className = '',
    ...rest
  }: CarouselProps<T> = $props();

  const logic = new CarouselState({
    totalItems: () => items.length,
    loop: () => loop,
    label: () => label
  });

  const aspectClasses: Record<NonNullable<CarouselProps<T>['aspectRatio']>, string> = {
    video: 'aspect-[16/9]',
    wide: 'aspect-[21/9]',
    photo: 'aspect-[4/3]',
    square: 'aspect-[1/1]',
    auto: 'h-auto min-h-[300px]'
  };

  let isHovered = $state(false);

  $effect(() => {
    if (!autoplay || isHovered || items.length <= 1 || typeof window === 'undefined') return;
    const interval = setInterval(() => {
      logic.next();
    }, intervalMs);
    return () => clearInterval(interval);
  });
</script>

<section
  {...logic.ariaAttrs}
  onkeydown={(e) => logic.handleKeyDown(e)}
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  class="group relative my-8 rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated p-2 md:p-3 {className}"
  {...rest}
>
  <!-- Slide Viewport -->
  <div
    class="relative overflow-hidden rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas {aspectClasses[
      aspectRatio
    ]}"
  >
    <div
      class="flex h-full w-full transition-transform duration-300 ease-out"
      style="transform: translateX(-{logic.currentIndex * 100}%);"
    >
      {#each items as item, index (index)}
        <div
          role="group"
          aria-roledescription="slide"
          aria-label="{index + 1} of {items.length}"
          aria-hidden={logic.currentIndex !== index}
          class="h-full w-full shrink-0 relative"
        >
          {@render children(item, index)}
        </div>
      {/each}
    </div>

    <!-- Arrow Navigation Buttons -->
    {#if items.length > 1}
      <button
        type="button"
        onclick={() => logic.prev()}
        class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold px-2.5 py-1.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas/90 text-fg-primary backdrop-blur-sm shadow-subtle hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        [←]
      </button>

      <button
        type="button"
        onclick={() => logic.next()}
        class="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold px-2.5 py-1.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas/90 text-fg-primary backdrop-blur-sm shadow-subtle hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        [→]
      </button>
    {/if}
  </div>

  <!-- Footer Navigation / Pagination Controls -->
  {#if items.length > 1}
    <div class="mt-3 flex items-center justify-between px-1 select-none text-xs font-mono">
      <!-- Dots -->
      <div class="flex items-center gap-1.5" role="tablist" aria-label="Slides">
        {#each items as _, i (i)}
          <button
            type="button"
            role="tab"
            aria-selected={logic.currentIndex === i}
            aria-label="Go to slide {i + 1}"
            onclick={() => logic.goTo(i)}
            class="h-2 rounded-full transition-all cursor-pointer {logic.currentIndex === i
              ? 'w-6 bg-accent-interactive'
              : 'w-2 bg-border-subtle hover:bg-fg-muted'}"
          ></button>
        {/each}
      </div>

      <!-- Slide Counter -->
      <div class="font-bold text-fg-muted">
        [{String(logic.currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(
          2,
          '0'
        )}]
      </div>
    </div>
  {/if}
</section>
