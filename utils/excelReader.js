const XLSX = require('xlsx');
const path = require('path');

class ExcelReader {
  constructor(filePath) {
    this.filePath = filePath;
  }

  readTestData(sheetName = 'TestCases') {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(this.filePath);
      
      // Get the specified sheet
      const sheet = workbook.Sheets[sheetName];
      
      if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found in Excel file`);
      }
      
      // Convert sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet);
      
      console.log(`✅ Loaded ${data.length} test cases from ${sheetName}`);
      return data;
    } catch (error) {
      console.error('❌ Error reading Excel file:', error.message);
      throw error;
    }
  }

  getTestCaseById(testId, sheetName = 'TestCases') {
    const data = this.readTestData(sheetName);
    return data.find(row => row.TestID === testId);
  }

  getTestCasesByStatus(status, sheetName = 'TestCases') {
    const data = this.readTestData(sheetName);
    return data.filter(row => 
      row.Execute && row.Execute.toLowerCase() === status.toLowerCase()
    );
  }
}

module.exports = ExcelReader;