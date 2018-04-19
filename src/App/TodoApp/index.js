import { assoc } from 'ramda';
import React from 'react'
import { Divider } from 'material-ui';

import TodoCreator from './TodoCreator';
import TodoList from './TodoList';

const setTodolist = assoc('todolist');

class TodoApp extends React.Component {

  state = {
    todolist: null,
  }

  static propTypes = {
    initialTodolist: TodoList.propTypes.data,
  }

  static defaultProps = {
    initialTodolist: [],
  }

  componentWillMount() {
    this.setState(setTodolist(this.props.initialTodolist));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(setTodolist(nextProps.initialTodolist));
  }

  render() {
    return (
      <React.Fragment>
        <TodoCreator />
        <Divider />
        <TodoList data={this.state.todolist} />
      </React.Fragment>
    )
  }
}

export default (TodoApp);
