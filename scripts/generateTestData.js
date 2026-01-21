const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create testdata directory if it doesn't exist
const testdataDir = path.join(__dirname, '..', 'testdata');
if (!fs.existsSync(testdataDir)) {
  fs.mkdirSync(testdataDir, { recursive: true });
}

// Define test data
const testCases = [
  {
    TestID: 'TC_001',
    TestName: 'Valid User Login',
    Username: 'rahulshettyacademy',
    Password: 'learning',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'success',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_002',
    TestName: 'Valid Admin Login',
    Username: 'rahulshettyacademy',
    Password: 'learning',
    UserType: 'admin',
    Dropdown: 'teach',
    ExpectedResult: 'success',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_003',
    TestName: 'Invalid Username',
    Username: 'wronguser',
    Password: 'learning',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_004',
    TestName: 'Invalid Password',
    Username: 'rahulshettyacademy',
    Password: 'wrongpass',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_005',
    TestName: 'Empty Username',
    Username: '',
    Password: 'learning',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_006',
    TestName: 'Empty Password',
    Username: 'rahulshettyacademy',
    Password: '',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'Yes'
  },
  {
    TestID: 'TC_007',
    TestName: 'Both Credentials Empty',
    Username: '',
    Password: '',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'No'
  },
  {
    TestID: 'TC_008',
    TestName: 'Special Characters in Username',
    Username: 'test@123',
    Password: 'learning',
    UserType: 'user',
    Dropdown: 'consult',
    ExpectedResult: 'error',
    Execute: 'Yes'
  }
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert test cases to worksheet
const worksheet = XLSX.utils.json_to_sheet(testCases);

// Set column widths
worksheet['!cols'] = [
  { wch: 10 },  // TestID
  { wch: 30 },  // TestName
  { wch: 25 },  // Username
  { wch: 15 },  // Password
  { wch: 10 },  // UserType
  { wch: 12 },  // Dropdown
  { wch: 15 },  // ExpectedResult
  { wch: 8 }    // Execute
];

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCases');

// Define output path
const outputPath = path.join(testdataDir, 'login-testcases.xlsx');

// Write the Excel file
XLSX.writeFile(workbook, outputPath);

console.log('✅ Excel file generated successfully!');
console.log(`📁 Location: ${outputPath}`);
console.log(`📊 Total test cases: ${testCases.length}`);