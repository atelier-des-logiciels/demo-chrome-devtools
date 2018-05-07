import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'material-ui';

const Title = ({ children }) => (
  <Typography
    id="app-title"
    variant="display2"
    gutterBottom
  >
    {children}
  </Typography>
)
Title.propTypes = {
  children: PropTypes.node.isRequired,
}
Title.defaultProps = {
  children: 'TodoApp',
}

export default Title;
