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

class PayoutOrderModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openPayoutModal,
            payoutData: this.props.payoutData,
            acctData: [1, 2, 3],
            selectedAcctInfoIndex: undefined,
            currentPayoutView: "defaultPayout", //selectAccount, addAccount,loading
            addAccountData: {
                bank_account_number: "",
                bank_ifsc_code: "",
                bank_account_holder_name: ""
            },
            errorFields: {},
            acctDetails: undefined,
            transferType: "NEFT",
            transactionAmount: 0,
            showAmountexceedError: false,
            availableCreditAmount: 0,
            availableCreditAmountError: false
        }
    }

    componentWillMount() {
        this.getAvailableCredit(this.props.payoutData["buyer_mobile"]);
        this.getBankDetails(this.props.payoutData["supplier_mobile"]);
        this.setState({ transactionAmount: this.props.payoutData["unsettled_amount"] ? this.props.payoutData["unsettled_amount"] : 0 })
    }

    getBankDetails = async (mobile) => {
        try {
            let resp = await orderService.getOrderAcount(mobile);
            if (resp.data.status === 1) {
                if (resp.data.result) {
                    this.setState({ currentPayoutView: "selectAccount", acctData: resp.data.result || [] });
                } else {
                    this.setState({ acctDetails: resp.data.result, acctData: resp.data.result })
                }
            } else {
                alert("An error occured while getting the account details");
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }

    getAvailableCredit = async (mobile) => {
        try {
            let payload = { "data": { "ca_mobile": mobile } };
            let resp = await orderService.getAvailableCredit(payload);
            if (resp.data.status === 1) {
                if (resp.data.result && resp.data.result !== "-") {
                    this.setState({ availableCreditAmount: resp.data.result })
                } else {
                    this.setState({ availableCreditAmountError: resp.data["message"] })
                }
            } else {
                alert("An error occured while getting the available credit details");
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the available credit details")
        }
    }


    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onPayoutModalClose();
    }

    handelAccountSelection(actInfo, index, event) {
        console.log(index)
        // console.log( event.target.id  )
        console.log(actInfo)
        this.setState({
            selectedAcctInfoIndex: index,
            acctDetails: actInfo,
            addAccountData: actInfo
        })
    }

    handleTransactionAmtInputChange(event) {
        var val = event.target.value;
        if (val === "" || !isNaN(val)) {
            this.setState({ transactionAmount: Number(val), showAmountexceedError: false }, function () {
                if (Number(val) > this.state.payoutData["unsettled_amount"] || Number(val) > this.state.availableCreditAmount) {
                    this.setState({ showAmountexceedError: true })
                }
            })
        }
    }

    handleInputChange(event) {
        event.preventDefault();
        try {
            var intejarIds = ["bank_account_number"]; // this values need to be intejar
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
                addAccountDataVal[id] = val ? val.toUpperCase() : "";
            }

            if (errors.hasOwnProperty(id)) {
                delete errors[id];
            }
            this.setState({
                addAccountData: addAccountDataVal,
                errorFields: errors
            })
        } catch (err) {
            console.log(err)
        }
        // console.log(addAccountDataVal)
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
            this.setState({ currentPayoutView: "defaultPayout" }, function () {
                let acctDetails = this.state.acctDetails;
                acctDetails = { bank_account_holder_name: "", bank_account_number: "", bank_ifsc_code: "" }
                acctDetails["bank_account_holder_name"] = this.state.addAccountData["bank_account_holder_name"];
                acctDetails["bank_account_number"] = this.state.addAccountData["bank_account_number"];
                acctDetails["bank_ifsc_code"] = this.state.addAccountData["bank_ifsc_code"];
                this.setState({ acctDetails: acctDetails })
            });
        } else {
            alert("Please fill the reqd. fields")
        }
    }

    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" + (dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            return dateVal;
        } else {
            return "";
        }
    }


    onNewBankAccountAdded = async () => {
        try {
            this.setState({ currentPayoutView: "loading" });
            var payloadData = { "data": [] };
            let pdata = this.state.payoutData;
            let payload = {
                "supplierid": pdata["supplierid"],
                "buyerid": pdata["buyerid"],
                "supplier_mobile": pdata["supplier_mobile"],
                "buyer_mobile": pdata["buyer_mobile"],
                "amount": this.state.transactionAmount,
                "creator_role": pdata["creator_role"] || "ca",
                "payment_mode": "bijak",
                "transaction_type": "b_out",
                "transaction_date": this.formateDateForApi(new Date()),

                "bank_detail": {
                    "account_holder_name": this.state.addAccountData["bank_account_holder_name"],
                    "account_number": this.state.addAccountData["bank_account_number"],
                    "account_ifsc": this.state.addAccountData["bank_ifsc_code"],
                },
                "order_id": this.state.payoutData["app_order_id"]
            };
            payloadData["data"].push(payload)
            let resp = await paymentService.addPayemtData(payloadData);
            this.setState({ currentPayoutView: "selectAccount" });
            if (resp.data.status === 1) {
                alert("Successfully added");
                this.props.onPayoutSuccessfull();
            } else {
                alert(resp && resp.data && resp.data.message ? resp.data.message : "An error occured while  adding account details");
            }
        } catch (err) {
            console.error(err);
            this.setState({ currentPayoutView: "selectAccount" });
            alert("Oops an error occured while adding account details");
        }
    }



    // onConfirmPayout = async () => {
    //     try {
    //         this.setState({ currentPayoutView: "loading" });
    //         let payload = {};
    //         payload["id"] = this.props.payoutData["id"];
    //         payload["name"] = this.props.payoutData["supplier_name"];
    //         payload["contact"] = this.props.payoutData["supplier_mobile"];
    //         payload["type"] = "Loader";
    //         payload["amount"] = this.props.payoutData["amount"];
    //         payload["reference_id"] = this.props.payoutData["supplier_name"];
    //         payload["notes"] = {};
    //         payload["mode"] = this.state.transferType;

    //         // payload["bank_detail"] = {
    //         //     "account_holder_name": this.state.addAccountData["bank_account_holder_name"],
    //         //     "account_number": this.state.addAccountData["bank_account_number"],
    //         //     "account_ifsc": this.state.addAccountData["bank_ifsc_code"],
    //         // };
    //         // payload["order_id"] = this.state.payoutData["app_order_id"];
    //         console.log(payload)
    //         return "";
    //         // let resp = await paymentService.confirmPayout(payload);
    //         let resp = {};
    //         if (resp.data.status === 1) {
    //             console.log(payload)
    //             alert("Successfully completed");
    //             this.props.onPayoutSuccessfull();
    //         } else {
    //             alert(resp && resp.data && resp.data.message ? resp.data.message : "An error occured while payout");
    //         }
    //         this.setState({ currentPayoutView: "defaultPayout" });
    //     } catch (err) {
    //         console.error(err);
    //         this.setState({ currentPayoutView: "defaultPayout" });
    //         alert("Oops an error occured while payout");
    //     }
    // }

    handelPaymentThroughChanged(event) {
        this.setState({
            transferType: event.target.value
        });
    }


    render() {
        const { classes } = this.props;
        const { availableCreditAmount, availableCreditAmountError, showAmountexceedError, transactionAmount,
            transferType, acctDetails, payoutData, acctData, selectedAcctInfoIndex, currentPayoutView, addAccountData,
            errorFields } = this.state;
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
                            Pay
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>

                    {currentPayoutView === "defaultPayout" &&
                        (acctDetails ?
                            <React.Fragment>
                                <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                    <span className={classes.actcardtext} style={{ width: "52%" }}> Supplier Name  : &nbsp; <strong> {payoutData["supplier_name"]}</strong>  </span>
                                    <span className={classes.actcardtext} > Max credit amount  : &nbsp;<strong style={{ color: "red" }}> ₹ {Utils.formatNumberWithComma(availableCreditAmount)}  </strong></span>
                                </div>

                                <div style={{ width: "100%", display: "flex" }}>
                                    <div style={{ width: "60%", lineHeight: "45px" }} className={classes.actcardtext} >
                                        Unsettled amount : ₹ {payoutData["unsettled_amount"]}
                                    </div>
                                    &nbsp;
                                    &nbsp;
                                    <div style={{ width: "4%", lineHeight: "45px" }} className={classes.actcardtext} >
                                        ₹
                                    </div>
                                    <TextField
                                        margin="dense"
                                        id="transactionAmount"
                                        error={errorFields["transactionAmount"] ? true : false}
                                        label="Amount for payout"
                                        type="text"
                                        style={{ width: '36%' }}
                                        // disabled={true}
                                        value={transactionAmount}
                                        onChange={this.handleTransactionAmtInputChange.bind(this)}
                                        fullWidth />

                                </div>

                                {showAmountexceedError &&
                                    <div
                                        className={classes.actcardtext}
                                        style={{ textAlign: "center", color: "red", fontSize: "12px" }}>
                                        Amount cannot exceed the max credit limit and should be less than unsettled amt.
                                </div>}

                                <div className={classes.actCardc} >
                                    <div className={classes.actcardtext} style={{
                                        textDecoration: "underline",
                                        textTransform: "uppercase",
                                        paddingBottom: "4px"
                                    }}> Account details </div>
                                    {acctDetails !== "-" && acctDetails !== "" ?
                                        <span>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Number     </span>: &nbsp;
                                                    <strong className={classes.actcardtext} > {acctDetails["bank_account_number"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Ifsc               </span>: &nbsp;
                                                    <strong className={classes.actcardtext} style={{ textTransform: "uppercase" }} > {acctDetails["bank_ifsc_code"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Holder Name</span>: &nbsp;
                                                    <strong className={classes.actcardtext} > {acctDetails["bank_account_holder_name"]} </strong> </div>
                                        </span> :
                                        <div style={{ padding: "14px" }} className={classes.actcardtext} onClick={(event) => this.onConfirmPayout()}>
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
                                        {payoutData["amount"] > 200000 && <FormHelperText>*IMPS is not available as amount is greater than 2,00,000</FormHelperText>}
                                    </FormControl>}
                                </div>
                                {acctDetails !== "-" && acctDetails !== "" &&
                                    <div style={{ textAlign: "center", paddingTop: "10px" }}>
                                        <Button
                                            variant="contained"
                                            disabled={showAmountexceedError}
                                            onClick={(event) => this.onNewBankAccountAdded()}
                                            style={{ background: showAmountexceedError ? "gray" : "blue", color: "#fff" }}>
                                            REQUEST PAYOUT
                            </Button>
                                    </div>}
                            </React.Fragment>
                            :
                            <Loader />)}



                    {currentPayoutView === "selectAccount" &&
                        <React.Fragment>
                            {availableCreditAmountError ?
                                <div style={{ padding: "22px", textAlign: "center" }}>
                                    {availableCreditAmountError}
                                </div> :
                                <div style={{ padding: "30px" }}>
                                    {acctData && acctData.length > 0 ?
                                        <div> Select an Account </div> :
                                        <div style={{ padding: "20px" }}> No account found. Please add an account to continue </div>}
                                    <List className={classes.root}>
                                        {acctData.map((obj, index) => {
                                            const labelId = `checkbox-list-label-${obj["bank_account_number"]}`;
                                            return (
                                                <ListItem key={"list_" + index} role={undefined} dense button
                                                    id={index}
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
                                        {selectedAcctInfoIndex || selectedAcctInfoIndex === 0 ?
                                            <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "defaultPayout" })}
                                                style={{ background: "green", color: "#fff", right: "5%", position: "absolute" }}>Continue</Button> : ""}
                                    </div>
                                </div>}
                        </React.Fragment>}

                    {currentPayoutView === "addAccount" &&
                        <React.Fragment>
                            <div> Enter the following details </div>
                            <div >
                                <TextField
                                    margin="dense"
                                    id="bank_account_number"
                                    error={errorFields["bank_account_number"] ? true : false}
                                    label="Account number"
                                    type="text"
                                    style={{ width: '100%' }}
                                    value={addAccountData.bank_account_number}
                                    onChange={this.handleInputChange.bind(this)}
                                    fullWidth />

                                <TextField
                                    margin="dense"
                                    id="bank_ifsc_code"
                                    label="Ifsc"
                                    error={errorFields["bank_ifsc_code"] ? true : false}
                                    type="text"
                                    style={{ width: '100%', textTransform: "uppercase" }}
                                    value={addAccountData.bank_ifsc_code}
                                    onChange={this.handleInputChange.bind(this)}
                                    fullWidth />

                                <TextField
                                    margin="dense"
                                    id="bank_account_holder_name"
                                    label="Name of Account holder"
                                    error={errorFields["bank_account_holder_name"] ? true : false}
                                    type="text"
                                    style={{ width: '100%' }}
                                    value={addAccountData.bank_account_holder_name}
                                    onChange={this.handleInputChange.bind(this)}
                                    fullWidth />
                            </div>
                            <Button variant="contained" onClick={(event) => this.onNewAccountSaveClicked(event)}
                                style={{ background: "blue", color: "#fff" }}>Save </Button>
                            <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "selectAccount" })}
                                style={{ float: "right", background: "red", color: "#fff" }}>Cancel </Button>
                        </React.Fragment>}
                    {/* {currentPayoutView === "selectAmount" &&
                        <React.Fragment>
                            <div> Available bijak credit : Rs. 50,000 </div>
                            <div> Amount for payout      : Rs. {payoutData["amount"]} </div>
                        </React.Fragment>} */}
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

PayoutOrderModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayoutOrderModal);