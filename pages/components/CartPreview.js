// The cart dropdown shown when the header cart icon is clicked
class CartPreview {
  constructor(page) {
    this.page = page;
    this.items = page.locator('.cart-preview .cart-item');
    this.checkoutButton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
  }

  item(name) {
    return this.items.filter({ hasText: name });
  }

  async names() {
    return this.items.locator('.product-info .product-name').allInnerTexts();
  }

  async lineAmounts() {
    return (await this.items.locator('.amount').allInnerTexts()).map(Number);
  }

  async amountOf(name) {
    return Number(await this.item(name).locator('.amount').innerText());
  }

  async unitPriceOf(name) {
    return Number(await this.item(name).locator('.product-info .product-price').innerText());
  }

  quantityOf(name) {
    return this.item(name).locator('.quantity');
  }

  async remove(name) {
    await this.item(name).locator('.product-remove').first().click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPreview };
