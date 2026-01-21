const CONFIG = {
  baseURL: 'https://rahulshettyacademy.com/loginpagePractise',
  headless: false,
  slowMo: 100,
  timeout: 30000,
  credentials: {
    validUsername: 'rahulshettyacademy',
    validPassword: 'learning'
  },
  screenshots: {
    enabled: true,
    path: './screenshots/'
  },
  testData: {
    excelPath: './testdata/login-testcases.xlsx',
    sheetName: 'TestCases'
  }
};

module.exports = CONFIG;