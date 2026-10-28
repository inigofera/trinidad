<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { NumberField } from '$lib/components/number-field/index.js';

  let value = $state(42.5);
  let min = $state(0);
  let max = $state(100);
  let step = $state(0.5);
  let unit = $state('ms');
  let label = $state('SAMPLING_INTERVAL');
  let disabled = $state(false);
  let invalid = $state(false);
  let errorMessage = $state('Value breaches nominal sampling threshold [max: 100ms]');

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { NumberField } from 'trinidad-ui';
  let value = $state(${value});
<\/script>

<NumberField
  label="${label}"
  bind:value
  min={${min}}
  max={${max}}
  step={${step}}
  unit="${unit}"
  disabled={${disabled}}
  invalid={${invalid}}
  ${invalid ? `errorMessage="${errorMessage}"` : ''}
/>`;
  });
</script>

<WorkbenchShell
  name="NumberField"
  description="Precision numeric telemetry input with horizontal drag scrubbing on label, floating-point safe clamping, and WAI-ARIA spinbutton specification."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-xs">
      <NumberField
        {label}
        bind:value
        {min}
        {max}
        {step}
        {unit}
        {disabled}
        {invalid}
        errorMessage={invalid ? errorMessage : undefined}
      />
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-val" class="text-fg-muted font-bold block">Current Value</label>
        <input
          id="ctrl-val"
          type="number"
          bind:value
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="space-y-1">
          <label for="ctrl-min" class="text-fg-muted font-bold block">Min</label>
          <input
            id="ctrl-min"
            type="number"
            bind:value={min}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
        <div class="space-y-1">
          <label for="ctrl-max" class="text-fg-muted font-bold block">Max</label>
          <input
            id="ctrl-max"
            type="number"
            bind:value={max}
            class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
          />
        </div>
        <div class="space-y-1">
          <label for="ctrl-step" class="text-fg-muted font-bold block">Step</label>
          <input
            id="ctrl-step"
            type="number"
            step="0.1"
            bind:value={step}
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

      <div class="space-y-1">
        <label for="ctrl-err" class="text-fg-muted font-bold block">Error Message</label>
        <input
          id="ctrl-err"
          type="text"
          bind:value={errorMessage}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="flex items-center gap-4 pt-1">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" bind:checked={invalid} />
          <span class="text-fg-primary font-bold">Invalid</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" bind:checked={disabled} />
          <span>Disabled</span>
        </label>
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
