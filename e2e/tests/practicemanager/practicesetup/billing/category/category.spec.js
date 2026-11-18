import { test, expect } from '@playwright/test';

test('To check the practicesetup >> billing >> category page', async ({ page }) => {
    // test.slow();
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    // await page.waitForTimeout(10000);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupBilling = page.getByRole('listitem').getByText('Billing', { exact: true });
    const billingCategory = page.getByRole('link').getByText('Category', { exact: true });
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        if(await practiceSetupBilling.isVisible()) {
            await practiceSetupBilling.click();
            if(await billingCategory.isVisible()) {
                await billingCategory.click();
                await expect(page).toHaveURL(/category/);
                await expect(page.locator('#addbillingCategory')).toBeVisible();
                await expect(page.locator("#billingCategory")).toBeVisible();
            }
        } 
    }
});

test('To check the billing Category form visible', async ({ page }) => {
    // test.slow();
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    // await page.waitForTimeout(10000);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupBilling = page.getByRole('listitem').getByText('Billing', { exact: true });
    const billingCategory = page.getByRole('link').getByText('Category', { exact: true });
    const addBillingCategory = page.locator('#addbillingCategory');
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupBilling.isVisible()) {
            await practiceSetupBilling.click();
            if(await billingCategory.isVisible()) {
                await billingCategory.click();
                await expect(page).toHaveURL(/category/);
                await expect(addBillingCategory).toBeVisible();
                await expect(page.locator("#billingCategory")).toBeVisible();
                await addBillingCategory.click();
                await expect(page.getByText('Add Billing Category')).toBeVisible();
                await page.locator('#closeBillingCategoryTop').click();
            }
        } 
    }
});

test('To check the billing Category form', async ({ page }) => {
    // test.slow();
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    // await page.waitForTimeout(10000);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupBilling = page.getByRole('listitem').getByText('Billing', { exact: true });
    const billingCategory = page.getByRole('link').getByText('Category', { exact: true });
    const addBillingCategory = page.locator('#addbillingCategory');
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupBilling.isVisible()) {
            await practiceSetupBilling.click();
            if(await billingCategory.isVisible()) {
                await billingCategory.click();
                await expect(page).toHaveURL(/category/);
                await expect(addBillingCategory).toBeVisible();
                await expect(page.locator("#billingCategory")).toBeVisible();
                await addBillingCategory.click();
                await expect(page.getByText('Add Billing Category')).toBeVisible();
                //positive test case 1
                await page.getByLabel('Category Name').fill('Test Category 1');
                await page.getByRole('textbox', { name: 'Abbreviation' }).fill('TC!');
                await page.getByLabel('Description').fill('Test Category');
                await page.locator('#addbillingCategorySubmit').click();
                await expect(page.locator('.toast-alert')).toHaveText(' Billing category has been added successfully.');
            }
        } 
    }
});