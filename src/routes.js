import React from "react";
import { Route, Switch} from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Home from "./components/common/HomePage";
import Signin from "./components/auth/SigninPage";
import NotFound from "./components/common/NotFoundPage";
import AccessDeniedContainer from "./components/auth/AccessDeniedContainer";
import { getStatusOfRole } from "./config/appConfig";


export default () =>
  <Switch>
    <Route path="/" exact component={Signin}  />
    <Route path="/login" exact component={Signin}  />
    <Route path="/access-denied" exact component={AccessDeniedContainer}  />
    <AppliedRoute path="/home" exact component={Home}  />
    
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/user-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/buyer-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/broker-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/supplier-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/rate-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/orders-list" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/payment" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/payment-details" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/todays-payment" exact component={Home}  />}
    {getStatusOfRole("BasicUser") && <AppliedRoute path="/home/add-bank-account" exact component={Home}  />}

    {/* supporting Data tab routes */}
    {getStatusOfRole("SupportingDataManagement") && <AppliedRoute path="/home/comodity-list" exact component={Home}  />}
    {getStatusOfRole("SupportingDataManagement") && <AppliedRoute path="/home/mandi-data" exact component={Home}  />}
    {getStatusOfRole("SupportingDataManagement") && <AppliedRoute path="/home/mandi-rates" exact component={Home}  />}

    {getStatusOfRole("SuperAdmin") && <AppliedRoute path="/home/role-permission" exact component={Home}  />}

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;