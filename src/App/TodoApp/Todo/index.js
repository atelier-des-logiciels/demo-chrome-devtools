import React from 'react'
import { noop } from 'ramda-adjunct';
import PropTypes from 'prop-types';
import { TextField, Icon, IconButton, Checkbox } from 'material-ui';
import { ListItem, ListItemText } from 'material-ui/List'
import DeleteIcon from '@material-ui/icons/Delete';
import { FormControl } from 'material-ui/Form';

class Todo extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    done: PropTypes.bool,
    editing: PropTypes.bool,
    onCheckboxClick: PropTypes.func,
    onToggleEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    done: false,
    editing: false,
    onCheckboxClick: noop,
    onToggleEdit: noop,
    onRemove: noop,
    onChange: noop,
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.done !== this.props.done
      || nextProps.editing !== this.props.editing
      || nextProps.id !== this.props.id
      || nextProps.value !== this.props.value
    );
  }

  focusTextField = () => {
    setTimeout(() => {
      if (this.textfield && typeof this.textfield.focus === 'function') {
        this.textfield.focus();
      }
    });
  }

  trimValue = () => {
    const { onChange, value } = this.props;
    onChange({ id: this.props.id, value: value.trim() });
  }

  onChange = (e) => {
    const { onChange } = this.props;
    onChange({ id: this.props.id, value: e.target.value })
  }

  onCheckboxClick = () => {
    const { id, onCheckboxClick } = this.props
    onCheckboxClick(id);
  }

  onRemove = () => {
    const { id, onRemove } = this.props
    onRemove(id);
  }

  onToggleEdit = (editing) => {
    const { id, onToggleEdit } = this.props
    onToggleEdit({ id, editing });
    if (editing) {
      this.focusTextField();
    } else {
      this.trimValue();
    }

  }

  renderValue = () => {
    const { editing, value } = this.props;
    if (!editing) {
      return (
        <ListItemText>{value}</ListItemText>
      );
    }
    return (
      <FormControl
        component="form"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          this.onToggleEdit(false);
        }}
      >
        <TextField fullWidth
          style={{ paddingLeft: '16px', width: '95%' }}
          inputRef={node => { this.textfield = node; }}
          onChange={this.onChange}
          value={value}
        />
      </FormControl>
    );
  }

  renderEditIcon = () => {
    if (this.props.editing) {
      return (
        <IconButton
          disableRipple
          style={{ color: 'green' }}
          component="span"
          onClick={() => this.onToggleEdit(false)}
        >
          <Icon>done</Icon>
        </IconButton>
      );
    }
    return (
      <IconButton
        id="todo-edit"
        disableRipple
        color="primary"
        component="span"
        onClick={() => this.onToggleEdit(true)}
      >
        <Icon>edit_icon</Icon>
      </IconButton>
    );
  }

  renderRemoveIcon = () => {
    return (
      <IconButton
        id="todo-remove"
        disableRipple
        color="secondary"
        component="span"
        onClick={this.onRemove}
      >
        <DeleteIcon />
      </IconButton>
    );
  }


  render() {
    return (
      <ListItem id='todo'>
        <Checkbox
          onClick={this.onCheckboxClick}
          checked={this.props.done}
        />
        {this.renderValue()}
        {this.renderEditIcon()}
        {this.renderRemoveIcon()}
      </ListItem>
    );
  }
}

export default Todo;
