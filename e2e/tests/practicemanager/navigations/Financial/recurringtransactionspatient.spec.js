const { test, expect } = require('@playwright/test');

test('Recurring Transactions - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/transactions/recurringTransactions');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});