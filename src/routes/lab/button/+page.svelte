<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { Button, ToggleButton, type ButtonVariant } from '$lib/components/button/index.js';

  let variant = $state<ButtonVariant>('primary');
  let loading = $state(false);
  let disabled = $state(false);
  let shortcut = $state('⌘K');
  let label = $state('Initiate Telemetry Sequence');
  let isToggle = $state(false);
  let pressed = $state(false);

  const generatedCode = $derived.by(() => {
    if (isToggle) {
      return `<script lang="ts">
  import { ToggleButton } from 'trinidad-ui';
  let pressed = $state(${pressed});
<\/script>

<ToggleButton
  variant="${variant}"
  bind:pressed
  ${shortcut ? `shortcut="${shortcut}"` : ''}
  disabled={${disabled}}
>
  ${label}
</ToggleButton>`;
    }

    return `<script lang="ts">
  import { Button } from 'trinidad-ui';
<\/script>

<Button
  variant="${variant}"
  loading={${loading}}
  disabled={${disabled}}
  ${shortcut ? `shortcut="${shortcut}"` : ''}
  onclick={() => console.log('Action dispatched')}
>
  ${label}
</Button>`;
  });
</script>

<WorkbenchShell
  name="Button & ToggleButton"
  description="Polymorphic action and toggle primitives with animated spinners, state-preserving width locking, and high-contrast tactile feedback."
  {generatedCode}
>
  {#snippet stage()}
    <div class="flex flex-col items-center gap-6">
      {#if !isToggle}
        <Button
          {variant}
          {loading}
          {disabled}
          shortcut={shortcut || undefined}
          onclick={() => alert('Button clicked!')}
        >
          {label}
        </Button>
      {:else}
        <ToggleButton {variant} bind:pressed {disabled} shortcut={shortcut || undefined}>
          {label}
          {pressed ? 'On' : 'Off'}
        </ToggleButton>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-mode" class="text-fg-muted font-bold block">Component Mode</label>
        <div class="grid grid-cols-2 gap-2" id="ctrl-mode">
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {isToggle
              ? 'bg-surface-canvas text-fg-muted'
              : 'bg-accent-interactive text-accent-contrast font-bold'}"
            onclick={() => (isToggle = false)}
          >
            Button
          </button>
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {isToggle
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (isToggle = true)}
          >
            ToggleButton
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label for="ctrl-variant" class="text-fg-muted font-bold block">Variant</label>
        <select
          id="ctrl-variant"
          bind:value={variant}
          class="w-full px-2 py-1.5 bg-surface-canvas border border-border-subtle text-fg-primary focus:outline-accent-interactive"
        >
          <option value="primary">primary</option>
          <option value="secondary">secondary</option>
          <option value="ghost">ghost</option>
          <option value="danger">danger</option>
        </select>
      </div>

      <div class="space-y-1">
        <label for="ctrl-label" class="text-fg-muted font-bold block">Label Content</label>
        <input
          id="ctrl-label"
          type="text"
          bind:value={label}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="space-y-1">
        <label for="ctrl-shortcut" class="text-fg-muted font-bold block">Shortcut Badge</label>
        <input
          id="ctrl-shortcut"
          type="text"
          bind:value={shortcut}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="flex items-center gap-4 pt-2">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" bind:checked={loading} disabled={isToggle} />
          <span>Loading</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" bind:checked={disabled} />
          <span>Disabled</span>
        </label>
        {#if isToggle}
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" bind:checked={pressed} />
            <span>Pressed</span>
          </label>
        {/if}
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
