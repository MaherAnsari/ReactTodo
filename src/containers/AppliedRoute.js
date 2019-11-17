import React from "react";
import { Route, Redirect } from "react-router-dom";
import cookie from 'react-cookies';

export default ({ component: Component, ...rest }) => 
    <Route {...rest} render={(props) => (cookie.load('token') ? (
        <Component {...props} />
    ) : (
            <Redirect to={{
                pathname: `/`,
                state: { referrer: props.location }
            }} />
        )
    )} />;