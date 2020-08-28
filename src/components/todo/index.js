import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import asyncComponent from "../../utils/asyncComponent";



const Todo = ({match}) => (
  <Switch>
    <Redirect exact from={`${match.url}`} to={`${match.url}/list`}/>
    <Route path={`${match.url}/list`} component={asyncComponent(() => import('./todoList'))}/>
  </Switch>
);

export default Todo;
