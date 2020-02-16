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
import Switch from '@material-ui/core/Switch';
import Loader from '../../common/Loader';
import Utils from '../../../app/common/utils';

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
        maxWidth: '700px',
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
    MuiPopoverroot: {
        zIndex: "99999"
    },
    muiSwitchroot: {
        float: "right"
    },
});

const transactionType = {
    "b_in": "bijak-in", 
    // "b_out": "bijak-out",
    "b_hist": "historical"
};
const payment_modeOption = ["bank", "cash", "bijak"];
const cashback_allotted_toOption = ["none", "la", "ca"];
const creator_roleOption = ["la", "ca"];

class EditTransactionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            editTransactionPayload: this.props.editableTransactionData,
            buyerid: "",
            supplierid: "",
            tempVar: {},
            errorFields: {},
            attachmentArray: [],
            showLoader: false

        }
        console.log(this.props.editableTransactionData)

    }

    componentWillMount() {
        let obj = {};
        let attachmentArrayVal = this.state.attachmentArray;
        if (this.state.editTransactionPayload) {
            obj["label"] = this.state.editTransactionPayload["supplier_fullname"];
            obj["value"] = this.state.editTransactionPayload["supplierid"];
        }
        var suppId = [obj];
        if (this.state.editTransactionPayload && this.state.editTransactionPayload["images"] && this.state.editTransactionPayload["images"] !== null) {
            for (var i = 0; i < this.state.editTransactionPayload["images"].length; i++) {
                let imgObj = {
                    bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                    image_url: this.state.editTransactionPayload["images"][i],
                    key: this.state.editTransactionPayload["images"][i]
                }
                attachmentArrayVal.push(imgObj)
            }
        }
        this.setState({ supplierid: suppId, attachmentArray : attachmentArrayVal })

    }


    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.open });
        }
    }

    handleInputChange(event) {
        event.preventDefault()
        var floatIds = ["amount", "amount_bank_entry", "cashback_value"]; // this values need to be float
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var addTransactionPayloadVal = this.state.editTransactionPayload;
        if (floatIds.indexOf(id) > -1) {
            if (val === "" || val.match(/^(\d+\.?\d{0,9}|\.\d{1,9})$/)) {
                addTransactionPayloadVal[id] = val;
            }
        } else {
            addTransactionPayloadVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            editTransactionPayload: addTransactionPayloadVal,
            errorFields: errors
        })
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    getSearchAreaText(id, event) {

        try {
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
                // optionsData.push({ label: data[i][labelKey]+ " ("+data[i][valuekey]+")", value: data[i][valuekey] });
                optionsData.push({ label: data[i]["fullname"] +",  "+data[i]["business_name"] +" \n  ("+data[i]["locality"] +" , "+data[i][valuekey]+" )", value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    async updateTransaction(event) {
        try {
            var payloadData = { "data": {} };
            var payload = this.state.editTransactionPayload;
            var id = this.state.editTransactionPayload["id"];

            if (this.checkForInvalidFields(payload)) {
                this.setState({ showLoader : true });
                payload["images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);
                payload["transaction_date"] = this.formateDateForApi(payload["transaction_date"]);
                payload["cashback_allotted_to"] = payload["cashback_allotted_to"] !== "none" ? payload["cashback_allotted_to"] : null;
                payloadData["data"] = this.removeBlankNonMandatoryFields(payload);
                var resp = await paymentService.updatePayementInfo(id, payloadData);
                this.setState({ showLoader : false });
                if (resp.data.status === 1 && resp.data.result) {
                    alert("Successfully added this transaction ");
                    this.props.onTransactionUpdated();
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
        var floatIds = ["amount", "amount_bank_entry", "cashback_value"]; 
        var keysWithValidUpdateData = {};
        var mandotaryFields = ["active", "amount", "amount_bank_entry", "bank_id", "bank_trxn_id", "cashback_allotted_to",
            "cashback_value", "creator_role", "images", "payment_mode", "reason", "remarks", "supplier_mobile",
            "supplierid", "transaction_date", "transaction_type"];
        for (var key in data) {
            if (data[key] !== "") {
                formateddata[key] = data[key];
            }
            
            if(formateddata[key] && floatIds.indexOf( key ) > -1 ){
                formateddata[key] = parseFloat( data[key] );
            }

            if (key === "cashback_value" && data[key] === "") {
                formateddata[key] = 0;
            }

            if (key === "cashback_allotted_to" && data[key] === "") {
                formateddata[key] = null;
            }
        }

        for (var i = 0; i < mandotaryFields.length; i++) {
            if (formateddata.hasOwnProperty(mandotaryFields[i]))
                keysWithValidUpdateData[mandotaryFields[i]] = formateddata[mandotaryFields[i]]
        }

        return keysWithValidUpdateData;
    }

    prepareSupportingUrlArray(data) {
        var urlArray = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length > 0; i++) {
                urlArray.push(data[i]["image_url"]);
            }
        } else {
            urlArray = this.state.editTransactionPayload["images"];
        }
        return urlArray;

    }

    checkForInvalidFields(data) {
        var isValid = true;
        var error = {};
        var nonMandatoryFields = ["bankid", "amount_bank_entry", "bank_trxn_id", "cashback_value", "cashback_allotted_to", "remarks", "reason","buyer_business_name","supplier_locality"]
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
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" +( dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
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

        let updatedFileName = Utils.getImageName(file.name);

        Storage.configure({
            level: 'public',
            AWSS3: {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',//Your bucket name;
                region: 'ap-south-1'//Specify the region your bucket was created in;
            }
        });

        Storage.put("payment/" + updatedFileName, file, {
            // key: "UBIL-Register-Online.png"
            contentType: 'image/png'
        }).then(result => {
        
            let attachmentObj = {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                filename: updatedFileName,
                key: result.key
            }
            let { attachmentArray } = this.state;

            Storage.get("payment/" + updatedFileName)
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
        var addTransactionPayloadVal = this.state.editTransactionPayload;
        addTransactionPayloadVal["transaction_date"] = dateval;
        this.setState({ dateval: addTransactionPayloadVal })
    }

    handleStateChange = (id, event) => {
        let data = this.state.editTransactionPayload;
        data[id] = event.target.checked;
        this.setState({ editableDataObj: data });
    };


    render() {
        const { classes } = this.props;
        const { showLoader, editTransactionPayload, supplierid, tempVar, errorFields } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '99999' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                { !showLoader ? <div>
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Edit Payment</p>
                </DialogTitle>
                <DialogContent>

                    <div >
                        <span style={{ lineHeight: "40px" }}>Enable / disable transaction</span>
                        <Switch
                            classes={{ root: classes.muiSwitchroot }}
                            checked={editTransactionPayload.active}
                            onChange={this.handleStateChange.bind(this, "active")}
                            value={editTransactionPayload.active}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />

                    </div>
                    <div style={{ display: "flex" }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ width: "49%" }} >
                            <Grid container style={{ width: "49%" }} >
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="transaction_date"
                                    label="Transaction date"
                                    format="dd-MMM-yyyy"
                                    style={{ width: '100%' }}
                                    value={editTransactionPayload.transaction_date}
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
                            value={editTransactionPayload.transaction_type}
                            onChange={this.handleInputChange.bind(this)}>
                            {Object.keys(transactionType).map((key, i) => (
                                <MenuItem key={i} value={key} selected={true} >
                                    {transactionType[key]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div style={{ display: "flex" }}>
                        <TextField
                            margin="dense"
                            id="Buyer_name"
                            label="Buyer name"
                            type="text"
                            disabled={true}
                            style={{ width: '49%' }}
                            value={editTransactionPayload.buyer_fullname}
                            onChange={() => { }}
                            fullWidth />

                        &nbsp;
                        &nbsp;
                    <div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>

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
                                        var data = editTransactionPayload;
                                        if (item && item !== null) {
                                            data["supplierid"] = tempVar[item["value"]]["id"];
                                            data["supplier_mobile"] = tempVar[item["value"]]["mobile"];
                                        } else {
                                            data["supplierid"] = "";
                                            data["supplier_mobile"] = "";
                                        }
                                        this.setState({ editTransactionPayload: data, errorFields: errorFields })
                                    })
                                }}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select supplier..`}
                                defaultOptions={[]}
                                loadOptions={this.getOptions.bind(this, "supplierid")}
                            />
                        </div>
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
                            value={editTransactionPayload.creator_role}
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
                            value={editTransactionPayload.payment_mode}
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
                            value={editTransactionPayload.bank_id}
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
                            value={editTransactionPayload.amount}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div style={{ display: "flex" }} >
                    <TextField
                            margin="dense"
                            id="bank_trxn_id"
                            label="Bank transaction id"
                            error={errorFields["bank_trxn_id"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={editTransactionPayload.bank_trxn_id}
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
                            value={editTransactionPayload.remarks}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    {/* <div style={{ display: "flex" }} >

                        <TextField
                            margin="dense"
                            id="reason"
                            error={errorFields["reason"] ? true : false}
                            label="Reason"
                            type="text"
                            style={{ width: '49%' }}
                            value={editTransactionPayload.reason}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                              &nbsp;
                        &nbsp;
                       <TextField
                            margin="dense"
                            id="amount_bank_entry"
                            label="Amount Bank Entry"
                            type="text"
                            error={errorFields["amount_bank_entry"] ? true : false}
                            style={{ width: '49%' }}
                            value={editTransactionPayload.amount_bank_entry}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                      
                    </div> */}


                    {/* <div style={{ display: "flex" }} >
                        <TextField
                            margin="dense"
                            id="cashback_value"
                            label="Cashback Value"
                            error={errorFields["cashback_value"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={editTransactionPayload.cashback_value}
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
                            classes={{ root: classes.MuiPopoverroot }}
                            style={{ width: '49%', marginTop: "1%" }}
                            value={editTransactionPayload.cashback_allotted_to}
                            onChange={this.handleInputChange.bind(this)}>
                            {cashback_allotted_toOption.map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div> */}
                    {this.state.attachmentArray && this.state.attachmentArray.length !== 0 &&
                        <div style={{ fontFamily: "lato", padding: "10px" }}>
                            Uploaded Images
                        </div>}
                    <div style={{ display: "flex" }}>
                        {(this.state.attachmentArray && this.state.attachmentArray.length !== 0) && this.state.attachmentArray.map((keyObj, i) => (
                            // <div key={"imhs_" + i} style={{ width: "150px", marginLeft: "5px", boxShadow: " 0px 0px 10px 0px rgba(0,0,0,0.75)" }} >
                            //     <img src={key} alt={key} height="150px" />
                            // </div>
                            <div key={"imhs_" + i} className="transaction-supporting-image">
                                <img src={keyObj["image_url"]} style={{cursor: "zoom-in"}} onClick={() => window.open(keyObj["image_url"], "_blank")} alt={keyObj["image_url"]} height="150px"  width="150px" />
                                <div className="transaction-delete-icon" onClick={this.deleteItem.bind(this, keyObj.key)}>
                                    <i className="fa fa-trash fa-lg"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(this.state.attachmentArray && this.state.attachmentArray.length === 0) &&
                        <div style={{ fontFamily: "lato", padding: "10px" }}>
                            No supporting images uploaded yet. you can add by clicking below
                        </div>}
                    <div >
                        <Grid container direction="row" alignItems="stretch">
                            <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'left', margin: "11px 0px 5px 0px", marginBottom: 5 }}>
                                <input
                                    className={classes.input}
                                    id="flat-button2-file"
                                    type="file"
                                    style={{ width: "50% !important" }}
                                    onClick={(event) => {
                                        event.target.value = null
                                    }}
                                    onChange={this.fileChangedHandler.bind(this)}
                                />
                                <label htmlFor="flat-button2-file">
                                    <Button component="span" style={{ border: '1px solid #d5d2d2', padding: '5px 10px', fontSize: 12, backgroundColor: '#dbdbdb' }}  >
                                        change/add supporting images
                            </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.updateTransaction.bind(this)} color="primary">Update</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
                </div>:
                 <Loader primaryText="Please wait.."/>}
            </Dialog>
        </div>
        );
    }
}

EditTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditTransactionModal);