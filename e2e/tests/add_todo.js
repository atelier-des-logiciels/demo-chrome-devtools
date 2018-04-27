const assert = require('assert').strict;

const initialTodoList = require('../../src/initialTodoList.json');
const { getTodoListFromPage } = require('../utils');

const newTodo = { value: 'This is an e2e testing todo task', done: false };

module.exports = async ({ page }) => {
  const input = await page.$('#todo-creator-input');
  await input.type(newTodo.value);
  await input.press('Enter');

  const todolist = await getTodoListFromPage(page);
  const expectedTodolist = [newTodo, ...initialTodoList];
  assert.deepEqual(todolist, expectedTodolist, 'A new todo should be added');

  await page.reload();
};
