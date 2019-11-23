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

class DataUploader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: {
                'state': '',
                'market': '',
                'district': '',
                'market_hindi':'',
                'district_hindi':'',
                'state_hindi':'-'
               
            },
            "stateList":[
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
            "districtMap":Utils.getDistrictData()  ,
            "districtList":[]

        }

    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }


    handleChange = event => {
        let data = this.state.dataObj;
        let id = event.target.id;
        data[id] = event.target.value;
        this.setState({dataObj:data});
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
        // console.log(this.state.dataObj);
        let resp = await mandiDataService.addMandiData(this.state.dataObj);
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
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


    handleStateChange  = (id,event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({dataObj:data});
        if(id === "state" ){
            let val = event.target.value;
            this.state.dataObj.district="";
            if(this.state.districtMap.hasOwnProperty(val.toLowerCase())){
                let list = this.state.districtMap[val.toLowerCase()];
                this.setState({districtList:list});
            }
           
        }
    };


    handleAddClick(event){

        let dialogText = "Are you sure to add ?"
        if (this.state.dataObj.state && this.state.dataObj.state !== "" && this.state.dataObj.market && this.state.dataObj.market !== "" && this.state.dataObj.district && this.state.dataObj.district !== ""
        && this.state.dataObj.market_hindi && this.state.dataObj.market_hindi !== "" && this.state.dataObj.district_hindi && this.state.dataObj.district_hindi !== "") {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            alert("All fields are required");
        }
    }
    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>Mandi Data</p>  </DialogTitle>
            <DialogContent>

                <div >
                    <TextField
                        margin="dense"
                        id="market"
                        label="Market"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.market}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /></div>
                <div >
                <TextField
                            select
                            id="state"
                            label="State"
                            type="text"
                            style={{ marginRight: '2%',width:'100%' }}
                            value={this.state.dataObj.state}
                            onChange={this.handleStateChange.bind(this,'state')}

                        >

                            {this.state.stateList.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    {/* <TextField
                        margin="dense"
                        id="state"
                        label="state"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.state}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /> */}
                    </div>

                <div >
                <TextField
                            select
                            id="district"
                            label="District"
                            type="text"
                            style={{ marginRight: '2%',width:'100%' }}
                            value={this.state.dataObj.district}
                            onChange={this.handleStateChange.bind(this,'district')}

                        >

                            {this.state.districtList.map((option, i) => (
                                <MenuItem key={i} value={option.district_name} selected={true}>
                                    {option.district_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    {/* <TextField
                        margin="dense"
                        id="district"
                        label="District"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.district}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /> */}
                    </div>
                       <div >
                    <TextField
                        margin="dense"
                        id="district_hindi"
                        label="District (Hindi)"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.district_hindi}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /></div>
                       <div >
                    <TextField
                        margin="dense"
                        id="market_hindi"
                        label="Market (Hindi)"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.market_hindi}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /></div>

            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Add</Button>
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

DataUploader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataUploader);