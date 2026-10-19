export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonStateConfig {
  loading?: () => boolean;
  disabled?: () => boolean;
}

export class ButtonState {
  #config: ButtonStateConfig = {};
  spinnerIndex = $state(0);
  static readonly SPINNER_FRAMES = ['[/]', '[-]', '[\\]', '[|]'] as const;

  constructor(config: ButtonStateConfig = {}) {
    this.#config = config;
  }

  loading = $derived(this.#config.loading?.() ?? false);
  disabled = $derived(this.#config.disabled?.() ?? false);
  currentSpinner = $derived(
    ButtonState.SPINNER_FRAMES[this.spinnerIndex % ButtonState.SPINNER_FRAMES.length]!
  );

  nextFrame(): void {
    this.spinnerIndex = (this.spinnerIndex + 1) % ButtonState.SPINNER_FRAMES.length;
  }

  ariaAttrs = $derived({
    'aria-busy': this.loading ? (true as const) : undefined,
    'aria-disabled': this.disabled ? (true as const) : undefined
  });
}
