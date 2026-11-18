import { test, expect } from '@playwright/test';

test('To check the practicesetup >> billing >> discount page', async ({ page }) => {
    // test.slow();
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupBilling = page.getByRole('listitem').getByText('Billing', { exact: true });
    const billingDiscount = page.getByRole('link', { name: 'Discounts' });

    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        if(await practiceSetupBilling.isVisible()) {
            await practiceSetupBilling.click();
            await page.waitForTimeout(10000);
            if(await billingDiscount.isVisible()) {
                await billingDiscount.click();
                await expect(page).toHaveURL(/discount/);
                await expect(page.getByText('View By Category')).toBeVisible();
                await expect(page.locator('#flexSwitchCheckDefault').first()).toBeChecked();
                await expect(page.getByRole('button', { name : 'Add Category'})).toBeVisible();
                await expect(page.locator('#discountCategory')).toBeVisible();
            }
        } 
    }
});