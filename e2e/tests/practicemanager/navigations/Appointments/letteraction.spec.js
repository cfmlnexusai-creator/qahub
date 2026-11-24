const { test, expect } = require('@playwright/test');

test('Letter - action', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/letters');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('.btn-view-letter').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/viewLetter\/id/);
});