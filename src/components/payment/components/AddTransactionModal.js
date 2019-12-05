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

class AddTransactionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            dataObj: {
                'state': '',
                'market': '',
                'district': '',
                'market_hindi': '',
                'district_hindi': '',
                'state_hindi': '',
                "remarks": "additional place"
            },
            addTransactionPayload:{
                trans_date : new Date(),
            },
            mandiGradeOptions: ["A", "B", "C", "D", "E", "F"],
            mandiGradeHindiOptions: ['क', 'ख', 'ग', 'घ', 'ङ', 'च'],
            "stateList": [
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
            "districtList": []

        }
        alert("open")

    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    render() {
        const { classes } = this.props;
        const { addTransactionPayload, mandiGradeOptions, mandiGradeHindiOptions } = this.state;
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
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={addTransactionPayload.trans_date}
        //   onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
        </MuiPickersUtilsProvider>
     </div>
                {/*<div >
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
                        style={{ marginRight: '2%', width: '100%' }}
                        value={this.state.dataObj.state}
                        onChange={this.handleStateChange.bind(this, 'state')} >
                        {this.state.stateList.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div >
                    <TextField
                        select
                        id="district"
                        label="District"
                        type="text"
                        style={{ marginRight: '2%', width: '100%' }}
                        value={this.state.dataObj.district}
                        onChange={this.handleStateChange.bind(this, 'district')}>
                        {this.state.districtList.map((option, i) => (
                            <MenuItem key={i} value={option.district_name} selected={true}>
                                {option.district_name}
                            </MenuItem>
                        ))}
                    </TextField>
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

                    
                    <div >
                        <TextField
                            select
                            id="mandi_grade"
                            label="Mandi Grade"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.mandi_grade }
                            onChange={this.handleStateChange.bind(this, 'mandi_grade')}>
                            {mandiGradeOptions.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            select
                            id="mandi_grade_hindi"
                            label="Mandi Grade ( Hindi )"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.mandi_grade_hindi || ""}
                            onChange={this.handleStateChange.bind(this, 'mandi_grade_hindi')}>
                            {mandiGradeHindiOptions.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            select
                            id="apmc_req"
                            label="APMC"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.apmc_req}
                            onChange={this.handleStateChange.bind(this, 'apmc_req')}>
                            {[true, false].map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option ? "Yes" : "No"}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="loc_lat"
                            label="Latitude"
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.loc_lat }
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="loc_long"
                            label="Longitude"
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.loc_long }
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div> */}

            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn}  color="primary">Add</Button>
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