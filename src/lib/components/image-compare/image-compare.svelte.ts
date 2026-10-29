export interface ImageCompareConfig {
  initialPosition?: () => number;
  label?: () => string;
  step?: number;
  largeStep?: number;
}

export class ImageCompareState {
  #config?: ImageCompareConfig;
  position = $state(50);
  isDragging = $state(false);
  step = 2;
  largeStep = 10;

  constructor(config: ImageCompareConfig = {}) {
    this.#config = config;
    if (config.initialPosition) {
      this.position = Math.min(100, Math.max(0, config.initialPosition()));
    }
    if (config.step) {
      this.step = config.step;
    }
    if (config.largeStep) {
      this.largeStep = config.largeStep;
    }
  }

  label = $derived(this.#config?.label?.() ?? 'Image comparison split position');

  setPosition(value: number): void {
    this.position = Math.min(100, Math.max(0, Math.round(value)));
  }

  startDrag(): void {
    this.isDragging = true;
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  updateFromPointer(clientX: number, rect: DOMRect): void {
    if (rect.width <= 0) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    this.setPosition((x / rect.width) * 100);
  }

  stepBy(direction: 1 | -1, isLarge: boolean = false): void {
    const delta = (isLarge ? this.largeStep : this.step) * direction;
    this.setPosition(this.position + delta);
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.stepBy(-1, event.shiftKey);
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.stepBy(1, event.shiftKey);
        event.preventDefault();
        break;
      case 'Home':
        this.setPosition(0);
        event.preventDefault();
        break;
      case 'End':
        this.setPosition(100);
        event.preventDefault();
        break;
    }
  }

  ariaAttrs = $derived({
    role: 'slider' as const,
    'aria-valuenow': this.position,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': this.label,
    'aria-valuetext': `${this.position}% split`
  });
}
