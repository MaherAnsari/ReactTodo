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
            acctData: [1, 2, 3],
            selectedAcctInfo: undefined,
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
            transferType:"NEFT"
        }
        // console.log(this.props.payoutData)
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


    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onPayoutModalClose();
    }

    handelAccountSelection(actInfo, event) {
        this.setState({ selectedAcctInfo: actInfo })
    }

    handleInputChange(event) {
        event.preventDefault()
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

    onConfirmPayout = async (  ) => {
        try {
            this.setState({currentPayoutView :"loading"});
            let payload = {};
            payload["id"] = this.props.payoutData["id"];
            payload["name"] = this.props.payoutData["supplier_fullname"]; 
            payload["contact"] = this.props.payoutData["supplier_mobile"];
            payload["type"] = "Loader";
            payload["amount"] = this.props.payoutData["amount"];
            payload["reference_id"] = this.props.payoutData["supplier_fullname"];
            payload["notes"] = {} ;
            payload["mode"] = this.state.transferType ;

            let resp = await paymentService.confirmPayout( payload );
            if (resp.data.status === 1) {
                // console.log(payload)
                alert( "Successfully completed");
                this.props.onPayoutSuccessfull();
            } else {
                alert(  resp && resp.data && resp.data.message  ? resp.data.message: "An error occured while payout");
            }
            this.setState({currentPayoutView :"defaultPayout"});
        } catch (err) {
            console.error(err);
            this.setState({currentPayoutView :"defaultPayout"});
            alert( "Oops an error occured while payout");
        }
    }

    handelPaymentThroughChanged( event ){
        this.setState({
            transferType: event.target.value
        });
    }


    render() {
        const { classes } = this.props;
        const { transferType, acctDetails, payoutData, acctData, selectedAcctInfo, currentPayoutView, addAccountData, errorFields } = this.state;
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
                                    <span className={classes.actcardtext} > Amount  : &nbsp;<strong style={{ color: "red" }}> ₹ { Utils.formatNumberWithComma(payoutData["amount"])}  </strong></span> </div>

                                <div className={classes.actCardc} >
                                    <div className={classes.actcardtext} style={{
                                        textDecoration: "underline",
                                        textTransform: "uppercase",
                                        paddingBottom: "4px"
                                    }}> Account details </div>
                                    {acctDetails !== "-" && acctDetails !== "" ?
                                        <span>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Number     </span>: &nbsp;<strong className={classes.actcardtext} > {acctDetails["bank_account_number"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Ifsc               </span>: &nbsp;<strong className={classes.actcardtext} style={{textTransform: "uppercase"}} > {acctDetails["bank_ifsc_code"]} </strong> </div>
                                            <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Holder Name</span>: &nbsp;<strong className={classes.actcardtext} > {acctDetails["bank_account_holder_name"]} </strong> </div>
                                        </span> :
                                        <div style={{ padding: "14px" }} className={classes.actcardtext} >
                                            Oops no bank account available.
                                    </div>}
                                </div>
                                <div>
                                {acctDetails !== "-" && acctDetails !== "" && <FormControl component="fieldset" style={{padding: "5px"}}>
                                <FormLabel component="legend" style={{ fontSize: "15px",fontFamily: "lato"}}>Select transfer type</FormLabel>
                                <RadioGroup aria-label="position" name="position" value={transferType} onChange={this.handelPaymentThroughChanged.bind(this)}  row>
                                    <FormControlLabel
                                    value="NEFT"
                                    control={<Radio color="primary" />}
                                    label="NEFT"
                                    style={{ fontSize: "14px",fontFamily: "lato"}}
                                    labelPlacement="end"
                                    />  
                                    <FormControlLabel
                                    value="IMPS"
                                    control={<Radio color="primary" />}
                                    label="IMPS"
                                    disabled={payoutData["amount"] > 200000}
                                    style={{ fontSize: "14px",fontFamily: "lato"}}
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
                            {acctData.map(value => {
                                const labelId = `checkbox-list-label-${value}`;
                                return (
                                    <ListItem key={value} role={undefined} dense button
                                        onClick={this.handelAccountSelection.bind(this, value)}>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectedAcctInfo === value}
                                                tabIndex={-1}
                                                disableRipple={false}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={`Account ${value + 1}`} />
                                        {value === selectedAcctInfo &&
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
                            {selectedAcctInfo &&
                                <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "selectAmount" })}
                                    style={{ background: "green", color: "#fff", right: "5%", position: "absolute" }}>Save</Button>}
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
                            <Loader primaryText={"Please wait.."}/>
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