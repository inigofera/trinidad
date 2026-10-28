<script lang="ts" generics="T extends Record<string, any>">
  import { DataTableState, type DataTableColumn } from './data-table.svelte.js';

  export interface DataTableProps<T> {
    rows: T[];
    columns: DataTableColumn<T>[];
    rowHeight?: number | undefined;
    height?: string | undefined;
    class?: string | undefined;
  }

  let {
    rows = [],
    columns = [],
    rowHeight = 36,
    height = '380px',
    class: className = ''
  }: DataTableProps<T> = $props();

  let scrollContainer = $state<HTMLDivElement | null>(null);

  const logic = new DataTableState<T>({
    rows: () => rows,
    columns: () => columns,
    rowHeight: () => rowHeight
  });

  function onScroll() {
    if (scrollContainer) {
      logic.handleScroll(scrollContainer.scrollTop, scrollContainer.clientHeight);
    }
  }

  $effect(() => {
    if (!scrollContainer) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        logic.viewportHeight = entry.contentRect.height;
      }
    });
    observer.observe(scrollContainer);
    return () => observer.disconnect();
  });
</script>

<div
  class="relative flex flex-col font-mono text-xs border border-border-subtle bg-surface-elevated {className}"
>
  <!-- Status bar with row count and active cell coordinates -->
  <div
    class="flex items-center justify-between px-3 py-1.5 border-b border-border-subtle bg-surface-canvas text-[11px] text-fg-muted select-none"
  >
    <div class="flex items-center gap-2">
      <span class="font-bold text-fg-primary">// DATA GRID</span>
      <span>[{logic.rows.length} total rows]</span>
      {#if logic.sortKey}
        <span class="text-fg-primary font-bold">
          [SORT: {logic.sortKey} ({logic.sortDir})]
        </span>
      {/if}
    </div>
    <div class="flex items-center gap-3">
      <span>CELL: [R:{logic.activeRowIndex} C:{logic.activeColIndex}]</span>
      <span class="text-fg-primary font-bold">[DOM: {logic.visibleRows.length} rendered]</span>
    </div>
  </div>

  <!-- Scrollable Virtual Viewport -->
  <div
    bind:this={scrollContainer}
    onscroll={onScroll}
    class="overflow-auto relative focus-visible:outline-none"
    style="height: {height};"
    tabindex="-1"
  >
    <table
      role="grid"
      aria-rowcount={logic.sortedRows.length}
      aria-colcount={logic.columns.length}
      onkeydown={(e) => logic.handleKeyDown(e, scrollContainer)}
      class="w-full border-collapse text-left font-mono text-xs select-none"
    >
      <!-- Fixed Header -->
      <thead class="sticky top-0 z-20 bg-surface-canvas border-b border-border-subtle shadow-xs">
        <tr>
          {#each logic.columns as col, colIdx (col.key + '_' + colIdx)}
            {@const isSorted = logic.sortKey === col.key}
            {@const sortAria = isSorted ? logic.sortDir : 'none'}
            <th
              role="columnheader"
              aria-sort={sortAria}
              tabindex={col.sortable ? 0 : -1}
              onclick={() => col.sortable && logic.toggleSort(col.key)}
              onkeydown={(e) => {
                if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  logic.toggleSort(col.key);
                }
              }}
              style={col.width ? `width: ${col.width};` : undefined}
              class="px-3 py-2 font-bold text-fg-muted uppercase tracking-wider text-[11px] border-r border-border-subtle/50 last:border-r-0 {col.sortable
                ? 'cursor-pointer hover:text-fg-primary hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-accent-interactive'
                : ''}"
            >
              <div class="flex items-center justify-between gap-1">
                <span>{col.header}</span>
                {#if col.sortable}
                  <span class="text-[10px] opacity-75 font-mono">
                    {#if isSorted && logic.sortDir === 'ascending'}
                      ▲
                    {:else if isSorted && logic.sortDir === 'descending'}
                      ▼
                    {:else}
                      ↕
                    {/if}
                  </span>
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>

      <!-- Virtualized Scroll Space -->
      <tbody
        style="height: {logic.totalHeight}px; position: relative;"
        class="divide-y divide-border-subtle/30"
      >
        <tr
          style="position: absolute; top: 0; left: 0; right: 0; transform: translateY({logic.offsetY}px); display: table; width: 100%; table-layout: fixed;"
        >
          <td colspan={logic.columns.length} class="p-0 border-0">
            <table class="w-full border-collapse table-fixed">
              <tbody>
                {#each logic.visibleRows as item (item.index)}
                  {@const rowIdx = item.index}
                  {@const rowData = item.data}
                  <tr
                    aria-rowindex={rowIdx + 1}
                    class="transition-colors hover:bg-surface-muted/50 {logic.activeRowIndex ===
                    rowIdx
                      ? 'bg-surface-muted'
                      : ''}"
                    style="height: {logic.rowHeight}px;"
                  >
                    {#each logic.columns as col, colIdx (col.key + '_' + colIdx)}
                      {@const isActiveCell =
                        logic.activeRowIndex === rowIdx && logic.activeColIndex === colIdx}
                      <td
                        role="gridcell"
                        aria-colindex={colIdx + 1}
                        tabindex={isActiveCell ? 0 : -1}
                        onclick={() => {
                          logic.activeRowIndex = rowIdx;
                          logic.activeColIndex = colIdx;
                        }}
                        style={col.width ? `width: ${col.width};` : undefined}
                        class="px-3 py-1.5 text-fg-primary truncate border-r border-border-subtle/30 last:border-r-0 {isActiveCell
                          ? 'ring-2 ring-inset ring-accent-interactive bg-accent-interactive/10'
                          : ''}"
                      >
                        {#if col.render}
                          {@render col.render(rowData)}
                        {:else}
                          {rowData[col.key] ?? '—'}
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
