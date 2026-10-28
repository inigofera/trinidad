import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const labRoutes = [
  '/lab/button',
  '/lab/number-field',
  '/lab/dialog',
  '/lab/combobox',
  '/lab/sparkline',
  '/lab/data-table',
  '/lab/diff-viewer',
  '/patterns',
  '/architecture'
];

const themes = ['paper', 'industrial'] as const;

for (const route of labRoutes) {
  for (const theme of themes) {
    test(`A11y verification: ${route} [data-theme="${theme}"]`, async ({ page }) => {
      // Seed the persisted theme before any script runs so app.html's FOUC-prevention
      // script applies data-theme pre-paint and hydration's validated localStorage
      // read agrees with it (prevents post-load reverts to the default theme).
      await page.addInitScript((t) => {
        try {
          localStorage.setItem('trinidad-theme', t);
        } catch {}
      }, theme);

      await page.goto(route);

      // Wait for layout and canvas/fonts to settle
      await page.waitForLoadState('networkidle');

      const scanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(scanResults.violations).toEqual([]);
    });
  }
}
