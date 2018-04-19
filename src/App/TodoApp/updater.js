import {
  curry, always, identity, when, map, reject,
  assoc, propEq, prepend, evolve,
} from 'ramda';

import { getNextId, handleMessages } from '../../utils';

const updateTodo = curry((id, f, list) => (
  map(
    when(propEq('id', id), f),
    list
  )
));

const todolistUpdater = handleMessages({
  SET_TODOLIST: todolist => always(todolist),

  CREATE_TODO: value => !value ? identity : state => {
    const id = getNextId(state);
    return prepend({ value, id }, state);
  },

  REMOVE_TODO: id => reject(propEq('id', id)),

  TOGGLE_EDIT_TODO: ({ id, editing }) => (
    updateTodo(id, assoc('editing', editing))
  ),

  CHANGE_TODO: ({ id, value }) => (
    updateTodo(id, assoc('value', value))
  ),

  TOGGLE_TODO_STATE: id => updateTodo(id, todo => (
    assoc('done', !todo.done, todo)
  )),
});

const newTodoValueUpdater = handleMessages({
  CREATE_TODO: always(always('')),
  SET_NEWTODO_VALUE: payload => always(payload),
});

export default (msg, payload) => evolve({
  todolist: todolistUpdater(msg, payload),
  newTodoValue: newTodoValueUpdater(msg, payload),
});
