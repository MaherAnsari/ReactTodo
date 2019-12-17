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
                "type": "",
                "bijak_amt": "",
                "supporting_images": [],
                "transport_info": "",
                "author_name": "",
                "author_mobile": "",
                "status": "",
                "remark": "",
                "other_info": "",
                "buyer_mobile": "",
                "supplier_mobile": "",
                "commission_rate": "",
                "commission_unit": ""
            },

            buyerid: "",
            supplierid: "",
            brokerid: "",
            tempVar: {},
            errorFields: {},
            attachmentArray: [],
            commodityList: []

        }
        this.getCommodityNames();
    }


    componentDidMount(){
        if(this.props.userdata && this.props.userdata.role === "ca"){
            this.state.addOrderPayload['buyerid'] = this.props.userdata.id;
            this.state.addOrderPayload['buyer_mobile'] = this.props.userdata.mobile;

        }else if(this.props.userdata && this.props.userdata.role === "la"){
            this.state.addOrderPayload['supplierid'] = this.props.userdata.id;
            this.state.addOrderPayload['supplier_mobile'] = this.props.userdata.mobile;
        }else if(this.props.userdata && this.props.userdata.role === "broker"){
            this.state.addOrderPayload['brokerid'] = this.props.userdata.id;
        }
    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
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
        var intejarIds = ["rate", "qnt", "bijak_amt", "commission_rate"]; // this values need to be intejar
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var addOrderPayloadVal = this.state.addOrderPayload;
        if (intejarIds.indexOf(id) > -1) {
            if (val === "" || !isNaN(val)) {
                addOrderPayloadVal[id] = Number(val);
            }
        } else {
            addOrderPayloadVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addOrderPayload: addOrderPayloadVal,
            errorFields: errors
        })
        console.log(addOrderPayloadVal)
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
                } else {
                    respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile");
                }
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

    async addOrder(event) {
        try {
            var payloadData = { "data": [] };
            var payload = this.state.addOrderPayload;

            if (this.checkForInvalidFields(payload)) {
                payload["supporting_images"] = this.prepareSupportingUrlArray(this.state.attachmentArray);
                payloadData["data"].push(this.removeBlankNonMandatoryFields(payload));
                var resp = await orderService.addNewOrder(payloadData);
                console.log(resp);
                if (resp.data.status === 1 && resp.data.result) {
                    alert("Successfully added this order ");
                    this.props.onOrderDataAdded();
                } else {
                    alert("There was an error while adding this order");
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
        var nonMandatoryFields = ["transport_info", "type", "author_name", "author_mobile", "status",
         "remark", "other_info","commission_rate","commission_unit"]
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

        Storage.configure({
            level: 'public',
            AWSS3: {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',//Your bucket name;
                region: 'ap-south-1'//Specify the region your bucket was created in;
            }
        });

        Storage.put("order/" + file.name, file, {
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

            Storage.get("order/" + file.name)
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


    render() {
        const { classes } = this.props;
        const { addOrderPayload, supplierid, buyerid, brokerid, commodityList, tempVar, errorFields } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                // disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Add Order</p>
                </DialogTitle>
                <DialogContent>

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
                                            data["buyerid"] = tempVar[item["label"]]["id"];
                                            data["buyer_mobile"] = tempVar[item["label"]]["mobile"];
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
                        {this.props.userdata && this.props.userdata.role === "la"?<TextField
                                margin="dense"
                                id="supplierid"
                                label="Supplier"
                                disabled={true}
                                // error={errorFields["amount"] ? true : false}
                                type="text"
                                style={{ width: '49%' }}
                                value={this.props.userdata.fullname}
                                // onChange={this.handleInputChange.bind(this)}
                                fullWidth /> :  <div style={{ borderBottom: errorFields["supplierid"] ? "2px solid red" : "1px solid gray", width: "49%" }}>

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
                                            data["supplierid"] = tempVar[item["label"]]["id"];
                                            data["supplier_mobile"] = tempVar[item["label"]]["mobile"];
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
                    {this.props.userdata && this.props.userdata.role === "broker"?<TextField
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
                                            data["brokerid"] = tempVar[item["label"]]["id"];
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
                        </div>}
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
                            value={addOrderPayload.commodity}
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
                            margin="dense"
                            id="qnt"
                            label="Quantity"
                            error={errorFields["qnt"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.qnt}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div style={{ display: "flex", marginTop: 4 }} >

                        <TextField
                            select
                            id="unit"
                            error={errorFields["unit"] ? true : false}
                            name="unit"
                            label="Unit"
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.unit}
                            onChange={this.handleInputChange.bind(this)}>
                            {["quintal", "ton"].map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                        &nbsp;
                    &nbsp;
                        <TextField
                            select
                            id="type"
                            name="type"
                            label="Type"
                            error={errorFields["type"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.type}
                            onChange={this.handleInputChange.bind(this)}>
                            {["none", "commission"].map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div style={{ display: "flex" }} >

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
                            margin="dense"
                            id="author_name"
                            label="Author name"
                            error={errorFields["author_name"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.author_name}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                    </div>

                    <div style={{ display: "flex" }} >
                        <TextField
                            margin="dense"
                            id="author_mobile"
                            label="Author mobile number"
                            type="text"
                            error={errorFields["author_mobile"] ? true : false}
                            style={{ width: '49%' }}
                            value={addOrderPayload.author_mobile}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />
                        &nbsp;
                        &nbsp;
                        <TextField
                            margin="dense"
                            id="status"
                            label="Status"
                            error={errorFields["status"] ? true : false}
                            type="text"
                            style={{ width: '49%' }}
                            value={addOrderPayload.status}
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
                            style={{ width: '49%' }}
                            value={addOrderPayload.remark}
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
                            value={addOrderPayload.other_info}
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
                    </div>
                    <div style={{ display: "flex" }} >
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

                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.addOrder.bind(this)} color="primary">Add</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

AddOrderModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddOrderModal);