const { test, expect } = require('@playwright/test');

test('Paid Invoices - XID', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/invoices');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').nth(1).click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/transactions\/transactionDetails\/recordid/);
});
