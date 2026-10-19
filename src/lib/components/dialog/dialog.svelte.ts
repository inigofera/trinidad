export interface DialogConfig {
  open: () => boolean;
  onOpenChange?: (open: boolean) => void;
}

export class DialogState {
  #config: DialogConfig;
  dialogElement = $state<HTMLDialogElement | null>(null);
  triggerElement = $state<HTMLElement | null>(null);
  #previousActiveElement: HTMLElement | null = null;
  #prevOverflow = '';

  constructor(config: DialogConfig) {
    this.#config = config;
  }

  get isOpen(): boolean {
    return this.#config.open();
  }

  setOpen(next: boolean): void {
    if (this.#config.open() === next) return;
    this.#config.onOpenChange?.(next);
  }

  lockScroll(): void {
    if (typeof document !== 'undefined') {
      this.#prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  unlockScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.#prevOverflow;
    }
  }

  saveActiveElement(): void {
    if (typeof document !== 'undefined') {
      this.#previousActiveElement = document.activeElement as HTMLElement | null;
    }
  }

  restoreFocus(): void {
    const target = this.triggerElement ?? this.#previousActiveElement;
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
    this.#previousActiveElement = null;
  }

  handleBackdropClick = (e: MouseEvent): void => {
    if (!this.dialogElement) return;
    const rect = this.dialogElement.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog || e.target === this.dialogElement) {
      this.setOpen(false);
    }
  };

  handleCancel = (e: Event): void => {
    e.preventDefault();
    this.setOpen(false);
  };
}
