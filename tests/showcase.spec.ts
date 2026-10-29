import { test, expect } from '@playwright/test';

test.describe('Portfolio Structure & Discovery Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lab/showcase');
  });

  test('FilterBar filters projects and supports keyboard navigation', async ({ page }) => {
    // Check initial state
    const allRadio = page.getByRole('radio', { name: 'All Work 4' });
    await expect(allRadio).toHaveAttribute('aria-checked', 'true');

    // Click 'UX Engineering' filter pill
    const uxeRadio = page.getByRole('radio', { name: 'UX Engineering 2' });
    await uxeRadio.click();
    await expect(uxeRadio).toHaveAttribute('aria-checked', 'true');
    await expect(allRadio).toHaveAttribute('aria-checked', 'false');

    // Test Arrow keys roving tabindex
    await uxeRadio.focus();
    await page.keyboard.press('ArrowRight');
    const dsRadio = page.getByRole('radio', { name: 'Design Systems 1' });
    await expect(dsRadio).toHaveAttribute('aria-checked', 'true');
    await expect(dsRadio).toBeFocused();

    // Test Home key
    await page.keyboard.press('Home');
    await expect(allRadio).toHaveAttribute('aria-checked', 'true');
    await expect(allRadio).toBeFocused();
  });

  test('ProjectCard renders kicker, metric badge, tags, and link', async ({ page }) => {
    const card = page
      .locator('article')
      .filter({ hasText: 'Trinidad Teleoperation HRI Console' })
      .first();
    await expect(card).toBeVisible();

    // Check kicker
    await expect(card.getByText('[2025 · INDUSTRIAL HRI]')).toBeVisible();

    // Check metric
    await expect(card.getByText('-42% Latency')).toBeVisible();

    // Check tag
    await expect(card.getByText('WebRTC', { exact: true })).toBeVisible();

    // Check link title
    const link = card.getByRole('link', { name: /Trinidad Teleoperation HRI Console/i });
    await expect(link).toBeVisible();
  });

  test('ExperienceItem renders role, organization, and bullet points', async ({ page }) => {
    const expItem = page
      .locator('div')
      .filter({ hasText: 'Lead UX Engineer & Design Systems Architect' })
      .first();
    await expect(expItem).toBeVisible();

    await expect(page.getByText('Autonomous Robotics & Spatial Computing')).toBeVisible();
    await expect(page.getByText('Current Role')).toBeVisible();
    await expect(
      page.getByText(/Decreased high-consequence teleoperation intervention latency by 42%/i)
    ).toBeVisible();
  });

  test('SiteNav mobile menu toggles disclosure state on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const toggleBtn = page
      .getByRole('main')
      .getByRole('button', { name: 'Toggle navigation menu' });
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' });
    await expect(mobileNav).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });
});
