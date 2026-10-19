import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const labRoutes = [
  '/lab/button',
  '/lab/number-field',
  '/lab/dialog',
  '/lab/combobox',
  '/lab/sparkline',
  '/lab/data-table',
  '/lab/diff-viewer'
];

const themes = ['paper', 'industrial'] as const;

for (const route of labRoutes) {
  for (const theme of themes) {
    test(`A11y verification: ${route} [data-theme="${theme}"]`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);

      // Wait for layout and canvas/fonts to settle
      await page.waitForLoadState('networkidle');

      const scanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(scanResults.violations).toEqual([]);
    });
  }
}
