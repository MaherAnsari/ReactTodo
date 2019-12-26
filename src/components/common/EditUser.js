import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import userListService from '../../app/userListService/userListService';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../app/common/utils';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import commodityService from '../../app/commodityService/commodityService';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    overrides: {
      
        MuiInputBase:{
            input:{
                color: "#000"
            }
        }
    }
});
const styles = theme => ({

    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    }

});

class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            dataObj:this.props.data,
            requiredKey: ['fullname', 'mobile', 'role'],
            roleList: ['la', 'ca', 'broker'],
            isUpdate: false,
            isInfo: false,
            payload: {},
            stateList: Utils.getStateData(),
            "districtMap": Utils.getDistrictData(),
            "districtList": [],



        }
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }
    componentDidMount() {
        //  this.getCommodityNames();
        if (this.props.data) {
            let data = this.props.data;
            let arr = ['state', 'district', 'locality', 'business_name', 'business_name_hindi', 'fullname_hindi']
            for (let i = 0; i < arr.length; i++) {
                if (data.hasOwnProperty(arr[i]) && (!data[arr[i]] || data[arr[i]] === "null")) {
                    data[arr[i]] = "";
                }
            }
            let list = [];

            let val = data['state'];
            if (this.state.districtMap.hasOwnProperty(val.toLowerCase())) {
                list = this.state.districtMap[val.toLowerCase()];

            }

            console.log(this.props.data);

            this.setState({ dataObj: this.props.data, districtList: list, isUpdate: true, isInfo: this.props.isInfo,commodityList:this.props.commodityList });
        }

        console.log(this.state.dataObj); 
        //getting the Commodity Names for ten drop Down  
       
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.commodityList !== this.state.commodityList) {
    //         this.setState({ commodityList: nextProps.commodityList });
    //     }
    // }

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
        let data = this.state.dataObj;
        if (values.length > 0) { 
            for (var i = 0; i < values.length; i++) { 
                commoditylist.push(values[i]); 
            } 
        } 
        data["default_commodity"] = values;
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
        // console.log(reqObj);
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
        // console.log(id); 
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

    getHeader() {
        if (this.props.isInfo) {
            return this.state.dataObj.fullname;
        } else {
            return "User Data";
        }
    }

    getProfileColor(data) {
        if (data <= 2) {
            return 'red';
        } else if (data > 2 && data <= 5) {
            return '#d8d805';
        } else {
            return "green";
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}><div style={{ width: '100%', padding: '8px 24px',marginTop:'50px'  }}>

            <div style={{ display: 'flex' }}>
                <TextField
                    margin="dense"
                    id="mobile"
                    label="Mobile"
                    type="number"
                    maxLength="10"
                    disabled={this.state.isInfo}
                    style={{ marginRight: '2%', width: '48%' }}
                    value={this.state.dataObj.mobile}
                    onChange={this.handleChange.bind(this)}
                    required
                    fullWidth
                />
                <TextField
                    select
                    id="role"
                    label="Role"
                    disabled={this.state.isInfo}
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
                </TextField>

            </div>
            <div style={{ display: 'flex' }}>
                <TextField
                    margin="dense"
                    id="fullname"
                    label="Fullname"
                    type="text"
                    disabled={this.state.isInfo}
                    style={{ marginRight: '2%', width: this.state.isUpdate ? '48%' : "98%" }}
                    value={this.state.dataObj.fullname}
                    onChange={this.handleChange.bind(this)}
                    required
                    fullWidth
                />

                {this.state.isUpdate && <TextField
                    margin="dense"
                    id="fullname_hindi"
                    disabled={this.state.isInfo}
                    label="Fullname (Hindi)"
                    type="text"
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
                    type="text"
                    disabled={this.state.isInfo}
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
                    options={this.props.commodityList}
                    getOptionLabel={e => e}
                    defaultValue={this.state.dataObj.default_commodity}
                    onChange={this.handelAutoCompleteChange}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip  label={option} {...getTagProps({ index })} />
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
                    type="text"
                    disabled={this.state.isInfo}
                    style={{ marginRight: '2%', width: this.state.isUpdate ? '48%' : "98%" }}
                    value={this.state.dataObj.business_name}
                    onChange={this.handleChange.bind(this)}
                    fullWidth
                />

                {this.state.isUpdate && <TextField
                    margin="dense"
                    id="business_name_hindi"
                    label="Buisness Name (Hindi)"
                    type="text"
                    disabled={this.state.isInfo}
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
                    type="number"
                    maxLength="10"
                    disabled={this.state.isInfo}
                    // disabled={this.state.isUpdate} 
                    style={{ marginRight: '2%', width: '48%' }}
                    value={this.state.dataObj.sec_mobile}
                    onChange={this.handleChange.bind(this)}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="third_mobile"
                    label="Third Mobile"
                    type="number"
                    maxLength="10"
                    disabled={this.state.isInfo}
                    // disabled={this.state.isUpdate} 
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
                    disabled={true}
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
                    type="text"
                    disabled={this.state.isInfo}
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
                    disabled={this.state.isInfo}
                    type="text"
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
                        disabled={this.state.isInfo}
                        checked={this.state.dataObj.bijak_verified}
                        onClick={this.handleCheckbox.bind(this, "bijak_verified")}
                        tabIndex={-1}
                        disableRipple
                    />Is Bijak Verified</div>

                <div style={{ marginRight: '2%', width: '38%' }}>
                    <Checkbox
                        style={{ height: 24, width: 34 }}
                        disabled={this.state.isInfo}
                        checked={this.state.dataObj.bijak_assured}
                        onClick={this.handleCheckbox.bind(this, "bijak_assured")}
                        tabIndex={-1}
                        disableRipple
                    />Is Bijak Assured</div>
                <div style={{ marginRight: '2%', width: '38%' }}>
                    <Checkbox
                        style={{ height: 24, width: 34 }}
                        checked={this.state.dataObj.active}
                        disabled={this.state.isInfo}
                        onClick={this.handleCheckbox.bind(this, "active")}
                        tabIndex={-1}
                        disableRipple
                    />Is User Enabled</div>
            </div>

            <div style={{ textAlign: 'end', marginRight: '4%', marginTop: '2%' }}>
                <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button>
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </div>
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
        </div>
        </MuiThemeProvider>
        );
    }
}

EditUser.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditUser); 