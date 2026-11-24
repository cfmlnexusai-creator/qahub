const { test, expect } = require('@playwright/test');

test('Transaction Reports - xid', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/reports/transactionReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').nth(2).click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/transactions\/transactionDetails\/recordid/);
});