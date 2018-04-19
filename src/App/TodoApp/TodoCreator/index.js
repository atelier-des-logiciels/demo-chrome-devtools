import { noop } from 'ramda-adjunct';
import React from 'react';
import PropTypes from 'prop-types';

import { Icon, IconButton, TextField } from 'material-ui';
import { InputAdornment } from 'material-ui/Input';
import { ListItem } from 'material-ui/List';
import { FormControl } from 'material-ui/Form';

const TodoCreator = (props) => {
  const { onChange, onCreate, value } = props;
  const startAdornment = (
    <InputAdornment position="start">
      <Icon>keyboard_arrow_right</Icon>
    </InputAdornment>
  );
  return (
    <ListItem>
      <FormControl
        component="form"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          onCreate();
        }}
      >
        <TextField fullWidth
          onChange={(e) => onChange(e.target.value)}
          value={value}
          label="Add a todo"
          InputProps={{
            startAdornment,
          }}
        />
      </FormControl>
      <IconButton
        onClick={() => onCreate()}
        disabled={!value}
        color="primary"
        component="span"
      >
        <Icon>add circle</Icon>
      </IconButton>
    </ListItem>
  );
}
TodoCreator.propTypes = {
  value: PropTypes.string,
  onCreate: PropTypes.func,
  onChange: PropTypes.func,
}
TodoCreator.defaultProps = {
  value: '',
  onCreate: noop,
  onChange: noop,
}

export default TodoCreator;
