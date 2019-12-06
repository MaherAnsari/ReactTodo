import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import userListService from './../../app/userListService/userListService';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from './../../app/common/utils';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import commodityService from './../../app/commodityService/commodityService';


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
        minHeight: '600px',
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
    profile:{
        marginLeft: '30%',
    background: 'red',
    width: '40px',
    borderRadius: '10px'
    }

});

class InfoDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            dataObj: {
                "mobile": "",
                "profile_completed": true,
                "fullname": "",
                "business_name": "",
                "locality": "",
                "district": "",
                "state": "",
                "role": this.props.role,
                "default_commodity": [],
                "bijak_verified": false,
                "bijak_assured": false,
                "exposure_cutoff_limit": 100,
                "active": true,
                "rating": 5
            },
            requiredKey: ['fullname', 'mobile', 'role'],
            roleList: ['la', 'ca', 'broker'],
            isUpdate: false,
            isInfo: false,
            payload: {},
            stateList: [
                "Andaman and Nicobar Islands",
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chandigarh",
                "Chhattisgarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Ladakh",
                "Lakshadweep",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "National Capital Territory of Delhi",
                "Odisha",
                "Puducherry",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttar Pradesh",
                "Uttarakhand",
                "West Bengal"
            ],
            "districtMap": Utils.getDistrictData(),
            "districtList": [],



        }
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }
    componentDidMount() {
        this.getCommodityNames();
        if (this.props.data) {
            let data = this.props.data;
            let arr = ['state', 'district', 'locality', 'business_name', 'business_name_hindi', 'fullname_hindi']
            for (let i = 0; i < arr.length; i++) {
                if (data.hasOwnProperty(arr[i]) && (!data[arr[i]] || data[arr[i]] === "null")) {
                    data[arr[i]] = "";
                }
            }
            let list = [];
            data['role'] = this.props.role;
            let val = data['state'];
            if (this.state.districtMap.hasOwnProperty(val.toLowerCase())) {
                list = this.state.districtMap[val.toLowerCase()];

            }

            // console.log(this.props.data);

            this.setState({ dataObj: this.props.data, districtList: list, isUpdate: true, isInfo: this.props.isInfo });
        }

        // console.log(this.state.dataObj);
        //getting the Commodity Names for ten drop Down 

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.commodityList !== this.state.commodityList) {
            // console.log(nextProps.commodityList)
            this.setState({ commodityList: nextProps.commodityList });
        }
    }

    async getCommodityNames(txt) {
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

    handleChange = event => {
        let data = this.state.dataObj;
        let id = event.target.id;
        if (id === "mobile" || id === "sec_mobile" || id === "third_mobile") {
            if (event.target.value.length <= 10) {
                data[id] = event.target.value;
            }
        } else if (id === "default_commodity" || id === "partner_names") {
            data[id] = event.target.value.split(',');
        } else {
            data[id] = event.target.value;
        }
        this.setState({ dataObj: data });
    }

    handelAutoCompleteChange = (event, values) => {
        var commoditylist = [];
        console.log(event);
        let data = this.state.dataObj;
        if (values.length > 0) {
            for (var i = 0; i < values.length; i++) {
                commoditylist.push(values[i].name);
            }
        }
        data["default_commodity"] = commoditylist;
        this.setState({ dataObj: data })
    }



    onSubmitClick = () => {
        let dialogText = "Are you sure to add ?"
        if (this.state.dataArr && this.state.dataArr.length > 0) {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            alert("Opps there was an error, while adding");
        }
    }

    handelConfirmUpdate = async () => {
        let id = this.state.dataObj.id;
        let obj = this.state.dataObj;
        let reqObj = {}
        if (this.state.isUpdate) {
            delete obj.mobile;
            delete obj.createdtime;
            delete obj.updatedtime;
            reqObj = { 'data': obj };
        } else {
            id = null;
            reqObj['data'] = [];
            reqObj['data'][0] = obj;
        }
        // let resp = {};
        let resp = await userListService.addUserData(this.state.isUpdate, id, reqObj);

        if (resp.data.status === 1) {

            this.props.onEditModalClosed();

        } else {
            alert("Opps there was an error, while adding");
        }
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }



    handleAddClick(event) {
        let data = this.state.dataObj;
        let reqArr = this.state.requiredKey;
        for (let i = 0; i < reqArr.length; i++) {
            if (!data[reqArr[i]] && data[reqArr[i]] === "") {
                alert("Please check all required field");
                return;
            }
        }
        let dialogText = this.state.isUpdate ? "Are you sure  to update ?" : "Are you sure to add ?";

        this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true, payload: data });

    }
    handleCheckbox(id, event) {
        let obj = this.state.dataObj;
        obj[id] = !obj[id];
        this.setState({ QueryObj: obj });
    }

    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
        if (id === "state") {
            let val = event.target.value;
            this.state.dataObj.district = "";
            if (this.state.districtMap.hasOwnProperty(val.toLowerCase())) {
                let list = this.state.districtMap[val.toLowerCase()];
                this.setState({ districtList: list });
            }

        }
    };

    getHeader(){
        if(this.props.isInfo){
            return this.state.dataObj.fullname ;
        }else{
            return "User Data";
        }
    }

    getProfileColor(data){
        if(data <= 2 ){
            return 'red';
        }else if(data >2 && data <= 5){
            return '#d8d805';
        }else{
            return "green";
        }
    }
    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
                    <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '20px',display:'flex',marginLeft:'35%',width:'60%' }}>{this.getHeader()}
    {this.props.isInfo && <p className={classes.profile} style={{background:this.getProfileColor(this.state.dataObj.profile_segment)}}>{this.state.dataObj.profile_segment}</p>}</div>  </DialogTitle> 
            <DialogContent> 

                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="mobile"
                        label="Mobile"
                        type="number"
                        maxLength="10"
                        required
                        disabled={this.state.isUpdate}
                        style={{ marginRight: '2%', width: '98%' }}
                        value={this.state.dataObj.mobile}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    {/* <TextField
                        select
                        id="role"
                        label="Role"
                        type="text"
                        style={{ marginRight: '2%', width: '48%', marginTop: '5px' }}
                        value={this.state.dataObj.role}
                        onChange={this.handleStateChange.bind(this, 'role')}

                    >

                        {this.state.roleList.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField> */}

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="fullname"
                        label="Fullname"
                        type="text"
                        style={{ marginRight: '2%', width: this.state.isUpdate ? '48%' : "98%" }}
                        value={this.state.dataObj.fullname}
                        disabled={this.state.isInfo}
                        onChange={this.handleChange.bind(this)}
                        required
                        fullWidth
                    />

                    {this.state.isUpdate && <TextField
                        margin="dense"
                        id="fullname_hindi"
                        label="Fullname (Hindi)"
                        type="text"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.fullname_hindi}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />}
                </div>


                <div style={{ display: 'flex' }}>

                    <TextField
                        select
                        margin="dense"
                        id="state"
                        label="State"
                        disabled={this.state.isInfo}
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.state}
                        onChange={this.handleStateChange.bind(this, 'state')}
                        fullWidth>

                        {this.state.stateList.map((option, i) => (
                            <MenuItem key={i} value={option.toLowerCase()} selected={true}>
                                {option.toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        id="district"
                        label="District"
                        type="text"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', marginTop: '5px', width: '48%' }}
                        value={this.state.dataObj.district}
                        onChange={this.handleStateChange.bind(this, 'district')}

                    >

                        {this.state.districtList.map((option, i) => (
                            <MenuItem key={i} value={option.district_name} selected={true}>
                                {option.district_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div style={{ display: 'flex' }}>
                    {/* <TextField
                        margin="dense"
                        id="default_commodity"
                        label="Default Commodity"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.default_commodity}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /> */}

                    <Autocomplete
                        multiple
                        id="fixed-tags-demo"
                        disabled={this.state.isInfo}
                        options={this.state.commodityList}
                        getOptionLabel={e => e}
                        defaultValue={this.state.dataObj.default_commodity}
                        onChange={this.handelAutoCompleteChange}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip disabled={this.state.isInfo} label={option} {...getTagProps({ index })} />
                            ))
                        }
                        style={{ width: "98%" }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Default Commodity"
                                placeholder="Search"
                                fullWidth
                            />
                        )}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="business_name"
                        label="Buisness Name"
                        disabled={this.state.isInfo}
                        type="text"
                        style={{ marginRight: '2%', width: this.state.isUpdate ? '48%' : "98%" }}
                        value={this.state.dataObj.business_name}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />

                    {this.state.isUpdate && <TextField
                        margin="dense"
                        id="business_name_hindi"
                        label="Buisness Name (Hindi)"
                        disabled={this.state.isInfo}
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.business_name_hindi}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />}

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="sec_mobile"
                        label="Second Mobile"
                        disabled={this.state.isInfo}
                        type="number"
                        maxLength="10"
                        disabled={this.state.isUpdate}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.sec_mobile}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="third_mobile"
                        label="Third Mobile"
                        disabled={this.state.isInfo}
                        type="number"
                        maxLength="10"
                        disabled={this.state.isUpdate}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.third_mobile}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="bijak_credit_limit"
                        label="bijak Credit Limit"
                        type="number"
                        maxLength="10"
                        disabled={this.state.isInfo}
                        // disabled={this.state.isUpdate} 
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.bijak_credit_limit}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="partner_names"
                        label="Partner Name"
                        disabled={this.state.isInfo}
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.partner_names}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="locality"
                        label="Locality"
                        type="text"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.locality}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="exposure_cutoff_limit"
                        label="Cutoff Limit"
                        type="number"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '23%' }}
                        value={this.state.dataObj.exposure_cutoff_limit}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="rating"
                        label="Rating"
                        type="number"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '23%' }}
                        value={this.state.dataObj.rating}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                </div>




                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.bijak_verified}
                            onClick={this.handleCheckbox.bind(this, "bijak_verified")}
                            tabIndex={-1}
                            disabled={this.state.isInfo}
                            disableRipple
                        />Is Bijak Verified</div>

                    <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.bijak_assured}
                            onClick={this.handleCheckbox.bind(this, "bijak_assured")}
                            tabIndex={-1}
                            disabled={this.state.isInfo}
                            disableRipple
                        />Is Bijak Assured</div>
                    <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.active}
                            onClick={this.handleCheckbox.bind(this, "active")}
                            tabIndex={-1}
                            disabled={this.state.isInfo}
                            disableRipple
                        />Is User Enable</div>
                </div>


            </DialogContent>
            <DialogActions>
                {!this.state.isInfo && <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button>}
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
        </div>
        );
    }
}

InfoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoDialog);