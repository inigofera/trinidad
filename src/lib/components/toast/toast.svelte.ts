import { Announcer } from '$lib/actions/announcer.svelte.js';

export type ToastVariant = 'nominal' | 'warning' | 'critical' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ShowToastOptions {
  message: string;
  variant?: ToastVariant | undefined;
  duration?: number | undefined;
}

export class ToastState {
  items = $state<ToastItem[]>([]);

  show(options: ShowToastOptions): string {
    const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
    const variant = options.variant ?? 'nominal';
    const duration = options.duration ?? 4000;

    const item: ToastItem = {
      id,
      message: options.message,
      variant,
      duration
    };

    this.items = [...this.items, item];

    // Announce via screen reader
    Announcer.announce(options.message, variant === 'critical' ? 'assertive' : 'polite');

    if (duration > 0 && typeof window !== 'undefined') {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }
}

export const toast = new ToastState();
