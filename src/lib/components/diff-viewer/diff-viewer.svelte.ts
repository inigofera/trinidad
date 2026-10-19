import { Announcer } from '$lib/actions/announcer.svelte.js';

export type DiffStatus = 'pending' | 'accepted' | 'rejected' | 'modified';
export type DiffMode = 'split' | 'unified';
export type DiffLineType = 'unchanged' | 'added' | 'removed';

export interface DiffLine {
  type: DiffLineType;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
  content: string;
}

export interface SplitDiffRow {
  left?: { lineNumber: number; content: string; type: DiffLineType };
  right?: { lineNumber: number; content: string; type: DiffLineType };
}

export interface DiffResolution {
  status: DiffStatus;
  finalContent: string;
}

export function computeLcsDiff(originalText: string, modifiedText: string): DiffLine[] {
  const origLines = originalText.split('\n');
  const modLines = modifiedText.split('\n');
  const n = origLines.length;
  const m = modLines.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origLines[i] === modLines[j]) {
        dp[i + 1]![j + 1] = dp[i]![j]! + 1;
      } else {
        dp[i + 1]![j + 1] = Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
      }
    }
  }

  const diff: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      diff.unshift({
        type: 'unchanged',
        originalLineNumber: i,
        modifiedLineNumber: j,
        content: origLines[i - 1]!
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
      diff.unshift({
        type: 'added',
        modifiedLineNumber: j,
        content: modLines[j - 1]!
      });
      j--;
    } else if (i > 0) {
      diff.unshift({
        type: 'removed',
        originalLineNumber: i,
        content: origLines[i - 1]!
      });
      i--;
    }
  }

  return diff;
}

export interface DiffViewerConfig {
  original: () => string;
  modified: () => string;
  mode?: () => DiffMode | undefined;
  title: () => string;
  status: () => DiffStatus;
  onStatusChange?: (status: DiffStatus) => void;
  onResolve?: (resolution: DiffResolution) => void;
}

export class DiffViewerState {
  #config: DiffViewerConfig;
  isEditing = $state(false);
  inlineDraft = $state('');
  activeMode = $state<DiffMode>('unified');

  constructor(config: DiffViewerConfig) {
    this.#config = config;
    if (config.mode?.()) {
      this.activeMode = config.mode()!;
    }
  }

  get original(): string {
    return this.#config.original();
  }

  get modified(): string {
    return this.#config.modified();
  }

  get title(): string {
    return this.#config.title();
  }

  get status(): DiffStatus {
    return this.#config.status();
  }

  get diffLines(): DiffLine[] {
    const mod = this.isEditing ? this.inlineDraft : this.modified;
    return computeLcsDiff(this.original, mod);
  }

  get splitRows(): SplitDiffRow[] {
    const lines = this.diffLines;
    const rows: SplitDiffRow[] = [];

    let leftPending: DiffLine | null = null;

    for (const line of lines) {
      if (line.type === 'unchanged') {
        if (leftPending) {
          rows.push({
            left: {
              lineNumber: leftPending.originalLineNumber!,
              content: leftPending.content,
              type: 'removed'
            }
          });
          leftPending = null;
        }
        rows.push({
          left: {
            lineNumber: line.originalLineNumber!,
            content: line.content,
            type: 'unchanged'
          },
          right: {
            lineNumber: line.modifiedLineNumber!,
            content: line.content,
            type: 'unchanged'
          }
        });
      } else if (line.type === 'removed') {
        if (leftPending) {
          rows.push({
            left: {
              lineNumber: leftPending.originalLineNumber!,
              content: leftPending.content,
              type: 'removed'
            }
          });
        }
        leftPending = line;
      } else if (line.type === 'added') {
        if (leftPending) {
          rows.push({
            left: {
              lineNumber: leftPending.originalLineNumber!,
              content: leftPending.content,
              type: 'removed'
            },
            right: {
              lineNumber: line.modifiedLineNumber!,
              content: line.content,
              type: 'added'
            }
          });
          leftPending = null;
        } else {
          rows.push({
            right: {
              lineNumber: line.modifiedLineNumber!,
              content: line.content,
              type: 'added'
            }
          });
        }
      }
    }

    if (leftPending) {
      rows.push({
        left: {
          lineNumber: leftPending.originalLineNumber!,
          content: leftPending.content,
          type: 'removed'
        }
      });
    }

    return rows;
  }

  setStatus(next: DiffStatus): void {
    this.#config.onStatusChange?.(next);
  }

  accept(): void {
    const finalContent = this.isEditing ? this.inlineDraft : this.modified;
    this.setStatus('accepted');
    this.isEditing = false;
    Announcer.announce('Proposal accepted. Changes committed to telemetry baseline.', 'polite');
    this.#config.onResolve?.({ status: 'accepted', finalContent });
  }

  reject(): void {
    this.setStatus('rejected');
    this.isEditing = false;
    Announcer.announce('Proposal rejected. Original baseline retained.', 'polite');
    this.#config.onResolve?.({ status: 'rejected', finalContent: this.original });
  }

  startEditing(): void {
    this.inlineDraft = this.modified;
    this.isEditing = true;
  }

  saveInlineEdit(): void {
    const finalContent = this.inlineDraft;
    this.setStatus('modified');
    this.isEditing = false;
    Announcer.announce('Proposal updated with inline operator modifications.', 'polite');
    this.#config.onResolve?.({ status: 'modified', finalContent });
  }

  cancelEditing(): void {
    this.isEditing = false;
  }
}
