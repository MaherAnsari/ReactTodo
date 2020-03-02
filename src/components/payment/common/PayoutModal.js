import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import paymentService from '../../../app/paymentService/paymentService';
import Loader from '../../common/Loader';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Utils from './../../../app/common/utils';
import { getAccessAccordingToRole } from '../../../config/appConfig';
// import commonService from '../../../app/commonService/commonService';
import orderService from '../../../app/orderService/orderService';


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

class PayoutModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openPayoutModal,
            payoutData: this.props.payoutData,
            acctData: [],
            currentPayoutView: "defaultPayout", //selectAccount, addAccount,loading
            addAccountData: {
                actno: "",
                ifsc: "",
                actholdername: ""
            },
            errorFields: {},
            // acctDetails:{
            //     acctNo:"0038xxxxxxxxxx786",
            //     ifsc:"ICICI003890",
            //     acctName:"Sanchit Jain"
            // }
            acctDetails: undefined,
            transferType: "NEFT",

            skipRazorPayTrans: true,
            skipRazorPayTransObj: {
                "bank_id": "",
                "utr": "",
                "remarks": ""
            },
            errorFieldsOfSkipTrans: {},
            // showChangeBankAcctOption : false,
            selected_bank_detail: {
                "bank_map_id": null,
                "bank_ifsc_code": "",
                "bank_account_number": "",
                "bank_account_holder_name": ""
            },
            selectedAcctInfoIndex: undefined,
            narration: "",
            narrationError: false
        }
        console.log(this.props.payoutData)
    }

    componentWillMount() {
        this.getBankDetails(this.props.payoutData["id"])
    }

    getBankDetails = async (id) => {
        try {
            let resp = await paymentService.getBankAcctDetails(id);
            if (resp.data.status === 1) {
                // console.log(resp.data.result)
                this.setState({ acctDetails: resp.data.result })
            } else {
                alert("An error occured while getting the account details");
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }

    getBankDetailsList = async (mobile) => {
        try {
            this.setState({ currentPayoutView: "loading" });
            // let param = { "mobile": mobile };
            // let resp = await commonService.getbankDetail(param);
            let resp = await orderService.getOrderAcount(mobile);
            if (resp.data.status === 1) {
                if (resp.data.result) {
                    this.setState({ currentPayoutView: "selectAccount", acctData: resp.data.result || [] });
                } else {
                    this.setState({ currentPayoutView: "selectAccount", acctData: resp.data.result })
                }
            } else {
                alert("An error occured while getting the account details");
                this.setState({ currentPayoutView: "defaultPayout" });
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onPayoutModalClose();
    }



    handleInputChange(event) {
        event.preventDefault();
        var intejarIds = ["actno"]; // this values need to be intejar
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var addAccountDataVal = this.state.addAccountData;
        if (intejarIds.indexOf(id) > -1) {
            if (val === "" || !isNaN(val)) {
                addAccountDataVal[id] = Number(val);
            }
        } else {
            addAccountDataVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addAccountData: addAccountDataVal,
            errorFields: errors
        })
        // console.log(addAccountDataVal)
    }

    handleSkipRazorInputChange(event) {
        event.preventDefault();
        var val = event.target.value;
        var id = event.target.id;
        var errors = this.state.errorFieldsOfSkipTrans;
        var skipRazorPayTransObjVal = this.state.skipRazorPayTransObj;
        skipRazorPayTransObjVal[id] = val;
        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            skipRazorPayTransObj: skipRazorPayTransObjVal,
            errorFieldsOfSkipTrans: errors
        })
    }

    checkForValidFormOnSkipTransaction() {
        var isvalid = true;
        let skipRazorPayTransObjVal = this.state.skipRazorPayTransObj;
        let errors = this.state.errorFieldsOfSkipTrans;
        for (let key in skipRazorPayTransObjVal) {
            if (skipRazorPayTransObjVal[key] === "") {
                isvalid = false;
                errors[key] = true;
            }
        }
        this.setState({ errorFieldsOfSkipTrans: errors });
        return isvalid;
    }


    checkForInvalidFields(data) {
        var isValid = true;
        var error = {};
        for (var key in data) {
            if (data[key] === "") {
                error[key] = true;
                isValid = false;
            }
        }
        this.setState({ errorFields: error });
        return isValid;
    }

    onNewAccountSaveClicked(event) {
        if (this.checkForInvalidFields(this.state.addAccountData)) {
            this.setState({ currentPayoutView: "selectAccount" });
        } else {
            alert("Please fill the reqd. fields")
        }
    }

    handelAccountSelection(actInfo, index, event) {
        let bank_detailVal = this.state.selected_bank_detail;
        console.log(actInfo)
        console.log(index)

        bank_detailVal["bank_map_id"] = actInfo.hasOwnProperty("bank_map_id") ? actInfo["bank_map_id"] : null;
        bank_detailVal["bank_account_holder_name"] = actInfo["bank_account_holder_name"];
        bank_detailVal["bank_account_number"] = actInfo["bank_account_number"];
        bank_detailVal["bank_ifsc_code"] = actInfo["bank_ifsc_code"];
        this.setState({ selectedAcctInfoIndex: index, selected_bank_detail: bank_detailVal, acctDetails: bank_detailVal })
    }

    onConfirmPayout = async () => {
        try {

            let payload = {};
            payload["id"] = this.props.payoutData["id"];
            payload["name"] = this.props.payoutData["supplier_fullname"];
            payload["contact"] = this.props.payoutData["supplier_mobile"];
            payload["type"] = "Loader";
            payload["buyer_name"] = this.props.payoutData["buyer_business_name"] || this.props.payoutData["buyer_fullname"];
            payload["amount"] = this.props.payoutData["amount"];
            payload["reference_id"] = this.props.payoutData["supplier_fullname"];
            payload["notes"] = {};
            payload["mode"] = this.state.transferType;

            if (!this.state.skipRazorPayTrans && this.state.narration && this.state.narration !== "" && this.state.narration.trim() !== "") {
                payload["narration"] = this.state.narration;
            }

            if (this.state.skipRazorPayTrans) {
                if (this.checkForValidFormOnSkipTransaction()) {
                    payload["skipRazorpayX"] = true;
                    payload["bank_id"] = this.state.skipRazorPayTransObj["bank_id"];
                    payload["utr"] = this.state.skipRazorPayTransObj["utr"];
                    payload["remarks"] = this.state.skipRazorPayTransObj["remarks"];
                } else {
                    alert("Please enter the reqd. fields.")
                    return;
                }
            } else {
                // on bank account changed,  also ignore in the case of skip razorpay
                if (this.state.selectedAcctInfoIndex || this.state.selectedAcctInfoIndex === 0) {
                    payload["is_bank_update"] = true;
                    payload["bank_details"] = this.state.selected_bank_detail;
                }
            }




            this.setState({ currentPayoutView: "loading" });
            // let resp = { data : { status : 0 }};

            // console.log(payload)
            let resp = await paymentService.confirmPayout(payload);
            if (resp.data.status === 1) {
                // console.log(payload)
                alert("Successfully completed");

            } else {
                alert(resp && resp.data && resp.data.message ? resp.data.message : "An error occured while payout");
                // this.setState({ showChangeBankAcctOption : true });
            }
            this.setState({ currentPayoutView: "defaultPayout" }, () => {
                this.props.onPayoutSuccessfull();
            });
        } catch (err) {
            console.error(err);
            this.setState({ currentPayoutView: "defaultPayout" });
            alert("Oops an error occured while payout");
        }
    }

    handelPaymentThroughChanged(event) {
        this.setState({
            transferType: event.target.value
        });
    }

    changeAccountInfoClicked() {
        this.setState({ currentPayoutView: "selectAccount" }, () => this.getBankDetailsList(this.props.payoutData["supplier_mobile"]));
    }

    handelNarrationChange(event) {
        var letterNumber = /^[0-9a-zA-Z]+$/;
        let inputtxt = event.target.value;
        if (inputtxt.length >= 0 && inputtxt.length <= 30 ) {
            if (inputtxt.match(letterNumber) || inputtxt === "") {
                this.setState({ narration: inputtxt, narrationError: false });
            } else {
                this.setState({ narrationError: true });
            }
        }
    }


    render() {
        const { classes } = this.props;
        const { transferType, acctDetails, payoutData, acctData, selectedAcctInfoIndex,
            currentPayoutView, addAccountData, errorFields,
            skipRazorPayTrans, skipRazorPayTransObj, errorFieldsOfSkipTrans } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '9999' }}
                open={this.state.open}
                fullWidth={true}
                classes={{ paper: currentPayoutView !== "defaultPayout" ? classes.dialogPaper : classes.dialogPaperdefaultpayout }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '40px' }}
                    id="form-dialog-title">
                    <div>
                        <div style={{ textAlign: "center", color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Payout
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>

                    {currentPayoutView === "defaultPayout" &&
                        (acctDetails ?
                            <React.Fragment>
                                <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                    <span className={classes.actcardtext} style={{ width: "60%" }}> Supplier Name  : &nbsp; <strong> {payoutData["supplier_fullname"]}</strong>  </span>
                                    <span className={classes.actcardtext} > Amount  : &nbsp;<strong style={{ color: "red" }}> ₹ {Utils.formatNumberWithComma(payoutData["amount"])}  </strong></span> </div>

                                <div className={classes.actCardc} >
                                    <div className={classes.actcardtext} style={{
                                        textDecoration: "underline",
                                        textTransform: "uppercase",
                                        paddingBottom: "4px"
                                    }}> Account details </div>
                                    {acctDetails !== "-" && acctDetails !== "" ?
                                        <span>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Number     </span>: &nbsp;<strong className={classes.actcardtext} > {acctDetails["bank_account_number"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Ifsc               </span>: &nbsp;<strong className={classes.actcardtext} style={{ textTransform: "uppercase" }} > {acctDetails["bank_ifsc_code"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Holder Name</span>: &nbsp;<strong className={classes.actcardtext} > {acctDetails["bank_account_holder_name"]} </strong> </div>
                                            {/* {showChangeBankAcctOption &&  */}
                                            <div style={{ textAlign: "center", marginTop: "5%" }}> <span onClick={() => this.changeAccountInfoClicked()} className={classes.actcardtext} style={{ padding: "3px 5px", background: "#E91E63", borderRadius: "4px", color: "#fff", cursor: "pointer" }}> Select another account </span></div>
                                        </span> :
                                        <div style={{ padding: "14px" }} className={classes.actcardtext} >
                                            Oops no bank account available.
                                    </div>}
                                </div>
                                <div>
                                    {acctDetails !== "-" && acctDetails !== "" && <FormControl component="fieldset" style={{ padding: "5px" }}>
                                        <FormLabel component="legend" style={{ fontSize: "15px", fontFamily: "lato" }}>Select transfer type</FormLabel>
                                        <RadioGroup aria-label="position" name="position" value={transferType} onChange={this.handelPaymentThroughChanged.bind(this)} row>
                                            <FormControlLabel
                                                value="NEFT"
                                                control={<Radio color="primary" />}
                                                label="NEFT"
                                                style={{ fontSize: "14px", fontFamily: "lato" }}
                                                labelPlacement="end"
                                            />
                                            <FormControlLabel
                                                value="IMPS"
                                                control={<Radio color="primary" />}
                                                label="IMPS"
                                                disabled={payoutData["amount"] > 200000}
                                                style={{ fontSize: "14px", fontFamily: "lato" }}
                                                labelPlacement="end"
                                            />
                                            <FormControlLabel
                                                value="RTGS"
                                                control={<Radio color="primary" />}
                                                label="RTGS"
                                                disabled={payoutData["amount"] < 200000}
                                                style={{ fontSize: "14px", fontFamily: "lato" }}
                                                labelPlacement="end"
                                            />
                                        </RadioGroup>
                                        {this.state.transferType === "NEFT" && <FormHelperText>*After 6 PM (IST) This request will be processed on Next Working Day</FormHelperText>}
                                        {this.state.transferType === "RTGS" && <FormHelperText>*After 5 PM (IST) This request will be processed on Next Working Day</FormHelperText>}
                                        {payoutData["amount"] > 200000 && <FormHelperText>*IMPS is not available as amount is greater than 2,00,000</FormHelperText>}

                                        <TextField
                                            margin="dense"
                                            id="narration"
                                            error={this.state.narrationError}
                                            label="Enter narration (optional)"
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={this.state.narration}
                                            onChange={this.handelNarrationChange.bind(this)}
                                            helperText={this.state.narrationError ? "*Special characters are not allowed" : ""}
                                            fullWidth />

                                    </FormControl>}
                                </div>
                                <div>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={skipRazorPayTrans}
                                            value="skipTransaction"
                                            onChange={(event) => this.setState({ skipRazorPayTrans: event.target.checked })} />
                                        }
                                        label="Skip Razorpay transaction" />

                                </div>
                                {skipRazorPayTrans && <div >

                                    <TextField
                                        margin="dense"
                                        id="bank_id"
                                        error={errorFieldsOfSkipTrans["bank_id"] ? true : false}
                                        label="Bank id"
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={skipRazorPayTransObj.bank_id}
                                        onChange={this.handleSkipRazorInputChange.bind(this)}
                                        fullWidth />

                                    <TextField
                                        margin="dense"
                                        id="utr"
                                        label="UTR"
                                        error={errorFieldsOfSkipTrans["utr"] ? true : false}
                                        type="text"
                                        style={{ width: '100%', textTransform: "uppercase" }}
                                        value={addAccountData.utr}
                                        onChange={this.handleSkipRazorInputChange.bind(this)}
                                        fullWidth />

                                    <TextField
                                        margin="dense"
                                        id="remarks"
                                        label="Remark"
                                        error={errorFieldsOfSkipTrans["remarks"] ? true : false}
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={addAccountData.remarks}
                                        onChange={this.handleSkipRazorInputChange.bind(this)}
                                        fullWidth />
                                </div>}

                                {acctDetails !== "-" && acctDetails !== "" && getAccessAccordingToRole("payViaCredit") &&
                                    <div style={{ textAlign: "center", paddingTop: "10px" }}>
                                        <Button
                                            variant="contained"
                                            onClick={(event) => this.onConfirmPayout()}
                                            style={{ background: "blue", color: "#fff" }}>
                                            CONFIRM PAYOUT
                            </Button>
                                    </div>}
                            </React.Fragment>
                            :
                            <Loader />)}

                    {currentPayoutView === "selectAccount" && <React.Fragment>
                        {acctData && acctData.length > 0 ? <div> Select an Account </div> : <div> Please add an account to continue </div>}
                        <List className={classes.root}>
                            {acctData && acctData.map((obj, index) => {
                                const labelId = `checkbox-list-label-${index}`;
                                return (
                                    <ListItem key={index} role={undefined} dense button
                                        onClick={this.handelAccountSelection.bind(this, obj, index)}>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectedAcctInfoIndex || selectedAcctInfoIndex === 0 ? selectedAcctInfoIndex === index : false}
                                                tabIndex={-1}
                                                disableRipple={false}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            id={labelId}
                                            primary={obj["bank_account_holder_name"]}
                                            secondary={"IFSC : " + (obj["bank_ifsc_code"] ? obj["bank_ifsc_code"].toUpperCase() : obj["bank_ifsc_code"]) + ", Account no. : " + obj["bank_account_number"]} />
                                        {(selectedAcctInfoIndex || selectedAcctInfoIndex === 0 ? selectedAcctInfoIndex === index : false) &&
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="comments">
                                                    <CheckCircleOutlineIcon style={{ color: "green" }} />
                                                </IconButton>
                                            </ListItemSecondaryAction>}
                                    </ListItem>
                                );
                            })}
                        </List>
                        <div>
                            {/* <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "addAccount" })}
                                style={{ background: "blue", color: "#fff" }}>Add a new Account</Button> */}
                            {!acctData || acctData.length === 0 ?
                                <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "defaultPayout" })}
                                    style={{ background: "blue", color: "#fff" }}>Back</Button> : ""}
                            {selectedAcctInfoIndex || selectedAcctInfoIndex === 0 ?
                                <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "defaultPayout" })}
                                    style={{ background: "green", color: "#fff", right: "5%", position: "absolute" }}>Change</Button> : ""}
                        </div>

                    </React.Fragment>}

                    {currentPayoutView === "addAccount" && <React.Fragment>
                        <div> Enter the following details </div>

                        <div >
                            <TextField
                                margin="dense"
                                id="actno"
                                error={errorFields["actno"] ? true : false}
                                label="Account number"
                                type="text"
                                style={{ width: '100%' }}
                                value={addAccountData.actno}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />

                            <TextField
                                margin="dense"
                                id="ifsc"
                                label="Ifsc"
                                error={errorFields["ifsc"] ? true : false}
                                type="text"
                                style={{ width: '100%', textTransform: "uppercase" }}
                                value={addAccountData.ifsc}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />

                            <TextField
                                margin="dense"
                                id="actholdername"
                                label="Name of Account holder"
                                error={errorFields["actholdername"] ? true : false}
                                type="text"
                                style={{ width: '100%' }}
                                value={addAccountData.actholdername}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>
                        <Button variant="contained" onClick={(event) => this.onNewAccountSaveClicked(event)}
                            style={{ background: "blue", color: "#fff" }}>Save </Button>
                    </React.Fragment>}
                    {currentPayoutView === "selectAmount" &&
                        <React.Fragment>
                            <div> Available bijak credit : Rs. 50,000 </div>
                            <div> Amount for payout      : Rs. {payoutData["amount"]} </div>
                        </React.Fragment>}
                    {currentPayoutView === "loading" &&
                        <React.Fragment>
                            <Loader primaryText={"Please wait.."} />
                        </React.Fragment>}
                </DialogContent>
            </Dialog>
        </div>
        );
    }
}

PayoutModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayoutModal);