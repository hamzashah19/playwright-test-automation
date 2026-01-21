const LoginPage = require('../pages/LoginPage');
const ShopPage = require('../pages/ShopPage');
const CONFIG = require('../utils/config');
const { 
  initializeBrowser, 
  closeBrowser, 
  takeScreenshot, 
  saveAuthState 
} = require('../utils/helpers');

async function testValidLogin() {
  console.log('\n=== Test 1: Valid Login (User) ===');
  
  try {
    const { page } = await initializeBrowser();
    
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    
    await loginPage.navigate(CONFIG.baseURL);
    await loginPage.login(
      CONFIG.credentials.validUsername,
      CONFIG.credentials.validPassword,
      'user'
    );
    
    await page.waitForTimeout(2000);
    
    if (await shopPage.isLoaded()) {
      console.log('✅ Login successful!');
      const products = await shopPage.getProductNames();
      console.log(`Found ${products.length} products:`, products);
      await saveAuthState();
      await takeScreenshot('valid-login-success');
      return { success: true, message: 'Login successful' };
    } else {
      const error = await loginPage.getErrorMessage();
      console.log('❌ Login failed:', error);
      await takeScreenshot('valid-login-failed');
      return { success: false, message: error };
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await takeScreenshot('valid-login-error');
    return { success: false, message: error.message };
  } finally {
    await closeBrowser();
  }
}

async function testInvalidLogin() {
  console.log('\n=== Test 2: Invalid Login ===');
  
  try {
    const { page } = await initializeBrowser();
    
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate(CONFIG.baseURL);
    await loginPage.login('wronguser', 'wrongpass', 'user');
    
    await page.waitForTimeout(2000);
    
    const error = await loginPage.getErrorMessage();
    if (error) {
      console.log('✅ Error message displayed correctly:', error.trim());
      await takeScreenshot('invalid-login-error-shown');
      return { success: true, message: 'Error handled correctly' };
    } else {
      console.log('❌ No error message shown');
      await takeScreenshot('invalid-login-no-error');
      return { success: false, message: 'No error displayed' };
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await takeScreenshot('invalid-login-exception');
    return { success: false, message: error.message };
  } finally {
    await closeBrowser();
  }
}

async function testAdminLogin() {
  console.log('\n=== Test 3: Admin Login ===');
  
  try {
    const { page } = await initializeBrowser();
    
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    
    await loginPage.navigate(CONFIG.baseURL);
    await loginPage.login(
      CONFIG.credentials.validUsername,
      CONFIG.credentials.validPassword,
      'admin',
      'teach'
    );
    
    await page.waitForTimeout(2000);
    
    if (await shopPage.isLoaded()) {
      console.log('✅ Admin login successful!');
      const productCount = await shopPage.getProductCount();
      console.log(`Products available: ${productCount}`);
      await takeScreenshot('admin-login-success');
      return { success: true, message: 'Admin login successful' };
    } else {
      const error = await loginPage.getErrorMessage();
      console.log('❌ Admin login failed:', error);
      await takeScreenshot('admin-login-failed');
      return { success: false, message: error };
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await takeScreenshot('admin-login-error');
    return { success: false, message: error.message };
  } finally {
    await closeBrowser();
  }
}

async function runAllTests() {
  console.log('Starting Playwright Tests with POM...\n');
  
  const results = [];
  
  results.push(await testValidLogin());
  results.push(await testInvalidLogin());
  results.push(await testAdminLogin());
  
  console.log('\n=== Test Summary ===');
  results.forEach((result, index) => {
    console.log(`Test ${index + 1}: ${result.success ? '✅ PASSED' : '❌ FAILED'} - ${result.message}`);
  });
}

const args = process.argv.slice(2);
const testType = args[0];

if (testType === 'valid') {
  testValidLogin();
} else if (testType === 'invalid') {
  testInvalidLogin();
} else if (testType === 'admin') {
  testAdminLogin();
} else {
  runAllTests();
}

module.exports = { testValidLogin, testInvalidLogin, testAdminLogin };