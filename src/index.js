import React from 'react'
import { render } from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <h1>Hello World</h1>
    )
  }
}

const container = document.querySelector('#root-container');
render(<App />, container);
