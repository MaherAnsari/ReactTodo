import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Auth from '@aws-amplify/auth';


const styles = theme => ({
    root: {
        width: '100%',
        // marginTop: '30px',
        // height: '88vh',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth:'1200px'
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
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

class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassWord: "",
            newPassword: "",
            confirmPassword: "",
            error: {},
            successMsg: false
        }
        this.onInputChange = this.onInputChange.bind(this);
        // this.changeNewPassword = this.changeNewPassword.bind(this);
        // this.changeCode = this.changeCode.bind(this);
        // this.handleForgotPasswordWithoutCode = this.handleForgotPasswordWithoutCode.bind(this);
        // this.handleForgotPasswordWithCodeRequest = this.handleForgotPasswordWithCodeRequest.bind(this);
        this.handelChangePassword = this.handelChangePassword.bind(this);
    }

    onInputChange(event) {
        let id = event.target.id;
        this.setState({ [id]: event.target.value, error: {} });

    }


    async getCurrentUserData() {
        try {
            var user = await Auth.currentAuthenticatedUser();
            if (user) {
                this.setState({
                    user: user
                })
            }
        } catch (e) {
            alert(e.message);
        }
    }

    async handelChangePassword(e) {

        e.preventDefault();

        try {
            if (this.checkIfInputAreValid()) {
                // var response = 
                await Auth.currentAuthenticatedUser()
                    .then(user => {
                        return Auth.changePassword(user, this.state.oldPassWord, this.state.newPassword);
                    })
                    .then(data => {
                        // console.log(data)
                        if (data === "SUCCESS") {
                            this.setState({ successMsg: true });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        let errorV = {};
                        errorV["confirmPassword"] = err.message;
                        this.setState({ error: errorV, successMsg: false });
                    });

                // if (response) {
                //     this.props.history.push(`/${localStorage.getItem('pepProviderName')}/login`);
                // }
            }
        } catch (e) {
            console.log(e);
        }
    }


    checkIfInputAreValid() {
        let isValid = true;
        let error = {};
        if (this.state.oldPassWord === "") {
            isValid = false;
            error["oldPassWord"] = "*Required ";
            this.setState({ error: error });
            return false;
        }

        if (this.state.newPassword === "") {
            isValid = false;
            error["newPassword"] = "*Required";
            this.setState({ error: error });
            return isValid;
        }

        if (this.state.confirmPassword === "") {
            let isValid = false;
            error["confirmPassword"] = "please enter the new password to confirm";
            this.setState({ error: error });
            return isValid;
        }

        if (this.state.newPassword !== this.state.confirmPassword) {
            error["confirmPassword"] = "Confirm password mismatch";
            this.setState({ error: error });
            return false;
        }

        return isValid;
    }


    async handleForgotPasswordWithCodeRequest(e) {
        e.preventDefault();
        try {
            var response = await Auth.forgotPasswordSubmit(this.state.username, this.state.code, this.state.newPassword);
            if (response) {
                // this.props.history.push(`/${ Utils.getpepProviderName() }/login`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    goBack(){
        this.props.history.goBack();
    }
    



    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper style={{ background: "#2e3247" , marginTop: "5%", padding:"20px"}}>
                    <Typography variant="headline"
                        style={{
                            fontSize: 20,
                            color: "#ffffff",
                            paddingTop: 20,
                            lineHeight:"60px",
                            fontWeight: 500,
                            fontFamily: "lato"
                        }}>
                        Change Password</Typography>
                    <React.Fragment>
                        <form className={classes.form} autoComplete="off" style={{ margin: '10px 50px' }}>

                            <FormControl margin="normal" required fullWidth >
                                <InputLabel
                                    htmlFor="oldPassWord"
                                    style={{ fontFamily: "lato",color:"#ffffff",fontWeight: 500, fontSize: 14 }}>
                                    Old Password</InputLabel>
                                <Input id="oldPassWord"
                                    name="oldPassWord"
                                    value={this.state.oldPassWord}
                                    type="password"
                                    onChange={this.onInputChange}
                                    autoComplete="off"
                                    autoFocus style={{ fontFamily: "'lato'", color: "#ffffff", fontWeight: 500, fontSize: 14 }} />
                                {this.state.error["oldPassWord"] && <span style={{ fontFamily: "lato", color: "red", fontWeight: 500,  fontSize: 11, textAlign: "left" }}>{this.state.error["oldPassWord"]} </span>}
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <InputLabel
                                    htmlFor="newPassword"
                                    style={{ fontFamily: "'lato'", fontWeight: 500,color:"#ffffff", fontSize: 14 }}>
                                    New Password </InputLabel>
                                <Input id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={this.onInputChange}
                                    autoComplete="off"
                                    style={{ fontFamily: "lato", color: "#ffffff", fontWeight: 500, fontSize: 14 }} />
                                {this.state.error["newPassword"] ? <span style={{ fontFamily: "lato", color: "red", fontWeight: 500, fontSize: 11, textAlign: "left" }}>{this.state.error["newPassword"]} </span> : ""}
                            </FormControl>

                            <FormControl margin="normal" required fullWidth >
                                <InputLabel
                                    htmlFor="confirmPassword"
                                    style={{ fontFamily: "'lato'", color:"#ffffff",fontWeight: 500, fontSize: 14 }}>
                                   Confirm Password</InputLabel>
                                <Input id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={this.onInputChange}
                                    autoComplete="off"
                                    style={{ fontFamily: "'lato'", color: "#ffffff", fontWeight: 500, fontSize: 14 }} />
                                {this.state.error["confirmPassword"] ? <span style={{ fontFamily: "lato", color: "red", fontWeight: 500,  fontSize: 12, textAlign: "left" }}>{this.state.error["confirmPassword"]}</span> : ""}
                                {this.state.successMsg && <span style={{ color: "#3fe33f", fontSize: 13, textAlign: "left" }}>SuccessFully Updated</span>}
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handelChangePassword}
                                className={this.props.classes.submit}
                                style={{ backgroundColor: '#36c2d8', color: 'white', fontSize: 15, fontFamily: "'lato'", fontWeight: 500 }}>
                                Submit
                            </Button>
                        </form>
                    </React.Fragment>

                    <div
                        style={{ color: "#ffffff", cursor: "pointer"}}
                        onClick={()=>{this.goBack()}}> 
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        &nbsp; Back 
                     </div>

                </Paper>
            </div>
        );
    }
}

ChangePasswordPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChangePasswordPage);
