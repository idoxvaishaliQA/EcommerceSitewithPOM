const { BasePage } = require('./BasePage');

// The full cart / checkout page (#/cart)
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.rows = page.locator('#productCartTables tbody tr');
    this.totalAmount = page.locator('.totAmt');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async productNames() {
    return this.rows.locator('.product-name').allInnerTexts();
  }

  // Last .amount cell of each row is the line total
  async lineTotals() {
    return (await this.rows.locator('td:last-child .amount').allInnerTexts()).map(Number);
  }

  async displayedTotal() {
    return Number(await this.totalAmount.innerText());
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

module.exports = { CartPage };
