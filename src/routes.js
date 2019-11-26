import React from "react";
import { Route, Switch} from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Home from "./components/common/HomePage";
import Signin from "./components/auth/SigninPage";
import NotFound from "./components/common/NotFoundPage";
export default () =>
  <Switch>
    <Route path="/" exact component={Signin}  />
    <Route path="/login" exact component={Signin}  />
    <AppliedRoute path="/home" exact component={Home}  />
    <AppliedRoute path="/home/mandi-data" exact component={Home}  />
    <AppliedRoute path="/home/user-list" exact component={Home}  />
    <AppliedRoute path="/home/buyer-list" exact component={Home}  />
    <AppliedRoute path="/home/broker-list" exact component={Home}  />
    <AppliedRoute path="/home/supplier-list" exact component={Home}  />
    <AppliedRoute path="/home/rate-list" exact component={Home}  />
    <AppliedRoute path="/home/comodity-list" exact component={Home}  />
    <AppliedRoute path="/home/orders-list" exact component={Home}  />
    <AppliedRoute path="/home/mandi-rates" exact component={Home}  />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;