import { test, expect } from '@playwright/test';

test('To check the practicesetup >> images page', {tag : "@smoke"}, async ({ page } ) => {
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    // await page.waitForTimeout(10000);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupImages = page.getByRole('link').getByText('Images', { exact: true });
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupImages.isVisible()) {
            await practiceSetupImages.click();
            await expect(page.getByText('View By Category')).toBeVisible();
        }
    }
});

test('To check view category and view image type click', async ({ page }) => {
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupImages = page.getByRole('link').getByText('Images', { exact: true });
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupImages.isVisible()) {
            await practiceSetupImages.click();
            await expect(page.getByText('View By Category')).toBeVisible();
            const viewByCategory = page.locator('#flexSwitchCheckDefault').first();
            const viewImageType = page.locator('#flexSwitchCheckDefault2');
            await expect(viewByCategory).toBeVisible();
            await expect(viewByCategory).toBeChecked();
            if(await viewByCategory.isChecked({ timeout: 15000 })) {
                await expect(page.getByRole('button', { name: 'Add Category' })).toBeVisible();
                await expect(page.locator('#imageCategoryTbl')).toBeVisible();
            } 
            await viewImageType.click();
            if(await viewImageType.isChecked({ timeout: 15000 })) {
                await expect(page.locator('#imageTypeTable')).toBeVisible();
            }
        }
    }
});


test('To check the add category form visible', async ({ page }) => {
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupImages = page.getByRole('link').getByText('Images', { exact: true });
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupImages.isVisible()) {
            await practiceSetupImages.click();
            await expect(page.getByText('View By Category')).toBeVisible();
            const viewByCategory = page.locator('#flexSwitchCheckDefault').first();
            if(await viewByCategory.isChecked({ timeout: 15000 })) {
                const addCategoryBtn = page.locator("#addCategory");
                await addCategoryBtn.click();
                await expect(page.getByLabel('Category Name')).toBeVisible();
                await page.locator('#closeCategoryTop').click();
            }
        }
    }
});


test('Add Category form', async ({ page }) => {
    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    const practiceSetupItem = page.getByRole('listitem').getByText('Practice Setup', { exact: true });
    const practiceSetupImages = page.getByRole('link').getByText('Images', { exact: true });
    if (await practiceSetupItem.isVisible()) {
        await practiceSetupItem.click();
        await page.waitForTimeout(10000);
        if(await practiceSetupImages.isVisible()) {
            await practiceSetupImages.click();
            await expect(page.getByText('View By Category')).toBeVisible();
            const viewByCategory = page.locator('#flexSwitchCheckDefault').first();
            if(await viewByCategory.isChecked({ timeout: 15000 })) {
                const addCategoryBtn = page.locator("#addCategory");
                await addCategoryBtn.click();
                await expect(page.getByText('Add Image Category')).toBeVisible();
                await page.getByLabel('Category Name').fill('Test Category 1');
                await page.getByLabel('Category Abbreviation ').fill('TC1');
                await page.getByRole('button', { name : 'Add' }, {exact: true}).click();
                await expect(page.locator('.toast-alert')).toHaveText('Image category has been inserted successfully.');
            }
        }
    }
});

