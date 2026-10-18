import type { ActionReturn } from 'svelte/action';

export type FocusTrapParam = boolean | (() => boolean);

export const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function isFocusable(element: HTMLElement): boolean {
  if (element.getAttribute('tabindex') === '-1') return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false;

  if (typeof window !== 'undefined') {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
  }

  return true;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  if (typeof container.querySelectorAll !== 'function') return [];
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
  );
  return candidates.filter(isFocusable);
}

export function useFocusTrap(
  node: HTMLElement,
  enabled: FocusTrapParam = true
): ActionReturn<FocusTrapParam> {
  let param = $state<FocusTrapParam>(enabled);
  let isActive = false;
  let previousActiveElement: HTMLElement | null = null;

  function evaluateEnabled(): boolean {
    return typeof param === 'function' ? param() : Boolean(param);
  }

  function activate(): void {
    if (isActive) return;
    isActive = true;
    if (typeof document !== 'undefined') {
      previousActiveElement = (document.activeElement as HTMLElement | null) ?? null;
      const focusables = getFocusableElements(node);
      const first = focusables[0];
      if (first && !node.contains(document.activeElement)) {
        first.focus();
      }
    }
  }

  function deactivate(): void {
    if (!isActive) return;
    isActive = false;
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
    previousActiveElement = null;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive || e.key !== 'Tab') return;

    const focusables = getFocusableElements(node);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;

    const active = typeof document !== 'undefined' ? document.activeElement : null;

    if (e.shiftKey) {
      if (active === first || !node.contains(active) || active === node) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !node.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  node.addEventListener('keydown', handleKeyDown);

  const cleanupRoot = $effect.root(() => {
    $effect(() => {
      const shouldBeActive = evaluateEnabled();
      if (shouldBeActive) {
        activate();
      } else {
        deactivate();
      }
    });
  });

  return {
    update(newEnabled: FocusTrapParam) {
      param = newEnabled;
    },
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
      cleanupRoot();
      deactivate();
    }
  };
}
