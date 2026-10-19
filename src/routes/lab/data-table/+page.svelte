<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import bundleStats from '../bundle-stats.json';
  import { DataTable, type DataTableColumn } from '$lib/components/data-table/index.js';

  interface TelemetryRecord {
    id: string;
    timestamp: string;
    channel: string;
    voltage: number;
    status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
    packetId: number;
  }

  function generateRows(count: number): TelemetryRecord[] {
    const statuses: ('NOMINAL' | 'WARNING' | 'CRITICAL')[] = [
      'NOMINAL',
      'NOMINAL',
      'NOMINAL',
      'WARNING',
      'CRITICAL'
    ];
    const channels = ['CH_01_BIAS', 'CH_02_RATE', 'CH_03_PRESSURE', 'CH_04_TEMP'];
    const result: TelemetryRecord[] = [];

    for (let i = 0; i < count; i++) {
      const status = statuses[i % statuses.length]!;
      result.push({
        id: `PKT-${String(i + 1).padStart(6, '0')}`,
        timestamp: `19:22:${String(Math.floor(i / 60) % 60).padStart(2, '0')}.${String(i % 1000).padStart(3, '0')}`,
        channel: channels[i % channels.length]!,
        voltage: Number((3.3 + Math.sin(i) * 0.4).toFixed(3)),
        status,
        packetId: 100000 + i
      });
    }

    return result;
  }

  let rowCount = $state(10000);
  let rows = $derived(generateRows(rowCount));
  let rowHeight = $state(36);

  const columns: DataTableColumn<TelemetryRecord>[] = [
    { key: 'id', header: 'Packet ID', width: '130px', sortable: true },
    { key: 'timestamp', header: 'Timestamp', width: '120px', sortable: true },
    { key: 'channel', header: 'Channel', width: '160px', sortable: true },
    { key: 'voltage', header: 'Voltage (V)', width: '120px', sortable: true },
    { key: 'status', header: 'Status', width: '110px', sortable: true }
  ];

  const trinity = {
    ergonomics:
      '2D grid cell roving navigation (Arrow keys, PageUp/Down, Home/End) keeps operator hands on home row',
    design:
      'Sub-pixel hairline separators, sticky telemetry header, and Space Mono tabular numeral columns',
    engineering:
      'O(1) DOM virtualization slicing: only 20-30 rows instantiated in DOM even when hosting 10,000+ items'
  };

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { DataTable, type DataTableColumn } from 'trinidad-ui';

  const rows = [...]; // 10,000 items
  const columns: DataTableColumn<TelemetryRecord>[] = [
    { key: 'id', header: 'Packet ID', sortable: true },
    { key: 'timestamp', header: 'Timestamp', sortable: true },
    { key: 'channel', header: 'Channel', sortable: true },
    { key: 'voltage', header: 'Voltage (V)', sortable: true },
    { key: 'status', header: 'Status', sortable: true }
  ];
<\/script>

<DataTable
  {rows}
  {columns}
  rowHeight={${rowHeight}}
  height="380px"
/>`;
  });
</script>

<WorkbenchShell
  name="DataTable"
  description="High-frequency virtualized log and data grid handling 10,000+ rows with O(1) DOM node allocation, multi-column sorting, and 2D grid accessibility."
  bundleSize={bundleStats['data-table']}
  {trinity}
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-2xl">
      <DataTable {rows} {columns} {rowHeight} height="360px" />
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-dataset" class="text-fg-muted font-bold block">// Dataset Scale</label>
        <div class="grid grid-cols-3 gap-2" id="ctrl-dataset">
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {rowCount === 100
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (rowCount = 100)}
          >
            100
          </button>
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {rowCount === 1000
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (rowCount = 1000)}
          >
            1,000
          </button>
          <button
            type="button"
            class="px-2 py-1 rounded border border-border-subtle {rowCount === 10000
              ? 'bg-accent-interactive text-accent-contrast font-bold'
              : 'bg-surface-canvas text-fg-muted'}"
            onclick={() => (rowCount = 10000)}
          >
            10,000 (Stress)
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label for="ctrl-rh" class="text-fg-muted font-bold block">// Row Height (px)</label>
        <input
          id="ctrl-rh"
          type="number"
          min="24"
          max="64"
          bind:value={rowHeight}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div
        class="p-3 bg-surface-canvas rounded border border-border-subtle text-[11px] space-y-1 text-fg-muted"
      >
        <div>
          ACTIVE ROW COUNT: <span class="text-fg-primary font-bold"
            >{rowCount.toLocaleString()}</span
          >
        </div>
        <div>
          TOTAL VIRTUAL HEIGHT: <span class="text-fg-primary font-bold"
            >{(rowCount * rowHeight).toLocaleString()} px</span
          >
        </div>
        <div>
          DOM MEMORY FOOTPRINT: <span class="text-fg-primary font-bold">&lt; 35 table rows</span>
        </div>
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
