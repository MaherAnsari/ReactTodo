import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
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

class UserFilterOption extends Component {

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
            "districtMap": Utils.getDistrictData(),
            "districtList": [],



        }
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }
    componentDidMount() {
        this.getCommodityNames();
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
       if (id === "default_commodity" ) {
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
      
    }


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }



    handleAddClick(event) {
       

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
                    <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '20px',display:'flex',marginLeft:'35%',width:'60%' }}>Filter Option</div>  </DialogTitle> 
            <DialogContent> 

          


                <div style={{ display: 'flex' }}>
             
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
                        id="rating"
                        label="Rating"
                        type="number"
                        disabled={this.state.isInfo}
                        style={{ marginRight: '2%', width: '98%' }}
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
                 <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Ok</Button>
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
           
        </div>
        );
    }
}

UserFilterOption.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserFilterOption);