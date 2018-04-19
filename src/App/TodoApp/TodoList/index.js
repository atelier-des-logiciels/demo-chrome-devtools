import React from 'react'
import PropTypes from 'prop-types';
import { Divider } from 'material-ui';
import List from 'material-ui/List'

import Todo from '../Todo';

const TodolistPropTypes = PropTypes.arrayOf(PropTypes.shape(Todo.propTypes));

class TodoList extends React.Component {

  static propTypes = {
    data: TodolistPropTypes.isRequired,
  }

  renderTodo = ({ id, value, editing, done }) => {
    // eslint-disable-next-line no-unused-vars
    const { data, ...restProps } = this.props;
    return (
      <React.Fragment key={id}>
        <Todo
          {...restProps}
          id={id}
          value={value}
          editing={editing}
          done={done}
        />
        <Divider />
      </React.Fragment>
    );
  }

  render() {
    const { data } = this.props;
    return (
      <List>{data.map(this.renderTodo)}</List>
    )
  }
}

export default TodoList;
