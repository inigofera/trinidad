<script lang="ts">
  import { Badge, Button } from '$lib';

  interface Props {
    simulateCrash: boolean;
    onCrash: () => void;
  }

  let { simulateCrash, onCrash }: Props = $props();

  function triggerCrash(): string {
    throw new Error(
      'ERR_SENSOR_BUFFER_OVERFLOW: Simulated NaN matrix in telemetry stream at frame #4092'
    );
  }
</script>

{#if simulateCrash}
  {triggerCrash()}
{:else}
  <div
    class="p-4 bg-surface-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div class="flex items-center gap-3">
      <Badge variant="nominal" pulse={true}>Subsystem nominal</Badge>
      <span class="font-mono text-xs text-fg-muted">Telemetry node streaming at 60Hz</span>
    </div>
    <Button variant="danger" onclick={onCrash}>[Inject Simulated Runtime Exception]</Button>
  </div>
{/if}
