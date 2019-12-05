import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import mandiDataService from '../../../app/mandiDataService/mandiDataService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../../app/common/utils';
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
import brokerService from '../../../app/brokerService/brokerService';
import paymentService from '../../../app/paymentService/paymentService';


const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '400px',
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
    }

});

const transactionType = {
    "b_in": "bijak-in", "b_out": "bijak-out",
    "b_hist": "historical"
};
const payment_modeOption = ["bank", "cash"];
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
                "cashback_allotted_to": ""
            },

            buyerid: "",
            supplierid: "",
            tempVar: {},
            errorFields: {}

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
            errorFields:errors
        })
        console.log(addTransactionPayloadVal)
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
                payload["transaction_date"] = this.formateDateForApi(payload["transaction_date"]);
                payload["cashback_allotted_to"] = payload["cashback_allotted_to"] !== "none" ? payload["cashback_allotted_to"] : null;
                payloadData["data"].push(payload);
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

    checkForInvalidFields(data) {
        var isValid = true;
        var error = {};
        var nonMandatoryFields = ["bankid", "amount_bank_entry", "bank_trxn_id", "cashback_value", "cashback_allotted_to", "remarks", "reason"]
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

    render() {
        const { classes } = this.props;
        const { addTransactionPayload, supplierid, buyerid, tempVar, errorFields } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>Mandi Data</p>  </DialogTitle>
                <DialogContent>

                    <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="transaction_date"
                                    label="Transaction date"
                                    format="dd/MM/yyyy"
                                    style={{ width: '100%' }}
                                    value={addTransactionPayload.transaction_date}
                                    //   onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div style={{ borderBottom: errorFields["buyerid"] ? "2px solid red" : "1px solid gray" }}>
                        <AsyncSelect
                            cacheOptions
                            value={buyerid}
                            id={"reactSelectCustom"}
                            name={"buyerid"}
                            // onChange={( item )=>{ this.setState({ buyerid : item  })}}
                            onChange={(item) => {
                                this.setState({ buyerid: item }, function () {
                                    var data = addTransactionPayload;
                                    if(errorFields["buyerid"]){
                                        delete errorFields["buyerid"];
                                    }
                                    if (item && item !== null) {
                                        data["buyerid"] = tempVar[item["label"]]["id"];
                                        data["buyer_mobile"] = tempVar[item["label"]]["mobile"];
                                    }else{
                                        data["buyerid"] = "";
                                        data["buyer_mobile"] ="";
                                    }
                                    this.setState({ addTransactionPayload: data , errorFields: errorFields})
                                })
                            }}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={`Select buyer..`}
                            defaultOptions={[]}
                            loadOptions={this.getOptions.bind(this, "buyerid")}
                        />
                    </div>
                    <div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray" }}>

                        <AsyncSelect
                            cacheOptions
                            value={supplierid}
                            id={"reactSelectCustom"}
                            name={"supplierid"}
                            onChange={(item) => {
                                this.setState({ supplierid: item }, function () {
                                    if(errorFields["supplierid"]){
                                        delete errorFields["supplierid"];
                                    }
                                    var data = addTransactionPayload;
                                    if (item && item !== null) {
                                        data["supplierid"] = tempVar[item["label"]]["id"];
                                        data["supplier_mobile"] = tempVar[item["label"]]["mobile"];
                                    }else{
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
                    </div>

                    <div >
                        <TextField
                            select
                            id="transaction_type"
                            name="transaction_type"
                            label="Transaction Type"
                            type="text"
                            error={errorFields["transaction_type"] ? true : false}
                            style={{ marginRight: '2%', width: '100%' }}
                            value={addTransactionPayload.transaction_type}
                            onChange={this.handleInputChange.bind(this)}>
                            {Object.keys(transactionType).map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {transactionType[key]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="bank_id"
                            label="Bank Id"
                            type="text"
                            error={errorFields["bank_id"] ? true : false}
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.bank_id}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div >
                        <TextField
                            margin="dense"
                            id="amount"
                            label="Amount"
                            error={errorFields["amount"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.amount}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div >
                        <TextField
                            margin="dense"
                            id="amount_bank_entry"
                            label="Amount Bank Entry"
                            type="text"
                            error={errorFields["amount_bank_entry"] ? true : false}
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.amount_bank_entry}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div >
                        <TextField
                            margin="dense"
                            id="bank_trxn_id"
                            label="Bank transaction id"
                            error={errorFields["bank_trxn_id"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.bank_trxn_id}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div >
                        <TextField
                            margin="dense"
                            id="reason"
                            error={errorFields["reason"] ? true : false}
                            label="Reason"
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.reason}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="remarks"
                            label="Remarks"
                            error={errorFields["remarks"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.remarks}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>
                    <div >
                        <TextField
                            select
                            id="payment_mode"
                            name="payment_mode"
                            label="Transaction Type"
                            error={errorFields["payment_mode"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%', width: '100%' }}
                            value={addTransactionPayload.payment_mode}
                            onChange={this.handleInputChange.bind(this)}>
                            {payment_modeOption.map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div >
                        <TextField
                            margin="dense"
                            id="cashback_value"
                            label="Cashback Value"
                            error={errorFields["cashback_value"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={addTransactionPayload.cashback_value}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>
                    <div >
                        <TextField
                            select
                            id="cashback_allotted_to"
                            name="cashback_allotted_to"
                            label="Cashback allotted to "
                            error={errorFields["cashback_allotted_to"] ? true : false}
                            type="text"
                            style={{ marginRight: '2%', width: '100%' }}
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
                        <TextField
                            select
                            id="creator_role"
                            error={errorFields["creator_role"] ? true : false}
                            name="creator_role"
                            label="Creater Role"
                            type="text"
                            style={{ marginRight: '2%', width: '100%' }}
                            value={addTransactionPayload.creator_role}
                            onChange={this.handleInputChange.bind(this)}>
                            {creator_roleOption.map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.addTransaction.bind(this)} color="primary">Add</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
            {/* {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""} */}
        </div>
        );
    }
}

AddTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddTransactionModal);