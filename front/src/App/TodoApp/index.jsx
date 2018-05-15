import React from "react";
import { Divider } from "material-ui";

import Context from "../context";
import TodoCreator from "./TodoCreator";
import TodoList from "./TodoList";
import TodoFilter from "./TodoFilter";

const TodoApp = () => (
  <Context.Consumer>
    {({ newTodoValue, todolist, filter, update }) => (
      <React.Fragment>
        <TodoCreator
          value={newTodoValue}
          onChange={update("SET_NEWTODO_VALUE")}
          onCreate={update("CREATE_TODO")}
        />
        <Divider />
        <TodoFilter
          filter={filter}
          onChange={update("SET_TODO_FILTER")}
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
