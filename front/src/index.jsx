import React from 'react'

import App from './App';
import render from './render';

import { withIds } from './utils';

const setTodos = todos => () => ({ todos: withIds(todos) })
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
  }
  componentDidMount() {
    fetch(`/api/todos`)
      .then(r => r.json())
      .then(todos => {
        this.setState(setTodos(todos))
      });
  }
  render() {
    return (
      <App
        initialTodolist={this.state.todos}
      />
    );
  }
}

render(<TodoApp />);
