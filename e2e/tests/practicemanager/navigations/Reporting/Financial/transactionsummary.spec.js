const { test, expect } = require('@playwright/test');

test('Transaction Summary - batch', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/reports/transactionSummary');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/reports\/batchSummary\/date/);
});