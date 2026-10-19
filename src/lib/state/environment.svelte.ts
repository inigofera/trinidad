import { getContext, setContext } from 'svelte';

export type Theme = 'paper' | 'industrial';
export type Density = 'comfortable' | 'compact';
export type Motion = 'full' | 'reduced';

export interface EnvironmentOptions {
  theme?: Theme;
  density?: Density;
  motion?: Motion;
  syncDom?: boolean;
}

export class EnvironmentState {
  theme = $state<Theme>('paper');
  density = $state<Density>('comfortable');
  motion = $state<Motion>('full');
  syncDom: boolean;

  constructor(options?: EnvironmentOptions) {
    if (options?.theme) this.theme = options.theme;
    if (options?.density) this.density = options.density;
    if (options?.motion) this.motion = options.motion;
    this.syncDom = options?.syncDom ?? true;
  }

  setTheme(next: Theme): void {
    this.theme = next;
    if (this.syncDom && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
  }

  setDensity(next: Density): void {
    this.density = next;
    if (this.syncDom && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-density', next);
    }
  }

  setMotion(next: Motion): void {
    this.motion = next;
    if (this.syncDom && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-motion', next);
    }
  }

  init(): () => void {
    if (this.syncDom && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.theme);
      document.documentElement.setAttribute('data-density', this.density);
      document.documentElement.setAttribute('data-motion', this.motion);
    }
    return () => {
      // Optional teardown / reset logic if unmounting
    };
  }
}

const ENVIRONMENT_KEY = Symbol('TRINIDAD_ENVIRONMENT_CONTEXT');

/**
 * Creates and sets the EnvironmentState in the current Svelte component hierarchy context.
 * Call this in root +layout.svelte or test harnesses to guarantee isolation per render tree.
 */
export function setEnvironment(options?: EnvironmentOptions): EnvironmentState {
  const state = new EnvironmentState(options);
  setContext(ENVIRONMENT_KEY, state);
  return state;
}

/**
 * Retrieves the EnvironmentState from the active Svelte component hierarchy context.
 * Falls back to an isolated standalone instance if invoked outside a context tree (e.g. headless SSR / unit test).
 */
export function getEnvironment(): EnvironmentState {
  const context = getContext<EnvironmentState | undefined>(ENVIRONMENT_KEY);
  if (context) return context;
  return new EnvironmentState({ syncDom: false });
}
