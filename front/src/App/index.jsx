import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Paper, Button, Icon, Divider } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { curry } from 'ramda';
import { hot } from 'react-hot-loader';

import Context from './context';
import updater from './updater';
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

const fetchTodos = () =>
  fetch(`/api/todos`)
    .then(r => r.json());

class App extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  update = curry((msg, payload) => {
    this.setState(updater(msg, payload));
  });

  state = {
    todolist: [],
    newTodoValue: '',
    update: this.update,
  }

  initTodos() {
    fetchTodos().then(this.update('SET_TODOLIST'));
  }

  componentDidMount() {
    this.initTodos();
  }

  render() {
    const { classes } = this.props;
    return (
      <Context.Provider value={this.state}>
        <div className={classes.root}>
          <Title>
            Alfred
            <Button
              id="todolist-reload"
              onClick={() => this.initTodos()}
              variant="fab"
              color="primary"
              className={classes.button}
            >
              <Icon>replay</Icon>
            </Button>
          </Title>
          <Paper className={classes.paper}>
            <Divider />
            <TodoApp />
          </Paper>
        </div>
      </Context.Provider>
    )
  }
}

// eslint-disable-next-line no-undef
export default hot(module)(withStyles(styles)(App));
