import React, { Component } from "react";
import Routes from "../routes";
import "../assets/css/app.css";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Auth } from "aws-amplify";
import cookie from 'react-cookies';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicroscope } from '@fortawesome/free-solid-svg-icons'
import "../assets/css/cardcss.scss";

library.add(faMicroscope)

const styles = {
  root: {
    flexGrow: 1,
  },
  bar: {
    backgroundColor: '#50a3b4',
  },
  flex: {
    flexGrow: 1,
    marginLeft: 5,
    color: '#fff'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      user: '',
      componentName: '',
      providerName:
        window.location.href
          .replace("https://", "")
          .replace("http://", "")
          .replace(window.location.hostname + "/", "")
          .split("/")[0] === 'localhost:3000' ? window.location.href
            .replace("https://", "")
            .replace("http://", "")
            .replace(window.location.hostname + "/", "")
            .split("/")[1] : window.location.href
              .replace("https://", "")
              .replace("http://", "")
              .replace(window.location.hostname + "/", "")
              .split("/")[0]
    };
    
  }

  userHasAuthenticated = (props) => {
    this.setState({ isAuthenticated: props.isLoggedIn, user: props.email, componentName: props.view });
  }

  async componentDidMount(){
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
  
  }
  componentWillMount() {
    // Utils.setDbName(this.state.providerName);
    Auth.currentAuthenticatedUser()
      .then(user => {
        var authk = user.signInUserSession.idToken.jwtToken;
        var username = user.signInUserSession.idToken.payload.name;
        cookie.save('token', authk, { path: '/' })
        cookie.save('username', username, { path: '/' });
      })
      .catch(err => {
        console.log(err);
        cookie.remove('token', { path: '/' });
        cookie.remove('username', { path: '/' });
      });
      
  }



  render() {
    return (
      <div className="outerContainer">
        <Routes />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);