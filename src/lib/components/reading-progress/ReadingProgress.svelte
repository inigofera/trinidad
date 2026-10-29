<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export interface ReadingProgressProps extends HTMLAttributes<HTMLDivElement> {
    height?: string | undefined;
    targetSelector?: string | undefined;
    class?: string | undefined;
  }

  let {
    height = '2px',
    targetSelector,
    class: className = '',
    ...rest
  }: ReadingProgressProps = $props();

  let progress = $state(0);

  $effect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateProgress = () => {
      let scrollY: number;
      let totalHeight: number;

      if (targetSelector) {
        const el = document.querySelector(targetSelector);
        if (!el) return;
        scrollY = el.scrollTop;
        totalHeight = el.scrollHeight - el.clientHeight;
      } else {
        scrollY = window.scrollY;
        totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      }

      const pct = totalHeight > 0 ? Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)) : 0;
      progress = Math.round(pct);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    const targetEl = targetSelector ? document.querySelector(targetSelector) : window;
    if (targetEl) {
      targetEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll, { passive: true });

    updateProgress();

    return () => {
      if (targetEl) {
        targetEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  });
</script>

<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Reading progress"
  class="fixed top-0 left-0 right-0 z-50 pointer-events-none bg-border-subtle/30 {className}"
  style="height: {height};"
  {...rest}
>
  <div
    class="h-full bg-accent-interactive transition-[width] duration-75 ease-out"
    style="width: {progress}%;"
  ></div>
</div>
