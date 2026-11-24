const { test, expect } = require('@playwright/test');

test('Unread Messages - Patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('#messageReadStatusSelect').selectOption({ label: 'All Messages' });

    await page.locator('#unreadMessagesTbl').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});