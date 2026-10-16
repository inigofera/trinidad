export class EnvironmentState {
  theme = $state<'paper' | 'industrial'>('paper');
  density = $state<'comfortable' | 'compact'>('comfortable');
  motion = $state<'full' | 'reduced'>('full');

  setTheme(next: 'paper' | 'industrial') {
    this.theme = next;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
  }

  setDensity(next: 'comfortable' | 'compact') {
    this.density = next;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-density', next);
    }
  }

  setMotion(next: 'full' | 'reduced') {
    this.motion = next;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-motion', next);
    }
  }

  init() {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.theme);
      document.documentElement.setAttribute('data-density', this.density);
      document.documentElement.setAttribute('data-motion', this.motion);
    }
  }
}

export const env = new EnvironmentState();
