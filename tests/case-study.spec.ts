import { test, expect } from '@playwright/test';

test.describe('End-to-End Case Study Template Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/case-study/trinidad-hri');
  });

  test('Page renders hero, metadata, and quantitative metrics', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Trinidad Teleoperation HRI Console/i })
    ).toBeVisible();
    await expect(page.getByText('Lead UX Engineer & Design Systems Architect')).toBeVisible();

    // Check StatCards in hero header
    const hero = page.locator('header');
    await expect(hero.getByText('-42%')).toBeVisible();
    await expect(hero.getByText('Operator Intervention Delay')).toBeVisible();
    await expect(hero.getByText('60.0 FPS')).toBeVisible();
  });

  test('InteractiveSandbox updates derived velocity state', async ({ page }) => {
    const sandbox = page.getByRole('region', { name: /Kinematics Calibration Gate sandbox/i });
    await expect(sandbox).toBeVisible();

    // Initial velocity: (45 * 0.0125) = 0.563 m/s (or ~0.563)
    await expect(sandbox.getByText(/0\.563 m\/s/i)).toBeVisible();
  });

  test('Inquiry form triggers Toast notification on submit', async ({ page }) => {
    const nameInput = page.getByLabel('Your Name');
    const emailInput = page.getByLabel('Email Address');
    const submitBtn = page.getByRole('button', { name: /Send Dispatch/i });

    await nameInput.fill('Dr. Vance');
    await emailInput.fill('vance@lab.org');
    await submitBtn.click();

    // Verify Toast appears
    const toastElem = page
      .getByRole('status')
      .filter({ hasText: 'Thank you Dr. Vance! Your message has been dispatched.' });
    await expect(toastElem).toBeVisible();

    // Verify dismissal on Escape
    await page.keyboard.press('Escape');
    await expect(toastElem).not.toBeVisible();
  });
});
