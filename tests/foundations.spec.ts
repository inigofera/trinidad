import { expect, test } from '@playwright/test';

test.describe('Foundations token wiring', () => {
  test('ThemeScope panels resolve their own theme and density values', async ({ page }) => {
    await page.goto('/foundations');
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(() => {
      const paper = document.querySelector<HTMLElement>(
        'main [data-theme="paper"][data-density="comfortable"]'
      );
      const industrial = document.querySelector<HTMLElement>(
        'main [data-theme="industrial"][data-density="compact"]'
      );

      if (!paper || !industrial) {
        throw new Error('Expected both Foundations theme scopes to render');
      }

      const resolve = (el: HTMLElement, variable: string) => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = `var(${variable})`;
        probe.style.color = `var(${variable})`;
        el.appendChild(probe);
        const styles = getComputedStyle(probe);
        const values = { background: styles.backgroundColor, color: styles.color };
        probe.remove();
        return values;
      };

      const paperSurface = resolve(paper, '--surface-canvas');
      const industrialSurface = resolve(industrial, '--surface-canvas');
      const industrialText = resolve(industrial, '--fg-primary');

      const paperControl = paper.querySelector<HTMLElement>('.bg-accent-interactive');
      const industrialControl = industrial.querySelector<HTMLElement>('.bg-accent-interactive');

      return {
        paperBg: getComputedStyle(paper).backgroundColor,
        industrialBg: getComputedStyle(industrial).backgroundColor,
        paperFg: getComputedStyle(paper).color,
        industrialFg: getComputedStyle(industrial).color,
        paperSurfaceBg: paperSurface.background,
        industrialSurfaceBg: industrialSurface.background,
        industrialTextColor: industrialText.color,
        paperControlHeight: paperControl ? getComputedStyle(paperControl).height : null,
        industrialControlHeight: industrialControl
          ? getComputedStyle(industrialControl).height
          : null
      };
    });

    expect(result.paperBg).toBe(result.paperSurfaceBg);
    expect(result.industrialBg).toBe(result.industrialSurfaceBg);
    expect(result.industrialFg).toBe(result.industrialTextColor);
    expect(result.paperBg).not.toBe(result.industrialBg);
    expect(result.paperFg).not.toBe(result.industrialFg);

    // Comfortable control height is 2.25rem (36px); compact is 1.75rem (28px).
    expect(result.paperControlHeight).toBe('36px');
    expect(result.industrialControlHeight).toBe('28px');
  });

  test('Tailwind token utilities follow CSS custom property overrides', async ({ page }) => {
    await page.goto('/foundations');
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const probe = document.createElement('div');
      probe.className = 'p-4 rounded-card text-3xl font-regular';
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);

      const read = () => {
        const styles = getComputedStyle(probe);
        return {
          paddingTop: styles.paddingTop,
          borderRadius: styles.borderTopLeftRadius,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      };

      const before = read();

      root.style.setProperty('--spacing-4', '2rem');
      root.style.setProperty('--radius-card', '20px');
      root.style.setProperty('--font-size-3xl', '2.5rem');
      root.style.setProperty('--font-weight-regular', '600');

      const after = read();

      root.style.removeProperty('--spacing-4');
      root.style.removeProperty('--radius-card');
      root.style.removeProperty('--font-size-3xl');
      root.style.removeProperty('--font-weight-regular');
      probe.remove();

      return { before, after };
    });

    expect(result.before).toEqual({
      paddingTop: '16px',
      borderRadius: '10px',
      fontSize: '30px',
      fontWeight: '400'
    });

    expect(result.after).toEqual({
      paddingTop: '32px',
      borderRadius: '20px',
      fontSize: '40px',
      fontWeight: '600'
    });
  });
});
