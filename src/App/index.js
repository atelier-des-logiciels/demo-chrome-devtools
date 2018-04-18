import React from 'react'
import { Typography, Paper } from 'material-ui';

const styles = {
  root: {
    paddingTop: 10,
    margin: 'auto',
    maxWidth: '800px',
    textAlign: 'center',
  },
  paper: {
    padding: 10,
  },
};

class App extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <Typography variant="display2" gutterBottom>
          TodoApp
        </Typography>
        <Paper style={styles.paper}>
          Hello World
        </Paper>
      </div>
    )
  }
}

export default App
