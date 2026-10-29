<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '../button/index.js';

  export interface FaultBoundaryProps {
    subsystemName: string;
    children: Snippet;
    onError?: (error: unknown) => void;
  }

  let { subsystemName, children, onError }: FaultBoundaryProps = $props();
</script>

<svelte:boundary onerror={(err) => onError?.(err)}>
  {@render children()}

  {#snippet failed(error, reset)}
    <div
      role="alert"
      class="p-4 bg-surface-elevated border-2 border-status-critical text-fg-primary font-mono text-xs flex flex-col gap-3"
    >
      <div class="flex items-center justify-between gap-2 border-b border-border-subtle pb-2">
        <span class="text-status-critical font-bold">
          Subsystem fault isolated: {subsystemName}
        </span>
        <span class="px-1.5 py-0.5 bg-surface-muted text-status-critical">ERR_BOUNDARY_TRIPPED</span
        >
      </div>
      <p class="text-fg-muted break-all">
        Diagnostic: {error instanceof Error ? error.message : String(error)}
      </p>
      <div class="flex items-center justify-end">
        <Button onclick={reset} variant="secondary">[Reset Subsystem]</Button>
      </div>
    </div>
  {/snippet}
</svelte:boundary>
