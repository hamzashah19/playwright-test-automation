const LoginPage = require('../pages/LoginPage');
const ShopPage = require('../pages/ShopPage');
const CONFIG = require('../utils/config');
const ExcelReader = require('../utils/excelReader');
const { 
  initializeBrowser, 
  closeBrowser, 
  takeScreenshot 
} = require('../utils/helpers');

async function runDataDrivenTest() {
  console.log('\n========================================');
  console.log('   DATA-DRIVEN TESTING WITH EXCEL');
  console.log('========================================\n');

  // Initialize Excel Reader
  const excelReader = new ExcelReader(CONFIG.testData.excelPath);
  
  // Read all test cases
  const testCases = excelReader.readTestData(CONFIG.testData.sheetName);
  
  // Filter only tests marked as "Yes" in Execute column
  const executableTests = testCases.filter(test => 
    test.Execute && test.Execute.toLowerCase() === 'yes'
  );

  console.log(`Found ${executableTests.length} test cases to execute\n`);

  const results = [];
  let passCount = 0;
  let failCount = 0;

  // Execute each test case
  for (const testCase of executableTests) {
    console.log(`\n--- Executing: ${testCase.TestID} - ${testCase.TestName} ---`);
    
    const result = await executeTestCase(testCase);
    results.push(result);
    
    if (result.status === 'PASS') {
      passCount++;
    } else {
      failCount++;
    }
  }

  // Print Summary Report
  console.log('\n========================================');
  console.log('           TEST SUMMARY REPORT');
  console.log('========================================');
  console.log(`Total Tests:  ${executableTests.length}`);
  console.log(`Passed:       ${passCount} ✅`);
  console.log(`Failed:       ${failCount} ❌`);
  console.log(`Pass Rate:    ${((passCount / executableTests.length) * 100).toFixed(2)}%`);
  console.log('========================================\n');

  // Detailed Results
  console.log('DETAILED RESULTS:');
  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.testId} - ${result.testName}: ${result.status}`);
    if (result.message) {
      console.log(`   → ${result.message}`);
    }
  });
}

async function executeTestCase(testCase) {
  const testId = testCase.TestID;
  const testName = testCase.TestName;
  const username = testCase.Username;
  const password = testCase.Password;
  const userType = testCase.UserType || 'user';
  const dropdown = testCase.Dropdown || 'consult';
  const expectedResult = testCase.ExpectedResult.toLowerCase();

  try {
    const { page } = await initializeBrowser();
    
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    
    // Navigate and login
    await loginPage.navigate(CONFIG.baseURL);
    await loginPage.login(username, password, userType, dropdown);
    
    await page.waitForTimeout(2000);
    
    // Verify result
    const isShopLoaded = await shopPage.isLoaded();
    const errorMessage = await loginPage.getErrorMessage();
    
    let status = 'FAIL';
    let message = '';
    
    if (expectedResult === 'success' && isShopLoaded) {
      status = 'PASS';
      message = 'Login successful as expected';
      await takeScreenshot(`${testId}_PASS`);
    } else if (expectedResult === 'error' && errorMessage) {
      status = 'PASS';
      message = `Error displayed as expected: ${errorMessage.trim()}`;
      await takeScreenshot(`${testId}_PASS`);
    } else if (expectedResult === 'success' && !isShopLoaded) {
      status = 'FAIL';
      message = errorMessage || 'Login failed unexpectedly';
      await takeScreenshot(`${testId}_FAIL`);
    } else if (expectedResult === 'error' && isShopLoaded) {
      status = 'FAIL';
      message = 'Login succeeded but error was expected';
      await takeScreenshot(`${testId}_FAIL`);
    }
    
    await closeBrowser();
    
    return { testId, testName, status, message };
    
  } catch (error) {
    await takeScreenshot(`${testId}_ERROR`);
    await closeBrowser();
    
    return { 
      testId, 
      testName, 
      status: 'FAIL', 
      message: `Exception: ${error.message}` 
    };
  }
}

// Run the data-driven tests
runDataDrivenTest();