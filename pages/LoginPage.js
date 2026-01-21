class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.userRadio = 'input[value="user"]';
    this.adminRadio = 'input[value="admin"]';
    this.okayButton = '#okayBtn';
    this.dropdownSelect = 'select.form-control';
    this.termsCheckbox = '#terms';
    this.signInButton = '#signInBtn';
    this.errorAlert = '.alert-danger';
  }

  async navigate(url) {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    // Wait for the form to be fully loaded
    await this.page.waitForSelector(this.usernameInput, { state: 'visible', timeout: 10000 });
    await this.page.waitForSelector(this.passwordInput, { state: 'visible', timeout: 10000 });
  }

  async enterUsername(username) {
    // Wait for field to be ready, then clear and fill
    await this.page.waitForSelector(this.usernameInput, { state: 'visible' });
    await this.page.click(this.usernameInput); // Click to focus
    await this.page.fill(this.usernameInput, ''); // Clear first
    await this.page.fill(this.usernameInput, username);
    console.log(`   ✓ Entered username: ${username}`);
  }

  async enterPassword(password) {
    await this.page.waitForSelector(this.passwordInput, { state: 'visible' });
    await this.page.click(this.passwordInput); // Click to focus
    await this.page.fill(this.passwordInput, ''); // Clear first
    await this.page.fill(this.passwordInput, password);
    console.log(`   ✓ Entered password: ${'*'.repeat(password.length)}`);
  }

  async selectUserType(type) {
    if (type.toLowerCase() === 'admin') {
      await this.page.waitForSelector(this.adminRadio, { state: 'visible' });
      await this.page.click(this.adminRadio);
      console.log('   ✓ Selected Admin user type');
    } else {
      await this.page.waitForSelector(this.userRadio, { state: 'visible' });
      await this.page.click(this.userRadio);
      console.log('   ✓ Selected User type');
      
      // Handle modal
      await this.page.waitForTimeout(1000); // Wait for modal
      try {
        const modalVisible = await this.page.locator(this.okayButton).isVisible({ timeout: 2000 });
        if (modalVisible) {
          await this.page.click(this.okayButton);
          console.log('   ✓ Accepted modal');
        }
      } catch (e) {
        // Modal might not appear, continue
      }
    }
  }

  async selectDropdownOption(value) {
    await this.page.waitForSelector(this.dropdownSelect, { state: 'visible' });
    await this.page.selectOption(this.dropdownSelect, value);
    console.log(`   ✓ Selected dropdown: ${value}`);
  }

  async acceptTerms() {
    await this.page.waitForSelector(this.termsCheckbox, { state: 'visible' });
    await this.page.check(this.termsCheckbox);
    console.log('   ✓ Accepted terms and conditions');
  }

  async clickSignIn() {
    await this.page.waitForSelector(this.signInButton, { state: 'visible' });
    await this.page.click(this.signInButton);
    console.log('   ✓ Clicked Sign In button');
  }

  async getErrorMessage() {
    try {
      const errorElement = this.page.locator(this.errorAlert);
      const isVisible = await errorElement.isVisible({ timeout: 3000 });
      if (isVisible) {
        return await errorElement.textContent();
      }
    } catch (e) {
      // No error message found
    }
    return null;
  }

  async login(username, password, userType = 'user', dropdownValue = 'consult') {
    await this.enterUsername(username);
    await this.page.waitForTimeout(500); // Small delay between actions
    
    await this.enterPassword(password);
    await this.page.waitForTimeout(500);
    
    await this.selectUserType(userType);
    await this.page.waitForTimeout(500);
    
    await this.selectDropdownOption(dropdownValue);
    await this.page.waitForTimeout(500);
    
    await this.acceptTerms();
    await this.page.waitForTimeout(500);
    
    await this.clickSignIn();
  }
}

module.exports = LoginPage;