const assert = require('assert').strict;

const initialTodoList = require('../../src/initialTodoList.json');
const { getTodoListFromPage } = require('../utils');

module.exports = async ({ page }) => {
  // remove all todos
  for (const elem of await page.$$('#todo-remove')) {
    await elem.click()
  }
  const cleanedTodolist = await getTodoListFromPage(page);
  assert.deepEqual(cleanedTodolist, [], 'All todos should be removed');

  // reload todos
  const reloadButtonElement = await page.$('#todolist-reload');
  await reloadButtonElement.click();
  const todolist = await getTodoListFromPage(page);
  assert.deepEqual(todolist, initialTodoList, 'All todos should be removed');

  await page.reload();
};
