const { test, expect } = require('@playwright/test');

test('Adjustments - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/adjustmentReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/dashboard\/account_identifier/);
});