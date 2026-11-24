const { test, expect } = require('@playwright/test');

test('Messages - Balance', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/message/messages');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('.message-sidebar').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/dashboard\/account_identifier/);
});