const { chromium } = require('playwright');
const CONFIG = require('./config');

let browser;
let context;
let page;

async function initializeBrowser() {
  browser = await chromium.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });
  context = await browser.newContext();
  page = await context.newPage();
  page.setDefaultTimeout(CONFIG.timeout);
  return { browser, context, page };
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
  }
}

async function takeScreenshot(filename) {
  if (CONFIG.screenshots.enabled && page) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    await page.screenshot({ 
      path: `${CONFIG.screenshots.path}${filename}_${timestamp}.png` 
    });
  }
}

async function saveAuthState(filename = 'auth.json') {
  if (context) {
    await context.storageState({ path: filename });
  }
}

function getPage() {
  return page;
}

module.exports = {
  initializeBrowser,
  closeBrowser,
  takeScreenshot,
  saveAuthState,
  getPage
};