import React from 'react'
import PropTypes from 'prop-types';
import { Paper, Button, Icon, Divider } from 'material-ui';
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
  button: {
    marginLeft: '16px',
  },
});

class App extends React.Component {
  render() {
    const { classes, initialTodolist } = this.props;
    return (
      <div className={classes.root}>
        <Title>
        TODO Assistant
          <Button
            id="todolist-reload"
            onClick={() => this.forceUpdate()}
            variant="fab"
            color="primary"
            className={classes.button}
          >
            <Icon>replay</Icon>
          </Button>
        </Title>
        <Paper className={classes.paper}>
          <Divider />
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
