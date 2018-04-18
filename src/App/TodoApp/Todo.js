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
    content: PropTypes.string.isRequired,
    done: PropTypes.bool,
    editing: PropTypes.bool,
    onDone: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    done: false,
    editing: false,
    onDone: noop,
    onEdit: noop,
    onRemove: noop,
  }

  renderContent() {
    const { editing, content } = this.props;
    if (!editing) {
      return (
        <ListItemText>{content}</ListItemText>
      );
    }
    return (
      <TextField fullWidth
        value={content}
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

  render() {
    const { id, done, editing, onDone, onEdit, onRemove } = this.props;
    return (
      <ListItem>
        <Checkbox onClick={() => onDone(id)} checked={done} />
        {this.renderContent()}
        <IconButton
          disabled={editing}
          color="primary"
          component="span"
          onClick={() => onEdit(id)}
        >
          <Icon>edit_icon</Icon>
        </IconButton>
        <IconButton
          color="secondary"
          component="span"
          onClick={() => onRemove(id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }
}

export default Todo;
