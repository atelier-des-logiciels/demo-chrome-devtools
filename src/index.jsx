import React from 'react'

import App from './App';
import render from './render';

import { withIds } from './utils';
import initialTodolist from './initialTodolist.json';

render(
  <App
    initialTodolist={withIds(initialTodolist)}
  />
);
