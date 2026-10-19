<script lang="ts">
  import {
    DiffViewerState,
    type DiffMode,
    type DiffResolution,
    type DiffStatus
  } from './diff-viewer.svelte.js';

  export interface DiffViewerProps {
    original: string;
    modified: string;
    mode?: DiffMode | undefined;
    title: string;
    status?: DiffStatus | undefined;
    class?: string | undefined;
    onResolve?: ((resolution: DiffResolution) => void) | undefined;
    onStatusChange?: ((status: DiffStatus) => void) | undefined;
  }

  let {
    original,
    modified,
    mode = 'unified',
    title,
    status = $bindable<DiffStatus>('pending'),
    class: className = '',
    onResolve,
    onStatusChange
  }: DiffViewerProps = $props();

  const logic = new DiffViewerState({
    original: () => original,
    modified: () => modified,
    mode: () => mode,
    title: () => title,
    status: () => status,
    onStatusChange: (next) => {
      status = next;
      onStatusChange?.(next);
    },
    onResolve: (res) => {
      onResolve?.(res);
    }
  });

  const statusBadge = $derived.by(() => {
    switch (status) {
      case 'accepted':
        return {
          label: 'ACCEPTED',
          class: 'bg-status-nominal/20 text-fg-primary border-status-nominal/50'
        };
      case 'rejected':
        return {
          label: 'REJECTED',
          class: 'bg-status-critical/20 text-fg-primary border-status-critical/50'
        };
      case 'modified':
        return {
          label: 'MODIFIED',
          class: 'bg-accent-interactive/20 text-fg-primary border-accent-interactive/50'
        };
      case 'pending':
      default:
        return {
          label: 'PENDING GATE',
          class: 'bg-status-warning/20 text-fg-primary border-status-warning/50'
        };
    }
  });
</script>

<div
  class="relative flex flex-col font-mono text-xs border border-border-subtle bg-surface-elevated {className}"
>
  <!-- Header Bar -->
  <div
    class="flex flex-wrap items-center justify-between border-b border-border-subtle p-3 gap-3 bg-surface-canvas"
  >
    <div class="flex items-center gap-2.5">
      <span class="font-bold text-fg-primary text-sm">// PROPOSAL: {title}</span>
      <span class="px-2 py-0.5 rounded text-[10px] font-bold border {statusBadge.class}">
        [{statusBadge.label}]
      </span>
    </div>

    <!-- Mode Selector & Gates -->
    <div class="flex items-center gap-2">
      <div class="flex items-center border border-border-subtle p-0.5 rounded bg-surface-elevated">
        <button
          type="button"
          onclick={() => (logic.activeMode = 'unified')}
          class="px-2 py-0.5 rounded text-[11px] transition-colors {logic.activeMode === 'unified'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
        >
          Unified
        </button>
        <button
          type="button"
          onclick={() => (logic.activeMode = 'split')}
          class="px-2 py-0.5 rounded text-[11px] transition-colors {logic.activeMode === 'split'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
        >
          Split
        </button>
      </div>
    </div>
  </div>

  <!-- Atomic Proposal Action Gates -->
  <div
    class="flex flex-wrap items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-muted/30 gap-2"
  >
    <div class="text-[11px] text-fg-muted select-none">
      GATE DISPOSITION: Review telemetry mutation proposal before committing.
    </div>

    <div class="flex items-center gap-2">
      {#if !logic.isEditing}
        <button
          type="button"
          onclick={() => logic.startEditing()}
          class="px-2.5 py-1 rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors cursor-pointer select-none"
        >
          ✎ Modify Inline
        </button>

        <button
          type="button"
          onclick={() => logic.reject()}
          class="px-2.5 py-1 rounded bg-status-critical text-white font-bold hover:brightness-110 active:translate-y-[1px] transition-transform cursor-pointer select-none"
        >
          ✕ Reject Proposal
        </button>

        <button
          type="button"
          onclick={() => logic.accept()}
          class="px-3 py-1 rounded bg-accent-interactive text-accent-contrast font-bold hover:brightness-105 active:translate-y-[1px] transition-transform cursor-pointer select-none"
        >
          ✓ Accept Proposal
        </button>
      {:else}
        <button
          type="button"
          onclick={() => logic.cancelEditing()}
          class="px-2.5 py-1 rounded bg-surface-elevated border border-border-subtle text-fg-muted hover:text-fg-primary transition-colors cursor-pointer select-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={() => logic.saveInlineEdit()}
          class="px-3 py-1 rounded bg-accent-interactive text-accent-contrast font-bold hover:brightness-105 active:translate-y-[1px] transition-transform cursor-pointer select-none"
        >
          Save &amp; Accept Modifications
        </button>
      {/if}
    </div>
  </div>

  <!-- Inline Editor or Diff Viewer -->
  {#if logic.isEditing}
    <div class="p-3 bg-surface-canvas">
      <label for="diff-inline-editor" class="block text-fg-muted mb-1.5 select-none font-bold">
        // INLINE OPERATOR EDITOR (Modify proposed payload):
      </label>
      <textarea
        id="diff-inline-editor"
        bind:value={logic.inlineDraft}
        rows="10"
        class="w-full p-3 font-mono text-xs bg-surface-elevated text-fg-primary border border-border-subtle focus-visible:outline-2 focus-visible:outline-accent-interactive resize-y"
      ></textarea>
    </div>
  {:else if logic.activeMode === 'unified'}
    <!-- Unified Diff View -->
    <div
      class="overflow-x-auto divide-y divide-border-subtle/20 font-mono text-xs bg-surface-canvas"
    >
      {#each logic.diffLines as line, i (i)}
        <div
          class="flex items-stretch transition-colors {line.type === 'added'
            ? 'bg-status-nominal/15 text-fg-primary'
            : line.type === 'removed'
              ? 'bg-status-critical/15 text-fg-primary'
              : 'text-fg-muted'}"
        >
          <!-- Line numbers -->
          <div
            class="flex select-none border-r border-border-subtle/40 bg-surface-canvas/50 text-[10px] text-fg-muted/60"
          >
            <span class="w-8 py-0.5 text-right pr-1.5">
              {line.originalLineNumber ?? ''}
            </span>
            <span class="w-8 py-0.5 text-right pr-1.5 border-l border-border-subtle/30">
              {line.modifiedLineNumber ?? ''}
            </span>
          </div>

          <!-- Diff marker -->
          <span
            class="w-6 py-0.5 text-center font-bold select-none {line.type === 'added'
              ? 'text-status-nominal'
              : line.type === 'removed'
                ? 'text-status-critical'
                : 'opacity-30'}"
          >
            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          </span>

          <!-- Code line -->
          <pre
            class="flex-1 py-0.5 pr-3 overflow-x-auto whitespace-pre font-mono leading-tight">{line.content}</pre>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Split Diff View -->
    <div
      class="overflow-x-auto font-mono text-xs bg-surface-canvas divide-y divide-border-subtle/20"
    >
      {#each logic.splitRows as row, i (i)}
        <div class="grid grid-cols-2 divide-x divide-border-subtle/40">
          <!-- Left: Original / Removed -->
          <div
            class="flex items-stretch {row.left?.type === 'removed'
              ? 'bg-status-critical/15 text-fg-primary'
              : row.left
                ? 'text-fg-muted'
                : 'bg-surface-muted/20'}"
          >
            {#if row.left}
              <span
                class="w-8 py-0.5 text-right pr-1.5 select-none border-r border-border-subtle/40 bg-surface-canvas/50 text-[10px] text-fg-muted/60"
              >
                {row.left.lineNumber}
              </span>
              <span class="w-5 py-0.5 text-center font-bold select-none text-status-critical">
                {row.left.type === 'removed' ? '-' : ' '}
              </span>
              <pre
                class="flex-1 py-0.5 pr-2 overflow-x-auto whitespace-pre font-mono leading-tight">{row
                  .left.content}</pre>
            {/if}
          </div>

          <!-- Right: Modified / Added -->
          <div
            class="flex items-stretch {row.right?.type === 'added'
              ? 'bg-status-nominal/15 text-fg-primary'
              : row.right
                ? 'text-fg-muted'
                : 'bg-surface-muted/20'}"
          >
            {#if row.right}
              <span
                class="w-8 py-0.5 text-right pr-1.5 select-none border-r border-border-subtle/40 bg-surface-canvas/50 text-[10px] text-fg-muted/60"
              >
                {row.right.lineNumber}
              </span>
              <span class="w-5 py-0.5 text-center font-bold select-none text-status-nominal">
                {row.right.type === 'added' ? '+' : ' '}
              </span>
              <pre
                class="flex-1 py-0.5 pr-2 overflow-x-auto whitespace-pre font-mono leading-tight">{row
                  .right.content}</pre>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
