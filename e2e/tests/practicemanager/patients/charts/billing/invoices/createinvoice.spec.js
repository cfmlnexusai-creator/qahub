const { test, expect } = require('@playwright/test');
const { PATIENT, INVOICE, PAYMENT_PLAN } = require('../../../../../fixtures/testdata');
const path = require('path');

test('Create Recurring Transaction and Payment Plan', async ({ page }) => {
    test.slow();
    await page.goto(process.env.BASE_URL.replace('/login/', '/dashboard'));
    await page.locator('.patients .invoice').click();
    await page.locator('.charts').click();
    await page.locator('#search').fill(PATIENT.ID);
    await page.getByRole('link', { name: PATIENT.ID, exact: true }).click();
    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
    await page.waitForLoadState('load');
    await page.locator('#toggleSidebar').click();
    await page.locator('.patientBilling').click();
    await page.locator('.patientBilling .patientBillingInvoice').click();
    await expect(page).toHaveURL(/patients\/patientBillingInvoice\/account_identifier/);

    //invoicewithprepayment
    await page.locator('button[name="invoiceCreate"]').click();
    await expect(page).toHaveURL(/invoices\/invoiceCreation\/account_identifier/);
    await page.waitForLoadState('load');
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
    await page.waitForLoadState('load');
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
    await page.waitForLoadState('load');
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
    await page.waitForLoadState('load');
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
    await page.waitForLoadState('load');
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
    await page.waitForLoadState('load');

    //recordofficededit
    await page.locator('#updateMerchantBtn').click();
    await page.locator('[aria-labelledby="select2-updateMerchant_id-container"]').click(); 
    await page.locator('#select2-updateMerchant_id-results').getByRole('option').nth(1).click();
    await page.locator('#updateMerchant').click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    //recorddetailsedit
    await page.locator('.nameEditIcon .recordEdit').click();
    await page.locator('.firstName').fill(PATIENT.FIRSTNAME);
    await page.locator('.lastName').fill(PATIENT.LASTNAME);
    await page.locator('#address').fill(PATIENT.ADDRESS);
    await page.locator('input[name="address2"]').nth(1).fill(PATIENT.ZIPCODE);
    await page.locator('input[name="customerId"]').fill(PATIENT.ID);
    await page.locator('#btnSave').click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    // recordamountedit
    await page.locator('.recordAmountEdit').click();
    await page.getByRole('textbox', { name: 'Amount..' }).fill(INVOICE.AMOUNT);
    await page.getByRole('button', { name: /Save/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    // recordmailedit
    await page.locator('.recordMailEdit').click();
    await page.locator('#contactUpdate input[name="email"]').fill(PATIENT.EMAIL);
    await page.locator('#contactUpdate input[name="phone"]').fill(PATIENT.PHONE);
    await page.getByRole('button', { name: /Save/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    // cloneinvoice
    await page.getByText('Clone', { exact: true }).click();
    await page.locator('#clone-invoice-modal-body').click();
    await page.getByRole('textbox', { name: ' First Name' }).fill(PATIENT.FIRSTNAME);
    await page.getByRole('textbox', { name: ' Last Name' }).fill(PATIENT.LASTNAME);
    await page.getByRole('textbox', { name: ' Email' }).fill(PATIENT.EMAIL);
    await page.locator('#clone-invoice-modal-body input[name="phone"]').fill(PATIENT.PHONE);
    await page.getByRole('textbox', { name: '$ Amount: Example:' }).fill(INVOICE.AMOUNT);
    await page.getByRole('textbox', { name: /Due Date/ }).click();
    await page.getByRole('cell', { name: /Today:/ }).click();
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    // Deleteinvoice
    await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
    await page.locator('a').filter({ hasText: /^Delete$/ }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    // Reopeninvoice
    await page.getByText('Reopen').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);
    await page.getByRole('link', { name: 'Back' }).click();

    //dayupdate
    const paymentPlansSection = page.getByText('Payment Plans', { exact: true }).locator('..');
    await paymentPlansSection.getByRole('searchbox', { name: 'Search:' }).fill('Days');
    const dayRow = page.locator('#paymentPlansTable tbody tr')
        .filter({ hasText: /\b\d+ Days\b/ })
        .first();
    await expect(dayRow).toBeVisible();
    await dayRow.locator('td').first().click();
    await expect(page).toHaveURL(/transactions\/viewRecurringTransactionsDetails\/recordid/);
    await page.waitForLoadState('load');

    //subscriptionstatus
    await page.locator('.fa-solid.fa-circle-stop').click();
    await page.locator('.ms-2.fa-solid.fa-circle-play').click();

    //updatecard
    await page.getByRole('button', { name: /Update Card/ }).click();
    await page.getByRole('textbox', { name: /Credit Card Number/ }).fill(INVOICE.CARDNUMBER);
    await page.getByRole('textbox', { name: /3 Digit CVV Code/ }).fill(INVOICE.CVV);
    await page.getByRole('button', { name: /Update/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    //updatecontact
    await page.getByRole('button', { name: /Update Contact/ }).click();
    await page.getByRole('textbox', { name: /First Name/ }).fill(PATIENT.FIRSTNAME);
    await page.getByRole('textbox', { name: /Last Name/ }).fill(PATIENT.LASTNAME);
    await page.getByRole('textbox', { name: /Email/ }).fill(PATIENT.EMAIL);
    await page.getByRole('textbox', { name: /Address/ }).fill(PATIENT.ADDRESS);
    await page.getByRole('textbox', { name: /Zip/ }).fill(PATIENT.ZIPCODE);
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);

    //updatesubscription
    await page.getByRole('button', { name: /Update Subscription/ }).click();
    await page.getByRole('textbox', { name: 'Next Run Date' }).click();
    await page.getByRole('cell', { name: /Today:/ }).click();
    await subscriptionAmount.fill(INVOICE.AMOUNT);
    await page.getByRole('spinbutton', { name: /Number Of Days In Between/ }).fill('2');
    await page.getByRole('textbox', { name: /Repetitions/ }).fill(PAYMENT_PLAN.REPETITIONS);
    await page.getByRole('button', { name: /Update/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);
    await page.getByRole('link', { name: 'Back' }).click();

    //dateupdate
    await paymentPlansSection.getByRole('searchbox', { name: 'Search:' }).fill('Day');
    const dateRow = page.locator('#paymentPlansTable tbody tr')
        .filter({ hasText: /Day \d+ of Month/ })
        .first();
    await expect(dateRow).toBeVisible();
    await dateRow.locator('td').first().click();
    await expect(page).toHaveURL(/transactions\/viewRecurringTransactionsDetails\/recordid/);
    await page.waitForLoadState('load');

    //updatesubscription
    await page.getByRole('button', { name: /Update Subscription/ }).click();
    await page.getByRole('textbox', { name: /\$ Amount/ }).fill(INVOICE.AMOUNT);
    await page.getByRole('textbox', { name: 'Next Run Date' }).click();
    await page.getByRole('cell', { name: /Today:/ }).click();
    await page.locator('div:nth-child(31) > .cbx > span > svg').click();
    await page.locator('label').filter({ hasText: 'Last Day' }).click();
    await page.getByRole('textbox', { name: /Repetitions/ }).fill(PAYMENT_PLAN.REPETITIONS);
    await page.getByRole('button', { name: /Update/ }).click();
    await expect(page.locator('.toast-alert')).toHaveClass(/bg-success/);
    await page.getByRole('link', { name: 'Back' }).click();
});