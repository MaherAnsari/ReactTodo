import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const styles = theme => ({
    paper: {
        maxHeight: 500,
        background: "transparent",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
        boxShadow: "0 !important",
    },
    dialogPaper: {
        minWidth: '500px',
        maxWidth: '500px'
    },
    textField: {
        fontSize: 14,
        fontFamily: "Montserrat",
        fontWeight: 500
    }
});


const theme = createMuiTheme({
    overrides: {
        MuiFormLabel: {
            root: {
                fontSize: 14,
                fontFamily: "Montserrat",
                fontWeight: 500
            }
        },
        MuiButton: {
            label: {
                fontSize: 14,
                fontFamily: "Montserrat",
                fontWeight: 600
            }
        },

        MuiInput: {
            underline: {
                // borderBottom: "2px solid #ffffff",
                fontSize: 14,
                fontFamily: "Montserrat",
                fontWeight: 500
            }
        },
        MuiInputBase: {
            inputType: {
                // color: "white",
                fontSize: 14,
                fontFamily: "Montserrat",
                fontWeight: 500
                // textAlign: "center"
            },
            input: {
                // color: "white",
                fontSize: 14,
                fontFamily: "Montserrat",
                fontWeight: 500
                // textAlign: "le"
            }

        },
        MuiTypography: {
            title: {
                fontSize: 22,
                fontFamily: "Montserrat",
                fontWeight: 600
            }
        }

    }
});


class EmailInputModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            open: this.props.show,
            dialogTitle: "Enter your email",
            errorMsg: "",
            enteredEmail: "",
            isEmailSentSuccess: "emailView"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.state) {
            this.setState({ open: nextProps.show, isEmailSentSuccess: nextProps.isEmailSentSuccess });
        }
    }

    validateEmail(emailId) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) //eslint-disable-line
        {
            return (true)
        }
        return (false)
    }


    handleConfirmed = () => {
        if (this.state.enteredEmail && this.state.enteredEmail !== "") {
            if (this.validateEmail(this.state.enteredEmail)) {
                this.setState({ open: false }, function () {
                    this.props.onConfirmed(this.state.enteredEmail);
                });
            } else {
                this.setState({ errorMsg: "Please enter a valid email" });
            }
        } else {
            this.setState({ errorMsg: "Email is required" });
        }
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.onCanceled();
    };

    handelInputChange(typeOfDD, event) {
        this.setState({ [typeOfDD]: event.target.value, errorMsg: "" });
    }


    render() {
        const { fullScreen, classes } = this.props;
        // console.log( this.state.isEmailSentSuccess  );
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        fullScreen={fullScreen}
                        // style={{width: 700}}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        classes={{ paper: classes.dialogPaper }}
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        {/* <DialogTitle id="responsive-dialog-title" style={{
                            fontSize: 14,
                            fontFamily: "Montserrat",
                            fontWeight: 600,
                            textAlign:"center"
                    }}>{this.state.dialogTitle}
                    </DialogTitle> */}
                        {this.state.isEmailSentSuccess === "emailView" &&
                            <DialogContent style={{ textAlign: "center" }}>

                                <i className="fa fa-file-text text-gray"
                                    style={{ fontSize: "56px", color: "rgba(0,0,0,.3)" }} aria-hidden="true" ></i>
                                <h4 style={{
                                    fontWeight: "600",
                                    margin: "10px 0 0 0",
                                    fontSize: "20px"
                                }}> Get Downlaodable link   </h4>
                                <p style={{
                                    fontSize: "12px",
                                    marginBottom: "0",
                                    marginTop:"10px"
                                }} >After entering your emailID please click on 'Submit' Button. We will capture your request and report will be dispatched on entered emailID in next 15 minutes. In case something goes wrong please contact admin.</p>
                                <div className={classes.container} noValidate autoComplete="off">
                                    <TextField
                                        id="enteredEmail"
                                        label="Please enter your email"
                                        fullWidth
                                        className={classes.textField}
                                        // classes={{ input: classes.textField }}
                                        value={this.state.enteredEmail}
                                        onChange={this.handelInputChange.bind(this, "enteredEmail")}
                                        margin="normal"
                                    />
                                    {this.state.errorMsg &&
                                        this.state.errorMsg !== "" &&
                                        <div style={{
                                            float: "left",
                                            color: "#ff0000",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            fontFamily: "Montserrat"
                                        }}>
                                            {this.state.errorMsg} </div>}
                                </div>

                            </DialogContent>}
                        {(this.state.isEmailSentSuccess === "success" || this.state.isEmailSentSuccess === "failed") &&
                            <DialogContent style={{ textAlign: "center" }}>
                                <i className="fa fa-file-text text-gray"
                                    style={{ fontSize: "56px", color: (this.state.isEmailSentSuccess === "success" ? "green" : "red") }} aria-hidden="true" ></i>

                                <h4 style={{
                                    fontWeight: "600",
                                    color: (this.state.isEmailSentSuccess === "success" ? "#1c394b" : "red"),
                                    fontSize: "20px"
                                }}> {this.state.isEmailSentSuccess === "success" ? "Request submitted successfully" : "Failed"} </h4>
                                <p style={{
                                    fontSize: "12px",
                                    marginBottom: "0"
                                }} > {this.state.isEmailSentSuccess === "success" ? "Your request has been Successfully processed. You will receive the email within 15 min." : "Opps an error occured. Please try again later"}  </p>
                            </DialogContent>}

                        {this.state.isEmailSentSuccess === "emailView" &&
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                            </Button>
                                <Button onClick={this.handleConfirmed} style={{
                                    background: "#4b9ca2",
                                    color: "#fff"

                                }} color="primary" autoFocus>
                                    Submit
                            </Button>
                            </DialogActions>}
                        {(this.state.isEmailSentSuccess === "success" || this.state.isEmailSentSuccess === "failed") &&
                            <DialogActions style={{ justifyContent: "center" }}>
                                <Button onClick={this.handleClose} style={{
                                    background: "#1c394b",
                                    color: "#fff"

                                }} color="primary">
                                    Close
                                </Button>
                            </DialogActions>}
                        {this.state.isEmailSentSuccess === "loading" &&
                            <DialogContent style={{ textAlign: "center" }}>
                                <i className="fa fa-spinner fa-spin"
                                    style={{ fontSize: "56px", color: "blue" }} aria-hidden="true" ></i>
                                <p style={{
                                    fontSize: "14px",
                                    marginBottom: "0"
                                }} >
                                    Your request is in process. Please wait..
                                </p>
                            </DialogContent>}
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default withStyles(styles)(EmailInputModal);