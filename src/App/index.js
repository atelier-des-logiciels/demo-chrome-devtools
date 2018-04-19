import React from 'react'
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import { withStyles } from 'material-ui/styles';

import Title from './Title'
import TodoApp from './TodoApp';

const styles = theme => ({
  root: {
    paddingTop: 10,
    margin: 'auto',
    maxWidth: '800px',
    textAlign: 'center',
  },
  paper: {
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
});

class App extends React.Component {
  render() {
    const { classes, initialTodolist } = this.props;
    return (
      <div className={classes.root}>
        <Title>TodoApp Demo</Title>
        <Paper className={classes.paper}>
          <TodoApp initialTodolist={initialTodolist} />
        </Paper>
      </div>
    )
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
  initialTodolist: PropTypes.arrayOf(PropTypes.shape({})),
}
App.defaultProps = {
  initialTodolist: [],
}

export default withStyles(styles)(App)
