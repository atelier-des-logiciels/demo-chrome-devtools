const assert = require('assert').strict;

const initialTodoList = require('../todolist.json');
const { getTodoListFromPage } = require('../utils');

const addedText = '=> E2E';

const expectedTodolist = initialTodoList.map(({ done }) => ({
  value: addedText,
  done,
}))

module.exports = async ({ page }) => {
  for (const elem of await page.$$('.todo-edit')) {
    await elem.click()
  }

  for (const elem of await page.$$('.todo-input')) {
    await elem.click({ clickCount: 3 })
    await elem.type(addedText);
    await elem.press('Enter');
  }

  const todolist = await getTodoListFromPage(page);
  assert.deepEqual(todolist, expectedTodolist, 'All todos should be modified');

  await page.reload();
};
