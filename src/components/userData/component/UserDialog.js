import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import userListService from '../../../app/userListService/userListService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '600px',
        // maxWidth: '700px',
        minHeight: '500px',
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

class UserDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: this.props.data,
            "stateList": [],
            requiredKey:['fullname','business_name','locality','district','state'],
            payload:{}
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
        if(id == "default_commodity"){
            data[id] = event.target.value.split(',');
        }else{
            data[id] = event.target.value;
        }
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

        let resp = await userListService.addUserData(this.state.dataObj.id, this.state.payload);
        this.setState({ showConfirmDialog: false, alertData: {} });
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onEditModalClosed();
        } else {
            alert("Opps there was an error, while adding");
        }
        
    }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    handleStateChange = event => {
        let data = this.state.dataObj;
        data['state'] = event.target.value;
        this.setState({ dataObj: data });
    };


    handleAddClick(event) {
        let data = this.state.dataObj;
        let reqObj = {"data":{}};
        let reqArr =  this.state.requiredKey;
        for(let i=0;i<reqArr.length;i++){
            if(!data[reqArr[i]] &&  data[reqArr[i]] == ""){
                alert("All fields are required");
                return;
            }
            reqObj.data[reqArr[i]] = data[reqArr[i]];
        }
        reqObj.data['bijak_verified']=data['bijak_verified'];
        reqObj.data['bijak_assured']=data['bijak_assured'];
        reqObj.data['default_commodity']=data['default_commodity'];
        reqObj.data['active']=data['active'];

        let dialogText = "Are you sure  to update ?"

        this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true ,payload:reqObj});

    }
    handleCheckbox(id, event) {
        // console.log(id);
        let obj = this.state.dataObj;
        obj[id] = !obj[id];
        this.setState({ QueryObj: obj });
    }
    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>User Data</p>  </DialogTitle>
            <DialogContent>

                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="mobile"
                        label="Mobile"
                        type="text"
                        disabled
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.mobile}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="fullname"
                        label="Fullname"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.fullname}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                </div>


                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="district"
                        label="District"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.district}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="state"
                        label="State"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.state}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="business_name"
                        label="Buisness Name"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.business_name}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="locality"
                        label="Locality"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.locality}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="default_commodity"
                        label="Default Commodity"
                        type="text"
                        style={{ marginRight: '2%' }}
                        value={this.state.dataObj.default_commodity}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    /></div>
                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.bijak_verified}
                            onClick={this.handleCheckbox.bind(this, "bijak_verified")}
                            tabIndex={-1}
                            disableRipple
                        />Is Bijak Verified</div>

                    <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.bijak_assured}
                            onClick={this.handleCheckbox.bind(this, "bijak_assured")}
                            tabIndex={-1}
                            disableRipple
                        />Is Bijak Assured</div>
                      <div style={{ marginRight: '2%', width: '38%' }}>
                        <Checkbox
                            style={{ height: 24, width: 34 }}
                            checked={this.state.dataObj.active}
                            onClick={this.handleCheckbox.bind(this, "active")}
                            tabIndex={-1}
                            disableRipple
                        />Is User Enable</div>   
                </div>


            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button>
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

UserDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDialog);