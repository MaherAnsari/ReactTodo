import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Auth } from "aws-amplify";
// import Auth from '@aws-amplify/auth'
import { Redirect } from "react-router-dom";
import cookie from 'react-cookies';
import Utils from '../../app/common/utils';
import '../../assets/css/login.css';


import $ from 'jquery';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            // width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                password: '',
                loading: false,
                verifyCode: '',
                showVerification: false,
                userdata: null,
                newpassword: '',
                otp: ''
            },
            action: 'sigin',
            disabledLoginBtn: false,
        }

        this.getViewContent = this.getViewContent.bind(this);
        this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
        this.getSigninFragment = this.getSigninFragment.bind(this);
        this.getChangePasswordFragment = this.getChangePasswordFragment.bind(this);
        // this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleSigninSubmit = this.handleSigninSubmit.bind(this)
        this.handleNewPassword = this.handleNewPassword.bind(this)

    }

    componentDidMount() {
        $('.input100').each(function () {

            // setTimeout((function() {
            //     alert($("#username").val());

            // }).bind(this), 5000);
            // if($('.input100').val().length > 0){
            //     $(this).addClass('has-val');
            // }
            $(this).on('blur', function () {
                if ($(this).val().trim() !== "") {
                    $(this).addClass('has-val');
                }
                else {
                    $(this).removeClass('has-val');
                }
            })
        })
    }

    handleValueChange = event => {
        const user = this.state.user;
        user[event.target.name] = event.target.value;
        this.setState({ user: user });
    }

    getSigninFragment() {
        return (

            <form className="login100-form validate-form">
                <img src="https://static.wixstatic.com/media/3ae3ef_e4ffe8f5fc524099b6a01ad4652b5bed~mv2.png/v1/fill/w_153,h_46,al_c,q_80,usm_1.20_1.00_0.01/Bijak%20Agritech%20Logo.webp" alt="logo" style={{ height: '8vh' }} />
                <span className="login100-form-title p-b-43" style={{display:'none', marginBottom: '16px' }}>
                    Bijak
				            	</span>

                <span style={{ marginBottom: '10px' }}></span>
                <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                    <input className="input100" value={this.state.user.username}
                        onChange={this.handleValueChange} type="text" id="username" name="username" />
                    <span className="focus-input100"></span>
                    <span className="label-input100">Mobile No.</span>
                </div>


                <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <input className="input100"
                        onChange={this.handleValueChange}
                        value={this.state.user.password}
                        name="password"
                        type="password"
                        id="password" />
                    <span className="focus-input100"></span>
                    <span className="label-input100">Password</span>
                </div>

                <div className="flex-sb-m w-full p-t-3 p-b-32">

                </div>

                <div className="container-login100-form-btn">
                    <button className="login100-form-btn"
                        disabled={this.state.disabledLoginBtn}
                        onClick={this.handleSigninSubmit}>
                        Login {this.state.disabledLoginBtn ? <i className="fa fa-spinner fa-spin tableContainer"></i> : ""}
                    </button>
                </div>
            </form>




        )
    }
    // url('images/bg-01.jpg')}
    getChangePasswordFragment() {
        return (

            <form className="login100-form validate-form">
                <img src='https://static.wixstatic.com/media/3ae3ef_e4ffe8f5fc524099b6a01ad4652b5bed~mv2.png/v1/fill/w_153,h_46,al_c,q_80,usm_1.20_1.00_0.01/Bijak%20Agritech%20Logo.webp' alt="logo" style={{ height: '8vh' }} />
                <span className="login100-form-title p-b-43" style={{ display: 'none' }}>
                    Forgot Password ! we will help you to get a new One
            </span>

                <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <input className="input100"
                        onChange={this.handleValueChange}
                        value={this.state.user.newpassword}
                        type="password"
                        name="newpassword"
                        id="newpassword" />
                    <span className="focus-input100"></span>
                    <span className="label-input100">Password</span>
                </div>
                <div className="flex-sb-m w-full p-t-3 p-b-32">
                </div>

                <div className="container-login100-form-btn">
                    <button className="login100-form-btn" onClick={this.handleNewPassword}>
                        Login
                    </button>
                </div>
            </form>

        )
    }

    getMFAOtpFragment() {
        return (

            <form className="login100-form validate-form">
                <img src='https://static.wixstatic.com/media/3ae3ef_e4ffe8f5fc524099b6a01ad4652b5bed~mv2.png/v1/fill/w_153,h_46,al_c,q_80,usm_1.20_1.00_0.01/Bijak%20Agritech%20Logo.webp' alt="logo" style={{ height: '8vh', marginBottom: '10px' }} />
                <span className="login100-form-title p-b-43"
                    style={{ display: 'none' }}>
                    Otp
                </span>


                <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                    <input className="input100"
                        name="otp"
                        type="text"
                        id="otp"
                        onChange={this.handleValueChange}
                        value={this.state.user.otp} />
                    <span className="focus-input100"></span>
                    <span className="label-input100">Otp</span>
                </div>

                <div className="flex-sb-m w-full p-t-3 p-b-32">
                </div>
                <div className="container-login100-form-btn">
                    <button className="login100-form-btn" onClick={this.handleVerifyOtp}>
                        Continue
					</button>
                </div>
            </form>

        )
    }



    getViewContent = (action) => {

        if (action === 'sigin') {
            return this.getSigninFragment();
        }

        if (action === 'NEW_PASSWORD_REQUIRED') {
            return this.getChangePasswordFragment();
        }

        if (action === 'SMS_MFA') {
            return this.getMFAOtpFragment();
        }
    }

    async handleSigninSubmit(e) {
        e.preventDefault()
        this.setState({ disabledLoginBtn: true })
        console.log(this.state.user);
        // console.log('Entered:', this.state)
        try {

            var data = await Auth.signIn(this.state.user.username, this.state.user.password);
            if (data) {
                console.log(data)
                this.setState({
                    userdata: data
                })
                if (data && data.challengeName === "NEW_PASSWORD_REQUIRED") {
                    let action = data.challengeName;
                    this.setState({ action: action });
                    return;
                }
                if (data && data.challengeName === 'SMS_MFA') {
                    let action = data.challengeName;
                    this.setState({ action: action });
                    return;
                }
                // console.log(data);
                var authk = data.signInUserSession.idToken.jwtToken;
                var username = data.signInUserSession.idToken.payload.name;
                var userId = data.username;
                cookie.save('userId', userId, { path: '/' });
                cookie.save('token', authk, { path: '/' });
                cookie.save('username', username, { path: '/' });
                // console.log(cookie);
             
                    this.props.history.push("/home/mandi-data");
                

            }
        } catch (e) {
            alert(e.message);
        }
        this.setState({ disabledLoginBtn: false });
    }

    async handleNewPassword(e) {
        e.preventDefault()
        console.log(this.state.user);
        try {
            // Auth.completeNewPassword()
            Auth.signIn(this.state.user.username, this.state.user.password)
                .then(user => {
                    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
                        Auth.completeNewPassword(
                            user,               // the Cognito User Object
                            this.state.user.newpassword,       // the new password
                            {
                                email: 'xxxx@example.com',
                                phone_number: this.state.user.username
                              }
                        ).then(user => {
                            // at this time the user is logged in if no MFA required
                            console.log(user);
                            this.setState({
                                userdata: user
                            })
                            // Auth.currentAuthenticatedUser({
                            // }).then(user => {
                            //     console.log(user);
                            //     user.deviceKey = user.getCachedDeviceKeyAndPassword();
                            //     console.log(user.deviceKey);
                            //     user.setDeviceStatusRemembered({
                            //         onSuccess: function (result) {
                            //             console.log('call result: ' + result);
                            //             // alert('call result: ' + result);
                            //         },
                            //         onFailure: function (err) {
                            //             console.log(JSON.stringify(err));
                            //         }
                            //     });
                            // })
                            //     .catch(err => console.log("_^_" + JSON.stringify(err)))
            
                            var authk = user.signInUserSession.idToken.jwtToken;
                            var username = user.signInUserSession.idToken.payload.name;
                            cookie.save('token', authk, { path: '/' })
                            cookie.save('username', username, { path: '/' });
                            var userId = user.username;
                            cookie.save('userId', userId, { path: '/' });
                            // this.props.history.push("/" + Utils.getDbName() + "/home/mandi-data");
                           
                                this.props.history.push("/home/mandi-data");
                            
                        }).catch(e => {
                            console.log(e);
                        });
                    } else {
                        // other situations
                    }
                }).catch(e => {
                    console.log(e);
                });
            

        } catch (e) {
            alert(e.message);
        }
    }

    async handleVerifyOtp(e) {
        e.preventDefault()
        try {
            var data = await Auth.confirmSignIn(this.state.userdata, this.state.user.otp, this.state.action);
            if (data) {
                this.setState({
                    userdata: data
                })
                // Auth.currentAuthenticatedUser({
                // }).then(user => {
                //     console.log(user);
                //     user.deviceKey = user.getCachedDeviceKeyAndPassword();
                //     console.log(user.deviceKey);
                //     user.setDeviceStatusRemembered({
                //         onSuccess: function (result) {
                //             console.log('call result: ' + result);
                //             // alert('call result: ' + result);
                //         },
                //         onFailure: function (err) {
                //             console.log(JSON.stringify(err));
                //         }
                //     });
                // })
                //     .catch(err => console.log("_^_" + JSON.stringify(err)))

                var authk = data.signInUserSession.idToken.jwtToken;
                var username = data.signInUserSession.idToken.payload.name;
                cookie.save('token', authk, { path: '/' })
                cookie.save('username', username, { path: '/' });
                var userId = data.username;
                cookie.save('userId', userId, { path: '/' });
                // this.props.history.push("/" + Utils.getDbName() + "/home/mandi-data");
         
                    this.props.history.push("/home/mandi-data");
                
            } else {
                alert("failed in login");
            }
        } catch (e) {
            alert(e.message);
        }
    }

    async handleVerifyOtp(e) {
        e.preventDefault()
        try {
            var data = await Auth.confirmSignIn(this.state.userdata, this.state.user.otp, this.state.action);
            if (data) {
                this.setState({
                    userdata: data
                })
                // Auth.currentAuthenticatedUser({
                // }).then(user => {
                //     console.log(user);
                //     user.deviceKey = user.getCachedDeviceKeyAndPassword();
                //     console.log(user.deviceKey);
                //     user.setDeviceStatusRemembered({
                //         onSuccess: function (result) {
                //             console.log('call result: ' + result);
                //             // alert('call result: ' + result);
                //         },
                //         onFailure: function (err) {
                //             console.log(JSON.stringify(err));
                //         }
                //     });
                // })
                //     .catch(err => console.log("_^_" + JSON.stringify(err)))

                var authk = data.signInUserSession.idToken.jwtToken;
                var username = data.signInUserSession.idToken.payload.name;
                cookie.save('token', authk, { path: '/' })
                cookie.save('username', username, { path: '/' });
                var userId = data.username;
                cookie.save('userId', userId, { path: '/' });
                // this.props.history.push("/" + Utils.getDbName() + "/home/mandi-data");
               
                    this.props.history.push("/home/mandi-data");
                
            } else {
                alert("failed in login");
            }
        } catch (e) {
            alert(e.message);
        }
    }

    render() {
        if (cookie.load('token')) {
            // return <Redirect to={"/" + Utils.getDbName() + "/home/mandi-data"} />;
           
                return <Redirect to={"/home/mandi-data"} />;
            
        }

        return (
            <React.Fragment>
                <CssBaseline />
                <main className={this.props.classes.layout}>
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100">
                                {this.getViewContent(this.state.action)}
                                <div className="login100-more" >
                                    {/* this div is for the backgroud image */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </React.Fragment >
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);