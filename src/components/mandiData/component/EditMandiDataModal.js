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

    dialogPaper: {
        minWidth: '550px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },

});

class EditMandiDataModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: this.props.editableData,
            mandiGradeOptions: ["A", "B", "C", "D", "E", "F", "G", "H"],
            mandiGradeHindiOptions: ['क', 'ख', 'ग', 'घ', 'ङ', 'च'],
            // dataObj: {
            //     'state': '',
            //     'market': '',
            //     'district': '',
            //     'market_hindi': '',
            //     'district_hindi': '',
            //     'state_hindi': '-'

            // },
            "stateList": this.props.stateList,
            "districtMap": this.props.districtMap,
            "districtList": [],
            "isManuallyAdded": this.props.editableData && this.props.editableData["businessAddedPlace"] ? this.props.editableData["businessAddedPlace"] : false
        }

    }

    componentDidMount() {
        console.log(this.props.editableData)
        this.setState({ districtList: Utils.getDistrictData()[this.props.editableData["state"].toLowerCase()] })
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
        this.setState({ dataObj: data });
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
        console.log(this.state.dataObj);
        var data = this.state.dataObj;
        var payload = {
            "market": data["market"],
            "apmc_req": data["apmc_req"],
            "mandi_grade": data["mandi_grade"],
            "mandi_grade_hindi": data["mandi_grade_hindi"],
            "loc_lat": data["loc_lat"],
            "loc_long": data["loc_long"]
        }
        console.log(payload)
        let resp = await mandiDataService.updateMandiData( payload );
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onEditModalClosed();
        } else {
            alert("Opps there was an error, while adding");
        }
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    checkForValid


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }


    handleDialogCancel(event) {
        this.setState({ open: false }, function () {
            this.props.onEditModalClosed();
        })
    }


    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
        if (id === "state") {
            let val = event.target.value;
            if (this.state.districtMap.hasOwnProperty(val.toLowerCase())) {
                let list = this.state.districtMap[val.toLowerCase()];
                this.setState({ districtList: list });
            }
        }
    };


    handleUpdateClick(event) {
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
        const { isManuallyAdded, mandiGradeOptions, mandiGradeHindiOptions } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>Edit Mandi Data</p>  </DialogTitle>
                <DialogContent>

                    <div >
                        <TextField
                            margin="dense"
                            id="market"
                            label="Market"
                            type="text"
                            disabled={true}
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
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%', width: '100%' }}
                            value={this.state.dataObj.state}
                            onChange={this.handleStateChange.bind(this, 'state')}>
                            {this.state.stateList.map((option, i) => (
                                <MenuItem key={i} value={option.toLowerCase()} selected={true}>
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
                            disabled={!isManuallyAdded}
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
                            id="state_hindi"
                            label="State (Hindi)"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.state_hindi}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="district_hindi"
                            label="District (Hindi)"
                            type="text"
                            disabled={!isManuallyAdded}
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
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.market_hindi}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>

                    <div >
                        <TextField
                            select
                            id="mandi_grade"
                            label="Mandi Grade"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.mandi_grade || ""}
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
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleUpdateClick.bind(this)} color="primary">Update</Button>
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

EditMandiDataModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditMandiDataModal);