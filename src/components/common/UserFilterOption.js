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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import commodityService from './../../app/commodityService/commodityService';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Utils from '../../app/common/utils';
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
    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },
    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    },
    card: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '15px'
    },
    offDay: {
        textAlign: 'center',
        width: '48%',
        // marginTop: '33px',
        marginLeft: '10px'
    }
});

class UserFilterOption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: { options:[], optionN_E :{}, optionE_N:{}},
            open: this.props.openModal,
            dataObj: {},
            roleList: ['All', 'la', 'ca', 'broker'],
            bijak_verified: ["All", "Yes", "No"],
            bijak_assured: ["All", "Yes", "No"],
            profile_completed: ["All", "Yes", "No"],
            active: ["All", "Yes", "No"],
            commodity: [],
            sortkey: ["id", "fullname", "rating","ordercount","paymentcount"],
            sortorder: ["asc", "desc"],
            filterDataArr: []



        }
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }
    componentDidMount() {
        this.getCommodityNames();
        let commodityArr = [];
        // console.log(this.props.filterData);
        // let obj = this.props.filterData;
        if (this.props.filterData['default_commodity']) {
            commodityArr = this.props.filterData['default_commodity'].split(",");
            // console.log(commodityArr);
        }
        let filterArr = [];
        if (this.props.filterData['sortkey']) {
            let sortkeyArr = this.props.filterData['sortkey'].split(',');
            let sortOrderArr = this.props.filterData['sortorder'].split(',');
            for (let i = 0; i < sortkeyArr.length; i++) {
                let obj = { "sortkey": sortkeyArr[i], "sortorder": sortOrderArr[i] };
                filterArr.push(obj);

            }
        }
        this.setState({ dataObj: this.props.filterData, commodity: commodityArr, filterDataArr: filterArr });


    }



    async getCommodityNames(txt) {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: Utils.getCommodityNamesArrayKeysMap(resp.data.result.data) });
            } else {
                this.setState({ commodityList: { options:[], optionN_E :{}, optionE_N:{}} });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: { options:[], optionN_E :{}, optionE_N:{}} });
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

        data[id] = event.target.value;

        this.setState({ dataObj: data });
    }

    handelAutoCompleteChange = (event, values) => {
        var commoditylist = [];
        let data = this.state.dataObj;
        if (values && values.length > 0) {
            for (var i = 0; i < values.length; i++) {
                commoditylist.push(this.state.commodityList["optionE_N"][values[i]]);
            }
        }
        data["default_commodity"] = commoditylist.join();
        this.setState({ dataObj: data, commodity: commoditylist })
    }

    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        // let val = event.target.value;
        data[id] = event.target.value;
        // }

        this.setState({ dataObj: data });
    }

    onSubmitClick = () => {

    }


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }



    handleAddClick(event) {
        if (!this.state.commodity.length) {
            delete this.state.dataObj.default_commodity;
        }
        let arr = this.state.filterDataArr;
        if (arr.length) {

            let sortkey = "";
            let sortorder = "";
            for (let i = 0; i < arr.length; i++) {
                // console.log(arr[i]['sortkey'].length);
                if (i === arr.length - 1 && arr[i]['sortkey'].length) {
                    sortkey += arr[i]['sortkey'];
                    sortorder += arr[i]['sortorder'];
                } else if (arr[i]['sortkey'] && arr[i]['sortkey'].length) {
                    sortkey += arr[i]['sortkey'] + ",";
                    sortorder += arr[i]['sortorder'] + ",";
                }else {
                    var n=sortkey.lastIndexOf(",");
                   sortkey=sortkey.substring(0,n) ;
                   var m=sortorder.lastIndexOf(",");
                   sortorder=sortorder.substring(0,m) 
                }

            }
            if (sortkey.length) {
                this.state.dataObj['sortkey'] = sortkey;
                this.state.dataObj['sortorder'] = sortorder;
            }

        }else{
            delete  this.state.dataObj['sortkey'];
            delete this.state.dataObj['sortorder']
        }
        

        console.log(this.state.dataObj);
        this.props.onFilterAdded(this.state.dataObj);
    }

    onAddFilterClick(event) {
        let obj = { "sortkey": "", "sortorder": "asc" };
        let arr = this.state.filterDataArr;
        arr.push(obj);
        this.setState({ filterDataArr: arr });
    }

    handleFilterChange(index, id, event) {
        // console.log(index);
        // console.log(event.target.value);
        // console.log(id);
        let data = this.state.filterDataArr;
        data[index][id] = event.target.value;
        this.setState({ filterDataArr: data });
    }
    onCancelClick(id, event) {
        let data = this.state.filterDataArr;
        data.splice(id, 1);
        this.setState({ filterDataArr: data });
    }

    getCommodityArray(data) {
        let cList = [];
        for (let i = 0; i < data.length; i++) {
            if (this.state.commodityList["optionN_E"].hasOwnProperty(data[i])) {
                cList.push(this.state.commodityList["optionN_E"][data[i]]);
            }
        }
        return cList;
    }

    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}><div > <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ height: '60px' }} id="form-dialog-title"><div style={{ color: '#000', fontFamily: 'Lato', fontSize: '20px', display: 'flex' }}>Filter Option</div>  </DialogTitle>
            <DialogContent>

                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        {!this.props.role && <TextField
                            select
                            id="role"
                            label="Role"
                            disabled={this.state.isInfo}
                            type="text"
                            style={{ marginRight: '2%', width: '98%', color: '#000',marginTop: '5px' }}
                            value={this.state.dataObj.role}
                            onChange={this.handleStateChange.bind(this, 'role')}

                        >

                            {this.state.roleList.map((option, i) => (
                                <MenuItem key={i}  value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>}

                        <Autocomplete
                            multiple
                            id="fixed-tags-demo"
                            options={this.state.commodityList["options"]}
                            getOptionLabel={e => e}
                            defaultValue={this.getCommodityArray(this.state.commodity)}
                            onChange={this.handelAutoCompleteChange}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip label={option} {...getTagProps({ index })} />
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

                        <TextField
                            select
                            id="bijak_verified"
                            label="Bijak Verified"
                            disabled={this.state.isInfo}
                            type="text"
                            style={{ marginRight: '2%', width: '98%', color: '#000',marginTop: '5px' }}
                            value={this.state.dataObj.bijak_verified}
                            onChange={this.handleStateChange.bind(this, 'bijak_verified')}

                        >

                            {this.state.bijak_verified.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            id="bijak_assured"
                            label="Bijak Assured"
                            disabled={this.state.isInfo}
                            type="text"
                            style={{ marginRight: '2%', width: '98%', marginTop: '5px' }}
                            value={this.state.dataObj.bijak_assured}
                            onChange={this.handleStateChange.bind(this, 'bijak_assured')}

                        >

                            {this.state.bijak_assured.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            id="profile_completed"
                            label="Profile Completed"
                            disabled={this.state.isInfo}
                            type="text"
                            style={{ marginRight: '2%', width: '98%', marginTop: '5px' }}
                            value={this.state.dataObj.profile_completed}
                            onChange={this.handleStateChange.bind(this, 'profile_completed')}

                        >

                            {this.state.profile_completed.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>


                        <TextField
                            select
                            id="active"
                            label="User Active"
                            disabled={this.state.isInfo}
                            type="text"
                            style={{ marginRight: '2%', width: '98%', marginTop: '5px' }}
                            value={this.state.dataObj.active}
                            onChange={this.handleStateChange.bind(this, 'active')}

                        >

                            {this.state.active.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className={classes.offDay}>
                        Sort Filter<i style={{ fontSize: '20px', marginLeft: '10px', color: 'red', cursor: 'pointer' }} onClick={this.onAddFilterClick.bind(this)} className="fa fa-plus-circle" aria-hidden="true"></i>
                        {this.state.filterDataArr.map((row, i) => {
                            return (
                                <div key={i} className={classes.card} >
                                    <div >
                                        <TextField
                                            select
                                            id="sortkey"
                                            label="Sort By"
                                            type="text"
                                            style={{ marginRight: '2%', width: '86%', marginLeft: '5%' }}
                                            value={row.sortkey}
                                            onChange={this.handleFilterChange.bind(this, i, 'sortkey')}

                                        >

                                            {this.state.sortkey.map((option, i) => (
                                                <MenuItem key={i} value={option} selected={true}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <i className={"fa fa-window-close " + classes.close} onClick={this.onCancelClick.bind(this, i)} aria-hidden="true"></i>
                                    </div>
                                    <TextField
                                        select
                                        id="sortorder"
                                        label="Sort Order"
                                        type="text"
                                        style={{ marginRight: '2%', width: '88%' }}
                                        value={row.sortorder}
                                        onChange={this.handleFilterChange.bind(this, i, 'sortorder')}

                                    >

                                        {this.state.sortorder.map((option, i) => (
                                            <MenuItem key={i} value={option} selected={true}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>);
                        })}
                    </div>
                </div>




                {/*               
                    <TextField
                        margin="dense"
                        id="rating"
                        label="Rating"
                        type="number"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '98%' }}
                        value={this.state.dataObj.rating}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /> */}

            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Ok</Button>
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>

        </div >
        </MuiThemeProvider>
        );
    }
}

UserFilterOption.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserFilterOption);