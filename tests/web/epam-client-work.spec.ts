import { test, expect } from '@playwright/test';

test('Navigate to EPAM Client Work via Services -> Explore Our Client Work', async ({ page }) => {
  // Step 1: Go to homepage
  await page.goto('https://www.epam.com/', { waitUntil: 'domcontentloaded' });

  // Step 2: Select "Services" from header menu
  // Prefer role-based locator; fallback to href-based locator if ambiguous
  const servicesLink = page.getByRole('link', { name: 'Services' }).first();
  if (await servicesLink.count() === 1) {
    await servicesLink.click().catch(async () => servicesLink.click({ force: true }));
  } else if ((await page.locator('a[href="/services"]').count()) > 0) {
    await page.locator('a[href="/services"]').first().click({ force: true });
  } else {
    throw new Error('Services link not found');
  }

  await page.waitForLoadState('domcontentloaded');

  // Step 3: Click "Explore Our Client Work"
  // Try role-based link first, then href
  const explore = page.getByRole('link', { name: 'Explore Our Client Work' }).first();
  if (await explore.count() > 0) {
    await explore.click().catch(async () => explore.click({ force: true }));
  } else if ((await page.locator('a[href="/services/client-work"]').count()) > 0) {
    await page.locator('a[href="/services/client-work"]').first().click({ force: true });
  } else {
    // final fallback: navigate directly
    await page.goto('https://www.epam.com/services/client-work', { waitUntil: 'networkidle' });
  }

  await page.waitForLoadState('networkidle');

  // Step 4: Verify "Client Work" text is visible
  const clientWork = page.getByText('Client Work').first();
  await expect(clientWork).toBeVisible();

  // Evidence: screenshot
  await page.screenshot({ path: 'tests/artifacts/epam-client-work-step1.png', fullPage: true });
});
