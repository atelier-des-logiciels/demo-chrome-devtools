import React from 'react'
import { noop } from 'ramda-adjunct';
import PropTypes from 'prop-types';
import { TextField, Icon, IconButton, Checkbox } from 'material-ui';
import { ListItem, ListItemText } from 'material-ui/List'
import { InputAdornment } from 'material-ui/Input';
import DeleteIcon from '@material-ui/icons/Delete';

class Todo extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    done: PropTypes.bool,
    editing: PropTypes.bool,
    onCheckboxClick: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    done: false,
    editing: false,
    onCheckboxClick: noop,
    onEdit: noop,
    onRemove: noop,
  }

  renderValue() {
    const { editing, value } = this.props;
    if (!editing) {
      return (
        <ListItemText>{value}</ListItemText>
      );
    }
    return (
      <TextField fullWidth
        value={value}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>keyboard_arrow_right</Icon>
            </InputAdornment>
          ),
        }}
      />
    );
  }

  onCheckboxClick = () => {
    const { id, onCheckboxClick } = this.props
    onCheckboxClick(id);
  }

  onRemove = () => {
    const { id, onRemove } = this.props
    onRemove(id);
  }

  onEdit = () => {
    const { id, onEdit } = this.props
    onEdit(id);
  }

  render() {
    const { done, editing } = this.props;
    return (
      <ListItem>
        <Checkbox onClick={this.onDone} checked={done} />
        {this.renderValue()}
        <IconButton
          disabled={editing}
          color="primary"
          component="span"
          onClick={this.onEdit}
        >
          <Icon>edit_icon</Icon>
        </IconButton>
        <IconButton
          color="secondary"
          component="span"
          onClick={this.onRemove}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }
}

export default Todo;
