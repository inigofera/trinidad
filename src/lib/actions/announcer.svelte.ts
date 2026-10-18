export type Politeness = 'polite' | 'assertive';

export class Announcer {
  static #instance: Announcer | null = null;
  #politeNode: HTMLElement | null = null;
  #assertiveNode: HTMLElement | null = null;
  #containerNode: HTMLElement | null = null;
  #mounted = false;

  constructor() {
    if (Announcer.#instance) {
      return Announcer.#instance;
    }
    this.#initNodes();
    Announcer.#instance = this;
  }

  static getInstance(): Announcer {
    if (!Announcer.#instance) {
      Announcer.#instance = new Announcer();
    }
    return Announcer.#instance;
  }

  static announce(message: string, politeness: Politeness = 'polite'): void {
    Announcer.getInstance().announce(message, politeness);
  }

  #initNodes(): void {
    if (typeof document === 'undefined' || this.#mounted) return;

    let container = document.querySelector<HTMLElement>('[data-trinidad-announcer="true"]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-trinidad-announcer', 'true');
      container.className = 'sr-only';
      Object.assign(container.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0'
      });

      const polite = document.createElement('div');
      polite.setAttribute('aria-live', 'polite');
      polite.setAttribute('aria-atomic', 'true');
      container.appendChild(polite);

      const assertive = document.createElement('div');
      assertive.setAttribute('aria-live', 'assertive');
      assertive.setAttribute('aria-atomic', 'true');
      container.appendChild(assertive);

      document.body.appendChild(container);
    }

    this.#containerNode = container;
    this.#politeNode = container.querySelector<HTMLElement>('[aria-live="polite"]');
    this.#assertiveNode = container.querySelector<HTMLElement>('[aria-live="assertive"]');
    this.#mounted = true;
  }

  announce(message: string, politeness: Politeness = 'polite'): void {
    if (typeof document === 'undefined') return;

    if (!this.#mounted) {
      this.#initNodes();
    }

    const targetNode = politeness === 'assertive' ? this.#assertiveNode : this.#politeNode;
    if (!targetNode) return;

    targetNode.textContent = '';
    requestAnimationFrame(() => {
      targetNode.textContent = message;
    });
  }

  destroy(): void {
    if (this.#containerNode?.parentElement) {
      this.#containerNode.parentElement.removeChild(this.#containerNode);
    }
    this.#containerNode = null;
    this.#politeNode = null;
    this.#assertiveNode = null;
    this.#mounted = false;
    Announcer.#instance = null;
  }
}

export const announcer = Announcer.getInstance();
