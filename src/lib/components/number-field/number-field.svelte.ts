export interface NumberFieldConfig {
  value: () => number;
  min?: () => number | undefined;
  max?: () => number | undefined;
  step?: () => number | undefined;
  disabled?: () => boolean;
  invalid?: () => boolean;
  onChange?: (next: number) => void;
}

export class NumberFieldState {
  #config: NumberFieldConfig;
  isScrubbing = $state(false);
  #startX = 0;
  #startValue = 0;

  constructor(config: NumberFieldConfig) {
    this.#config = config;
  }

  get min(): number {
    return this.#config.min?.() ?? -Infinity;
  }

  get max(): number {
    return this.#config.max?.() ?? Infinity;
  }

  get step(): number {
    return this.#config.step?.() ?? 1;
  }

  get disabled(): boolean {
    return this.#config.disabled?.() ?? false;
  }

  get invalid(): boolean {
    return this.#config.invalid?.() ?? false;
  }

  clamp(val: number): number {
    const stepVal = this.step;
    const stepped = Math.round(val / stepVal) * stepVal;
    const stepStr = stepVal.toString();
    const precision = stepStr.includes('.') ? (stepStr.split('.')[1]?.length ?? 0) : 0;
    const rounded = Number(stepped.toFixed(precision));
    return Math.min(this.max, Math.max(this.min, rounded));
  }

  increment(multiplier = 1): void {
    if (this.disabled) return;
    const next = this.clamp(this.#config.value() + this.step * multiplier);
    this.#config.onChange?.(next);
  }

  decrement(multiplier = 1): void {
    if (this.disabled) return;
    const next = this.clamp(this.#config.value() - this.step * multiplier);
    this.#config.onChange?.(next);
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.increment(mult);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.decrement(mult);
        break;
      case 'Home':
        if (Number.isFinite(this.min)) {
          e.preventDefault();
          this.#config.onChange?.(this.min);
        }
        break;
      case 'End':
        if (Number.isFinite(this.max)) {
          e.preventDefault();
          this.#config.onChange?.(this.max);
        }
        break;
    }
  };

  handlePointerDown = (e: PointerEvent): void => {
    if (this.disabled || e.button !== 0) return;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    this.isScrubbing = true;
    this.#startX = e.clientX;
    this.#startValue = this.#config.value();
  };

  handlePointerMove = (e: PointerEvent): void => {
    if (!this.isScrubbing) return;
    const deltaX = e.clientX - this.#startX;
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const next = this.clamp(this.#startValue + deltaX * this.step * mult);
    this.#config.onChange?.(next);
  };

  handlePointerUp = (e: PointerEvent): void => {
    if (!this.isScrubbing) return;
    const target = e.currentTarget as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {
      // Element may have been detached
    }
    this.isScrubbing = false;
  };

  get ariaAttrs() {
    return {
      role: 'spinbutton' as const,
      'aria-valuenow': this.#config.value(),
      'aria-valuemin': Number.isFinite(this.min) ? this.min : undefined,
      'aria-valuemax': Number.isFinite(this.max) ? this.max : undefined,
      'aria-disabled': this.disabled ? (true as const) : undefined,
      'aria-invalid': this.invalid ? (true as const) : undefined
    };
  }
}
