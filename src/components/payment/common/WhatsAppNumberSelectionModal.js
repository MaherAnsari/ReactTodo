import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import commonService from '../../../app/commonService/commonService';
import SweetAlertPage from '../../../app/common/SweetAlertPage';

const styles = theme => ({

    dialogPaper: {
        minWidth: '600px',
        // maxWidth: '700px',
        // minHeight: '700px',
        // maxHeight: '500px'
    },
    dialogPaperdefaultpayout: {
        minWidth: '400px',
        maxWidth: '500px',
        // minHeight: '700px',
        // maxHeight: '500px'
    },
    minWidth: '600px',
    actcardtext: {
        fontSize: "15px",
        fontFamily: "lato"
    },
    actCardc: {
        boxShadow: "0px 0px 7px 0px rgba(0,0,0,0.75)",
        padding: "10px",
        margin: "10px",
        // width:"80%",
        borderLeft: "5px solid #ec7596",
        borderRadius: "5px"
    }
});


class WhatsAppNumberSelectionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            transactionInfoData: this.props.transactionInfoData,
            selectedUser: "supplier",
            otherNumber: "",

            showSweetAlert: false,
            sweetAlertData: {
                "type": "",
                "title": "",
                "text": ""
            }
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.OnModalCancelled();
    }

    handleUserChange(event) {
        this.setState({ selectedUser: event.target.value });
    }

    onInputChanged(event) {
        let val = event.target.value;
        if (!isNaN(val)) {
            this.setState({ otherNumber: event.target.value });
        }

    }

    async sendReceiptToWhatsapp(event) {
        try {
            let whatsappNumber = "";
            if (this.state.selectedUser === "supplier") {
                whatsappNumber = this.state.transactionInfoData["supplier_mobile"];
            } else if (this.state.selectedUser === "buyer") {
                whatsappNumber = this.state.transactionInfoData["buyer_mobile"];
            } else if (this.state.selectedUser === "other") {
                if (this.state.otherNumber === "") {
                    alert("Please enter the number.");
                    return;
                } else if (this.state.otherNumber.length < 10) {
                    alert("Please enter a valid number.");
                    return;
                }
                whatsappNumber = this.state.otherNumber;
            }
            let payload = { "mobile": whatsappNumber, "id": this.state.transactionInfoData["id"] }
            // let resp = { data:{ status : 0}}
            let resp = await commonService.sendinvoicefromwhatsapp(payload);
            console.log(resp);
            let sweetAlrtData = this.state.sweetAlertData;
            if (resp.data.status === 1) {
                // alert("Receipt sent to whatsapp number " + whatsappNumber);
                sweetAlrtData["type"] = "success";
                sweetAlrtData["title"] = "Success";
                sweetAlrtData["text"] = "Receipt sent to whatsapp number " + whatsappNumber;
            } else {
                // alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error sending the watsapp receipt");
                // alert("Oops there was an error sending the watsapp receipt");

                sweetAlrtData["type"] = "error";
                sweetAlrtData["title"] = "Error";
                sweetAlrtData["text"] = resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error sending the watsapp receipt";
            }
            // this.handleDialogCancel();

            this.setState({
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });

        } catch (err) {
            console.error(err)
            this.setState({ open: false }, () =>
                alert("Oops there was an error sending the receipt")
            );
        }
    }

    handelSweetAlertClosed() {
        this.setState({ showSweetAlert: false }, () =>
            this.handleDialogCancel()
        )
    }

    render() {
        const { classes } = this.props;
        const { transactionInfoData, selectedUser, otherNumber, showSweetAlert, sweetAlertData } = this.state;

        return (<div>
            <Dialog style={{ zIndex: '99999' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Confirm Number For Whatsapp </p>
                </DialogTitle>
                <DialogContent>
                    <React.Fragment>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Select Whom to send the receipt</FormLabel>
                            <RadioGroup aria-label="position" name="position" value={selectedUser}
                                onChange={this.handleUserChange.bind(this)}
                                row>
                                <FormControlLabel
                                    value="supplier"
                                    control={<Radio color="primary" />}
                                    label={transactionInfoData["supplier_mobile"] ? "LA (" + transactionInfoData["supplier_mobile"] + ")" : "Supplier"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="buyer"
                                    control={<Radio color="primary" />}
                                    label={transactionInfoData["buyer_mobile"] ? "CA (" + transactionInfoData["buyer_mobile"] + ")" : "Buyer"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="other"
                                    control={<Radio color="primary" />}
                                    label="Other"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>

                        {selectedUser === "other" && <div>
                            <TextField
                                required
                                value={otherNumber}
                                style={{ width: "100%" }}
                                id="standard-required"
                                onChange={this.onInputChanged.bind(this)}
                                label="Enter Mobile Number" />
                        </div>}
                    </React.Fragment>

                    {showSweetAlert &&
                    <SweetAlertPage
                        show={true}
                        style={{zIndex :999999}}
                        type={sweetAlertData.type}
                        title={sweetAlertData.title}
                        text={sweetAlertData.text}
                        sweetAlertClose={() => this.handelSweetAlertClosed()}
                    />}
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={(event) => this.sendReceiptToWhatsapp(event)} color="primary">Send</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

WhatsAppNumberSelectionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WhatsAppNumberSelectionModal);