import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'material-ui';

const Title = ({ children }) => (
  <Typography variant="display2" gutterBottom>
    {children}
  </Typography>
)
Title.propTypes = {
  children: PropTypes.string.isRequired,
}
Title.defaultProps = {
  children: 'TodoApp',
}

export default Title;
