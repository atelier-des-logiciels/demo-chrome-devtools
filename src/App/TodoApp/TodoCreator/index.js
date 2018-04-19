import { noop } from 'ramda-adjunct';
import React from 'react';
import PropTypes from 'prop-types';

import { Icon, IconButton, TextField } from 'material-ui';
import { InputAdornment } from 'material-ui/Input';
import { ListItem } from 'material-ui/List';
import { FormControl } from 'material-ui/Form';

class TodoCreator extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    onCreate: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
    onCreate: noop,
    onChange: noop,
  }


  submit = () => {
    const { onCreate, value } = this.props;
    onCreate(value.trim());
    this.textfield.focus();
  }

  render() {
    const { onChange, value } = this.props;
    const { submit } = this;
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
            submit();
          }}
        >
          <TextField fullWidth
            inputRef={node => { this.textfield = node }}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            label="Add a todo"
            InputProps={{
              startAdornment,
            }}
          />
        </FormControl>
        <IconButton
          disableRipple
          onClick={submit}
          disabled={!value}
          color="primary"
          component="span"
        >
          <Icon>add circle</Icon>
        </IconButton>
      </ListItem>
    );
  }
}

export default TodoCreator;
