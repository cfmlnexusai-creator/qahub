const { test, expect } = require('@playwright/test');

test('Claim Denials - Claim ID', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Claim Denials', exact: true })}).locator('tbody').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/patientClaims\/account_identifier/);
});