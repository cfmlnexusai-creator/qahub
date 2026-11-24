const { test, expect } = require('@playwright/test');

test('Transaction Reports - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/reports/transactionReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});
