import { expect, test } from '@playwright/test';

test.describe('Phase 2: Visual Media & Artifact Presentation Suite', () => {
  test('ImageCompare slider supports keyboard navigation and step modifiers', async ({ page }) => {
    await page.goto('/lab/media');

    const slider = page.getByRole('slider', { name: /visual comparison/i });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '50');

    // Focus and press ArrowRight (single step +2)
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '52');

    // Shift + ArrowRight (large step +10)
    await page.keyboard.press('Shift+ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '62');

    // ArrowLeft (single step -2)
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveAttribute('aria-valuenow', '60');

    // Home (0) and End (100)
    await page.keyboard.press('Home');
    await expect(slider).toHaveAttribute('aria-valuenow', '0');

    await page.keyboard.press('End');
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  test('DeviceFrame renders browser chrome and industrial terminal styles', async ({ page }) => {
    await page.goto('/lab/media');

    // Browser URL bar pill
    await expect(
      page.getByText('https://artolozaga.dev/work/depalletizer', { exact: true })
    ).toBeVisible();

    // Switch to Terminal variant
    const select = page.getByLabel('Variant');
    await select.selectOption('terminal');
    await expect(page.getByText(/DEPALLETIZER_OPERATOR/i)).toBeVisible();
    await expect(page.getByText(/CAL: 60Hz/i)).toBeVisible();
  });

  test('MediaFigure triggers Lightbox modal and dismisses on Escape', async ({ page }) => {
    await page.goto('/lab/media');

    const zoomBtn = page.getByRole('button', { name: /Open full resolution image viewer/i });
    await expect(zoomBtn).toBeAttached();

    // Open lightbox
    await zoomBtn.click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Carousel navigates slides via next/prev buttons and dot tabs', async ({ page }) => {
    await page.goto('/lab/media');

    const carousel = page.getByRole('region', { name: 'Media carousel' });
    await expect(carousel).toBeVisible();

    // Initial slide
    await expect(page.getByText('[01 / 03]')).toBeVisible();
    await expect(page.getByText('Field Inquiry: Warehouse Floor')).toBeVisible();

    // Next slide
    const nextBtn = page.getByRole('button', { name: 'Next slide' });
    await nextBtn.click();
    await expect(page.getByText('[02 / 03]')).toBeVisible();
    await expect(page.getByText('Low-Fidelity Ergonomic Wireframes')).toBeVisible();

    // Dot tab to 3rd slide
    const dot3 = page.getByRole('tab', { name: 'Go to slide 3' });
    await dot3.click();
    await expect(page.getByText('[03 / 03]')).toBeVisible();
    await expect(page.getByText('W3C Token Hierarchy Definition')).toBeVisible();
  });
});
