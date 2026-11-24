const { test, expect } = require('@playwright/test');

test('Failed Transactions - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/transactions/failedtransactions');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/dashboard\/account_identifier/);
});