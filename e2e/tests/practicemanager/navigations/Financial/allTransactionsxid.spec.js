const { test, expect } = require('@playwright/test');

test('All Transactions - xid', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/transactions/allTransactions');

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/transactions\/viewRecurringTransactionsDetails\/recordid/);
});