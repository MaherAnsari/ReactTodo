import React from "react";
import { Route, Switch } from "react-router-dom";
import Todo from '../components/todo'

const App = ({ match }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}todo`} component={Todo} />
    </Switch>
  </div>
);

export default App;
