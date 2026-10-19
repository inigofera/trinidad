import { Announcer } from '$lib/actions/announcer.svelte.js';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 1;
  if (t === q) return 1000;

  let score = 0;
  let tIdx = 0;
  let prevMatch = -2;

  for (let qIdx = 0; qIdx < q.length; qIdx++) {
    const qChar = q[qIdx]!;
    const matchIdx = t.indexOf(qChar, tIdx);
    if (matchIdx === -1) return 0; // Not a subsequence

    score += 5;

    // Consecutive bonus
    if (matchIdx === prevMatch + 1) {
      score += 10;
    }

    // Word boundary bonus
    if (
      matchIdx === 0 ||
      t[matchIdx - 1] === ' ' ||
      t[matchIdx - 1] === '-' ||
      t[matchIdx - 1] === '_' ||
      t[matchIdx - 1] === '/'
    ) {
      score += 15;
    }

    // Exact case bonus
    if (text[matchIdx] === query[qIdx]) {
      score += 2;
    }

    prevMatch = matchIdx;
    tIdx = matchIdx + 1;
  }

  return score;
}

export interface ComboboxConfig {
  items: () => CommandItem[];
  query: () => string;
  open: () => boolean;
  onQueryChange?: (q: string) => void;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: CommandItem) => void;
}

export class ComboboxState {
  #config: ComboboxConfig;
  activeIndex = $state(0);
  listboxElement = $state<HTMLElement | null>(null);

  constructor(config: ComboboxConfig) {
    this.#config = config;
  }

  get query(): string {
    return this.#config.query();
  }

  get isOpen(): boolean {
    return this.#config.open();
  }

  get filteredItems(): CommandItem[] {
    const q = this.query;
    const all = this.#config.items();
    if (!q.trim()) return all;

    const scored = all
      .map((item) => ({ item, score: fuzzyScore(q, item.label) }))
      .filter((entry) => entry.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
  }

  get flattenedNavigableItems(): CommandItem[] {
    return this.filteredItems.filter((item) => !item.disabled);
  }

  get groupedItems(): Record<string, CommandItem[]> {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of this.filteredItems) {
      const g = item.group || 'Commands';
      if (!groups[g]) groups[g] = [];
      groups[g]!.push(item);
    }
    return groups;
  }

  get activeItem(): CommandItem | undefined {
    const items = this.flattenedNavigableItems;
    if (items.length === 0) return undefined;
    const clampedIndex = Math.max(0, Math.min(items.length - 1, this.activeIndex));
    return items[clampedIndex];
  }

  setOpen(next: boolean): void {
    if (this.isOpen === next) return;
    this.#config.onOpenChange?.(next);
  }

  setQuery(next: string): void {
    this.#config.onQueryChange?.(next);
    this.activeIndex = 0;
  }

  scrollActiveIntoView(itemId: string): void {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(itemId);
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ block: 'nearest' });
    }
  }

  selectItem(item: CommandItem): void {
    if (item.disabled) return;
    item.onSelect?.();
    this.#config.onSelect?.(item);
    Announcer.announce(`Selected ${item.label}`, 'polite');
    this.setOpen(false);
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    const items = this.flattenedNavigableItems;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!this.isOpen) {
          this.setOpen(true);
          return;
        }
        if (items.length > 0) {
          this.activeIndex = (this.activeIndex + 1) % items.length;
          const next = items[this.activeIndex];
          if (next) this.scrollActiveIntoView(`trinidad-option-${next.id}`);
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        if (!this.isOpen) {
          this.setOpen(true);
          return;
        }
        if (items.length > 0) {
          this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
          const prev = items[this.activeIndex];
          if (prev) this.scrollActiveIntoView(`trinidad-option-${prev.id}`);
        }
        break;
      }

      case 'Enter': {
        if (!this.isOpen) {
          this.setOpen(true);
          return;
        }
        e.preventDefault();
        const active = this.activeItem;
        if (active) {
          this.selectItem(active);
        }
        break;
      }

      case 'Escape': {
        if (this.isOpen) {
          e.preventDefault();
          this.setOpen(false);
        }
        break;
      }

      case 'Home': {
        if (this.isOpen && items.length > 0) {
          e.preventDefault();
          this.activeIndex = 0;
          const first = items[0];
          if (first) this.scrollActiveIntoView(`trinidad-option-${first.id}`);
        }
        break;
      }

      case 'End': {
        if (this.isOpen && items.length > 0) {
          e.preventDefault();
          this.activeIndex = items.length - 1;
          const last = items[items.length - 1];
          if (last) this.scrollActiveIntoView(`trinidad-option-${last.id}`);
        }
        break;
      }
    }
  };
}
