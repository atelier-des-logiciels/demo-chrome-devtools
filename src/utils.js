import {
  identity, inc, assoc,
  pipe, pluck, reduce,
  zipWith, times, toPairs,
} from 'ramda';

const generateIds = times(identity);

export const withIds = todolist => (
  zipWith(assoc('id'), generateIds(todolist.length), todolist)
);

export const getNextId = pipe(
  pluck('id'),
  reduce(Math.max, -1),
  inc,
);

export const handleMessages = (messagesMap) => (msg, payload) => state => {
  const reducer = (nextState, [m, u]) => {
    if (m === msg) {
      return u(payload)(nextState);
    }
    return nextState;
  };
  return reduce(reducer, state, toPairs(messagesMap));
};
