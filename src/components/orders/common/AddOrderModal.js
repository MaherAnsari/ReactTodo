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
import AsyncSelect from 'react-select/lib/Async';
import buyerService from '../../../app/buyerService/buyerService';
import supplierService from '../../../app/supplierService/supplierService';
import brokerService from '../../../app/brokerService/brokerService';
import { Storage } from 'aws-amplify';
import commodityService from '../../../app/commodityService/commodityService';
import orderService from '../../../app/orderService/orderService';
import Loader from '../../common/Loader';
import Utils from '../../../app/common/utils';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import { Auth } from 'aws-amplify';

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
// const statusOption = ["pending", "settled", "partial_settled"];

class AddOrderModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            addOrderPayload: {
                "buyerid": "",
                "supplierid": "",
                "brokerid": "",
                "commodity": "",
                "rate": "",
                "qnt": "",
                "unit": "",
                "type": "bilti",
                "bijak_amt": "",
                "supporting_images": [],
                "actual_dispatch_date": new Date(),
                "transport_info": "",
                "author_name": "",
                // "author_mobile": "",
                "creator_role": "",
                "status": "pending",
                "remark": "",
                "other_info": "",
                "buyer_mobile": "",
                "supplier_mobile": "",
                "commission_rate": "",
                "commission_unit": "",
                "target_location": "",
                "source_location": "",
                "rate_unit": "",

                "broker_mobile": "",
                "bijak_total_amount": "",
                "invoice_no": "",
                "old_system_order_id": "",
                "pkt": "",
                "brokerage": ""

            },

            buyerid: "",
            supplierid: "",
            brokerid: "",
            tempVar: {},
            errorFields: {},
            attachmentArray: [],
            commodityList: [],
            showLoader: false,
            subId : ""

        }
        this.getCommodityNames();
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }


    componentDidMount() {

        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => this.setState({ subId : user.attributes.sub}))
        .catch(err => console.log(err));

        if (this.props.userdata && this.props.userdata.role === "ca") {
            this.state.addOrderPayload['buyerid'] = this.props.userdata.id;
            this.state.addOrderPayload['buyer_mobile'] = this.props.userdata.mobile;

        } else if (this.props.userdata && this.props.userdata.role === "la") {
            this.state.addOrderPayload['supplierid'] = this.props.userdata.id;
            this.state.addOrderPayload['supplier_mobile'] = this.props.userdata.mobile;
        } else if (this.props.userdata && this.props.userdata.role === "broker") {
            this.state.addOrderPayload['brokerid'] = this.props.userdata.id;
        }
    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.open });
        }
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
            console.error(resp)
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.getCommodityNamesArray(resp.data.result.data) });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    getCommodityNamesArray(data) {
        try {
            var listData = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["name"]) {
                        listData.push(data[i]["name"])
                    }
                }
            }
            return listData;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    handleInputChange(event) {
        var floatIds = ["rate", "qnt", "bijak_amt", "commission_rate","bijak_total_amount", "pkt", "brokerage"]; // this values need to be float
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var addOrderPayloadVal = this.state.addOrderPayload;
        if (floatIds.indexOf(id) > -1) {
            // if (val === "" || !isNaN(val)) {
            if (val === "" || val.match(/^(\d+\.?\d{0,9}|\.\d{1,9})$/)) {
                addOrderPayloadVal[id] = val;
            }
        } else {
            addOrderPayloadVal[id] = val;
        }
        console.log(id + "-----" + addOrderPayloadVal[id]);
        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addOrderPayload: addOrderPayloadVal,
            errorFields: errors
        })
        console.log(addOrderPayloadVal)
    }

    handelAutoCompleteChange = (event, values) => {

        var errors = this.state.errorFields;
        var id = "commodity";

        var addOrderPayloadVal = this.state.addOrderPayload;
        if (values && values !== null) {
            addOrderPayloadVal[id] = values.toString();
        } else {
            addOrderPayloadVal[id] = "";
        }
        console.log(id + "-----" + addOrderPayloadVal[id]);

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addOrderPayload: addOrderPayloadVal,
            errorFields: errors
        })
    }

    handleDialogCancel(event) {
        this.props.onAddModalCancel();
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
                // optionsData.push({ label: data[i][labelKey] + " (" + data[i][valuekey] + " )", value: data[i][valuekey] });
                optionsData.push({ label: data[i]["fullname"] + ",  " + data[i]["business_name"] + " \n  (" + data[i]["locality"] + " , " + data[i][valuekey] + " )", value: data[i][valuekey] });
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

    async addOrder(event) {
        try {
            var payloadData = { "data": [] };
            var payload = this.state.addOrderPayload;
            // console.log()
            if (this.checkForInvalidFields(payload)) {
                this.setState({ showLoader: true });
                payload["supporting_images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);
                payload["actual_dispatch_date"] = this.formateDateForApi(payload["actual_dispatch_date"]);
                payloadData["data"].push(this.removeBlankNonMandatoryFields(payload));

                var resp = await orderService.addNewOrder( this.state.subId ,payloadData);
                console.log(resp);
                this.setState({ showLoader: false });
                if (resp.data.status === 1 && resp.data.result) {
                    alert("Successfully added this order ");
                    this.props.onOrderDataAdded();
                } else {
                    // alert("There was an error while adding this order");
                    alert(resp && resp.data && resp.data.message ? resp.data.message : "There was an error while adding this order");
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
        var floatIds = ["rate", "qnt", "bijak_amt", "commission_rate"];
        for (var key in data) {
            if (data[key] !== "") {
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
        console.log(formateddata);
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
            "remark", "other_info", "commission_rate", "commission_unit", "rate", "qnt",
             "unit", "rate_unit","broker_mobile","bijak_total_amount",
             "invoice_no","old_system_order_id","pkt","brokerage"]
        for (var key in data) {
            if (nonMandatoryFields.indexOf(key) === -1 && data[key] === "") {
                error[key] = true;
                isValid = false;
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
            // let data = err
            console.log(err)
        }
        );
    }


    handelDateChange(dateval) {
        var addOrderPayloadVal = this.state.addOrderPayload;
        addOrderPayloadVal["actual_dispatch_date"] = dateval;
        this.setState({ addOrderPayload: addOrderPayloadVal })
    }




    render() {
        const { classes } = this.props;
        const { showLoader, addOrderPayload, supplierid, buyerid, commodityList, tempVar, errorFields } = this.state;
        console.log(commodityList)
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
                            Add Order</p>
                    </DialogTitle>
                    <DialogContent>

                        <div style={{ display: "flex" }}>
                            <Grid container style={{ width: "49%" }} >
                                <div style={{ width: "100%", textAlign: "center", lineHeight: "54px" }}>
                                    Order Date
                        </div>
                            </Grid>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ width: "49%" }} >
                                <Grid container style={{ width: "49%" }} >
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="actual_dispatch_date"
                                        format="dd-MMM-yyyy"
                                        style={{ width: '100%' }}
                                        value={addOrderPayload["actual_dispatch_date"]}
                                        maxDate={new Date()}
                                        onChange={(dateval) => {
                                            this.handelDateChange(dateval);
                                        }}

                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
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
                                                var data = addOrderPayload;
                                                if (errorFields["buyerid"]) {
                                                    delete errorFields["buyerid"];
                                                }
                                                if (item && item !== null) {
                                                    data["buyerid"] = tempVar[item["value"]]["id"];
                                                    data["buyer_mobile"] = tempVar[item["value"]]["mobile"];
                                                    data["target_location"] = tempVar[item["value"]]["locality"]
                                                } else {
                                                    data["buyerid"] = "";
                                                    data["buyer_mobile"] = "";
                                                }
                                                this.setState({ addOrderPayload: data, errorFields: errorFields })
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
                                                var data = addOrderPayload;
                                                if (item && item !== null) {
                                                    data["supplierid"] = tempVar[item["value"]]["id"];
                                                    data["supplier_mobile"] = tempVar[item["value"]]["mobile"];
                                                    data["source_location"] = tempVar[item["value"]]["locality"]
                                                } else {
                                                    data["supplierid"] = "";
                                                    data["supplier_mobile"] = "";
                                                }
                                                this.setState({ addOrderPayload: data, errorFields: errorFields })
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

                        <div style={{ display: "flex" }}>
                            {/* {this.props.userdata && this.props.userdata.role === "broker" ? <TextField
                            margin="dense"
                            id="brokerid"
                            label="Broker"
                            disabled={true}
                            // error={errorFields["amount"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={this.props.userdata.fullname}
                            // onChange={this.handleInputChange.bind(this)}
                            fullWidth /> : <div style={{ borderBottom: errorFields["brokerid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>
                                <AsyncSelect
                                    cacheOptions
                                    value={brokerid}
                                    id={"reactSelectCustom"}
                                    name={"brokerid"}
                                    // onChange={( item )=>{ this.setState({ buyerid : item  })}}
                                    onChange={(item) => {
                                        this.setState({ brokerid: item }, function () {
                                            var data = addOrderPayload;
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
                                            this.setState({ addOrderPayload: data, errorFields: errorFields })
                                        })
                                    }}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={`Select broker..`}
                                    defaultOptions={[]}
                                    loadOptions={this.getOptions.bind(this, "brokerid")}
                                />
                            </div>} */}

                            <TextField
                                select
                                id="creator_role"
                                name="creator_role"
                                label="Creater Role"
                                error={errorFields["creator_role"] ? true : false}
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={addOrderPayload.creator_role}
                                onChange={this.handleInputChange.bind(this)}>
                                {["la", "ca"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                            &nbsp;
                            &nbsp;
                            <Autocomplete
                                // multiple
                                id="commodity"
                                error={errorFields["commodity"] ? true : undefined}
                                name="commodity"
                                label="Commodity"
                                options={commodityList}
                                getOptionLabel={e => e}
                                value={addOrderPayload.commodity}
                                onChange={this.handelAutoCompleteChange}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                style={{ width: '49%', marginTop: '1%', borderBottom: (errorFields["commodity"] ? "1px solid red" : "unset") }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Commodity"
                                        placeholder="Search"
                                        fullWidth
                                    />
                                )}
                            />
                            {/* <TextField
                                select
                                id="commodity"
                                error={errorFields["commodity"] ? true : false}
                                name="commodity"
                                label="Commodity"
                                type="text"
                                style={{ width: '49%', marginTop: '1%' }}
                                value={addOrderPayload.commodity}
                                onChange={this.handleInputChange.bind(this)}>
                                {commodityList.map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField> */}
                        </div>
                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="source_location"
                                label="Source Location"
                                type="text"
                                error={errorFields["source_location"] ? true : false}
                                style={{ width: '49%' }}
                                value={addOrderPayload.source_location}
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
                                value={addOrderPayload.target_location}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>

                        <div style={{ display: "flex", marginTop: 4 }} >

                            <TextField
                                margin="dense"
                                id="bijak_amt"
                                label="Bijak Amount"
                                type="text"
                                error={errorFields["bijak_amt"] ? true : false}
                                style={{ width: '49%' }}
                                value={addOrderPayload.bijak_amt}
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
                                value={addOrderPayload.type}
                                onChange={this.handleInputChange.bind(this)}>
                                {["bilti", "commission"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="rate"
                                label="Rate"
                                type="text"
                                error={errorFields["rate"] ? true : false}
                                style={{ width: '49%' }}
                                value={addOrderPayload.rate}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                          &nbsp;

                          <TextField
                                select
                                id="rate_unit"
                                name="rate_unit"
                                label="Rate Unit"
                                error={errorFields["rate_unit"] ? true : false}
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={addOrderPayload.rate_unit}
                                onChange={this.handleInputChange.bind(this)}>
                                {["Rs/Kg", "Rs/Quintal", "Rs/Ton", "Rs/Packet", "Rs/Crate", "Rs/Box", "Rs/Pc"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </div>



                        <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="qnt"
                                label="Quantity"
                                error={errorFields["qnt"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.qnt}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />

                            &nbsp;
                              &nbsp;
                            <TextField
                                select
                                id="unit"
                                error={errorFields["unit"] ? true : false}
                                name="unit"
                                label="Unit"
                                type="text"
                                style={{ width: '49%', marginTop: '5px' }}
                                value={addOrderPayload.unit}
                                onChange={this.handleInputChange.bind(this)}>
                                {["kg", "quintal", "ton", "packet", "crate", "box", "pc"].map((key, i) => (
                                    <MenuItem key={i} value={key} selected={true}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>



                            {/* <TextField
                                margin="dense"
                                id="author_name"
                                label="Author name"
                                error={errorFields["author_name"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.author_name}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth /> */}
                        </div>

                        {/* <div style={{ display: "flex" }} > */}
                        {/* <TextField
                            margin="dense"
                            id="author_mobile"
                            label="Author mobile number"
                            type="text"
                            error={errorFields["author_mobile"] ? true : false}
                            style={{ width: '49%' }}
                            value={addOrderPayload.author_mobile}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth /> */}

                        {/* <TextField
                            select
                            id="creator_role"
                            name="creator_role"
                            label="Creater Role"
                            error={errorFields["creator_role"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.creator_role}
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
                            id="status"
                            name="status"
                            label="Status"
                            error={errorFields["status"] ? true : false}
                            type="text"
                            defaultValue={"pending"}
                            style={{ width: '49%', marginTop: "1%" }}
                            value={addOrderPayload.status}
                            onChange={this.handleInputChange.bind(this)}>
                            {statusOption.map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div> */}
                        <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="transport_info"
                                label="Transport info"
                                error={errorFields["transport_info"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.transport_info}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                  &nbsp;

                            <TextField
                                margin="dense"
                                id="remark"
                                error={errorFields["remark"] ? true : false}
                                label="Remarks"
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.remark}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>

                        {/*--------------- newly Added---------------- */}
                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="broker_mobile"
                                error={errorFields["broker_mobile"] ? true : false}
                                label="Broker Mobile"
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.broker_mobile}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                        &nbsp;
                        <TextField
                                margin="dense"
                                id="bijak_total_amount"
                                label="Bijak total Amount"
                                error={errorFields["bijak_total_amount"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.bijak_total_amount}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>

                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="invoice_no"
                                error={errorFields["invoice_no"] ? true : false}
                                label="Invoice No."
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.invoice_no}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                        &nbsp;
                        <TextField
                                margin="dense"
                                id="old_system_order_id"
                                label="Old System Order id"
                                error={errorFields["old_system_order_id"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.old_system_order_id}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>

                        <div style={{ display: "flex" }} >

                            <TextField
                                margin="dense"
                                id="pkt"
                                error={errorFields["pkt"] ? true : false}
                                label="Pkt"
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.pkt}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                            &nbsp;
                            &nbsp;
                            <TextField
                                margin="dense"
                                id="brokerage"
                                label="brokerage"
                                error={errorFields["brokerage"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.brokerage}
                                onChange={this.handleInputChange.bind(this)}
                                fullWidth />
                        </div>


                        {/*--------------- newly Added ends---------------- */}

                        {/* <div style={{ display: "flex" }} >
                            <TextField
                                margin="dense"
                                id="commission_rate"
                                label="Commision rate"
                                error={errorFields["commission_rate"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={addOrderPayload.commission_rate}
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
                                value={addOrderPayload.commission_unit}
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
                                value={addOrderPayload.transport_info}
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
                                    <img src={keyObj["image_url"]} style={{ cursor: "zoom-in" }} onClick={() => window.open(keyObj["image_url"], "_blank")} alt={keyObj["image_url"]} height="150px" width="150px" />
                                    <div className="transaction-delete-icon" onClick={this.deleteItem.bind(this, keyObj.key)}>
                                        <i className="fa fa-trash fa-lg"></i>
                                    </div>
                                </div>
                            ))}
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
                            </Grid>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button className={classes.formCancelBtn} onClick={this.addOrder.bind(this)} color="primary">Add</Button>
                        <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                    </DialogActions>
                </div> :
                    <Loader primaryText="Please wait.." />}
            </Dialog>
        </div>
        );
    }
}

AddOrderModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddOrderModal);