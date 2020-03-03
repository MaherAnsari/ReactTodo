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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../common/Loader';

const styles = theme => ({

    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },
    offDay: {
        textAlign: 'center',
        width: '48%',
        marginTop: '33px',
        marginLeft: '10px'
    },
    close:{
        color:'#000',
        fontSize:'20px'
    },
    card:{
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '10px',
        borderRadius: '10px',
        marginTop:'15px'
    }


});

class AddRatesDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: {
                "market":"",
                "district":"",
                "state":"",
                "commodity":"",
                "min_price":0,
                "max_price":0,
                "modal_price":0
            },
            "stateList": Utils.getStateData(),
            "districtMap": Utils.getDistrictData(),
            "marketList":[],
            "districtList": [],
            "commodityList":[],
            showLoader: false,
            showConfirmDialog: false,
            dialogText: "", 
            dialogTitle: "",

        }
        this.handleCommodityChange = this.handleCommodityChange.bind(this);


    }

    handleCommodityChange = (event, values) => {
        console.log(values);
        if(values){
            let obj = this.state.dataObj;
           obj['commodity'] =  values['label']
            this.setState({  dataObj: obj });
        }else{
            let obj = this.state.dataObj;
            obj['commodity'] = "";
            this.setState({ dataObj: obj });
        }
       


    }

    getMarketData = async (marketName) => {
       let params = {"district":marketName,"lang":"hindi"}
        let resp = await mandiDataService.getMarketList(params);
        if (resp.data.status === 1) {
           this.setState({marketList:resp.data.result});
        } else {
            // alert("Opps there was an error, while getting market list");
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while getting market list");
        }
        // this.setState({ showConfirmDialog: false, alertData: {} });
    }


    handleChange = event => {
        let data = this.state.dataObj;
        let id = event.target.id;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
    }

    onSubmitClick = () => {
        let dialogText = "Are you sure to add ?"
        if (this.state.dataArr && this.state.dataArr.length > 0) {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            // alert("Oops there was an error, while adding");
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while adding");
        }
    }

    handelConfirmUpdate = async () => {
        this.setState({ showConfirmDialog: false, showLoader : true });
        let resp = await mandiDataService.addCommodityRates(this.state.dataObj);
        this.setState({ showLoader : false });
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onEditModalClosed();
        } else {
            // alert("Opps there was an error, while adding");
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while adding");
        }
        this.setState({  alertData: {} });
    }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
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
        if(id === "district"){
            data['market']="";
            this.getMarketData(event.target.value);
        }
    };


    handleAddClick(event) {
        let dialogText = "Are you sure to add ?"
        console.log(this.state.dataObj);
        if (this.state.dataObj.state && this.state.dataObj.state !== "" && this.state.dataObj.market && this.state.dataObj.market !== "" && this.state.dataObj.district && this.state.dataObj.district !== ""
            && this.state.dataObj.min_price !== ""  && this.state.dataObj.max_price !== ""
             && this.state.dataObj.modal_price !== "") {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            alert("Please check  required fields");
        }
    }

    onCancelClick(id,event){
   
    }
    render() {
        const { classes } = this.props;
        const { showLoader , showConfirmDialog} = this.state;
        console.log( showLoader , showConfirmDialog )
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                { !showLoader ? <div>
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', fontFamily: 'Lato', fontSize: '18px' }}>Add Mandi Data</p>  </DialogTitle>
                <DialogContent>
                <TextField
                                    select
                                    id="state"
                                    label="State"
                                    type="text"
                                    style={{ marginRight: '2%', width: '98%' }}
                                    value={this.state.dataObj.state}
                                    required
                                    onChange={this.handleStateChange.bind(this, 'state')} >
                                    {this.state.stateList.map((option, i) => (
                                        <MenuItem key={i} value={option} selected={true}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    id="district"
                                    label="District"
                                    type="text"
                                    style={{ marginRight: '2%', width: '98%' }}
                                    value={this.state.dataObj.district}
                                    required
                                    onChange={this.handleStateChange.bind(this, 'district')}>
                                    {this.state.districtList.map((option, i) => (
                                        <MenuItem key={i} value={option.district_name} selected={true}>
                                            {option.district_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    id="market"
                                    label="Market"
                                    type="text"
                                    style={{ marginRight: '2%', width: '98%' }}
                                    value={this.state.dataObj.market}
                                    required
                                    onChange={this.handleStateChange.bind(this, 'market')}>
                                    {this.state.marketList.map((option, i) => (
                                        <MenuItem key={i} value={option.market} selected={true}>
                                            {option.market}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Autocomplete
                        options={this.props.commodityList}
                        style={{  width: '98%' }}
                        getOptionLabel={option => option.value}
                        id="commodity"
                        required
                        onChange={this.handleCommodityChange}
                        renderInput={params => (
                            <TextField {...params} label="Commodity" margin="none" fullWidth />
                        )}
                    />
                                {/* <TextField
                                    select
                                    id="commdity"
                                    label="Commodity"
                                    type="text"
                                    style={{ marginRight: '2%', width: '98%' }}
                                    value={this.state.dataObj.commdity}
                                    required
                                    onChange={this.handleStateChange.bind(this, 'commdity')}>
                                    {this.props.commodityList.map((option, i) => (
                                        <MenuItem key={i} value={option.label} selected={true}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField> */}

                                <TextField
                                    margin="dense"
                                    id="min_price"
                                    label="Min Price"
                                    type="number"
                                    style={{ marginRight: '2%' , width: '98%' }}
                                    value={this.state.dataObj.min_price}
                                    required
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                                 <TextField
                                     margin="dense"
                                     id="max_price"
                                     label="Max Price"
                                     type="number"
                                     style={{ marginRight: '2%' , width: '98%' }}
                                     value={this.state.dataObj.max_price}
                                     required
                                     onChange={this.handleChange.bind(this)}
                                     fullWidth
                                />
                                 <TextField
                                     margin="dense"
                                     id="modal_price"
                                     label="Modal Price"
                                     type="number"
                                     required
                                     style={{ marginRight: '2%' , width: '98%' }}
                                     value={this.state.dataObj.modal_price}
                                     onChange={this.handleChange.bind(this)}
                                     fullWidth
                                />
                        
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Add</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
                </div>:
                 <Loader primaryText="Please wait.."/>}
            </Dialog>
            {showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
        </div>
        );
    }
}

AddRatesDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddRatesDialog);