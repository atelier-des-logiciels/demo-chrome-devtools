import React from "react";
import { Divider } from "material-ui";

import Context from "../context";
import TodoCreator from "./TodoCreator";
import TodoList from "./TodoList";

const TodoApp = () => (
  <Context.Consumer>
    {({ newTodoValue, todolist, update }) => (
      <React.Fragment>
        <TodoCreator
          value={newTodoValue}
          onChange={update("SET_NEWTODO_VALUE")}
          onCreate={update("CREATE_TODO")}
        />
        <Divider />
        <TodoList
          data={todolist}
          onRemove={update("REMOVE_TODO")}
          onToggleEdit={update("TOGGLE_EDIT_TODO")}
          onChange={update("CHANGE_TODO")}
          onCheckboxClick={update("TOGGLE_TODO_STATE")}
        />
      </React.Fragment>
    )}
  </Context.Consumer>
);

export default TodoApp;
