import React, {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {IntlProvider} from "react-intl";
import MainApp from "./MainApp";
import SignIn from "../SignIn";
import SignUp from "../Signup";
import {setInitUrl} from "../../appRedux/actions/AuthActions";

const RestrictedRoute = ({component: Component, location, authUser, ...rest}) =>
  <Route
    {...rest}
    render={props =>
      authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: {from: location}
          }}
        />}
  />;


const App = (props) => {

  const dispatch = useDispatch();
  const {authUser, initURL} = useSelector(({auth}) => auth);

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    console.log(location.pathname)
        if (initURL === '') {
      dispatch(setInitUrl(location.pathname));
    }
  });

  useEffect(() => {
    if (location.pathname === '/') {
      console.log(authUser)
      if (authUser === null) {
        history.push('/signin');
      } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
        history.push('/todo');
      } else {
        console.log(initURL)
        history.push(initURL);
      }
    }
  }, [authUser, initURL, location, history]);

//   const currentAppLocale = AppLocale[locale.locale];

  return (
    // <ConfigProvider locale={currentAppLocale.antd}>
      <IntlProvider
        >
        <Switch>
          <Route exact path='/signin' component={SignIn}/>
          <Route exact path='/signup' component={SignUp}/>
          {/* <Route exact path='/signup' component={SignUp}/>/ */}
          <RestrictedRoute path={`${match.url}`} authUser={authUser} location={location}
                           component={MainApp}/>
        </Switch>
 </IntlProvider>
   //   {/*  // </ConfigProvider> */}
  )
};

export default memo(App);
