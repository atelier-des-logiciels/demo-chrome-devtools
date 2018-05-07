const assert = require('assert').strict;

module.exports = async ({ page }) => {
  const rootContainer = await page.$('#root-container');
  assert.ok(rootContainer, 'App root container should be displayed')
};
