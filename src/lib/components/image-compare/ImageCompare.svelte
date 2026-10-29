<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { ImageCompareState } from './image-compare.svelte.js';

  export interface ImageCompareProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    beforeSrc: string;
    beforeAlt: string;
    beforeLabel?: string | undefined;
    afterSrc: string;
    afterAlt: string;
    afterLabel?: string | undefined;
    initialPosition?: number | undefined;
    aspectRatio?: 'video' | 'wide' | 'photo' | 'square' | 'auto' | undefined;
    class?: string | undefined;
  }

  let {
    beforeSrc,
    beforeAlt,
    beforeLabel = 'Before',
    afterSrc,
    afterAlt,
    afterLabel = 'After',
    initialPosition = 50,
    aspectRatio = 'video',
    class: className = '',
    ...rest
  }: ImageCompareProps = $props();

  let containerEl = $state<HTMLDivElement | null>(null);

  const logic = new ImageCompareState({
    initialPosition: () => initialPosition,
    label: () => `${beforeLabel} vs ${afterLabel} visual comparison`
  });

  const aspectClasses: Record<NonNullable<ImageCompareProps['aspectRatio']>, string> = {
    video: 'aspect-[16/9]',
    wide: 'aspect-[21/9]',
    photo: 'aspect-[4/3]',
    square: 'aspect-[1/1]',
    auto: 'h-auto'
  };

  function handlePointerDown(e: PointerEvent) {
    logic.startDrag();
    if (containerEl) {
      logic.updateFromPointer(e.clientX, containerEl.getBoundingClientRect());
    }
  }

  $effect(() => {
    if (!logic.isDragging || typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      if (containerEl) {
        logic.updateFromPointer(e.clientX, containerEl.getBoundingClientRect());
      }
    };

    const handlePointerUp = () => {
      logic.stopDrag();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  });
</script>

<div
  bind:this={containerEl}
  class="relative select-none overflow-hidden rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas {aspectClasses[
    aspectRatio
  ]} {className}"
  {...rest}
>
  <!-- After Image (Base Layer) -->
  <img
    src={afterSrc}
    alt={afterAlt}
    class="absolute inset-0 h-full w-full object-cover pointer-events-none"
    loading="lazy"
  />

  <!-- Before Image (Clipped Overlay Layer) -->
  <div
    class="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
    style="clip-path: inset(0 calc(100% - {logic.position}%) 0 0);"
  >
    <img
      src={beforeSrc}
      alt={beforeAlt}
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
    />
  </div>

  <!-- Divider Line & Slider Thumb -->
  <div
    class="absolute top-0 bottom-0 z-20 flex flex-col items-center pointer-events-none"
    style="left: {logic.position}%; transform: translateX(-50%);"
  >
    <!-- Vertical Hairline Line -->
    <div class="h-full w-[2px] bg-accent-interactive shadow-sm"></div>

    <!-- Interactive Thumb Pill -->
    <button
      type="button"
      {...logic.ariaAttrs}
      onpointerdown={handlePointerDown}
      onkeydown={(e) => logic.handleKeyDown(e)}
      class="absolute top-1/2 -translate-y-1/2 pointer-events-auto cursor-ew-resize flex items-center justify-center gap-1 px-2 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-fg-primary font-mono text-xs font-bold shadow-subtle hover:border-accent-interactive hover:bg-surface-canvas focus-visible:outline-2 focus-visible:outline-accent-interactive select-none"
      title="Drag or use arrow keys to adjust split"
    >
      <span aria-hidden="true" class="text-fg-muted font-bold">◂</span>
      <span class="text-[10px] text-fg-primary tracking-tighter">||</span>
      <span aria-hidden="true" class="text-fg-muted font-bold">▸</span>
    </button>
  </div>

  <!-- Corner Badges -->
  {#if beforeLabel}
    <div
      class="absolute bottom-3 left-3 z-10 font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-control)] bg-surface-canvas/90 text-fg-primary border border-border-subtle backdrop-blur-sm pointer-events-none select-none"
    >
      [{beforeLabel}]
    </div>
  {/if}

  {#if afterLabel}
    <div
      class="absolute bottom-3 right-3 z-10 font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-control)] bg-surface-canvas/90 text-fg-primary border border-border-subtle backdrop-blur-sm pointer-events-none select-none"
    >
      [{afterLabel}]
    </div>
  {/if}
</div>
