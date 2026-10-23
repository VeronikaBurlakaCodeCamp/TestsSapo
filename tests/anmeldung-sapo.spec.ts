/// <reference types="node" />

import { expect, test } from '@playwright/test';

test('Anmeldung SAPO', async ({ page }) => {
  const username = process.env.SAPO_USERNAME;
  const password = process.env.SAPO_PASSWORD;

  if (!username || !password) {
    throw new Error('Set SAPO_USERNAME and SAPO_PASSWORD before running this test.');
  }
  if (password.length < 2) {
    throw new Error('SAPO_PASSWORD contains only one character; enter the full password.');
  }

  await page.goto('/html/pageLoginWin.html');
  await page.getByRole('textbox', { name: 'Benutzername' }).fill(username);
  const passwordField = page.getByRole('textbox', { name: 'Windows-Kennwort' });
  await passwordField.fill(password);
  const enteredPasswordLength = await passwordField.evaluate(
    input => (input as HTMLInputElement).value.length,
  );
  if (enteredPasswordLength !== password.length) {
    throw new Error('The password field did not receive the complete password.');
  }
  await page.getByRole('button', { name: 'Absenden' }).click();

  const authenticationError = page.getByText(/Benutzerauthentifizierung fehlgeschlagen/i);
  if (await authenticationError.isVisible()) {
    throw new Error('SIT rejected the Windows credentials; verify the password is current.');
  }

  await expect(page.getByText(username, { exact: true })).toBeVisible();

  const [sapoPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: /AKAB Sachbearbeiterportal/i }).click(),
  ]);

  await sapoPage.waitForLoadState('domcontentloaded');
  await expect(sapoPage.locator('body')).toBeVisible();
  await expect(sapoPage).not.toHaveURL(/RequestLoginMenuServlet|pageLoginWin\.html/);
});