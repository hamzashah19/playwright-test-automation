class ShopPage {
  constructor(page) {
    this.page = page;
    this.productTitles = '.card-title a';
    this.addToCartButtons = '.card-footer button';
    this.checkoutButton = '#navbarResponsive a[class*="btn-primary"]';
  }

  async isLoaded() {
    return this.page.url().includes('shop');
  }

  async getProductNames() {
    return await this.page.locator(this.productTitles).allTextContents();
  }

  async getProductCount() {
    return await this.page.locator(this.productTitles).count();
  }

  async addProductToCart(productName) {
    const products = await this.page.locator(this.productTitles).all();
    for (let i = 0; i < products.length; i++) {
      const text = await products[i].textContent();
      if (text.trim() === productName) {
        const buttons = await this.page.locator(this.addToCartButtons).all();
        await buttons[i].click();
        return true;
      }
    }
    return false;
  }
}

module.exports = ShopPage;