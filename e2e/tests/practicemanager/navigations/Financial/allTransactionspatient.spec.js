const { test, expect } = require('@playwright/test');

test('All Transactions - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/transactions/allTransactions');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});