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

  renderTodo({ id, content, editing, done }) {
    return (
      <React.Fragment key={id}>
        <Todo id={id} content={content} editing={editing} done={done} />
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
