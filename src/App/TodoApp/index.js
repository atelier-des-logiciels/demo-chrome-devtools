import { curry } from 'ramda';
import React from 'react'
import { Divider } from 'material-ui';

import updater from './updater';

import TodoCreator from './TodoCreator';
import TodoList from './TodoList';

class TodoApp extends React.Component {

  state = {
    todolist: [],
    newTodoValue: '',
  }

  static propTypes = {
    initialTodolist: TodoList.propTypes.data,
  }

  static defaultProps = {
    initialTodolist: [],
  }

  update = curry((msg, payload) => {
    this.setState(updater(msg, payload));
  });

  componentWillMount() {
    this.update('SET_TODOLIST', this.props.initialTodolist);
  }

  componentWillReceiveProps(nextProps) {
    this.update('SET_TODOLIST', nextProps.initialTodolist);
  }

  render() {
    return (
      <React.Fragment>
        <TodoCreator
          value={this.state.newTodoValue}
          onChange={this.update('SET_NEWTODO_VALUE')}
          onCreate={this.update('CREATE_TODO')}
        />
        <Divider />
        <TodoList
          data={this.state.todolist}
          onRemove={this.update('REMOVE_TODO')}
          onToggleEdit={this.update('TOGGLE_EDIT_TODO')}
          onChange={this.update('CHANGE_TODO')}
          onCheckboxClick={this.update('TOGGLE_TODO_STATE')}
        />
      </React.Fragment>
    )
  }
}

export default (TodoApp);
