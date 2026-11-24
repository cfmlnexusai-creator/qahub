const { test, expect } = require('@playwright/test');

test('Invoice Reports(Custom Reports) - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/reports/customReports');

    await page.locator('#select2-custom-container').click();

    await page.getByRole('option', { name: 'Bad Debt', exact: true }).click();

    await page.getByText('Run Report', { exact: true }).click();

    await expect(page).toHaveURL(/reports\/customReports\?action=badDebt/);
});