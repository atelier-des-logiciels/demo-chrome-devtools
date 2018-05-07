const assert = require('assert').strict;

module.exports = async ({ page }) => {
  const appTitle = await page.$('#app-title');
  assert.ok(appTitle, 'App title should be displayed')
};
