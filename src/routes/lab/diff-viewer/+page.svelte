<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { DiffViewer, type DiffStatus, type DiffMode } from '$lib/components/diff-viewer/index.js';

  let original = $state(`# Mission Telemetry Baseline v1.4
CHANNEL_01_RATE = 50.0
CHANNEL_02_GAIN = 1.024
SAFETY_INTERLOCK_THRESHOLD = 95.0
SAMPLING_FREQ_HZ = 60
STATUS_HEARTBEAT_SEC = 5`);

  let modified = $state(`# Mission Telemetry Baseline v1.4
CHANNEL_01_RATE = 60.0
CHANNEL_02_GAIN = 1.045
CHANNEL_03_PRESSURE = 101.3
SAFETY_INTERLOCK_THRESHOLD = 92.5
SAMPLING_FREQ_HZ = 60
STATUS_HEARTBEAT_SEC = 2`);

  let mode = $state<DiffMode>('unified');
  let title = $state('Rate and safety threshold adjustment');
  let status = $state<DiffStatus>('pending');
  let lastResolvedOutput = $state<string>('');

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { DiffViewer, type DiffStatus } from 'trinidad-ui';

  let status = $state<DiffStatus>('${status}');
<\/script>

<DiffViewer
  title="${title}"
  original={originalPayload}
  modified={modifiedPayload}
  mode="${mode}"
  bind:status
  onResolve={(resolution) => {
    console.log('Resolved:', resolution.status);
  }}
/>`;
  });
</script>

<WorkbenchShell
  name="DiffViewer"
  description="Interactive proposal gate and code diff viewer powered by an LCS algorithm with unified/split views, line number alignment, and inline modification."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-2xl">
      <DiffViewer
        {original}
        {modified}
        {mode}
        {title}
        bind:status
        onResolve={(res) =>
          (lastResolvedOutput = `Status: ${res.status} | Content length: ${res.finalContent.length} chars`)}
      />

      {#if lastResolvedOutput}
        <div
          class="mt-4 p-2.5 rounded bg-surface-elevated border border-border-subtle font-mono text-[11px] text-fg-muted"
        >
          Gate resolution: <span class="text-accent-interactive font-bold"
            >{lastResolvedOutput}</span
          >
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-mode" class="text-fg-muted font-bold block">Diff View Mode</label>
        <div class="grid grid-cols-2 gap-2" id="ctrl-mode">
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {mode === 'unified'
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (mode = 'unified')}
          >
            Unified Mode
          </button>
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {mode === 'split'
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (mode = 'split')}
          >
            Split Mode
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label for="ctrl-status" class="text-fg-muted font-bold block">Status Gate State</label>
        <select
          id="ctrl-status"
          bind:value={status}
          class="w-full px-2 py-1.5 bg-surface-canvas border border-border-subtle text-fg-primary focus:outline-accent-interactive"
        >
          <option value="pending">pending</option>
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
          <option value="modified">modified</option>
        </select>
      </div>

      <div class="space-y-1">
        <label for="ctrl-title" class="text-fg-muted font-bold block">Proposal Title</label>
        <input
          id="ctrl-title"
          type="text"
          bind:value={title}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="space-y-1">
        <label for="ctrl-orig" class="text-fg-muted font-bold block">Original Text</label>
        <textarea
          id="ctrl-orig"
          rows="4"
          bind:value={original}
          class="w-full p-2 bg-surface-canvas border border-border-subtle text-fg-primary text-[11px]"
        ></textarea>
      </div>

      <div class="space-y-1">
        <label for="ctrl-mod" class="text-fg-muted font-bold block">Modified Proposal</label>
        <textarea
          id="ctrl-mod"
          rows="4"
          bind:value={modified}
          class="w-full p-2 bg-surface-canvas border border-border-subtle text-fg-primary text-[11px]"
        ></textarea>
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
