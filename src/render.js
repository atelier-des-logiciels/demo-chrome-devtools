import { render } from 'react-dom';

export default (component) => (
  render(component, document.querySelector('#root-container'))
)
