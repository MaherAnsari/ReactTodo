import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import AsyncSelect from 'react-select/lib/Async';
import buyerService from '../../../app/buyerService/buyerService';
import supplierService from '../../../app/supplierService/supplierService';
import paymentService from '../../../app/paymentService/paymentService';
import { Storage } from 'aws-amplify';
import Loader from '../../common/Loader';
import orderService from '../../../app/orderService/orderService';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },
    formAddBtn: {
        width: '90%',
        borderRadius: '10px',
        fontSize: '20px',
        textTransform: 'uppercase',
        backgroundColor: '#4d9fa0 ',
        color: '#fff',
        height: '45px',
        marginBottom: '15px',
        marginTop: "11px",
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    formRoot: {
        // display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        // marginLeft: '25%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    },
    input: {
        display: 'none',
    },

});

const transactionType = {
    "b_in": "bijak-in",
    // "b_out": "bijak-out",
    "b_hist": "historical"
};
// const payment_statusOption = ["pending","pending_approved"];
const payment_modeOption = ["bank", "cash", "bijak"];
const cashback_allotted_toOption = ["none", "la", "ca"];
const creator_roleOption = ["la", "ca"];
class AddTransactionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            addTransactionPayload: {
                "supplierid": "",
                "buyerid": "",
                "supplier_mobile": "",
                "buyer_mobile": "",
                "bank_id": "",
                "amount": "",
                "amount_bank_entry": "",
                "bank_trxn_id": "",
                "creator_role": "",
                "payment_mode": "",
                "transaction_type": "",
                "transaction_date": new Date(),
                "cashback_value": "",
                "cashback_allotted_to": "",
                // "status":""
            },

            buyerid: "",
            supplierid: "",
            tempVar: {},
            errorFields: {},
            attachmentArray: [],
            showLoader: false,
            currentAddTransactionView: "addPayment",// "enterAcctDetails", // "selectAccount"
            "bank_detail": {
                "account_holder_name": "",
                "account_number": "",
                "account_ifsc": ""
            },
            acctDataArray: undefined,
            selectedAcctInfo: undefined,

        }

    }

    componentDidMount() {
        if (this.props.userdata && this.props.userdata.role === "ca") {
            this.state.addTransactionPayload['buyerid'] = this.props.userdata.id;
            this.state.addTransactionPayload['buyer_mobile'] = this.props.userdata.mobile;

        } else if (this.props.userdata && this.props.userdata.role === "la") {
            this.state.addTransactionPayload['supplierid'] = this.props.userdata.id;
            this.state.addTransactionPayload['supplier_mobile'] = this.props.userdata.mobile;
        }
    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }

    handleInputChange(event) {
        var intejarIds = ["amount", "amount_bank_entry", "cashback_value"]; // this values need to be intejar
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var addTransactionPayloadVal = this.state.addTransactionPayload;
        if (intejarIds.indexOf(id) > -1) {
            if (val === "" || !isNaN(val)) {
                addTransactionPayloadVal[id] = Number(val);
            }
        } else {
            addTransactionPayloadVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addTransactionPayload: addTransactionPayloadVal,
            errorFields: errors
        })
    }


    handleBankDetailsChange(event) {
        var intejarIds = ["account_number"]; // this values need to be intejar
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var bankData = this.state.bank_detail;
        if (intejarIds.indexOf(id) > -1) {
            if (val === "" || !isNaN(val)) {
                bankData[id] = Number(val);
            }
        } else {
            bankData[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            bank_detail: bankData,
            errorFields: errors
        })
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    getOptions = async (type, inputValue, callback) => {
        try {
            if (!inputValue) {
                callback([]);
            }
            let resp = {};
            let data = {};
            data["searchVal"] = inputValue;
            if (type === "buyerid") {

                data['role'] = 'ca';
                resp = await buyerService.serchUser(data);
            }

            if (type === "supplierid") {
                data['role'] = 'la';
                resp = await supplierService.serchUser(data);
            }

            if (resp.data.status === 1 && resp.data.result) {
                var respData = [];
                respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile");
                this.setTempArray(resp.data.result.data, "mobile");
                callback(respData);
            } else {
                callback([]);
            }
        } catch (err) {
            console.error(err);
            callback([]);
        }
    }

    setTempArray(data, type) {
        var tempVarVal = this.state.tempVar;
        for (var i = 0; i < data.length; i++) {
            tempVarVal[data[i][type]] = data[i];
        }
        this.setState({ tempVar: tempVarVal });
    }

    formatDataForDropDown(data, labelKey, valuekey) {

        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i][labelKey] + " (" + data[i][valuekey] + ")", value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    onTransactionDataAdded(event) {
        var transData = this.state.addTransactionPayload;
        if (this.checkForInvalidFields(transData)) {
            if (transData["payment_mode"] === "bank" && transData["transaction_type"] === "b_in") {
                // this.setState({ currentAddTransactionView : "selectAccount" },
                //  function(){
                this.getBankDetails(transData["supplier_mobile"]);
                // });
            } else {
                this.addTransaction();
            }
        } else {
            alert("Please fill the mandatory fields highlighted");
        }
    }

    getBankDetails = async (mobile) => {
        try {
            this.setState({ showLoader: true });
            let resp = await orderService.getOrderAcount(mobile);
            this.setState({ showLoader: false });
            if (resp.data.status === 1) {
                if (resp.data.result) {
                    this.setState({ currentAddTransactionView: "selectAccount", acctDataArray: resp.data.result || [] });
                } else {
                    this.setState({ acctDataArray: resp.data.result })
                }
            } else {
                alert("An error occured while getting the account details");
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }


    checkForInvalidFieldsOfAccount(data) {
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

    onTransactionDataAddedWithAccount(event) {
        var bank_detail = this.state.bank_detail;
        if (this.checkForInvalidFieldsOfAccount(bank_detail)) {
            let transData = this.state.addTransactionPayload;
            transData["bank_detail"] = bank_detail;
            this.setState({ addTransactionPayload: transData }, function () {
                this.addTransaction();
            })
            console.log(transData)
        } else {
            alert("Please fill the mandatory fields highlighted");
        }
    }
    async addTransaction(event) {
        try {
            var payloadData = { "data": [] };
            var payload = this.state.addTransactionPayload;
            this.setState({ showLoader: true });
            payload["images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);
            payload["transaction_date"] = this.formateDateForApi(payload["transaction_date"]);
            payload["cashback_allotted_to"] = payload["cashback_allotted_to"] !== "none" ? payload["cashback_allotted_to"] : null;
            payloadData["data"].push(this.removeBlankNonMandatoryFields(payload));
            var resp = await paymentService.addPayemtData(payloadData);
            this.setState({ showLoader: false });
            if (resp.data.status === 1 && resp.data.result) {
                alert("Successfully added this transaction ");
                this.props.onTransactionAdded();
            } else {
                alert("There was an error while adding this transaction");
            }

        } catch (err) {
            console.log(err);
        }
    }

    removeBlankNonMandatoryFields(data) {
        var formateddata = {};
        for (var key in data) {
            if (data[key] !== "") {
                formateddata[key] = data[key];
            }
            if (key === "cashback_value" && data[key] === "") {
                formateddata[key] = 0;
            }
            if (key === "cashback_allotted_to" && data[key] === "") {
                formateddata[key] = null;
            }
        }
        return formateddata;
    }

    prepareSupportingUrlArray(data) {
        var urlArray = [];
        for (var i = 0; i < data.length > 0; i++) {
            urlArray.push(data[i]["image_url"]);
        }
        return urlArray;
    }

    checkForInvalidFields(data) {
        var isValid = true;
        var error = {};
        var nonMandatoryFields = ["bank_id", "amount_bank_entry", "bank_trxn_id", "cashback_value", "cashback_allotted_to", "remarks", "reason"]
        for (var key in data) {
            if (nonMandatoryFields.indexOf(key) === -1 && data[key] === "") {
                error[key] = true;
                isValid = false;
            }
        }
        this.setState({ errorFields: error });
        return isValid;
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

    deleteItem(key) {
        let { attachmentArray } = this.state;
        for (var i = 0; i < attachmentArray.length; i++) {
            var indFile = attachmentArray[i];
            if (indFile.key === key) {
                attachmentArray.splice(i, 1);
                this.setState({ attachmentArray });
            }
        }
    }


    fileChangedHandler = (event) => {
        let { selectedFileName, isFileLoading, file } = this.state;
        file = event.target.files[0];
        selectedFileName = file ? file.name : null;
        isFileLoading = !file ? false : true;
        this.setState({ selectedFileName, isFileLoading, file })
        Storage.configure({
            level: 'public',
            AWSS3: {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',//Your bucket name;
                region: 'ap-south-1'//Specify the region your bucket was created in;
            }
        });
        Storage.put("payment/" + file.name, file, {
            // key: "UBIL-Register-Online.png"
            contentType: 'image/png'
        }).then(result => {
            let attachmentObj = {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                filename: file.name,
                key: result.key
            }
            let { attachmentArray } = this.state;

            Storage.get("payment/" + file.name)
                .then(result => {
                    attachmentObj["image_url"] = result.split("?")[0];
                    attachmentArray.push(attachmentObj)
                    this.setState({
                        isFileUpload: false,
                        attachmentArray
                    });
                })
                .catch(err => console.log(err));
        }
        ).catch(err => {
            this.setState({
                isFileUpload: false
            })
            console.log(err)
        }
        );
    }


    handelDateChange(dateval) {
        var addTransactionPayloadVal = this.state.addTransactionPayload;
        addTransactionPayloadVal["transaction_date"] = dateval;
        this.setState({ dateval: addTransactionPayloadVal })
    }

    handelAccountSelection(actInfo, event) {
        let bank_detailVal = this.state.bank_detail;
        bank_detailVal["account_holder_name"] = actInfo["bank_account_holder_name"];
        bank_detailVal["account_number"] = actInfo["bank_account_number"];
        bank_detailVal["account_ifsc"] = actInfo["bank_ifsc_code"];
        this.setState({ selectedAcctInfo: actInfo, bank_detail: bank_detailVal })
    }

    render() {
        const { classes } = this.props;
        const { bank_detail, currentAddTransactionView, showLoader, addTransactionPayload,
            supplierid, buyerid, tempVar, errorFields, acctDataArray, selectedAcctInfo } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                {!showLoader ? <div>
                    <DialogTitle
                        style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                        id="form-dialog-title">
                        <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Add Transaction</p>
                    </DialogTitle>
                    <DialogContent>
                        {currentAddTransactionView === "addPayment" &&
                            <React.Fragment>
                                <div style={{ display: "flex" }}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ width: "49%" }} >
                                        <Grid container style={{ width: "49%" }} >
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="transaction_date"
                                                label="Transaction date"
                                                format="dd-MMM-yyyy"
                                                style={{ width: '100%' }}
                                                value={addTransactionPayload.transaction_date}
                                                onChange={(dateval) => {
                                                    this.handelDateChange(dateval);
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>

                                    &nbsp;
                                  &nbsp;
                         <TextField
                                        select
                                        id="transaction_type"
                                        name="transaction_type"
                                        label="Transaction Type"
                                        type="text"
                                        error={errorFields["transaction_type"] ? true : false}
                                        style={{ marginTop: "15px", width: '49%' }}
                                        value={addTransactionPayload.transaction_type}
                                        onChange={this.handleInputChange.bind(this)}>
                                        {Object.keys(transactionType).map((key, i) => (
                                            <MenuItem key={i} value={key} selected={true}>
                                                {transactionType[key]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div style={{ display: "flex" }}>
                                    {this.props.userdata && this.props.userdata.role === "ca" ?

                                        <TextField
                                            margin="dense"
                                            id="buyerid"
                                            label="Buyer"
                                            disabled={true}
                                            // error={errorFields["amount"] ? true : false}
                                            type="text"
                                            style={{ width: '49%' }}
                                            value={this.props.userdata.fullname}
                                            // onChange={this.handleInputChange.bind(this)}
                                            fullWidth />
                                        : <div style={{ borderBottom: errorFields["buyerid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>
                                            <AsyncSelect
                                                cacheOptions
                                                value={buyerid}
                                                id={"reactSelectCustom"}
                                                name={"buyerid"}
                                                // onChange={( item )=>{ this.setState({ buyerid : item  })}}
                                                onChange={(item) => {
                                                    this.setState({ buyerid: item }, function () {
                                                        var data = addTransactionPayload;
                                                        if (errorFields["buyerid"]) {
                                                            delete errorFields["buyerid"];
                                                        }
                                                        if (item && item !== null) {
                                                            data["buyerid"] = tempVar[item["value"]]["id"];
                                                            data["buyer_mobile"] = tempVar[item["value"]]["mobile"];
                                                        } else {
                                                            data["buyerid"] = "";
                                                            data["buyer_mobile"] = "";
                                                        }
                                                        this.setState({ addTransactionPayload: data, errorFields: errorFields })
                                                    })
                                                }}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={`Select buyer..`}
                                                defaultOptions={[]}
                                                loadOptions={this.getOptions.bind(this, "buyerid")}
                                            />
                                        </div>}
                                    &nbsp;
                                    &nbsp;
                        {this.props.userdata && this.props.userdata.role === "la" ? <TextField
                                        margin="dense"
                                        id="supplierid"
                                        label="Supplier"
                                        disabled={true}
                                        // error={errorFields["amount"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={this.props.userdata.fullname}
                                        // onChange={this.handleInputChange.bind(this)}
                                        fullWidth /> : <div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>

                                            <AsyncSelect
                                                cacheOptions
                                                value={supplierid}
                                                id={"reactSelectCustom"}
                                                name={"supplierid"}
                                                onChange={(item) => {
                                                    this.setState({ supplierid: item }, function () {
                                                        if (errorFields["supplierid"]) {
                                                            delete errorFields["supplierid"];
                                                        }
                                                        var data = addTransactionPayload;
                                                        if (item && item !== null) {
                                                            data["supplierid"] = tempVar[item["value"]]["id"];
                                                            data["supplier_mobile"] = tempVar[item["value"]]["mobile"];
                                                        } else {
                                                            data["supplierid"] = "";
                                                            data["supplier_mobile"] = "";
                                                        }
                                                        this.setState({ addTransactionPayload: data, errorFields: errorFields })
                                                    })
                                                }}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={`Select supplier..`}
                                                defaultOptions={[]}
                                                loadOptions={this.getOptions.bind(this, "supplierid")}
                                            />
                                        </div>}
                                </div>

                                <div style={{ display: "flex", marginTop: 4 }} >

                                    <TextField
                                        select
                                        id="creator_role"
                                        error={errorFields["creator_role"] ? true : false}
                                        name="creator_role"
                                        label="Creater Role"
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.creator_role}
                                        onChange={this.handleInputChange.bind(this)}>
                                        {creator_roleOption.map((key, i) => (
                                            <MenuItem key={i} value={key} selected={true}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    &nbsp;
                                &nbsp;
                        <TextField
                                        select
                                        id="payment_mode"
                                        name="payment_mode"
                                        label="Payment mode"
                                        error={errorFields["payment_mode"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.payment_mode}
                                        onChange={this.handleInputChange.bind(this)}>
                                        {payment_modeOption.map((key, i) => (
                                            <MenuItem key={i} value={key} selected={true}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div style={{ display: "flex" }} >

                                    <TextField
                                        margin="dense"
                                        id="bank_id"
                                        label="Bank Id"
                                        type="text"
                                        error={errorFields["bank_id"] ? true : false}
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.bank_id}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                    &nbsp;
                                  &nbsp;
                        <TextField
                                        margin="dense"
                                        id="amount"
                                        label="Amount"
                                        error={errorFields["amount"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.amount}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                </div>

                                <div style={{ display: "flex" }} >
                                    <TextField
                                        margin="dense"
                                        id="amount_bank_entry"
                                        label="Amount Bank Entry"
                                        type="text"
                                        error={errorFields["amount_bank_entry"] ? true : false}
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.amount_bank_entry}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                    &nbsp;
                                    &nbsp;
                        <TextField
                                        margin="dense"
                                        id="bank_trxn_id"
                                        label="Bank transaction id"
                                        error={errorFields["bank_trxn_id"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.bank_trxn_id}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                </div>

                                <div style={{ display: "flex" }} >

                                    <TextField
                                        margin="dense"
                                        id="reason"
                                        error={errorFields["reason"] ? true : false}
                                        label="Reason"
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.reason}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                    &nbsp;
                                &nbsp;
                        <TextField
                                        margin="dense"
                                        id="remarks"
                                        label="Remarks"
                                        error={errorFields["remarks"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.remarks}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                </div>


                                <div style={{ display: "flex" }} >
                                    <TextField
                                        margin="dense"
                                        id="cashback_value"
                                        label="Cashback Value"
                                        error={errorFields["cashback_value"] ? true : false}
                                        type="text"
                                        style={{ width: '49%' }}
                                        value={addTransactionPayload.cashback_value}
                                        onChange={this.handleInputChange.bind(this)}
                                        fullWidth />
                                    &nbsp;
                                &nbsp;
                        <TextField
                                        select
                                        id="cashback_allotted_to"
                                        name="cashback_allotted_to"
                                        label="Cashback allotted to "
                                        error={errorFields["cashback_allotted_to"] ? true : false}
                                        type="text"
                                        style={{ width: '49%', marginTop: "1%" }}
                                        value={addTransactionPayload.cashback_allotted_to}
                                        onChange={this.handleInputChange.bind(this)}>
                                        {cashback_allotted_toOption.map((key, i) => (
                                            <MenuItem key={i} value={key} selected={true}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div >
                                    <Grid container direction="row" alignItems="stretch">
                                        <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'left', margin: "11px 0px 5px 0px", marginBottom: 5 }}>
                                            <input
                                                className={classes.input}
                                                id="flat-button2-file"
                                                type="file"
                                                onClick={(event) => {
                                                    event.target.value = null
                                                }}
                                                onChange={this.fileChangedHandler.bind(this)}
                                            />
                                            <label htmlFor="flat-button2-file">
                                                <Button component="span" style={{ border: '1px solid #d5d2d2', padding: '5px 10px', fontSize: 12, backgroundColor: '#dbdbdb' }}  >
                                                    Choose supporting images
                            </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            {(this.state.attachmentArray && this.state.attachmentArray.length !== 0) &&
                                                <React.Fragment>
                                                    {this.state.attachmentArray.map((indUpload, index) => (
                                                        <Grid key={index} container direction="row" style={{ border: '1px solid #cbccd4', padding: '2px 5px', backgroundColor: '#f4f4f4', borderRadius: 20, marginBottom: 5, alignItems: 'center' }}>
                                                            <React.Fragment>
                                                                <Grid item xs={1} sm={1} md={1} style={{ textAlign: 'center' }}>
                                                                    <img src="https://img.icons8.com/plasticine/2x/file.png" height="30" width="30"></img>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} md={10} >
                                                                    <span target="_blank"><span style={{ margin: 0, fontSize: 13 }}>{indUpload.filename}</span></span>

                                                                </Grid>
                                                                <Grid item xs={12} sm={12} md={1} onClick={this.deleteItem.bind(this, indUpload.key)}>
                                                                    <p style={{ margin: 0, fontSize: 13, color: '#547df9', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}>X</p>
                                                                </Grid>
                                                            </React.Fragment>
                                                        </Grid>
                                                    ))}
                                                </React.Fragment>
                                            }
                                        </Grid>
                                    </Grid>
                                </div>

                            </React.Fragment>}

                        {currentAddTransactionView === "selectAccount" &&
                            <React.Fragment>
                                <div>
                                    {acctDataArray && acctDataArray.length > 0 ?
                                        <div> Select an Account </div> :
                                        <div style={{padding: "20px"}}>We cannot find any account associated with this user.{"\n"}Please add an account to add this transactions </div>}
                                    <List className={classes.root}>
                                        {acctDataArray && acctDataArray.map(obj => {
                                            const labelId = `checkbox-list-label-${obj["id"]}`;
                                            return (
                                                <ListItem key={obj["id"]} role={undefined} dense button
                                                    onClick={this.handelAccountSelection.bind(this, obj)}>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={selectedAcctInfo && selectedAcctInfo["id"] ? selectedAcctInfo["id"] === obj["id"] : false}
                                                            tabIndex={-1}
                                                            disableRipple={false}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        id={labelId}
                                                        primary={obj["bank_account_holder_name"]}
                                                        secondary={"IFSC : " + obj["bank_ifsc_code"] + ", Account no. : " + obj["bank_account_number"]} />
                                                    {(selectedAcctInfo && selectedAcctInfo["id"] ? selectedAcctInfo["id"] === obj["id"] : false) &&
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

                                        {selectedAcctInfo &&
                                            <Button variant="contained" onClick={(event) => this.onTransactionDataAddedWithAccount(event)}
                                                style={{ background: "green", color: "#fff", right: "5%", position: "absolute" }}>Save</Button>}
                                            <Button variant="contained" onClick={this.handleDialogCancel.bind(this)}
                                                style={{ background: "blue", color: "#fff" }}>Cancel</Button>
                                    </div>
                                </div>
                            </React.Fragment>}

                        {currentAddTransactionView === "enterAcctDetails" &&
                            <React.Fragment>
                                <div> Enter the following details </div>
                                <div style={{ paddingBottom: "50px" }}>
                                    <TextField
                                        margin="dense"
                                        id="account_number"
                                        error={errorFields["account_number"] ? true : false}
                                        label="Account number"
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={bank_detail.account_number}
                                        onChange={this.handleBankDetailsChange.bind(this)}
                                        fullWidth />

                                    <TextField
                                        margin="dense"
                                        id="account_ifsc"
                                        label="Ifsc"
                                        error={errorFields["account_ifsc"] ? true : false}
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={bank_detail.account_ifsc}
                                        onChange={this.handleBankDetailsChange.bind(this)}
                                        fullWidth />

                                    <TextField
                                        margin="dense"
                                        id="account_holder_name"
                                        label="Name of Account holder"
                                        error={errorFields["account_holder_name"] ? true : false}
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={bank_detail.account_holder_name}
                                        onChange={this.handleBankDetailsChange.bind(this)}
                                        fullWidth />
                                </div>
                                <Button variant="contained" onClick={(event) => this.onTransactionDataAddedWithAccount(event)}
                                    style={{ background: "blue", color: "#fff" }}>Save </Button>
                                <Button variant="contained" onClick={this.handleDialogCancel.bind(this)}
                                    style={{ float: "right", background: "red", color: "#fff" }}>Cancel </Button>
                            </React.Fragment>
                        }

                    </DialogContent>
                    {currentAddTransactionView === "addPayment" && <DialogActions>
                        <Button className={classes.formCancelBtn} onClick={this.onTransactionDataAdded.bind(this)} color="primary">Add</Button>
                        <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                    </DialogActions>}
                </div> :
                    <Loader primaryText="Please wait.." />}
            </Dialog>
        </div>
        );
    }
}

AddTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddTransactionModal);