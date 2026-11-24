const { test, expect } = require('@playwright/test');

test('Account Status - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/accountStatusReport');

    await page.locator('#accountStatusType').selectOption({ label: 'In Resolution' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});