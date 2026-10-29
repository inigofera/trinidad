<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { Sparkline } from '$lib/components/sparkline/index.js';

  let data = $state<number[]>([
    45.2, 48.0, 52.1, 49.3, 56.4, 62.0, 58.1, 64.3, 71.2, 68.4, 74.5, 79.1, 75.3, 82.0, 88.4, 84.1,
    78.3, 71.0, 65.2, 60.1
  ]);
  let min = $state(0);
  let max = $state(100);
  let warnThreshold = $state(70);
  let criticalThreshold = $state(85);
  let unit = $state('ms');
  let label = $state('Telemetry latency ring buffer');
  let streaming = $state(false);

  // Simulated live telemetry stream
  $effect(() => {
    if (!streaming) return;
    const interval = setInterval(() => {
      const prev = data[data.length - 1] ?? 50;
      const noise = (Math.random() - 0.48) * 8;
      const next = Math.max(min, Math.min(max, prev + noise));
      data = [...data.slice(1), Number(next.toFixed(1))];
    }, 100);
    return () => clearInterval(interval);
  });

  function triggerSpike() {
    data = [...data.slice(1), 94.5];
  }

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { Sparkline } from 'trinidad-ui';
  let buffer = $state([${data.slice(-5).join(', ')}...]);
<\/script>

<Sparkline
  label="${label}"
  data={buffer}
  min={${min}}
  max={${max}}
  warnThreshold={${warnThreshold}}
  criticalThreshold={${criticalThreshold}}
  unit="${unit}"
/>`;
  });
</script>

<WorkbenchShell
  name="Sparkline"
  description="High-frequency telemetry stream visualizer rendering to Retina 2D canvas with threshold warnings, dimension caching, and pause-on-hover crosshair inspection."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-lg">
      <Sparkline
        {data}
        {min}
        {max}
        {warnThreshold}
        {criticalThreshold}
        {unit}
        {label}
        fps={streaming ? 60 : undefined}
      />
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-stream" class="text-fg-muted font-bold block">Stream Generator</label>
        <div class="grid grid-cols-2 gap-2" id="ctrl-stream">
          <button
            type="button"
            class="px-2 py-1.5 rounded border border-border-subtle {streaming
              ? 'bg-status-nominal text-surface-canvas font-bold'
              : 'bg-surface-canvas text-fg-primary'}"
            onclick={() => (streaming = !streaming)}
          >
            {streaming ? '■ Pause Stream' : '▶ Start Stream'}
          </button>
          <button
            type="button"
            class="px-2 py-1.5 rounded border border-border-subtle bg-surface-canvas text-fg-primary font-bold hover:border-status-critical"
            onclick={triggerSpike}
          >
            Inject spike
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <label for="ctrl-warn" class="text-fg-muted font-bold block">Warn Threshold</label>
          <input
            id="ctrl-warn"
            type="number"
            bind:value={warnThreshold}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary font-bold"
          />
        </div>
        <div class="space-y-1">
          <label for="ctrl-crit" class="text-fg-muted font-bold block">Crit Threshold</label>
          <input
            id="ctrl-crit"
            type="number"
            bind:value={criticalThreshold}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary font-bold"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <label for="ctrl-min" class="text-fg-muted font-bold block">Min Scale</label>
          <input
            id="ctrl-min"
            type="number"
            bind:value={min}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
        <div class="space-y-1">
          <label for="ctrl-max" class="text-fg-muted font-bold block">Max Scale</label>
          <input
            id="ctrl-max"
            type="number"
            bind:value={max}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <label for="ctrl-label" class="text-fg-muted font-bold block">Label</label>
          <input
            id="ctrl-label"
            type="text"
            bind:value={label}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
        <div class="space-y-1">
          <label for="ctrl-unit" class="text-fg-muted font-bold block">Unit</label>
          <input
            id="ctrl-unit"
            type="text"
            bind:value={unit}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
