const PAUSE_MS = 3000;

// Shared behaviour for every page object
class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Visible pause between steps (the scenario asks for 3s waits so the run can be watched)
  async pause(ms = PAUSE_MS) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = { BasePage, PAUSE_MS };
