const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { loginData } = require('../utils/testData');
const { only } = require('node:test');

test.describe('Login Feature', () => {

  test ('User should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(loginData.username, loginData.password);
    await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(loginData.expectedError);
    await expect(page).toHaveURL('/dashboard');
//   await expect(page.getByText('Dashboard')).toBeVisible();
  });

});