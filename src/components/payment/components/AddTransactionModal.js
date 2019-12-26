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
    "b_in": "bijak-in", "b_out": "bijak-out",
    "b_hist": "historical"
};
// const payment_statusOption = ["pending","pending_approved"];
const payment_modeOption = ["bank", "cash","bijak"];
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
            attachmentArray: []

        }
        // console.log(this.props);

    }

    componentDidMount(){
        if(this.props.userdata && this.props.userdata.role === "ca"){
            this.state.addTransactionPayload['buyerid'] = this.props.userdata.id;
            this.state.addTransactionPayload['buyer_mobile'] = this.props.userdata.mobile;

        }else if(this.props.userdata && this.props.userdata.role === "la"){
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
        // console.log(addTransactionPayloadVal)
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    getSearchAreaText(id, event) {

        try {
            console.log(id)


            this.setState({ [id]: event !== null ? event : "" });
        } catch (err) {
            console.log(err);
        }
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
                this.setTempArray(resp.data.result.data);
                callback(respData);
            } else {
                callback([]);
            }
        } catch (err) {
            console.error(err);
            callback([]);
        }
    }

    setTempArray(data) {
        var tempVarVal = this.state.tempVar;
        for (var i = 0; i < data.length; i++) {
            tempVarVal[data[i]["fullname"]] = data[i];
        }
        this.setState({ tempVar: tempVarVal });
    }

    formatDataForDropDown(data, labelKey, valuekey) {

        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i][labelKey], value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    async addTransaction(event) {
        try {
            var payloadData = { "data": [] };
            var payload = this.state.addTransactionPayload;

            if (this.checkForInvalidFields(payload)) {
                payload["images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);

                payload["transaction_date"] = this.formateDateForApi(payload["transaction_date"]);
                payload["cashback_allotted_to"] = payload["cashback_allotted_to"] !== "none" ? payload["cashback_allotted_to"] : null;
                // payload["status"] = payload["status"] !== "none" ? (payload["status"] !== ""? payload["status"] : null)  : null;
                payloadData["data"].push(this.removeBlankNonMandatoryFields(payload));
                // console.log (  payloadData["data"] )
                // return;
                var resp = await paymentService.addPayemtData(payloadData);
                console.log(resp);
                if (resp.data.status === 1 && resp.data.result) {
                    alert("Successfully added this transaction ");
                    this.props.onTransactionAdded();
                } else {
                    alert("There was an error while adding this transaction");
                }
            } else {
                alert("please fill the mandatory fields highlighted");
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
        // console.log(data);
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
            dateVal = dateVal.getFullYear() + "-" + (dateVal.getMonth() + 1 < 10 ? "0" + dateVal.getMonth() + 1 : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            return dateVal;
        } else {
            return "";
        }
    }

    onStepChangeEventOccurs = (stepType) => {
        let { attachmentArray, step } = this.state;
        attachmentArray = [];
        step = stepType;
        this.setState({ attachmentArray, step });
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
            let data = result
            let attachmentObj = {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                filename: file.name,
                key: result.key
            }
            let { attachmentArray } = this.state;

            Storage.get("payment/" + file.name)
                .then(result => {
                    console.log(result.split("?")[0]);
                    attachmentObj["image_url"] = result.split("?")[0];
                    attachmentArray.push(attachmentObj)
                    this.setState({
                        isFileUpload: false,
                        attachmentArray
                    });
                })
                .catch(err => console.log(err));
            console.log(data)
        }
        ).catch(err => {
            this.setState({
                isFileUpload: false
            })
            let data = err
            console.log(err)
        }
        );
    }


    handelDateChange(dateval) {
        var addTransactionPayloadVal = this.state.addTransactionPayload;
        addTransactionPayloadVal["transaction_date"] = dateval;
        this.setState({ dateval: addTransactionPayloadVal })
    }

    render() {
        const { classes } = this.props;
        const { addTransactionPayload, supplierid, buyerid, tempVar, errorFields } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Add Transaction</p>
                </DialogTitle>
                <DialogContent>

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
                                                data["buyerid"] = tempVar[item["label"]]["id"];
                                                data["buyer_mobile"] = tempVar[item["label"]]["mobile"];
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
                        {this.props.userdata && this.props.userdata.role === "la"? <TextField
                                margin="dense"
                                id="supplierid"
                                label="Supplier"
                                disabled={true}
                                // error={errorFields["amount"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={this.props.userdata.fullname}
                                // onChange={this.handleInputChange.bind(this)}
                                fullWidth /> :<div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>

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
                                            data["supplierid"] = tempVar[item["label"]]["id"];
                                            data["supplier_mobile"] = tempVar[item["label"]]["mobile"];
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
                    {/* <div style={{ display: "flex", marginTop: 4 }} >

                    <TextField
                        select
                        id="status"
                        error={errorFields["status"] ? true : false}
                        name="status"
                        label="Payment Status"
                        type="text"
                        style={{ width: '49%' }}
                        value={addTransactionPayload.status}
                        onChange={this.handleInputChange.bind(this)}>
                        {payment_statusOption.map((key, i) => (
                            <MenuItem key={i} value={key} selected={true}>
                                {key}
                            </MenuItem>
                        ))}
                    </TextField>
                    &nbsp;
                    </div> */}
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

                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.addTransaction.bind(this)} color="primary">Add</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

AddTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddTransactionModal);