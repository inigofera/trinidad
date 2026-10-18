import type { ActionReturn } from 'svelte/action';

export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingTabindexOptions {
  selector: string;
  orientation?: RovingOrientation | undefined;
  loop?: boolean | undefined;
}

export function useRovingTabindex(
  node: HTMLElement,
  options: RovingTabindexOptions
): ActionReturn<RovingTabindexOptions> {
  let opts = { ...options };

  function getItems(): HTMLElement[] {
    if (typeof node.querySelectorAll !== 'function') return [];
    return Array.from(node.querySelectorAll<HTMLElement>(opts.selector));
  }

  function isItemDisabled(el: HTMLElement): boolean {
    return (
      el.hasAttribute('disabled') ||
      el.getAttribute('aria-disabled') === 'true' ||
      el.getAttribute('disabled') === 'true'
    );
  }

  function syncTabindices(preferredActive?: HTMLElement): void {
    const items = getItems();
    if (items.length === 0) return;

    let activeItem: HTMLElement | null = preferredActive ?? null;

    if (!activeItem || !items.includes(activeItem)) {
      activeItem = items.find((el) => el.getAttribute('tabindex') === '0') ?? null;
    }

    if (!activeItem || isItemDisabled(activeItem)) {
      activeItem =
        items.find(
          (el) =>
            !isItemDisabled(el) &&
            (el.getAttribute('aria-selected') === 'true' ||
              el.getAttribute('aria-checked') === 'true')
        ) ?? null;
    }

    if (!activeItem || isItemDisabled(activeItem)) {
      activeItem = items.find((el) => !isItemDisabled(el)) ?? items[0] ?? null;
    }

    for (const item of items) {
      if (item === activeItem) {
        item.setAttribute('tabindex', '0');
      } else {
        item.setAttribute('tabindex', '-1');
      }
    }
  }

  function handleFocusIn(e: FocusEvent): void {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const items = getItems();
    const matched = items.find((el) => el === target || el.contains(target));
    if (matched && !isItemDisabled(matched)) {
      syncTabindices(matched);
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    const items = getItems();
    if (items.length === 0) return;

    const orientation = opts.orientation ?? 'both';
    const loop = opts.loop !== false;

    const isHorizontalNext = orientation !== 'vertical' && e.key === 'ArrowRight';
    const isHorizontalPrev = orientation !== 'vertical' && e.key === 'ArrowLeft';
    const isVerticalNext = orientation !== 'horizontal' && e.key === 'ArrowDown';
    const isVerticalPrev = orientation !== 'horizontal' && e.key === 'ArrowUp';
    const isHome = e.key === 'Home';
    const isEnd = e.key === 'End';

    if (
      !isHorizontalNext &&
      !isHorizontalPrev &&
      !isVerticalNext &&
      !isVerticalPrev &&
      !isHome &&
      !isEnd
    ) {
      return;
    }

    const currentTarget =
      typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
    let currentIndex = items.findIndex((el) => el === currentTarget || el.contains(currentTarget));

    if (currentIndex === -1) {
      currentIndex = items.findIndex((el) => el.getAttribute('tabindex') === '0');
      if (currentIndex === -1) currentIndex = 0;
    }

    const nonDisabledIndices = items
      .map((el, i) => (!isItemDisabled(el) ? i : -1))
      .filter((i): i is number => i !== -1);

    if (nonDisabledIndices.length === 0) return;

    let targetIndex = -1;

    if (isHome) {
      targetIndex = nonDisabledIndices[0] ?? -1;
    } else if (isEnd) {
      targetIndex = nonDisabledIndices[nonDisabledIndices.length - 1] ?? -1;
    } else if (isHorizontalNext || isVerticalNext) {
      const currentPosInFiltered = nonDisabledIndices.indexOf(currentIndex);
      if (currentPosInFiltered === -1) {
        const nextIdx = nonDisabledIndices.find((idx) => idx > currentIndex);
        targetIndex = nextIdx ?? (loop ? (nonDisabledIndices[0] ?? -1) : -1);
      } else if (currentPosInFiltered < nonDisabledIndices.length - 1) {
        targetIndex = nonDisabledIndices[currentPosInFiltered + 1] ?? -1;
      } else if (loop) {
        targetIndex = nonDisabledIndices[0] ?? -1;
      }
    } else if (isHorizontalPrev || isVerticalPrev) {
      const currentPosInFiltered = nonDisabledIndices.indexOf(currentIndex);
      if (currentPosInFiltered === -1) {
        const prevIndices = nonDisabledIndices.filter((idx) => idx < currentIndex);
        const prevIdx = prevIndices[prevIndices.length - 1];
        targetIndex =
          prevIdx ?? (loop ? (nonDisabledIndices[nonDisabledIndices.length - 1] ?? -1) : -1);
      } else if (currentPosInFiltered > 0) {
        targetIndex = nonDisabledIndices[currentPosInFiltered - 1] ?? -1;
      } else if (loop) {
        targetIndex = nonDisabledIndices[nonDisabledIndices.length - 1] ?? -1;
      }
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const targetElement = items[targetIndex];
      if (targetElement) {
        syncTabindices(targetElement);
        targetElement.focus();
      }
    }
  }

  node.addEventListener('focusin', handleFocusIn);
  node.addEventListener('keydown', handleKeyDown);

  let observer: MutationObserver | null = null;
  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => {
      syncTabindices();
    });
    observer.observe(node, { childList: true, subtree: true });
  }

  syncTabindices();

  return {
    update(newOptions: RovingTabindexOptions) {
      opts = { ...newOptions };
      syncTabindices();
    },
    destroy() {
      node.removeEventListener('focusin', handleFocusIn);
      node.removeEventListener('keydown', handleKeyDown);
      observer?.disconnect();
    }
  };
}
