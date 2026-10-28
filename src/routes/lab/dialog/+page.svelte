<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { Dialog } from '$lib/components/dialog/index.js';
  import { Button } from '$lib/components/button/index.js';

  let open = $state(false);
  let title = $state('OVERRIDE_TELEMETRY_CALIBRATION');
  let description = $state('You are about to re-zero telemetry bias across all channels.');

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { Dialog, Button } from 'trinidad-ui';
  let open = $state(${open});
<\/script>

<Dialog
  bind:open
  title="${title}"
  description="${description}"
>
  {#snippet trigger({ onclick })}
    <Button variant="primary" {onclick}>
      Open Operator Dialog
    </Button>
  {/snippet}

  <p class="font-mono text-xs text-fg-muted">
    Telemetry sensor parameters will be reset to hardware defaults.
  </p>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (open = false)}>
      Cancel
    </Button>
    <Button variant="danger" onclick={() => { open = false; alert('Confirmed!'); }}>
      Confirm Reset
    </Button>
  {/snippet}
</Dialog>`;
  });
</script>

<WorkbenchShell
  name="Dialog"
  description="Native modal system utilizing HTML5 <dialog> with focus trapping, body scroll locking, Escape cancellation, and backdrop click dismiss."
  {generatedCode}
>
  {#snippet stage()}
    <div class="flex flex-col items-center gap-4">
      <Dialog bind:open {title} {description}>
        {#snippet trigger({ onclick })}
          <Button variant="primary" {onclick}>Open Operator Dialog [Modal]</Button>
        {/snippet}

        <p class="font-mono text-xs">
          Confirming this operation will trigger a zero-point re-calibration of the high-frequency
          telemetry channels.
        </p>

        {#snippet footer()}
          <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
          <Button
            variant="danger"
            onclick={() => {
              open = false;
              alert('Re-zeroing sequence committed.');
            }}
          >
            Commit Calibration
          </Button>
        {/snippet}
      </Dialog>
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-open" class="text-fg-muted font-bold block">Modal State</label>
        <button
          id="ctrl-open"
          type="button"
          class="w-full py-1.5 rounded border border-border-subtle {open
            ? 'bg-status-nominal text-surface-canvas font-bold'
            : 'bg-surface-canvas text-fg-primary'}"
          onclick={() => (open = !open)}
        >
          {open ? 'State: OPEN (Click to Close)' : 'State: CLOSED (Click to Open)'}
        </button>
      </div>

      <div class="space-y-1">
        <label for="ctrl-title" class="text-fg-muted font-bold block">Title</label>
        <input
          id="ctrl-title"
          type="text"
          bind:value={title}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="space-y-1">
        <label for="ctrl-desc" class="text-fg-muted font-bold block">Description</label>
        <textarea
          id="ctrl-desc"
          rows="3"
          bind:value={description}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        ></textarea>
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
