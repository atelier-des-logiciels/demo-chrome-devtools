import { zipWith, assoc, times, identity } from 'ramda';

const generateIds = times(identity);

export const withIds = todolist => (
  zipWith(assoc('id'), generateIds(todolist.length), todolist)
);
