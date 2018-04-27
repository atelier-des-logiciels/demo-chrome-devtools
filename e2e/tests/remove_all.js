const assert = require('assert').strict;

const { getTodoListFromPage } = require('../utils');

module.exports = async ({ page }) => {
  const elements = await page.$$('#todo-remove');
  for (const elem of elements) {
    await elem.click()
  }

  const todolist = await getTodoListFromPage(page);
  assert.deepEqual(todolist, [], 'All todos checkbox should be clicked');

  await page.reload();
};
