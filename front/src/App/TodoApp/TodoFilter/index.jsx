import React from 'react';
import PropTypes from 'prop-types';
import { Button }  from 'material-ui';
import { withStyles } from 'material-ui/styles';

const styles = {
  box: {
    padding: '0.5em 0'
  }
}

const TodoFilter = ({ onChange, filter, classes }) => (
  <div className={classes.box}>
    <Button
      variant={filter === "all" ? "raised" : "flat"}
      onClick={() => onChange('all')}
    >
      All
    </Button>
    <Button
      variant={filter === "active" ? "raised" : "flat"}
      onClick={() => onChange('active')}
    >
      Active
    </Button>
    <Button
      variant={filter === "completed" ? "raised" : "flat"}
      onClick={() => onChange('completed')}
    >
      Completed
    </Button>
  </div>
);

TodoFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
}

export default withStyles(styles)(TodoFilter);