<script lang="ts">
  import { SparklineState } from './sparkline.svelte.js';

  export interface SparklineProps {
    data: number[];
    min?: number | undefined;
    max?: number | undefined;
    warnThreshold?: number | undefined;
    criticalThreshold?: number | undefined;
    unit?: string | undefined;
    label: string;
    fps?: number | undefined;
    class?: string | undefined;
  }

  let {
    data = [],
    min = 0,
    max = 100,
    warnThreshold,
    criticalThreshold,
    unit = '',
    label,
    fps,
    class: className = ''
  }: SparklineProps = $props();

  let canvasNode = $state<HTMLCanvasElement | null>(null);
  let containerNode = $state<HTMLDivElement | null>(null);

  const logic = new SparklineState({
    data: () => data,
    min: () => min,
    max: () => max,
    warnThreshold: () => warnThreshold,
    criticalThreshold: () => criticalThreshold,
    unit: () => unit,
    label: () => label
  });

  // Observe container dimensions without thrashing in draw loop
  $effect(() => {
    if (!containerNode) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        logic.setDimensions(Math.floor(width), Math.floor(height));
      }
    });
    observer.observe(containerNode);
    return () => observer.disconnect();
  });

  // Render on data update, dimension change, or scrubbing change
  $effect(() => {
    if (!canvasNode) return;
    // Dependency tracking
    const _len = data.length;
    const _scrub = logic.scrubIndex;
    const _w = logic.width;
    const _h = logic.height;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    logic.draw(canvasNode, dpr);
  });
</script>

<div class="inline-flex flex-col gap-1.5 font-mono text-xs w-full {className}">
  <!-- Monospace Header & Status Readout -->
  <div class="flex items-center justify-between text-[11px] text-fg-muted select-none">
    <div class="flex items-center gap-2">
      <span class="font-bold text-fg-primary">// {label}</span>
      {#if logic.isPaused}
        <span
          class="px-1 py-0.2 rounded bg-accent-interactive/20 text-fg-primary text-[10px] font-bold"
        >
          [PAUSED / INSPECTING]
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-3">
      {#if fps !== undefined}
        <span class="text-status-nominal text-[10px]">[{fps} FPS]</span>
      {/if}
      <span class="text-fg-primary font-bold">
        {#if logic.inspectedValue !== null}
          {logic.inspectedValue.toFixed(1)} {unit}
        {:else}
          {logic.latestValue.toFixed(1)} {unit}
        {/if}
      </span>
    </div>
  </div>

  <!-- Telemetry Canvas Container -->
  <div
    bind:this={containerNode}
    class="relative w-full h-24 bg-surface-elevated border border-border-subtle focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-interactive transition-colors overflow-hidden"
  >
    <canvas
      bind:this={canvasNode}
      aria-label="{label}: {logic.latestValue.toFixed(1)} {unit}"
      aria-roledescription="telemetry sparkline"
      tabindex="0"
      onkeydown={logic.handleKeyDown}
      onfocus={() => (logic.isFocused = true)}
      onblur={() => {
        logic.isFocused = false;
        logic.scrubIndex = null;
      }}
      onpointerenter={() => (logic.isHovered = true)}
      onpointerleave={logic.handlePointerLeave}
      onpointermove={(e) => {
        if (canvasNode) logic.handlePointerMove(e, canvasNode);
      }}
      class="w-full h-full block cursor-crosshair focus:outline-none"
    ></canvas>
  </div>

  <!-- Footer Scale Metadata -->
  <div class="flex items-center justify-between text-[10px] select-none font-mono">
    <span class="text-fg-muted">MIN: {logic.min} {unit}</span>
    {#if warnThreshold !== undefined}
      <span class="text-status-warning font-bold">WARN: {warnThreshold} {unit}</span>
    {/if}
    {#if criticalThreshold !== undefined}
      <span class="text-status-critical font-bold">CRIT: {criticalThreshold} {unit}</span>
    {/if}
    <span class="text-fg-muted">MAX: {logic.max} {unit}</span>
  </div>
</div>
