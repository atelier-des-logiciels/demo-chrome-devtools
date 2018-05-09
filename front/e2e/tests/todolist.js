const assert = require('assert').strict;

const initialTodoList = require('../todolist.json');
const { getTodoListFromPage } = require('../utils');

module.exports = async ({ page }) => {
  const todolist = await getTodoListFromPage(page);
  assert.deepEqual(initialTodoList, todolist, 'Initial todolist should be displayed');
};
