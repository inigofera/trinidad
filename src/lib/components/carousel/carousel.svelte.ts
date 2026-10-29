export interface CarouselConfig {
  totalItems: () => number;
  initialIndex?: number;
  loop?: () => boolean;
  label?: () => string;
}

export class CarouselState {
  #config?: CarouselConfig;
  currentIndex = $state(0);

  constructor(config: CarouselConfig) {
    this.#config = config;
    if (config.initialIndex !== undefined) {
      this.currentIndex = config.initialIndex;
    }
  }

  total = $derived(this.#config?.totalItems() ?? 0);
  loop = $derived(this.#config?.loop?.() ?? true);
  label = $derived(this.#config?.label?.() ?? 'Media carousel');

  next(): void {
    if (this.total <= 0) return;
    if (this.currentIndex < this.total - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    }
  }

  prev(): void {
    if (this.total <= 0) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.total - 1;
    }
  }

  goTo(index: number): void {
    if (this.total <= 0) return;
    this.currentIndex = Math.max(0, Math.min(index, this.total - 1));
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.prev();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.next();
        event.preventDefault();
        break;
    }
  }

  ariaAttrs = $derived({
    role: 'region' as const,
    'aria-roledescription': 'carousel',
    'aria-label': this.label
  });
}
