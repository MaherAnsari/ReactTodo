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
// import AsyncSelect from 'react-select/lib/Async';
import buyerService from '../../../app/buyerService/buyerService';
import supplierService from '../../../app/supplierService/supplierService';
import brokerService from '../../../app/brokerService/brokerService';
import { Storage } from 'aws-amplify';
import orderService from '../../../app/orderService/orderService';
import Switch from '@material-ui/core/Switch';
import Loader from '../../common/Loader';
import Utils from '../../../app/common/utils';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
    muiSwitchroot: {
        float: "right"
    },

});

// const statusOption = ["pending", "settled", "partial_settled"];

class EditOrderDataModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            orderPayload: this.props.editableData,
            orderPayloadToUpdate: {
                "active": "",
                // "buyerid": "",
                "actual_dispatch_date": "",
                // "supplierid": "",
                "brokerid": "",
                "commodity": "",
                "rate": "",
                "qnt": "",
                "unit": "",
                "type": "BILTI",
                "bijak_amt": "",
                "supporting_images": [],
                "transport_info": "",
                "author_name": "",
                "app_order_id": "",
                // "author_mobile": "",
                "creator_role": "",
                "status": "",
                "remark": "",
                "other_info": "",
                "buyer_mobile": "",
                "supplier_mobile": "",
                "commission_rate": "",
                "commission_unit": "",
                "target_location": "",
                "source_location": ""
            },

            buyerid: "",
            supplierid: "",
            brokerid: "",
            tempVar: {},
            errorFields: {},
            attachmentArray: [],
            commodityList: this.props.commodityList,
            showLoader: false

        }

    }

    componentDidMount() {
        console.log(this.state.orderPayload)
        if (this.state.orderPayload) {


            let attachmentArrayVal = this.state.attachmentArray;
            if (this.state.orderPayload && this.state.orderPayload["supporting_images"] && this.state.orderPayload["supporting_images"] !== null) {
                for (var i = 0; i < this.state.orderPayload["supporting_images"].length; i++) {
                    let imgObj = {
                        bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                        image_url: this.state.orderPayload["supporting_images"][i],
                        key: this.state.orderPayload["supporting_images"][i]
                    }
                    attachmentArrayVal.push(imgObj)
                }
            }

            this.setState({
                attachmentArray: attachmentArrayVal,
                // buyerid: [{ label: this.state.orderPayload["buyer_name"], value: this.state.orderPayload["buyer_mobile"] }],
                // supplierid: [{ label: this.state.orderPayload["supplier_name"], value: this.state.orderPayload["supplier_mobile"] }],
                brokerid: [{ value: this.state.orderPayload["brokerid"], label: this.state.orderPayload["broker_name"] }],
            })
        }
    }


    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.open });
        }
    }





    handleInputChange(event) {
        var floatIds = ["rate", "qnt", "bijak_amt", "commission_rate"]; // this values need to be float
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var orderPayloadVal = this.state.orderPayload;
        if (floatIds.indexOf(id) > -1) {
            // if (val === "" || !isNaN(val)) {
            if (val === "" || val.match(/^(\d+\.?\d{0,9}|\.\d{1,9})$/)) {
                orderPayloadVal[id] = val;
            }
        } else {
            orderPayloadVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            orderPayload: orderPayloadVal,
            errorFields: errors
        })
        console.log(orderPayloadVal)
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

            if (type === "brokerid") {
                data['role'] = 'broker';
                resp = await brokerService.serchUser(data);
            }

            if (resp.data.status === 1 && resp.data.result) {
                var respData = [];
                if (type === "brokerid") {
                    respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "id");
                    this.setTempArray(resp.data.result.data, "id");
                } else {
                    respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile");
                    this.setTempArray(resp.data.result.data, "mobile");
                }

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
                // optionsData.push({ label: data[i][labelKey] + " (" + data[i][valuekey] + ")", value: data[i][valuekey] });
                optionsData.push({ label: data[i]["fullname"] +",  "+data[i]["business_name"] +" \n  ("+data[i]["locality"] +" , "+data[i][valuekey]+" )", value: data[i][valuekey] });
            }
        }
        return optionsData;
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

    async updateOrder(event) {
        try {
            var payload = this.state.orderPayload;
            var id = payload.id;
            if (this.checkForInvalidFields(payload)) {
                this.setState({ showLoader: true });
                payload["supporting_images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);
                payload = this.removeBlankNonMandatoryFields(payload);
                payload["actual_dispatch_date"] = this.formateDateForApi(payload["actual_dispatch_date"]);
                // var resp= { data:{ status : 1, result:{} }}
                var resp = await orderService.updateExistingOrder(id, payload);
                this.setState({ showLoader: false });
                if (resp.data.status === 1 && resp.data.result) {
                    alert("Successfully updated this order ");
                    this.props.onOrderDataUpdated();
                } else {
                    alert("There was an error while updating this order");
                }
            } else {
                alert("please fill the mandatory fields highlighted");
            }
        } catch (err) {
            console.log(err);
        }
    }

    removeBlankNonMandatoryFields(data) {
        var floatIds = ["rate", "qnt", "bijak_amt", "commission_rate"]
        var formateddata = {};
        for (var key in this.state.orderPayloadToUpdate) {
            if (data[key] && data[key] !== "") {
                formateddata[key] = data[key];
            }

            if (key === "active") {
                formateddata[key] = data[key];
            }

            if (formateddata[key] && floatIds.indexOf(key) > -1) {
                formateddata[key] = parseFloat(data[key]);
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
        var nonMandatoryFields = ["transport_info", "type", "author_name", "brokerid",
            "remark", "other_info", "commission_rate", "commission_unit", "rate", "qnt", "unit"];
        var extraMandatoryFields = ["creator_role"];
        for (var key in data) {
            // console.log( key +"---"+data[key])
            if (nonMandatoryFields.indexOf(key) === -1 && data[key] === "" && data[key] === null) {
                error[key] = true;
                isValid = false;
                console.log(key)
            }
            if (extraMandatoryFields.indexOf(key) > -1 && (data[key] === "" || data[key] === null)) {
                error[key] = true;
                isValid = false;
                console.log(key)
            }
        }
        this.setState({ errorFields: error });
        return isValid;
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
        Storage.put("order/" + updatedFileName, file, {
            // key: "UBIL-Register-Online.png"
            contentType: 'image/png'
        }).then(result => {
            let data = result
            let attachmentObj = {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                filename: updatedFileName,
                key: result.key
            }
            let { attachmentArray } = this.state;

            Storage.get("order/" + updatedFileName)
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
            console.log(err)
        }
        );
    }

    handleStateChange = (id, event) => {
        let data = this.state.orderPayload;
        if (id === "active") {
            data[id] = event.target.checked;
        }
        console.log(data)
        this.setState({ orderPayload: data });
    };


    handelDateChange(dateval) {
        var orderPayloadVal = this.state.orderPayload;
        orderPayloadVal["actual_dispatch_date"] = dateval;
        this.setState({ orderPayload: orderPayloadVal })
    }

    render() {
        const { classes } = this.props;
        const { showLoader, orderPayload, brokerid, commodityList, tempVar, errorFields } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                // disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                {!showLoader ? <div>
                    <DialogTitle
                        style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                        id="form-dialog-title">
                        <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Edit Order</p>
                    </DialogTitle>
                    <DialogContent>

                        <div >
                            <span style={{ lineHeight: "40px", fontFamily: "lato", fontSize: "17px" }}>Enable / disable order</span>
                            <Switch
                                classes={{ root: classes.muiSwitchroot }}
                                checked={orderPayload.active}
                                onChange={this.handleStateChange.bind(this, "active")}
                                value={orderPayload.active}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />

                        </div>

                        <div style={{ display: "flex" }}>

                            <div style={{ width: "49%", lineHeight: "40px", fontFamily: "lato", fontSize: "17px" }}>
                                Order Date
                        </div>

                            <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ width: "49%" }} >
                                <div style={{ width: "49%" }} >
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="actual_dispatch_date"
                                        format="dd-MMM-yyyy"
                                        style={{ width: '100%' }}
                                        value={orderPayload["actual_dispatch_date"]}
                                        maxDate={new Date()}
                                        onChange={(dateval) => {
                                            this.handelDateChange(dateval);
                                        }}

                                    />
                                </div>
                            </MuiPickersUtilsProvider>
                        </div>

                        <div style={{ display: "flex" }}>
                            {/* <div style={{ borderBottom: errorFields["buyerid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>
                            <AsyncSelect
                                cacheOptions
                                value={buyerid}
                                id={"reactSelectCustom"}
                                name={"buyerid"}
                                // onChange={( item )=>{ this.setState({ buyerid : item  })}}
                                onChange={(item) => {
                                    this.setState({ buyerid: item }, function () {
                                        var data = orderPayload;
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
                                        this.setState({ orderPayload: data, errorFields: errorFields })
                                    })
                                }}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select buyer..`}
                                defaultOptions={[]}
                                loadOptions={this.getOptions.bind(this, "buyerid")}
                            />
                        </div> */}

                            <TextField
                                margin="dense"
                                id="Buyer_name"
                                label="Buyer name"
                                type="text"
                                disabled={true}
                                style={{ width: '49%' }}
                                value={orderPayload.buyer_name}
                                onChange={() => { }}
                                fullWidth />

                            &nbsp;
                            &nbsp;
                    {/* <div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>

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
                                        var data = orderPayload;
                                        if (item && item !== null) {
                                            data["supplierid"] = tempVar[item["label"]]["id"];
                                            data["supplier_mobile"] = tempVar[item["label"]]["mobile"];
                                        } else {
                                            data["supplierid"] = "";
                                            data["supplier_mobile"] = "";
                                        }
                                        this.setState({ orderPayload: data, errorFields: errorFields })
                                    })
                                }}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select supplier..`}
                                defaultOptions={[]}
                                loadOptions={this.getOptions.bind(this, "supplierid")}
                            />
                        </div> */}
                            <TextField
                                margin="dense"
                                id="supplier_name"
                                label="supplier name"
                                type="text"
                                disabled={true}
                                style={{ width: '49%' }}
                                value={orderPayload.supplier_name}
                                onChange={() => { }}
                                fullWidth />
                        </div>

                        <div style={{ display: "flex" }}>
                            {/* <div style={{ borderBottom: errorFields["brokerid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>
                            <AsyncSelect
                                cacheOptions
                                value={brokerid}
                                id={"reactSelectCustom"}
                                name={"brokerid"}
                                // onChange={( item )=>{ this.setState({ buyerid : item  })}}
                                onChange={(item) => {
                                    this.setState({ brokerid: item }, function () {
                                        var data = orderPayload;
                                        if (errorFields["brokerid"]) {
                                            delete errorFields["brokerid"];
                                        }
                                        if (item && item !== null) {
                                            data["brokerid"] = tempVar[item["value"]]["id"];
                                            // data["buyer_mobile"] = tempVar[item["label"]]["mobile"];
                                        } else {
                                            data["brokerid"] = "";
                                            // data["buyer_mobile"] = "";
                                        }
                                        this.setState({ orderPayload: data, errorFields: errorFields })
                                    })
                                }}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select broker..`}
                                defaultOptions={[]}
                                loadOptions={this.getOptions.bind(this, "brokerid")}
                            />
                        </div> */}
                            <TextField
                                select
                                id="creator_role"
                                name="creator_role"
                                label="Creater Role"
                                error={errorFields["creator_role"] ? true : false}
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={orderPayload.creator_role}
                                onChange={this.handleInputChange.bind(this)}>
                                {["la", "ca"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                            &nbsp;
                            &nbsp;
                        <TextField
                                select
                                id="commodity"
                                error={errorFields["commodity"] ? true : false}
                                name="commodity"
                                label="Commodity"
                                type="text"
                                style={{ width: '49%', marginTop: '1%' }}
                                value={orderPayload.commodity}
                                onChange={this.handleInputChange.bind(this)}>
                                {commodityList.map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="source_location"
                                label="Source Location"
                                type="text"
                                error={errorFields["source_location"] ? true : false}
                                style={{ width: '49%' }}
                                value={orderPayload.source_location}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                            &nbsp;
<TextField
                                margin="dense"
                                id="target_location"
                                label="Target Location"
                                error={errorFields["target_location"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.target_location}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>
                        <div style={{ display: "flex" }} >


                            <TextField
                                margin="dense"
                                id="bijak_amt"
                                label="Bijak Amount"
                                type="text"
                                error={errorFields["bijak_amt"] ? true : false}
                                style={{ width: '49%' }}
                                value={orderPayload.bijak_amt}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />

                            &nbsp;
                          &nbsp;

                          <TextField
                                select
                                id="type"
                                name="type"
                                label="Type"
                                error={errorFields["type"] ? true : false}
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={orderPayload.type}
                                onChange={this.handleInputChange.bind(this)}>
                                {["bilti", "commission"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </div>

                        <div style={{ display: "flex", marginTop: 4 }} >

                            <TextField
                                select
                                id="unit"
                                error={errorFields["unit"] ? true : false}
                                name="unit"
                                label="Unit"
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={orderPayload.unit}
                                onChange={this.handleInputChange.bind(this)}>
                                {["kg", "quintal", "ton", "packet", "crate", "box", "pc"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                            &nbsp;
                        &nbsp;

                        <TextField
                                margin="dense"
                                id="qnt"
                                label="Quantity"
                                error={errorFields["qnt"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.qnt}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>

                        <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="rate"
                                label="Rate"
                                type="text"
                                error={errorFields["rate"] ? true : false}
                                style={{ width: '49%' }}
                                value={orderPayload.rate}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                          &nbsp;
                          <TextField
                                margin="dense"
                                id="transport_info"
                                label="Transport info"
                                error={errorFields["transport_info"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.transport_info}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />

                        </div>
                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="remark"
                                error={errorFields["remark"] ? true : false}
                                label="Remarks"
                                type="text"
                                style={{ width: '98%' }}
                                value={orderPayload.remark}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>
                        {/* 
                        <div style={{ display: "flex" }} >
                          
                             <TextField
                                margin="dense"
                                id="author_name"
                                label="Author name"
                                error={errorFields["author_name"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.author_name}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                            &nbsp;
                  
                            <TextField
                                select
                                id="status"
                                name="status"
                                label="Status"
                                error={errorFields["status"] ? true : false}
                                type="text"

                                style={{ width: '49%', marginTop: "1%" }}
                                value={orderPayload.status}
                                onChange={this.handleInputChange.bind(this)}>
                                {statusOption.map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="remark"
                                error={errorFields["remark"] ? true : false}
                                label="Remarks"
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.remark}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                        &nbsp;
                        <TextField
                                margin="dense"
                                id="other_info"
                                label="Other Info"
                                error={errorFields["other_info"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.other_info}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>


                        <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="commission_rate"
                                label="Commision rate"
                                error={errorFields["commission_rate"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={orderPayload.commission_rate}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                        &nbsp;
                        <TextField
                                select
                                id="commission_unit"
                                name="commission_unit"
                                label="Commission unit"
                                error={errorFields["commission_unit"] ? true : false}
                                type="text"
                                style={{ width: '49%', marginTop: "1%" }}
                                value={orderPayload.commission_unit}
                                onChange={this.handleInputChange.bind(this)}>
                                {["quintal", "ton"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div> */}

                        {/* <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="transport_info"
                                label="Transport info"
                                error={errorFields["transport_info"] ? true : false}
                                type="text"
                                style={{ width: '100%' }}
                                value={orderPayload.transport_info}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
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
                                    <img src={keyObj["image_url"]} style={{cursor: "zoom-in"}} onClick={() => window.open(keyObj["image_url"], "_blank")} alt={keyObj["image_url"]} height="150px" width="150px" />
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
                        <Button className={classes.formCancelBtn} onClick={this.updateOrder.bind(this)} color="primary">Update</Button>
                        <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                    </DialogActions>
                </div> :
                    <Loader primaryText="Please wait.." />}
            </Dialog>
        </div>
        );
    }
}

EditOrderDataModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditOrderDataModal);