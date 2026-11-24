const { test, expect } = require('@playwright/test');

test('Invoice Reports(Custom Reports) - amount', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/reports/customReports');

    await page.locator('#custom').selectOption({ label: 'Closed Invoices' });
    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/invoices\/invoiceDetail\/recordid/);
});