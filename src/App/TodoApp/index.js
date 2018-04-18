import { assoc } from 'ramda';
import React from 'react'
import { Paper, Divider } from 'material-ui';
import { withStyles } from 'material-ui/styles';

import TodoCreator from './TodoCreator';
import TodoList from './TodoList';

const setTodolist = assoc('todolist');

const styles = theme => ({
  root: {
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
});

@withStyles(styles)
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
      <Paper style={styles.root}>
        <TodoCreator />
        <Divider />
        <TodoList data={this.state.todolist} />
      </Paper>
    )
  }
}

export default (TodoApp);
