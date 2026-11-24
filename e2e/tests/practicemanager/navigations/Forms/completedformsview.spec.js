const { test, expect } = require('@playwright/test');

test('Countersign Forms(Completed Forms) - Countersign', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/Forms/completedForm');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/Forms\/viewDocument\/document/);
});