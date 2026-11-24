const { test, expect } = require('@playwright/test');

test('Recurring Transactions - amount', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/transactions/recurringTransactions');

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/transactions\/viewRecurringTransactionsDetails\/recordid/);
});