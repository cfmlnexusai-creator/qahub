const { test, expect } = require('@playwright/test');
const { PATIENT, INVOICE } = require('../../../../../fixtures/testdata');
const path = require('path');

test('Create Billing for patient @regression', async ({ page }) => {
    test.slow();
    await page.goto(process.env.BASE_URL.replace('/login/', '/dashboard'));
    await page.locator('.patients .invoice').click();
    await page.locator('.charts').click();
    await page.locator('#search').fill(PATIENT.ID);
    await page.getByRole('link', { name: PATIENT.ID, exact: true }).click();
    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
    await page.locator('#toggleSidebar').click();
    await page.locator('.patientBilling').click();
    await page.locator('.patientBilling .patientBillingInvoice').click();
    await expect(page).toHaveURL(/patients\/patientBillingInvoice\/account_identifier/);

    //invoicewithprepayment
    await page.locator('button[name="invoiceCreate"]').click();
    await expect(page).toHaveURL(/invoices\/invoiceCreation\/account_identifier/);
    await page.locator('[aria-labelledby="select2-appointmentId-container"]').click();
    await page.locator('#select2-appointmentId-results').getByRole('option').nth(1).click();
    const amountInput = page.locator('#amount');
    await amountInput.click();
    await amountInput.press('ControlOrMeta+A');
    await amountInput.press('Backspace');
    await amountInput.pressSequentially(INVOICE.AMOUNT);
    await page.locator('[aria-labelledby="select2-invoice_creation_type-container"]').click();
    await page.locator('#select2-invoice_creation_type-results').getByRole('option', { name: 'Pre-Payment' }).click();
    await page.locator('#submitBtn').click();
    const successBox = page.locator('.cbox_messagebox.cbox_messagebox_success');
    await expect(successBox).toBeVisible();
    await expect(successBox).toHaveText('Invoice created successfully.');

    //invoicewithBalance
    await page.locator('button[name="invoiceCreate"]').click();
    await expect(page).toHaveURL(/invoices\/invoiceCreation\/account_identifier/);
    await page.locator('[aria-labelledby="select2-appointmentId-container"]').click();
    await page.locator('#select2-appointmentId-results').getByRole('option').nth(1).click();
    await amountInput.click();
    await amountInput.press('ControlOrMeta+A');
    await amountInput.press('Backspace');
    await amountInput.pressSequentially(INVOICE.AMOUNT);
    await page.locator('[aria-labelledby="select2-invoice_creation_type-container"]').click();
    await page.locator('#select2-invoice_creation_type-results').getByRole('option', { name: 'Balance' }).click();
    await page.locator('#submitBtn').click();
    await expect(successBox).toBeVisible();
    await expect(successBox).toHaveText('Invoice created successfully.');

    //invoicewithdocument(prepayment)
    await page.locator('button[name="invoiceCreate"]').click();
    await expect(page).toHaveURL(/invoices\/invoiceCreation\/account_identifier/);
    await page.locator('[aria-labelledby="select2-appointmentId-container"]').click();
    await page.locator('#select2-appointmentId-results').getByRole('option').nth(1).click();
    await amountInput.click();
    await amountInput.press('ControlOrMeta+A');
    await amountInput.press('Backspace');
    await amountInput.pressSequentially(INVOICE.AMOUNT);
    await page.locator('[aria-labelledby="select2-invoice_creation_type-container"]').click();
    await page.locator('#select2-invoice_creation_type-results').getByRole('option', { name: 'Pre-Payment' }).click();
    const filePath = path.join(__dirname, '../../../../../fixtures/sample-invoice.pdf');
    await page.locator('#imageFileUpload').setInputFiles(filePath);
    await expect(page.locator('#imageFileUpload')).toHaveValue(/sample-invoice\.pdf$/);
    await page.locator('#submitBtn').click();
    await expect(successBox).toBeVisible();
    await expect(successBox).toHaveText('Invoice created successfully.');

    // authorizeCard
    // await page.locator('button[name="authorizeCard"]').click();
    // await expect(page).toHaveURL(/transactions\/authorizeCard\/account_identifier/);
    // await page.locator('#ccnum').fill(INVOICE.CARDNUMBER);
    // await page.locator('#cvv').fill(INVOICE.CVV);
    // await page.locator('#zip').fill(PATIENT.ZIPCODE);
    // await page.locator('#address').fill(PATIENT.ADDRESS);
    // await page.locator('#auth_submitBtnId').click();
    // await expect(successBox).toBeVisible();
    // await expect(successBox).toHaveText('Authorization is successful.');

    //quicktransactionwithnewcard
    await page.locator('button[name="quickTransaction"]').click();
    await expect(page).toHaveURL(/transactions\/quick_transactions\/account_identifier/);
    await amountInput.click();
    await amountInput.press('ControlOrMeta+A');
    await amountInput.press('Backspace');
    await amountInput.pressSequentially(INVOICE.AMOUNT);
    await page.locator('#postal_code').click();
    await page.locator('#postal_code').fill(PATIENT.ZIPCODE);
    await page.locator('#address').click();
    await page.locator('#address').fill(PATIENT.ADDRESS);
    const newcardInput = page.locator('#useNewCard');
    if (await newcardInput.isVisible()) {
        await page.locator('#useNewCard').click();
    }
    await page.locator('#ccnum').click();
    await page.locator('#ccnum').fill(INVOICE.CARDNUMBER);
    await page.locator('#cvv').click();
    await page.locator('#cvv').fill(INVOICE.CVV);
    await page.locator('#qmerchantSubmitId').click();
    await expect(successBox).toBeVisible();
    await expect(successBox.locator('span')).toHaveText('Your transaction has been successfully completed.');

    //quicktransactionwithsavedcards
    await page.locator('button[name="quickTransaction"]').click();
    await expect(page).toHaveURL(/transactions\/quick_transactions\/account_identifier/);
    await amountInput.click();
    await amountInput.press('ControlOrMeta+A');
    await amountInput.press('Backspace');
    await amountInput.pressSequentially(INVOICE.AMOUNT);
    await page.locator('#postal_code').click();
    await page.locator('#postal_code').fill(PATIENT.ZIPCODE);
    await page.locator('#address').click();
    await page.locator('#address').fill(PATIENT.ADDRESS);
    if (await newcardInput.isVisible()) {
        await page.locator('[aria-labelledby="select2-cardDetailsValue-container"]').click();
        await page.locator('#select2-cardDetailsValue-results').getByRole('option').nth(1).click();
    }else{
        await page.locator('#ccnum').click();
        await page.locator('#ccnum').fill(INVOICE.CARDNUMBER);
        await page.locator('#cvv').click();
        await page.locator('#cvv').fill(INVOICE.CVV);
    }
    await page.locator('#qmerchantSubmitId').click();
    await expect(successBox).toBeVisible();
    await expect(successBox.locator('span')).toHaveText('Your transaction has been successfully completed.');

    //resubmittransactionwithrequired
    const resubmitButton = page.locator('#cardFileTable #resubmit-btn');
    if (await resubmitButton.isVisible()) {
        await resubmitButton.click();
    }
    const resubmitModal = page.locator('#resubmit-modal-id');
    if (await resubmitModal.isVisible()) {
        await amountInput.click();
        await amountInput.press('ControlOrMeta+A');
        await amountInput.press('Backspace');
        await amountInput.pressSequentially(INVOICE.AMOUNT);
        await page.locator('.resubmitBtn ').click();
        await expect(successBox).toBeVisible();
        await expect(successBox.locator('span')).toHaveText('Resubmit transaction is successful.');
    }

    //resubmittransactionwithallvalues
    if (await resubmitButton.isVisible()) {
        await resubmitButton.click();
    }
    if (await resubmitModal.isVisible()) {
        await amountInput.click();
        await amountInput.press('ControlOrMeta+A');
        await amountInput.press('Backspace');
        await amountInput.pressSequentially(INVOICE.AMOUNT);
        const surchargeamount = page.locator('#resubmitSurchargeAmountInput');
        await surchargeamount.click();
        await surchargeamount.press('ControlOrMeta+A');
        await surchargeamount.press('Backspace');
        await surchargeamount.pressSequentially(INVOICE.AMOUNT);
        await page.locator('.resubmitBtn ').click();
        await expect(successBox).toBeVisible();
        await expect(successBox.locator('span')).toHaveText('Resubmit transaction is successful.');
    }

    //updatepatientinvoicedetails
    await page.locator('#openInvoiceTable tbody tr').first().locator('td').first().click();
    await expect(page).toHaveURL(/invoices\/invoiceDetail\/recordid/);
    await page.locator('.nameEditIcon .recordEdit').click();
    await page.locator('.firstName').fill('Selshiya');
    await page.locator('.lastName').fill('A');
    await page.locator('#address').fill(PATIENT.ADDRESS);
    await page.locator('input[name="address2"]').nth(1).fill(PATIENT.ZIPCODE);
    await page.locator('input[name="customerId"]').fill(PATIENT.ID);
    await page.locator('#btnSave').click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);
});