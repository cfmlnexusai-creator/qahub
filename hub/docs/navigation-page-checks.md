# Patient Manager: Navigation & Page Checks

100 manual test definitions grounded in the source routes and views of `development_patientmanager`. Execution status: **Pending**; these cases have not been run against Patient Manager.

Use a synthetic-data company and a permitted account with the relevant menus/widgets enabled. Seed records for record-specific links. Do not literally enter placeholder identifiers. Do not save, charge, send, delete or publish business data while running these visibility checks.

## Login & Dashboard

### NAV-001: Open Login and check the email field

Target: Patient Manager. Route: /login. Source control/section: userName. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/main/index.cfm#L29`

1. Sign out or open a private browser in the Patient Manager test environment.
   Expected: No authenticated patient/company page is displayed.

2. Open the application Login link or /login in this signed-out browser.
   Expected: The Login form loads without 404, blank content or a server error.

3. Open the Login link in a signed-out browser.
   Expected: The Email field is visible, labelled and accepts focus; the page is not blank.

4. Refresh the Login page once without submitting credentials.
   Expected: The Login page and its input controls remain visible and usable.

### NAV-002: Open Login and check the password/passcode field

Target: Patient Manager. Route: /login. Source control/section: userPassword. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/main/index.cfm#L37`

1. Sign out or open a private browser in the Patient Manager test environment.
   Expected: No authenticated patient/company page is displayed.

2. Open the application Login link or /login in this signed-out browser.
   Expected: The Login form loads without 404, blank content or a server error.

3. Open Login and move from Email to the password/passcode field.
   Expected: The password/passcode input is visible, masks entered text and has a working visibility toggle.

4. Refresh the Login page once without submitting credentials.
   Expected: The Login page and its input controls remain visible and usable.

### NAV-003: Go to Dashboard and check Today's Appointments table

Target: Patient Manager. Route: /dashboard. Source control/section: todaysAppointmentTbl. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L81`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled Today's Appointments table.
   Expected: Time, Name, Type, Status and Provider columns are visible; records or the intended empty state are shown.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-004: Go to Dashboard and check office and provider filters

Target: Patient Manager. Route: /dashboard. Source control/section: officeSelectVal. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L61`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled office and provider filters.
   Expected: All Offices and Any Provider controls are visible when the account configuration enables them.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-005: Go to Dashboard and check appointment calendar

Target: Patient Manager. Route: /dashboard. Source control/section: appointmentCalendarDashboard. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L133`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled appointment calendar.
   Expected: The configured appointment calendar widget is visible and finishes loading.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-006: Go to Dashboard and check appointment charges section

Target: Patient Manager. Route: /dashboard. Source control/section: appointmentChargesDashboardTbl. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L273`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled appointment charges section.
   Expected: The appointment charges table and its headers are visible for the enabled widget.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-007: Go to Dashboard and check reviews section

Target: Patient Manager. Route: /dashboard. Source control/section: reviewDashboardTbl. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L362`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled reviews section.
   Expected: The review table and rating/office/provider filters are visible when reviews are enabled.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-008: Go to Dashboard and check Provider Call List

Target: Patient Manager. Route: /dashboard. Source control/section: providerCallList. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L914`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled Provider Call List.
   Expected: The enabled Provider Call List renders its table or intended empty state.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-009: Go to Dashboard and check Tasks section

Target: Patient Manager. Route: /dashboard. Source control/section: workflowsTasksTbl. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L977`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled Tasks section.
   Expected: The Tasks table is visible and each synthetic task link opens the corresponding patient task page.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-010: Go to Dashboard and check Referrals section

Target: Patient Manager. Route: /dashboard. Source control/section: referralsTbl. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/dashboard/index.cfm#L1044`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /dashboard; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Dashboard in the sidebar and locate the enabled Referrals section.
   Expected: The Referrals table is visible and an existing synthetic referral link opens its submission details.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Patient Search & Summary

### NAV-011: Open Charts and check MRN search

Target: Patient Manager. Route: /charts. Source control/section: mrn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/index.cfm#L7`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /charts; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Charts and inspect the search area.
   Expected: The MRN field, search action and patient result area are visible.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-012: Open Charts and follow a patient result

Target: Patient Manager. Route: /charts. Source control/section: patientsList. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/index.cfm#L26`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /charts; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Search for the seeded synthetic patient and click its result link.
   Expected: The correct patient dashboard opens; patient identity and the patient navigation are visible.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-013: Open Patient Dashboard and check Allergies

Target: Patient Manager. Route: /patients/dashboard/account_identifier/{patientId}. Source control/section: allergyTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDashboard.cfm#L13`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/dashboard/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the synthetic patient from Charts and inspect Allergies.
   Expected: Allergies and Allergy Additional Notes render for the selected synthetic patient.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-014: Open Patient Dashboard and check Medications

Target: Patient Manager. Route: /patients/dashboard/account_identifier/{patientId}. Source control/section: medicationsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDashboard.cfm#L64`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/dashboard/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the synthetic patient from Charts and inspect Medications.
   Expected: Medications and Medications Additional Notes render without switching patient context.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-015: Open Patient Dashboard and check Health History

Target: Patient Manager. Route: /patients/dashboard/account_identifier/{patientId}. Source control/section: healthHistoryTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDashboard.cfm#L113`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/dashboard/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the synthetic patient from Charts and inspect Health History.
   Expected: Health History and its notes section are visible or show the designed empty/suppressed state.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-016: Open Patient Dashboard and check Recent Invoices

Target: Patient Manager. Route: /patients/dashboard/account_identifier/{patientId}. Source control/section: recentInvoices. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDashboard.cfm#L209`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/dashboard/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the synthetic patient from Charts and inspect Recent Invoices.
   Expected: Recent Invoices is visible; opening an existing synthetic invoice reaches that invoice detail page.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-017: Open Demographics and check Patient Info tab

Target: Patient Manager. Route: /patients/demographics/account_identifier/{patientId}. Source control/section: nav-patientInfo-tab. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDemographics.cfm#L46`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/demographics/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Demographics in the selected patient navigation.
   Expected: The Patient Info tab is active and patient information fields are visible.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-018: Open Demographics and switch to Emergency Contact

Target: Patient Manager. Route: /patients/demographics/account_identifier/{patientId}. Source control/section: nav-emergencyContact-tab. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientDemographics.cfm#L48`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/demographics/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Demographics and select the Emergency Contact tab.
   Expected: The Emergency Contact panel opens, and switching back to Patient Info works without losing patient context.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-019: Open Insurance and check Add Policy entry

Target: Patient Manager. Route: /patients/insurance/account_identifier/{patientId}. Source control/section: addPolicysubmit. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientInsurance.cfm#L12`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/insurance/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Insurance and then Add Policy; close the form without saving.
   Expected: The policy form opens with Plan Type and Insurance Company fields and can be closed safely.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-020: Open Insurance and check policy form sections

Target: Patient Manager. Route: /patients/insurance/account_identifier/{patientId}. Source control/section: insurancePlanTypes. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientInsurance.cfm#L67`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/insurance/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Add Policy for the synthetic patient without submitting.
   Expected: Plan Type, Medical Insurance Type, insured-party and plan fields are visible with readable labels.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Clinical & Patient Pages

### NAV-021: Open Eligibility Lookup and check its main sections

Target: Patient Manager. Route: /patients/eligibility/account_identifier/{patientId}. Source control/section: eligibilityLookup. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientEligibility.cfm#L70`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/eligibility/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Eligibility from the synthetic patient navigation.
   Expected: Eligibility Lookup, payer selection and provider selection render; do not submit a paid lookup.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-022: Open patient SMS inbox and check its main sections

Target: Patient Manager. Route: /patients/smsInbox/account_identifier/{patientId}. Source control/section: messages. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientSmsInbox.cfm#L4`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/smsInbox/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the patient SMS Inbox tab.
   Expected: The Messages thread area is visible; the composer or a clear availability notice is displayed.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-023: Open patient Forms and check its main sections

Target: Patient Manager. Route: /patients/form/account_identifier/{patientId}. Source control/section: documentListTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientForm.cfm#L15`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/form/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Forms for the synthetic patient.
   Expected: The Forms table, Send A Form entry and completed-form area render without sending a form.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-024: Open Treatment Plans and check its main sections

Target: Patient Manager. Route: /patients/treatmentPlans/account_identifier/{patientId}. Source control/section: addtreatment. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientTreatmentPlan.cfm#L12`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/treatmentPlans/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Treatment Plans and click Add Treatment Plan; cancel.
   Expected: The treatment-plan form opens with Template, Provider, Title and date fields, then closes without saving.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-025: Open Clinical Notes and check its main sections

Target: Patient Manager. Route: /patients/clinicalNotes/account_identifier/{patientId}. Source control/section: addClinicalNotes. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientClinicalNotes.cfm#L2`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/clinicalNotes/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Clinical Notes and its Add Clinical Note entry; cancel.
   Expected: The notes list and add-note form render; cancelling returns to the list.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-026: Open Material Log and check its main sections

Target: Patient Manager. Route: /patients/materialLog/account_identifier/{patientId}. Source control/section: addmaterialLog. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientMaterialLog.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/materialLog/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Material Log and its Add Material entry; close it.
   Expected: The material log page and Add Material control render without creating a material entry.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-027: Open patient Tasks and check its main sections

Target: Patient Manager. Route: /patients/tasks/account_identifier/{patientId}. Source control/section: createTaskForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientWorkflow.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/tasks/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Tasks and click Add Task; cancel.
   Expected: The task form shows Title, Description, Due Date and assignment controls; Cancel closes it.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-028: Open patient Ledger and check its main sections

Target: Patient Manager. Route: /patients/patientLedger/account_identifier/{patientId}. Source control/section: addPayments. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientLedger.cfm#L36`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/patientLedger/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Ledger from the synthetic patient menu.
   Expected: Aging balances and Add Charges, Add Payments, Add Adjustments and Issue Refund entries are visible when permitted; do not post a transaction.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-029: Open patient Images and check its main sections

Target: Patient Manager. Route: /patients/images/account_identifier/{patientId}. Source control/section: imagesListSection. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/imagesList.cfm#L23`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/images/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Images and click Upload Images; close without uploading.
   Expected: The image list and upload panel render with file controls, and closing returns to the list.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-030: Open patient Claims and check its main sections

Target: Patient Manager. Route: /patients/patientClaims/account_identifier/{patientId}. Source control/section: addClaimAttachment. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patients/patientClaims.cfm#L26`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patients/patientClaims/account_identifier/{patientId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Claims for a synthetic patient with a seeded claim and open its attachment section.
   Expected: Claim Details and attachment/document sections are visible; no claim is submitted.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Appointments

### NAV-031: Open Schedule View and check patient search

Target: Patient Manager. Route: /appointment/ScheduleView. Source control/section: searchAppointment. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/index.cfm#L24`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/ScheduleView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Schedule View from the Appointments menu.
   Expected: Search Patients is visible and accepts focus.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-032: Open Schedule View and check view controls

Target: Patient Manager. Route: /appointment/ScheduleView. Source control/section: appointmentView. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/index.cfm#L33`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/ScheduleView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Schedule View and inspect View Type and Calendar View Duration.
   Expected: View controls are visible; switching a permitted view renders the schedule without a broken page.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-033: Open Schedule View and check calendar view

Target: Patient Manager. Route: /appointment/ScheduleView. Source control/section: appointmentCalenderView. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/index.cfm#L48`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/ScheduleView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Schedule View and select its calendar presentation.
   Expected: The calendar area renders and the selected view is reflected in the control.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-034: Open Schedule View and check daily availability link

Target: Patient Manager. Route: /appointment/ScheduleView. Source control/section: dailyAvailabilityBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/index.cfm#L59`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/ScheduleView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Edit Daily Availability for a permitted provider; return without saving.
   Expected: The availability UI opens and can be closed/backed out of without creating an appointment.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-035: Open Waitlist and check office/provider filters

Target: Patient Manager. Route: /appointment/waitlist. Source control/section: waitlistLocationFilter. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/waitList.cfm#L27`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/waitlist; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Waitlist from Appointments.
   Expected: Office and provider filters are visible and populated according to the test account permissions.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-036: Open Waitlist and follow a patient link

Target: Patient Manager. Route: /appointment/waitlist. Source control/section: waitListTableList. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientAppointment/waitList.cfm#L48`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/waitlist; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Waitlist, then click an existing synthetic patient entry.
   Expected: Patient, Office, Providers and appointment columns render; the link opens the matching patient/schedule context.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-037: Open Upcoming Appointments and check timeframe

Target: Patient Manager. Route: /appointment/upcoming. Source control/section: timeframeSelect. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/upcomingAppointments/index.cfm#L14`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/upcoming; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Upcoming Appointments and inspect Show upcoming appointments.
   Expected: The timeframe selector and office/provider filters render without an endless loading overlay.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-038: Open Upcoming Appointments and check table sections

Target: Patient Manager. Route: /appointment/upcoming. Source control/section: upcomingAppointmentsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/upcomingAppointments/index.cfm#L52`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/upcoming; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Upcoming Appointments and inspect an existing synthetic row.
   Expected: Appointment Date, Patient, Office, Provider, Registration, Insurance and Confirmation columns render; a patient link opens the correct record.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-039: Open Appointment Requests and check list

Target: Patient Manager. Route: /appointment/requests. Source control/section: appointmentRequestDetails. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/appointmentRequest/index.cfm#L19`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/requests; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Appointment Requests in the sidebar.
   Expected: Submitted, Status, Patient and Requested Office columns render with data or an intended empty state.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-040: Open an Appointment Request detail link

Target: Patient Manager. Route: /appointment/requests. Source control/section: Link Patient. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/appointmentRequest/index.cfm#L84`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointment/requests; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click a seeded synthetic request detail link; return to the request list without linking a patient.
   Expected: The request detail page opens for the chosen request and returning to the list works; no request is changed.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Invoices

### NAV-041: Check Paid Invoices table

Target: Patient Manager. Route: /invoices. Source control/section: recentPaidTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/index.cfm#L36`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Invoices from the sidebar.
   Expected: Paid invoice columns including Patient, XID, Amount Invoiced and Amount Paid render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-042: Check historical invoice search

Target: Patient Manager. Route: /invoices. Source control/section: searchHistoricalBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/index.cfm#L13`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Search Historical Invoices; close the search UI without changing records.
   Expected: The historical-search controls open and the invoice list remains reachable.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-043: Check Create Invoice page

Target: Patient Manager. Route: /invoices/invoiceCreation. Source control/section: invoiceCreate. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/invoiceCreation.cfm#L35`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/invoiceCreation; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. From a synthetic patient billing page click Create Invoice; do not submit.
   Expected: The Create Invoice form opens with patient contact, office and appointment fields.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-044: Check invoice amount and due-date controls

Target: Patient Manager. Route: /invoices/invoiceCreation. Source control/section: due_date. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/invoiceCreation.cfm#L108`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/invoiceCreation; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Create Invoice for the synthetic patient and inspect Amount and Due Date.
   Expected: Amount, Due Date, Description and invoice-type controls are visible and labelled; Cancel/Back returns without creating an invoice.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-045: Check Outstanding Invoices table

Target: Patient Manager. Route: /invoices/outstandingInvoices. Source control/section: outstandingTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/outstandingInvoices.cfm#L45`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/outstandingInvoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Outstanding Invoices in the invoice navigation.
   Expected: Office, Patient, Amount, Date Created, Aging and last-contact columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-046: Check Outstanding Invoices menu

Target: Patient Manager. Route: /invoices/outstandingInvoices. Source control/section: outstandingInvoiceFunction. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/outstandingInvoices.cfm#L133`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/outstandingInvoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the Outstanding Invoices Menu for a seeded record, then dismiss it without selecting a write action.
   Expected: Available menu actions are visible and dismiss cleanly; no reminder is sent and no invoice is changed.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-047: Check Adjusted Invoices page

Target: Patient Manager. Route: /invoices/adjustedInvoices. Source control/section: adjustedInvoiceTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/adjustedInvoices.cfm#L14`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/adjustedInvoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Adjusted Invoices.
   Expected: Patient, Current Amount, Previous Amount, Date Adjusted, Adjusted By and Notes columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-048: Check Deleted Invoices page

Target: Patient Manager. Route: /invoices/deletedInvoices. Source control/section: deleteInvoiceTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/deletedInvoices.cfm#L15`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/deletedInvoices; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Deleted Invoices.
   Expected: Patient, Amount, Date Created, Date Deleted and Deleted By columns render; no restore/delete action is executed.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-049: Check Invoice Details page

Target: Patient Manager. Route: /invoices/invoiceDetail?recordid={invoiceId}. Source control/section: printContent. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/invoiceDetail.cfm#L53`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/invoiceDetail?recordid={invoiceId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click the amount link for an existing synthetic invoice in the invoice list.
   Expected: The chosen invoice detail loads with its amount, contact and office information; refresh preserves the same invoice context.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-050: Check Invoice Details office-edit entry

Target: Patient Manager. Route: /invoices/invoiceDetail?recordid={invoiceId}. Source control/section: updateMerchantBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/invoices/invoiceDetail.cfm#L74`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /invoices/invoiceDetail?recordid={invoiceId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open invoice details, click Update office and cancel.
   Expected: The office-edit controls open, Save and Cancel are visible, and Cancel leaves the invoice unchanged.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Transactions

### NAV-051: Check All Transactions list

Target: Patient Manager. Route: /transactions/allTransactions. Source control/section: all_transactions_table. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/allTransactions.cfm#L36`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/allTransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open All Transactions from the sidebar.
   Expected: Office, Date, Patient, Amount, XID, Status and payment-type columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-052: Check historical transaction search

Target: Patient Manager. Route: /transactions/allTransactions. Source control/section: searchHistoricalBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/allTransactions.cfm#L12`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/allTransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Search Historical Transactions and dismiss it.
   Expected: The search UI opens and returns to the transaction list without changing a transaction.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-053: Check Quick Transaction form

Target: Patient Manager. Route: /transactions/quick_transactions. Source control/section: paymentForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/quick_transactions.cfm#L24`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/quick_transactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Quick Transaction from synthetic patient Billing; do not submit payment.
   Expected: Office, Provider, contact, Amount and payment-method sections render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-054: Check Quick Transaction payment source

Target: Patient Manager. Route: /transactions/quick_transactions. Source control/section: billingPaymentSource. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/quick_transactions.cfm#L69`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/quick_transactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Inspect Billing Payment Source and saved/new-card choices on Quick Transaction.
   Expected: Permitted payment-source options render; choosing a display option reveals the matching fields without charging a card.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-055: Check Recurring Transactions list

Target: Patient Manager. Route: /transactions/recurringTransactions. Source control/section: recurringTransactionsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/recurringTransactions.cfm#L36`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/recurringTransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Recurring Transactions.
   Expected: Office, Patient, Transaction Amount, Active, Start Date, Next Run Date and Frequency columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-056: Check recurring transaction historical search

Target: Patient Manager. Route: /transactions/recurringTransactions. Source control/section: searchHistoricalBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/recurringTransactions.cfm#L11`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/recurringTransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Search Historical Recurring Transactions and close it.
   Expected: Historical search controls render and the recurring transaction list remains reachable.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-057: Check Failed Transactions list

Target: Patient Manager. Route: /transactions/failedtransactions. Source control/section: failed_transactions_table. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/failedtransactions.cfm#L34`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/failedtransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Failed Transactions.
   Expected: Office, Date, Parent XID, Status, Patient, Amount and Error Message columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-058: Check failed transaction historical search

Target: Patient Manager. Route: /transactions/failedtransactions. Source control/section: searchHistoricalBtn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/failedtransactions.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/failedtransactions; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Search Historical Failed Transactions and dismiss it.
   Expected: The historical-search UI renders and closes without resubmitting a payment.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-059: Check Transaction Details page

Target: Patient Manager. Route: /transactions/transactionDetails?recordid={transactionId}. Source control/section: printContent. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/transactionDetails.cfm#L25`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/transactionDetails?recordid={transactionId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Follow an existing synthetic transaction detail link from All Transactions.
   Expected: XID, Office, Transaction Amount, Card Type, last four digits and transaction dates render for the selected record.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-060: Check Transaction Details action links

Target: Patient Manager. Route: /transactions/transactionDetails?recordid={transactionId}. Source control/section: refund-btn. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/transactions/transactionDetails.cfm#L271`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /transactions/transactionDetails?recordid={transactionId}; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open a suitable seeded successful transaction and inspect its available actions.
   Expected: Permitted Refund, Void or Recurring entries are visible for that record status; do not execute a financial action.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Forms, Referrals & Messages

### NAV-061: Check Forms list

Target: Patient Manager. Route: /Forms.listForms. Source control/section: documentListTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/Forms/listForms.cfm#L17`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /Forms.listForms; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Forms from configuration navigation.
   Expected: Active, Company, Forms, Document Type, Date Created and Date Modified columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-062: Check Add Form link

Target: Patient Manager. Route: /Forms.listForms. Source control/section: Add Form. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/Forms/listForms.cfm#L12`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /Forms.listForms; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add Form, inspect the destination and return without saving.
   Expected: The form-builder page opens and returning to the Forms list works without creating a document.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-063: Check Completed Forms table

Target: Patient Manager. Route: /Forms.completedForm. Source control/section: completedFormTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/Forms/completedForm.cfm#L44`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /Forms.completedForm; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Completed Forms.
   Expected: Form, Patient, Appointment Date, Provider and Date Completed columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-064: Check Completed Forms filters

Target: Patient Manager. Route: /Forms.completedForm. Source control/section: providerFilter. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/Forms/completedForm.cfm#L24`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /Forms.completedForm; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Inspect provider/location filtering and Search Countersign Forms.
   Expected: The permitted filters and countersign search entry are visible; no form is countersigned.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-065: Check Referral Practices list

Target: Patient Manager. Route: /referral. Source control/section: referral_Practice. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/referral/index.cfm#L100`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /referral; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open referral practices from the sidebar.
   Expected: Practice, Offices, Referrals, Date Added, Active and Action columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-066: Check Add Practice form link

Target: Patient Manager. Route: /referral. Source control/section: addPractice. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/referral/index.cfm#L48`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /referral; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add Practice, inspect its form and close it.
   Expected: Practice name, office/address and contact fields render; closing creates no practice.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-067: Check Referral tabs

Target: Patient Manager. Route: /patientReferrals. Source control/section: referralTabs. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/referralForm/list.cfm#L7`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patientReferrals; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Patient Referrals and switch among Active Referrals, Contacted & Scheduled and Archived Referrals.
   Expected: Each tab shows its own list/filter area without losing the referral page.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-068: Check Referral submission link

Target: Patient Manager. Route: /patientReferrals. Source control/section: referralDetails. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/referralForm/list.cfm#L62`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patientReferrals; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Follow an existing synthetic referral submission link, then return.
   Expected: The chosen submission detail opens and the referral list can be reached again without archiving/linking the record.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-069: Check patient message composer

Target: Patient Manager. Route: /patientMessagesView. Source control/section: message-input. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientMessages/index.cfm#L130`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patientMessagesView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the message page through an existing synthetic patient conversation link.
   Expected: Patient context, message history, composer, character counter and Send control render; no message is sent.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-070: Check message Back to Previous Page link

Target: Patient Manager. Route: /patientMessagesView. Source control/section: Back to Previous Page. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/patientMessages/index.cfm#L18`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patientMessagesView; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Enter a synthetic conversation from its originating page, then click Back to Previous Page.
   Expected: The previous patient/list page opens with the correct context instead of a blank page or broken URL.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Practice & User Setup

### NAV-071: Check Practice Settings tabs

Target: Patient Manager. Route: /practiceSetup/practiceSettings. Source control/section: nav-loginSecurity-tab. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/practiceSettings.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/practiceSettings; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Practice Settings and inspect its General, Insurance, EMR, Login Security and Communication tabs.
   Expected: Configured tabs are visible and changing tabs reveals the corresponding settings panel without saving.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-072: Check Practice NPI and Tax ID section

Target: Patient Manager. Route: /practiceSetup/practiceSettings. Source control/section: practiceNPI. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/practiceSettings.cfm#L35`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/practiceSettings; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Practice Settings and inspect the practice-identification section.
   Expected: Practice NPI and Practice Tax ID controls are visible with the current test-company context.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-073: Check Fee Schedule list

Target: Patient Manager. Route: /practiceSetup/createFeeSchedule. Source control/section: feeScheduleList. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/createFeeSchedule.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/createFeeSchedule; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Fee Schedules from Practice Setup.
   Expected: Name, Status, Year, Date Active and action columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-074: Check Create Fee Schedule dialog

Target: Patient Manager. Route: /practiceSetup/createFeeSchedule. Source control/section: createFeeSchedule. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/createFeeSchedule.cfm#L5`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/createFeeSchedule; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Create Fee Schedule and then Cancel.
   Expected: Name, Year, Date Begin and Date End fields render; cancelling creates no fee schedule.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-075: Check Departments list

Target: Patient Manager. Route: /practiceSetup/departments. Source control/section: departmentsList. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/departments.cfm#L16`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/departments; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Departments from Practice Setup.
   Expected: Active, Departments and Date Created columns render with the Add Department entry.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-076: Check Add Department dialog

Target: Patient Manager. Route: /practiceSetup/departments. Source control/section: addDepartments. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/departments.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/departments; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add Department, inspect Department Name, then Cancel.
   Expected: The dialog opens and closes cleanly without adding a department.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-077: Check Users list

Target: Patient Manager. Route: /settings/listUsers. Source control/section: merchant-table. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/settings/listUsers.cfm#L14`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /settings/listUsers; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. As a permitted admin, open Users.
   Expected: User Name, Email, Mobile, 2FA, Account Status and Date Last Login columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-078: Check Add New User link

Target: Patient Manager. Route: /settings/listUsers. Source control/section: Add New User. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/settings/listUsers.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /settings/listUsers; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add New User, inspect the destination and return without submitting.
   Expected: The new-user editor opens with identity/security/account fields; returning to Users creates no account.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-079: Check User Settings general panel

Target: Patient Manager. Route: /userSettings. Source control/section: usereditform. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/settings/userSettings.cfm#L20`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /userSettings; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open the signed-in user account settings.
   Expected: First Name, Last Name, Email, Mobile Phone and Two Factor Authentication controls render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-080: Check User Settings preference tabs

Target: Patient Manager. Route: /userSettings. Source control/section: nav-location-tab. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/settings/userSettings.cfm#L17`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /userSettings; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Switch to Provider Preferences and Custom View, then return to General without saving.
   Expected: Each settings tab opens its matching panel and the General tab remains reachable.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Reports

### NAV-081: Open Production/Collection report and check its filters

Target: Patient Manager. Route: /productionCollectionReports. Source control/section: productionReportForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/productionCollectionReports.cfm#L12`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /productionCollectionReports; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: View By, Office, Provider and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-082: Open Adjustments report and check its filters

Target: Patient Manager. Route: /adjustmentReports. Source control/section: adjustmentReportsForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/adjustmentReports.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /adjustmentReports; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: View By, Office, Provider and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-083: Open Accounts Receivable report and check its filters

Target: Patient Manager. Route: /arReports. Source control/section: arReportForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/arReports.cfm#L25`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /arReports; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Aging buckets 0-30 through 121+, Total, View By, Office and Provider controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-084: Open Payments report and check its filters

Target: Patient Manager. Route: /paymentReports. Source control/section: paymentreportform. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/paymentreports.cfm#L6`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /paymentReports; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: The report date-range controls and Run Report entry render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-085: Open Materials Search report and check its filters

Target: Patient Manager. Route: /materialsSearch. Source control/section: materialsScheduleReportForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/materialsSearch.cfm#L11`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /materialsSearch; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Category, Materials, Lot, Serial Number and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-086: Open Materials Usage report and check its filters

Target: Patient Manager. Route: /materialsUsageReport. Source control/section: materialsUsageReportForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/materialsUsageReport.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /materialsUsageReport; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Category, Materials, Provider and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-087: Open Appointment Charges report and check its filters

Target: Patient Manager. Route: /appointmentChargesReport. Source control/section: appointmentChargesReportForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/appointmentChargesReport.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /appointmentChargesReport; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Procedure Code, date-range and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-088: Open Patients Registered report and check its filters

Target: Patient Manager. Route: /patientsRegistered. Source control/section: patientsRegisteredForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/patientsRegistered.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /patientsRegistered; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Date-range selection and Run Report are visible; the results section becomes reachable after a permitted read-only report run. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-089: Open Account Status report and check its filters

Target: Patient Manager. Route: /accountStatusReport. Source control/section: accountStatusForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/accountStatusReport.cfm#L9`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /accountStatusReport; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Account Status selection and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-090: Open Claim Summary by Carrier report and check its filters

Target: Patient Manager. Route: /claimSummaryByCarrier. Source control/section: claimSummaryForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceReports/claimSummaryByCarrier.cfm#L10`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /claimSummaryByCarrier; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open this report from the Reports navigation using an account permitted to view it.
   Expected: Payer, Claim Category, Type and Run Report controls render. The report opens at the correct route, not a 404 or server error.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

## Subscription Billing, Configuration & Help

### NAV-091: Check Your Bills list

Target: Patient Manager. Route: /customerBilling/bills. Source control/section: customerBillsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/bills.cfm#L52`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/bills; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Customer Billing > Bills.
   Expected: Your bills, Status, Year, Month, Usage, Amount Due and Billed on sections render; use the intended empty state if no bills exist.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-092: Check Bills filters and detail link

Target: Patient Manager. Route: /customerBilling/bills. Source control/section: billsStatusFilter. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/bills.cfm#L31`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/bills; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Inspect Status/Year filters; if a seeded bill exists, click View and return.
   Expected: Filters render and an existing bill opens its matching detail page without paying the bill.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-093: Check Your Payments summary

Target: Patient Manager. Route: /customerBilling/payments. Source control/section: outstandingBalanceCard. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/payments.cfm#L11`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/payments; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Customer Billing > Payments.
   Expected: Summary of balances and the outstanding-balance area are visible.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-094: Check Your Payments list

Target: Patient Manager. Route: /customerBilling/payments. Source control/section: customerPaymentsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/payments.cfm#L47`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/payments; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Inspect the payments list and Bill period/Status filters.
   Expected: The payment table/cards show Date, Status, Card and Amount with working display filters.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-095: Check Payment Methods list

Target: Patient Manager. Route: /customerBilling/paymentMethods. Source control/section: customerPaymentMethodsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/paymentMethods.cfm#L18`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/paymentMethods; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Customer Billing > Payment Methods.
   Expected: Cards On File and Default, Type, Last Four, Expiration and Added columns render.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-096: Check Add Payment Method link

Target: Patient Manager. Route: /customerBilling/addEditPaymentMethod. Source control/section: paymentForm. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/CustomerBilling/addEditPaymentMethod.cfm#L21`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /customerBilling/addEditPaymentMethod; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add Payment Method and inspect the page; return without submitting.
   Expected: Contact, billing address and card-entry controls render; no card is saved or charged.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-097: Check Notifications list

Target: Patient Manager. Route: /notifications. Source control/section: notificationsTable. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/notifications/index.cfm#L13`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /notifications; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Notifications.
   Expected: Date Created, Name, Description, Start, End and Recurring columns render with permitted controls.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-098: Check Add Notification form

Target: Patient Manager. Route: /notifications. Source control/section: addNotification. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/notifications/index.cfm#L8`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /notifications; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Click Add Notification, inspect the form and Cancel.
   Expected: Name, Description, Content and start/end controls render; cancelling publishes no notification.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-099: Check Insurance Types configuration

Target: Patient Manager. Route: /practiceSetup/Types. Source control/section: Insurance Health Types:. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/practiceSetup/insuranceTypes.cfm#L11`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /practiceSetup/Types; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Insurance Types in Practice Setup.
   Expected: Insurance Health Types and Insurance Types sections render with their active/name settings.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.

### NAV-100: Check Help Center search and categories

Target: Patient Manager. Route: /helpCenter. Source control/section: searchBox. This is a manual navigation/visibility definition, not a recorded pass result.

Source: `development_patientmanager/views/helpCenter/help_center.cfm#L8`

1. Sign in to the Patient Manager test environment and select the test company with the required page access.
   Expected: The authenticated application shell and permitted navigation are visible.

2. Follow the relevant sidebar, patient-menu or record link to /helpCenter; use the seeded record where identifiers are required.
   Expected: The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.

3. Open Help Center, enter a documented help-topic keyword and select a category/topic.
   Expected: The search field, CATEGORIES and TOPICS areas render; selecting a listed topic opens its content without a broken link.

4. Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.
   Expected: The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.
