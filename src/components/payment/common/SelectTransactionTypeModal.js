import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import paymentService from '../../../app/paymentService/paymentService';

const styles = theme => ({

    dialogPaper: {
        minWidth: '400px',
        maxWidth: '450px',
        // minHeight: '700px',
        // maxHeight: '500px'
    }
});
const statusOption = ["approved", "failed"];

class SelectTransactionTypeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            errorFields: {},
            rowData: this.props.rowDataObj,
            statusUpdateObj: {
                "status" : "",
                "reason" : ""
            }
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onStatusUpdateObjClose();
    }

    handleInputChange(event) {
        var errors = this.state.errorFields;
        var id = event.target.id;
        if (!id && id === undefined) {
            id = event.target.name;
        }
        var val = event.target.value;
        var statusUpdateObjVal = this.state.statusUpdateObj;
        statusUpdateObjVal[id] = val;

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }

        this.setState({
            statusUpdateObj: statusUpdateObjVal,
            errorFields: errors
        })
    }

    checkIfValidDataForUpload( data ){
        console.log( data )
        var isValid = true;
        var errors =  {};
        if( !data["status"] || data["status"] === ""){
            isValid = false;
            errors["status"] = true;
        }

        if( data["status"] === "failed" && (!data["reason"] || data["reason"] === "")){
            isValid = false;
            errors["reason"] = true;
        }

        this.setState({ errorFields : errors });
        return isValid;
    }

    onStatusUpdatedClicked(event) {
        var row = this.state.rowData;
        var statusUpdateObj_val = this.state.statusUpdateObj;

        var obj = {};
        obj["id"] = row["id"];
        obj["status"] = statusUpdateObj_val["status"];
        obj["reason"] = statusUpdateObj_val["reason"];
        obj["pay_id"] = row["pay_id"];
        console.log( this.checkIfValidDataForUpload( obj ))
        if(this.checkIfValidDataForUpload( obj ) ){
            this.updatePaymentStatus( obj );
        }
    }

    updatePaymentStatus = async ( payload ) => {
        try {
            let resp = await paymentService.updateStatusOfPayment( payload );
            if (resp.data.status === 1 ) {
              alert( "Successfully updated ");
              this.props.onUpdateSuccessFull( );
            } else {
              alert( "An error occured while updating the status")
            }
        } catch (err) {
            console.error(err);
            alert( "An error occured while updating the status")
        }
    }


    render() {
        const { classes } = this.props;
        const { errorFields, statusUpdateObj } = this.state;

        return (<div>
            <Dialog style={{ zIndex: '9999' }}
                open={this.state.open}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '40px' }}
                    id="form-dialog-title">
                    <div style={{ textAlign: "center", color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Change Status
                        </div>
                </DialogTitle>
                <DialogContent>

                    <div >
                        <TextField
                            select
                            id="status"
                            name="status"
                            label="Payment status"
                            error={errorFields["status"] ? true : false}
                            type="text"
                            style={{ width: '98%', marginTop: "1%" }}
                            value={statusUpdateObj.status}
                            onChange={this.handleInputChange.bind(this)}>
                            {statusOption.map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            margin="dense"
                            id="reason"
                            label="reason"
                            error={errorFields["reason"] ? true : false}
                            type="text"
                            style={{ width: '98%' }}
                            value={statusUpdateObj.reason}
                            onChange={this.handleInputChange.bind(this)}
                            fullWidth />

                    </div>

                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.onStatusUpdatedClicked.bind(this)} color="primary">Update</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

SelectTransactionTypeModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectTransactionTypeModal);