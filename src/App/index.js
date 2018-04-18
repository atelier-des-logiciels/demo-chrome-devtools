import React from 'react'
import PropTypes from 'prop-types';

import Title from './Title'
import TodoApp from './TodoApp';

const styles = {
  root: {
    paddingTop: 10,
    margin: 'auto',
    maxWidth: '800px',
    textAlign: 'center',
  },
};

class App extends React.Component {
  render() {
    const { initialTodolist } = this.props;
    return (
      <div style={styles.root}>
        <Title>TodoApp Demo</Title>
        <TodoApp initialTodolist={initialTodolist} />
      </div>
    )
  }
}
App.propTypes = {
  initialTodolist: PropTypes.arrayOf(PropTypes.shape({})),
}
App.defaultProps = {
  initialTodolist: [],
}

export default App
