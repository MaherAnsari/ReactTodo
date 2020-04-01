import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import roleService from './../../app/roleService/roleService';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Loader from './Loader';
import List from '@material-ui/core/List';
import SweetAlertPage from '../../app/common/SweetAlertPage';

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
    },
    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    }

});

class RoleDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            data: {
                "mobile": "",
                "name": "",
                "permissions": []
            },
            // roleList: ['user-creation', 'add-bank','order-creation','payviaCreditption','payment-request','manage-credit','manange-supporting-data'
            //             ,'payment-tab-entry-rule','super-admin','mandi-data-update','mandi-rates-update','commodityList-update'],
            // roleList : [
            //     "user-creation",
            //     "add-bank",
            //     "order-creation",
            //     "payout-role",
            //     "request-payout",
            //     "manage-credit",
            //     "manage-images-data",
            //     "payment-update",
            //     "super-admin",
            //     "supporting-data-role"
            // ],
            roleList: [
                "BasicUser",
                "UserManagement",
                "OrderManagement",
                "PayoutMaker",
                "PayoutChecker",
                "PaymentManagment",
                "SupportingDataManagement",
                "SuperAdmin",
                "ViewUserMobileNumber",
                "DownloadData"
                // "RazorpayX"
            ],

            showLoader: false,

            showSweetAlert: false,
            sweetAlertData: {
                "type": "",
                "title": "",
                "text": ""
            },
            showErrorMsg : false
        }
    }


    componentDidMount() {

        if (this.props.isupdate) {
            let arr = typeof (this.props.editdata['permissions']) === "string" ? this.props.editdata['permissions'].split(',') : this.props.editdata['permissions'];
            let obj = this.props.editdata;
            obj['permissions'] = arr;
            this.setState({ data: obj })
        }
    }

    componentWillReceiveProps(nextProps) {

    }



    handleChange = event => {
        let dataObj = this.state.data;
        let id = event.target.id;
        if (id === "mobile") {
            if (event.target.value.length <= 10) {
                dataObj[id] = event.target.value;
            }
        } else {
            dataObj[id] = event.target.value;
        }
        this.setState({ data: dataObj, showErrorMsg : false });
    }





    onSubmitClick = () => {
        let dialogText = "Are you sure to add ?"
        if (this.state.dataArr && this.state.dataArr.length > 0) {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            // alert("Opps there was an error, while adding");
            let sweetAlrtData = this.state.sweetAlertData;
            sweetAlrtData["type"] = "error";
            sweetAlrtData["title"] = "Error";
            sweetAlrtData["text"] = "Opps there was an error, while adding";
            this.setState({
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });

        }
    }

    handelConfirmUpdate = async () => {
        try {
            this.setState({ showLoader: true, showConfirmDialog: false });
            let resp;
            if (this.props.isupdate) {
                resp = await roleService.updateUser(this.state.data);
            } else {
                resp = await roleService.addUser(this.state.data);
            }
            this.setState({ showLoader: false });
            let sweetAlrtData = this.state.sweetAlertData;
            console.log(resp)
            if (resp.data.status === 1) {
                // this.props.onEditModalClosed();
                sweetAlrtData["type"] = "success";
                sweetAlrtData["title"] = "Success";
                sweetAlrtData["text"] = "Successfully Added";
            } else {
                // alert("Opps there was an error, while adding");
                // alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while adding");
                sweetAlrtData["type"] = "error";
                sweetAlrtData["title"] = "Error";
                sweetAlrtData["text"] = resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while adding";
            }
            this.setState({
                showConfirmDialog: false,
                alertData: {},
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });
        } catch (err) {
            console.log(err);
        }
    }

    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }



    handleAddClick(event) {
        let data = this.state.data;

        if (!data['name'] && data['name'] === "" && !data['mobile'] && data['mobile'] === "") {
            // alert("Please check all required field");
            this.setState({ showErrorMsg : true});
            return;
        }
        let dialogText = this.props.isupdate ? "Are you sure  to update ?" : "Are you sure to add ?";

        this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });

    }
    handleCheckbox(id, event) {
        let obj = this.state.dataObj;
        obj[id] = !obj[id];
        this.setState({ QueryObj: obj });
    }
    handleToggle = (event, value) => {
        // console.log(value,event);
        let dataObj = this.state.data;
        let arr = this.state.data.permissions;
        if (arr.indexOf(event) > -1) {
            let index = arr.indexOf(event);
            arr.splice(index, 1)
        } else {
            arr.push(event);
        }
        dataObj.permissions = arr;
        this.setState({});
    };


    handelSweetAlertClosed() {
        this.setState({ showSweetAlert: false }, () =>{
            if( this.state.sweetAlertData["type"] !== "error"){
                this.props.onEditModalClosed()
            }
        })
    }

    render() {
        const { classes } = this.props;
        const { showLoader, showSweetAlert, sweetAlertData } = this.state;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            {!showLoader ? <div>
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '18px' }}> Edit Role-Permission
</div>  </DialogTitle>
                <DialogContent>


                    <div style={{ display: 'flex' }}>
                        <TextField
                            margin="dense"
                            id="mobile"
                            label="Mobile"
                            type="text"
                            disabled={this.props.isupdate}
                            style={{ marginRight: '2%', width: "48%" }}
                            value={this.state.data.mobile}
                            onChange={this.handleChange.bind(this)}
                            required
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            style={{ marginRight: '2%', width: "48%" }}
                            value={this.state.data.name}
                            onChange={this.handleChange.bind(this)}
                            required
                            fullWidth
                        />

                    </div>

                    <div>
                        <div style={{ fontSize: '16px', marginTop: '10px', fontWeight: '500' }}>Roles:</div>
                        <div style={{ height: '50vh', overflow: 'auto' }}>
                            <List className={classes.list} dense component="div" role="list">
                                {this.state.roleList.map(value => {
                                    const labelId = `transfer-list-all-item-${value}-label`;

                                    return (
                                        <ListItem key={value} role="listitem" button onClick={this.handleToggle.bind(this, value)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={this.state.data.permissions.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={value} />
                                        </ListItem>
                                    );
                                })}
                                <ListItem />
                            </List>
                        </div>
                    </div>




                </DialogContent>
                {this.state.showErrorMsg &&
                        <div style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: "12px",
                            color: "red",
                            textAlign:"right",
                            paddingRight: "10px"
                        }}
                        > Please check all required fields</div>}
                <DialogActions>
                    {!this.state.isInfo && <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button>}
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </div> :
                <Loader primaryText="Please wait.." />}
        </Dialog>
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
            {showSweetAlert &&
                <SweetAlertPage
                    show={true}
                    type={sweetAlertData.type}
                    title={sweetAlertData.title}
                    text={sweetAlertData.text}
                    sweetAlertClose={() => this.handelSweetAlertClosed()}
                />}
        </div>
        );
    }
}

RoleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoleDialog);