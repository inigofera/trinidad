import type { Snippet } from 'svelte';

export type SortDirection = 'none' | 'ascending' | 'descending';

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: Snippet<[T]>;
}

export interface DataTableConfig<T> {
  rows: () => T[];
  columns: () => DataTableColumn<T>[];
  rowHeight?: () => number | undefined;
  overscan?: () => number | undefined;
}

export class DataTableState<T extends Record<string, any>> {
  #config: DataTableConfig<T>;
  scrollTop = $state(0);
  viewportHeight = $state(380);
  sortKey = $state<string | null>(null);
  sortDir = $state<SortDirection>('none');
  activeRowIndex = $state(0);
  activeColIndex = $state(0);

  constructor(config: DataTableConfig<T>) {
    this.#config = config;
  }

  get rows(): T[] {
    return this.#config.rows();
  }

  get columns(): DataTableColumn<T>[] {
    return this.#config.columns();
  }

  get rowHeight(): number {
    return this.#config.rowHeight?.() ?? 36;
  }

  get overscan(): number {
    return this.#config.overscan?.() ?? 5;
  }

  get sortedRows(): T[] {
    const raw = this.rows;
    if (!this.sortKey || this.sortDir === 'none') {
      return raw;
    }

    const key = this.sortKey;
    const dirMult = this.sortDir === 'ascending' ? 1 : -1;

    return [...raw].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dirMult;
      }

      return String(valA).localeCompare(String(valB)) * dirMult;
    });
  }

  get totalHeight(): number {
    return this.sortedRows.length * this.rowHeight;
  }

  get startIndex(): number {
    return Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - this.overscan);
  }

  get endIndex(): number {
    return Math.min(
      this.sortedRows.length,
      Math.ceil((this.scrollTop + this.viewportHeight) / this.rowHeight) + this.overscan
    );
  }

  get offsetY(): number {
    return this.startIndex * this.rowHeight;
  }

  get visibleRows(): { index: number; data: T }[] {
    const sorted = this.sortedRows;
    const start = this.startIndex;
    const end = this.endIndex;
    const result: { index: number; data: T }[] = [];

    for (let i = start; i < end; i++) {
      const item = sorted[i];
      if (item !== undefined) {
        result.push({ index: i, data: item });
      }
    }

    return result;
  }

  toggleSort(colKey: string): void {
    if (this.sortKey !== colKey) {
      this.sortKey = colKey;
      this.sortDir = 'ascending';
    } else if (this.sortDir === 'ascending') {
      this.sortDir = 'descending';
    } else {
      this.sortDir = 'none';
      this.sortKey = null;
    }
  }

  handleScroll = (top: number, height: number): void => {
    this.scrollTop = top;
    this.viewportHeight = height;
  };

  handleKeyDown = (e: KeyboardEvent, scrollContainer?: HTMLElement | null): void => {
    const totalRows = this.sortedRows.length;
    const totalCols = this.columns.length;
    if (totalRows === 0 || totalCols === 0) return;

    const pageSize = Math.max(1, Math.floor(this.viewportHeight / this.rowHeight) - 1);

    let handled = false;

    switch (e.key) {
      case 'ArrowUp':
        this.activeRowIndex = Math.max(0, this.activeRowIndex - 1);
        handled = true;
        break;
      case 'ArrowDown':
        this.activeRowIndex = Math.min(totalRows - 1, this.activeRowIndex + 1);
        handled = true;
        break;
      case 'ArrowLeft':
        this.activeColIndex = Math.max(0, this.activeColIndex - 1);
        handled = true;
        break;
      case 'ArrowRight':
        this.activeColIndex = Math.min(totalCols - 1, this.activeColIndex + 1);
        handled = true;
        break;
      case 'PageUp':
        this.activeRowIndex = Math.max(0, this.activeRowIndex - pageSize);
        handled = true;
        break;
      case 'PageDown':
        this.activeRowIndex = Math.min(totalRows - 1, this.activeRowIndex + pageSize);
        handled = true;
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          this.activeRowIndex = 0;
        }
        this.activeColIndex = 0;
        handled = true;
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          this.activeRowIndex = totalRows - 1;
        }
        this.activeColIndex = totalCols - 1;
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      // Keep active row inside visible scroll viewport
      if (scrollContainer) {
        const rowTop = this.activeRowIndex * this.rowHeight;
        const rowBottom = rowTop + this.rowHeight;
        if (rowTop < scrollContainer.scrollTop) {
          scrollContainer.scrollTop = rowTop;
        } else if (rowBottom > scrollContainer.scrollTop + scrollContainer.clientHeight) {
          scrollContainer.scrollTop = rowBottom - scrollContainer.clientHeight;
        }
      }
    }
  };
}
