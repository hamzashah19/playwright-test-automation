// @ts-check
//import { test, expect } from '@playwright/test';
const{test, expect} = require('@playwright/test');

test('has title', async ({ page }) => {
  // @ts-ignore
  await page.goto(process.env.URL);
   console.log(await page.title());
   await expect(page).toHaveTitle("OrangeHRM");
   await page.locator('[name="username"]').type("username");
   await page.locator('[name="password"]').fill("password");
   await page.locator('button:visible').click();
   console.log (await page.locator(':text-is("Invalid credentials")').textContent());
   await expect(page.locator(':text-is("Invalid credentials")')).toContainText('Test');
   
});







