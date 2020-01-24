import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Auth } from "aws-amplify";
// import Auth from '@aws-amplify/auth'
import { Redirect } from "react-router-dom";
import cookie from 'react-cookies';
import './accessdenied.css';
import $ from 'jquery';
import commonService from '../../app/commonService/commonService';

const styles = theme => ({
    root: {
        flexGrow: 1
    }
});

class AccessDeniedContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }



    }


    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={this.props.classes.layout}>
                    <div id="notfound">
                        <div className="notfound">
                            <div className="notfound-404">
                                <h1 style={{color: "#000"}}>404</h1>
                            </div>
                            <h2>Oops! Its seems that you don't have any access to this portal</h2>
                            <p>Please ask your Admin to provide access.</p>
                            <a href="/">Go To Homepage</a>
                        </div>
                    </div>
                </main>
            </React.Fragment >
        );
    }
}

AccessDeniedContainer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccessDeniedContainer);