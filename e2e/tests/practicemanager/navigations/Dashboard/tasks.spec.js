const { test, expect } = require('@playwright/test');

test('Tasks - task', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    const pageEvent = page.waitForEvent('popup');
    
    page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Tasks', exact: true })}).locator('tbody').getByRole('link').first().click();
    
    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/tasks\/account_identifier/);
});