const { test, expect } = require('@playwright/test');

test('Unlocked Notes - action - edit', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Unlocked Notes', exact: true })}).locator('.editNote').first().click();

    await expect(page).toHaveURL(/emrNote\/addEmrNote\/account_identifier/);
});