const { evolve, not } = require('ramda');
const assert = require('assert').strict;

const initialTodoList = require('../todolist.json');
const { getTodoListFromPage } = require('../utils');

const inverseDone = evolve({ done: not });

const expectedTodolist = initialTodoList.map(inverseDone);

module.exports = async ({ page }) => {
  const todoElements = await page.$$('#todo');
  for (const todoElem of todoElements) {
    const input = await todoElem.$('input');
    await input.click()
  }

  const todolist = await getTodoListFromPage(page);
  assert.deepEqual(todolist, expectedTodolist, 'All todos checkbox should be clicked');

  await page.reload();
};
