import { noop } from 'ramda-adjunct';
import React from 'react';
import PropTypes from 'prop-types';

import { Icon, IconButton, TextField } from 'material-ui';
import { InputAdornment } from 'material-ui/Input';
import { ListItem } from 'material-ui/List';
import { FormControl } from 'material-ui/Form';

const TodoCreator = (props) => {
  const { onChange, onCreate, onCancel, content } = props;
  const startAdornment = (
    <InputAdornment position="start">
      <Icon>keyboard_arrow_right</Icon>
    </InputAdornment>
  );
  const endAdornment = content ? (
    <InputAdornment position="start">
      <IconButton
        onClick={() => onCancel()}
      >
        <Icon>cancel</Icon>
      </IconButton>
    </InputAdornment>
  ) : null;
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
          value={content}
          label="Add a todo"
          InputProps={{
            startAdornment,
            endAdornment,
          }}
        />
      </FormControl>
      <IconButton
        onClick={() => onCreate()}
        disabled={!content}
        color="primary"
        component="span"
      >
        <Icon>add circle</Icon>
      </IconButton>
    </ListItem>
  );
}
TodoCreator.propTypes = {
  content: PropTypes.string,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
}
TodoCreator.defaultProps = {
  content: '',
  onCreate: noop,
  onCancel: noop,
  onChange: noop,
}

export default TodoCreator;
