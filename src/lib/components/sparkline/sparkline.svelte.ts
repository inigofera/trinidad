import { tokens } from '$lib/tokens/tokens.js';

export interface SparklineConfig {
  data: () => number[];
  min?: () => number | undefined;
  max?: () => number | undefined;
  warnThreshold?: () => number | undefined;
  criticalThreshold?: () => number | undefined;
  unit?: () => string | undefined;
  label: () => string;
}

export class SparklineState {
  #config: SparklineConfig;
  isHovered = $state(false);
  isFocused = $state(false);
  scrubIndex = $state<number | null>(null);
  width = $state(320);
  height = $state(80);

  constructor(config: SparklineConfig) {
    this.#config = config;
  }

  get data(): number[] {
    return this.#config.data();
  }

  get min(): number {
    const configuredMin = this.#config.min?.();
    if (configuredMin !== undefined) return configuredMin;
    const d = this.data;
    return d.length > 0 ? Math.min(0, ...d) : 0;
  }

  get max(): number {
    const configuredMax = this.#config.max?.();
    if (configuredMax !== undefined) return configuredMax;
    const d = this.data;
    return d.length > 0 ? Math.max(100, ...d) : 100;
  }

  get warnThreshold(): number | undefined {
    return this.#config.warnThreshold?.();
  }

  get criticalThreshold(): number | undefined {
    return this.#config.criticalThreshold?.();
  }

  get unit(): string {
    return this.#config.unit?.() ?? '';
  }

  get label(): string {
    return this.#config.label();
  }

  get isPaused(): boolean {
    return this.isHovered || this.isFocused;
  }

  get latestValue(): number {
    const d = this.data;
    return d.length > 0 ? (d[d.length - 1] ?? 0) : 0;
  }

  get inspectedValue(): number | null {
    if (this.scrubIndex === null) return null;
    return this.data[this.scrubIndex] ?? null;
  }

  setDimensions(w: number, h: number): void {
    if (w > 0 && h > 0 && (this.width !== w || this.height !== h)) {
      this.width = w;
      this.height = h;
    }
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    const len = this.data.length;
    if (len === 0) return;

    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault();
        if (this.scrubIndex === null) {
          this.scrubIndex = len - 1;
        } else {
          this.scrubIndex = Math.max(0, this.scrubIndex - 1);
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (this.scrubIndex === null) {
          this.scrubIndex = 0;
        } else {
          this.scrubIndex = Math.min(len - 1, this.scrubIndex + 1);
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        this.scrubIndex = 0;
        break;
      }
      case 'End': {
        e.preventDefault();
        this.scrubIndex = len - 1;
        break;
      }
      case 'Escape': {
        this.scrubIndex = null;
        break;
      }
    }
  };

  handlePointerMove = (e: PointerEvent, canvas: HTMLCanvasElement): void => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const len = this.data.length;
    if (len <= 1 || rect.width <= 0) return;

    const fraction = Math.max(0, Math.min(1, x / rect.width));
    this.scrubIndex = Math.round(fraction * (len - 1));
  };

  handlePointerLeave = (): void => {
    this.isHovered = false;
    this.scrubIndex = null;
  };

  draw(canvas: HTMLCanvasElement, dpr: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = this.width;
    const h = this.height;
    const d = this.data;
    const len = d.length;

    // Theme-aware palette for canvas readouts. Resolved semantic CSS variables are
    // read from the canvas' computed style so nested ThemeScope subtrees render with
    // their active theme; token primitives act as fallbacks when the variables are
    // unavailable (SSR / pre-hydration). One computed-style read per draw.
    const style = getComputedStyle(canvas);
    const themedColor = (prop: string, fallback: string): string => {
      const value = style.getPropertyValue(prop).trim();
      return value || fallback;
    };

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (len === 0) {
      ctx.restore();
      return;
    }

    const minVal = this.min;
    const maxVal = this.max;
    const range = maxVal - minVal || 1;
    const padY = 8;
    const effH = h - padY * 2;

    const getY = (val: number) => {
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      const norm = (clamped - minVal) / range;
      return h - padY - norm * effH;
    };

    const getX = (idx: number) => {
      if (len <= 1) return 0;
      return (idx / (len - 1)) * w;
    };

    // Draw dashed threshold lines
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    if (this.warnThreshold !== undefined) {
      const warnY = getY(this.warnThreshold);
      ctx.strokeStyle = tokens.primitive.color['amber-500'];
      ctx.beginPath();
      ctx.moveTo(0, warnY);
      ctx.lineTo(w, warnY);
      ctx.stroke();
    }

    if (this.criticalThreshold !== undefined) {
      const critY = getY(this.criticalThreshold);
      ctx.strokeStyle = tokens.primitive.color['crimson-500'];
      ctx.beginPath();
      ctx.moveTo(0, critY);
      ctx.lineTo(w, critY);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Determine telemetry stroke color
    const latest = d[len - 1] ?? 0;
    let strokeColor: string = tokens.primitive.color['lime-400'];
    if (this.criticalThreshold !== undefined && latest >= this.criticalThreshold) {
      strokeColor = tokens.primitive.color['crimson-500'];
    } else if (this.warnThreshold !== undefined && latest >= this.warnThreshold) {
      strokeColor = tokens.primitive.color['amber-500'];
    }

    // Telemetry polyline
    ctx.beginPath();
    for (let i = 0; i < len; i++) {
      const px = getX(i);
      const py = getY(d[i]!);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    // Draw stroke
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.stroke();

    // Subtle area fill under line
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${strokeColor}33`);
    grad.addColorStop(1, `${strokeColor}00`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Inspection Crosshair & Readout (unified face via --font-mono)
    if (this.scrubIndex !== null && this.scrubIndex >= 0 && this.scrubIndex < len) {
      const idx = this.scrubIndex;
      const scrubX = getX(idx);
      const scrubY = getY(d[idx]!);
      const scrubVal = d[idx]!;

      const hairline = themedColor('--fg-muted', tokens.primitive.color['stone-300']);

      // Vertical hairline
      ctx.strokeStyle = hairline;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(scrubX, 0);
      ctx.lineTo(scrubX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point marker
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(scrubX, scrubY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hairline;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Readout Box
      const relIdx = -(len - 1 - idx);
      const readoutText = `[idx: ${relIdx} | ${scrubVal.toFixed(1)} ${this.unit}]`;
      const readoutFont = themedColor('--font-mono', tokens.primitive.font.mono);
      ctx.font = `10px ${readoutFont}`;
      const textWidth = ctx.measureText(readoutText).width;
      const boxW = textWidth + 12;
      const boxH = 18;

      let boxX = scrubX + 8;
      if (boxX + boxW > w - 4) {
        boxX = scrubX - boxW - 8;
      }
      let boxY = scrubY - 20;
      if (boxY < 4) {
        boxY = scrubY + 8;
      }

      const readoutFill = themedColor('--surface-elevated', tokens.primitive.color['slate-900']);
      const readoutStroke = themedColor('--border-subtle', tokens.primitive.color['stone-300']);
      ctx.fillStyle = readoutFill;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = readoutStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const readoutInk = themedColor('--fg-primary', tokens.primitive.color['cream-50']);
      ctx.fillStyle = readoutInk;
      ctx.textBaseline = 'middle';
      ctx.fillText(readoutText, boxX + 6, boxY + boxH / 2);
    }

    ctx.restore();
  }
}
