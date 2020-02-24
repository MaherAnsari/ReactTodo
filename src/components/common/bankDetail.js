import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Loader from '../common/Loader';
import commonService from '../../app/commonService/commonService';
import { getAccessAccordingToRole } from '../../config/appConfig';
import Fab from '@material-ui/core/Fab';
import ConfirmDialog from '../../app/common/ConfirmDialog';

const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px',
        // padding: "0px 20%",
        // minHeight: '80vh',
    },
    card: {
        maxWidth: '100%',
        minHeight: '70vh',
        marginTop: '15px',
        height: '97%',
    }
});



class BankDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            acctData: [],
            currentPayoutView: "default", //selectAccount, addAccount,loading
            addAccountData: {
                account_number: "",
                ifsc: "",
                name: "",
                bank_name: "-"

            },

            errorFields: {},
            currentSelectedUserDetails: this.props.userData,
            showConfirmDialog: false,
            dialogText: "",
            dialogTitle:"",
            forceUpdateData: undefined
        }
    }

    componentDidMount() {
        this.getBankDetails(this.props.userdata);
    }
    getBankDetails = async (userData) => {
        try {
            this.setState({ showLoader: true, currentSelectedUserDetails: userData });
            let param = { "mobile": userData["mobile"] };
            let resp = await commonService.getbankDetail(param);
            if (resp.data.status === 1) {
                if (resp.data.result) {
                    this.setState({ showLoader: false, currentPayoutView: "selectAccount", acctData: resp.data.result || [] });
                } else {
                    this.setState({ showLoader: false, acctData: resp.data.result })
                }
            } else {
                alert("An error occured while getting the account details");
                this.setState({ showLoader: false });
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }

    handleInputChange(event) {
        try {
            event.preventDefault();
            var intejarIds = ["account_number"]; // this values need to be intejar
            var errors = this.state.errorFields;
            var id = event.target.id;
            if (!id && id === undefined) {
                id = event.target.name;
            }
            var val = event.target.value;
            var addAccountDataVal = this.state.addAccountData;
            if (intejarIds.indexOf(id) > -1) {
                if (val === "" || !isNaN(val)) {
                    addAccountDataVal[id] = val;  
                }
            } else {
                if (id === "bank_name") {
                    addAccountDataVal[id] = val;
                } else {
                    addAccountDataVal[id] = val ? val.toUpperCase() : val;
                }
            }

            if (errors.hasOwnProperty(id)) {
                delete errors[id];
            }
            this.setState({
                addAccountData: addAccountDataVal,
                errorFields: errors
            })
            // console.log(addAccountDataVal)
        } catch (err) {
            console.log(err)
        }
    }

    onsearchCleared(event) {
        this.setState({
            acctData: [],
            currentPayoutView: "default",
            addAccountData: {
                account_number: "",
                ifsc: "",
                name: "",
                bank_name: "-"
            },
            errorFields: {},
            currentSelectedUserDetails: undefined
        })
    }

    getStatusIcon(status) {
        if (!status) {
            return "check";
        } else {
            return "disc_full";
        }
    }

    getStatusIconColor(status) {
        if (!status) {
            return "green";
        } else {
            return "red";
        }
    }

    getStatusText(status) {
        if (status) {
            return " Verified";
        }
        // else if ( !status) {
        //     return "Verified";
        // }
        else {
            return " Non Verified";
        }
    }

    checkIfAccountInputDetaisAreValid() {
        let isValid = true;
        var data = this.state.addAccountData;
        let error = {};
        for (var key in data) {
            if (data[key] === "") {
                isValid = false;
                error[key] = true;
            }
        }
        this.setState({ errorFields: error })
        return isValid;
    }


    onNewAccountAddClicked = async () => {
        try {
            if (this.checkIfAccountInputDetaisAreValid()) {
                this.setState({ showLoader: true });
                let userData = this.state.currentSelectedUserDetails;
                let payload = {
                    "id": userData["id"],
                    "name": userData["fullname"],
                    "mobile": userData["mobile"],
                    "type": "Loader",
                    "bank_account": {
                        account_number: this.state.addAccountData["account_number"] + "",
                        ifsc: this.state.addAccountData["ifsc"],
                        name: this.state.addAccountData["name"],
                        bank_name: "-"
                    }
                }
                let resp = await commonService.addbankDetail(payload);
                if (resp.data.status === 1) {
                    if (resp.data.result) {
                        this.setState({ showLoader: false, currentPayoutView: "selectAccount" }, function () {
                            alert("Successfully Added");
                            this.getBankDetails(this.state.currentSelectedUserDetails)
                        });
                    } else {
                        this.setState({ showLoader: false })
                        alert("An error occured while adding the account details");
                    }
                } else {
                    this.setState({ showLoader: false })
                    alert("An error occured while adding the account details. Please check the details and try again");
                }
            }
        } catch (err) {
            console.error(err);
            this.setState({ showLoader: false })
            alert("An error occured while adding the account details")
        }
    }

    getStatusOfAccount( obj ){
        if( obj["status"] !== "active"){
            return (<Fab
                variant="extended"
                disabled={ !getAccessAccordingToRole("addBankAccount") }
                size="small"
                aria-label="Force validate"
                onClick={( event )=> this.setState({ dialogText: <div style={{display: "block"}}><div style={{ fontSize: "13px"}}>{`Name : ${obj["name"]} `}</div>
                <div style={{ fontSize: "13px"}}>{`IFSC : ${obj["ifsc"]} , Account no. : ${obj["account"]}`}</div></div>, forceUpdateData : obj, showConfirmDialog : true })}
                style={{ textTransform: "none", background: getAccessAccordingToRole("addBankAccount") ? "#108ad0": "gray", color: "#ffffff", padding: "0 8px" }}
            >
                Force validate
    </Fab>)
        }else{
            return (<span style={{ "textTransform": "capitalize" }}>{obj["status"] ? obj["status"] : ""} </span>);
        }
    }

    onForceUpdateBankDetail = async ( ) => {
        try {
            this.setState({ showLoader : true , showConfirmDialog : false });
            let data = this.state.forceUpdateData;
            let payload ={
                ifsc :data["ifsc"],
                accountnumber :data["account"],
                mobile:data["mobile"],
                name: data["name"],
            }
            let resp = await commonService.forceUpdateBankDetail(payload);
            this.setState({ showLoader : false });
                if (resp.data.status === 1) {
                    alert("Successfully updated");
                    this.getBankDetails(this.state.currentSelectedUserDetails)
                }else{
                    alert("Oops an error occured while validating your account details.");
                }
            
        }catch( err ){
            console.log( err )
        }
    }

    handelCancelUpdate(event) {
        this.setState({ showConfirmDialog: false, forceUpdateData : undefined });
      }

    render() {
        const { classes } = this.props;
        const { showLoader, acctData, currentPayoutView, addAccountData, errorFields } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        {/* <FilterListComponent
                            onsearchCleared={this.onsearchCleared.bind(this)}
                            getSearchedOrderListData={this.getBankDetails.bind(this)} /> */}

                        {!showLoader ? <React.Fragment>
                            {currentPayoutView === "selectAccount" &&
                                <React.Fragment>

                                    {acctData && acctData.length > 0 ?
                                        <div style={{ textAlign: "left", padding: "6px 10px" }}> Existing Accounts</div> :
                                        <div> No Account added Yet. Click to continue</div>}
                                    <List style={{ padding: "5px 10px" }} >
                                        {acctData && acctData.map((obj, index) => {
                                            const labelId = `checkbox-list-label-${obj["id"]}`;
                                            return (
                                                <ListItem key={obj["id"]} role={undefined} dense button style={{ background: index % 2 === 0 ? "#f1f1f1" : "#f9f9f9" }}>
                                                    <ListItemText
                                                        id={labelId}
                                                        primary={obj["name"]}
                                                        secondary={"IFSC : " + (obj["ifsc"] ? obj["ifsc"].toUpperCase() : "") + ", Account no. : " + obj["account"]} />
                                                    <Icon edge="end" aria-label="comments" style={{ color: this.getStatusIconColor(obj["pending_validation"]) }}>
                                                        {/* {this.getStatusIcon(obj["pending_validation"])} */}
                                                    </Icon>
                                                    {this.getStatusOfAccount( obj )}
                                                    {/* <span style={{ "textTransform": "capitalize" }}>{obj["status"] ? obj["status"] : ""} </span> */}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                    {getAccessAccordingToRole("addBankAccount") && <div className="updateBtnFixedModal" style={{ right: '7px', bottom: '90px' }}>
                                        <Button variant="contained"
                                            onClick={(event) =>
                                                this.setState({
                                                    errorFields: {},
                                                    currentPayoutView: "addAccount",
                                                    addAccountData: {
                                                        account_number: "",
                                                        ifsc: "",
                                                        name: "",
                                                        bank_name: "-"
                                                    }
                                                })}
                                            style={{ background: "transparent", color: "#fff" }}>Add a new Account</Button>

                                    </div>}

                                </React.Fragment>}

                            {currentPayoutView === "addAccount" &&
                                <React.Fragment>
                                    <div> Enter the following details </div>
                                    <div style={{ padding: "15px 20%" }}>


                                        {/* <TextField
                                            margin="dense"
                                            id="bank_name"
                                            error={errorFields["bank_name"] ? true : false}
                                            label="Bank name "
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.bank_name}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth /> */}
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            label="Name of Account holder"
                                            error={errorFields["name"] ? true : false}
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.name}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />

                                        <TextField
                                            margin="dense"
                                            id="account_number"
                                            error={errorFields["account_number"] ? true : false}
                                            label="Account number"
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.account_number}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />
                                        <TextField
                                            margin="dense"
                                            id="ifsc"
                                            label="Ifsc"
                                            error={errorFields["ifsc"] ? true : false}
                                            type="text"
                                            style={{ width: '100%', textTransform: "uppercase" }}
                                            value={addAccountData.ifsc}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />


                                    </div>
                                    <div style={{ paddingTop: "24px", textAlign: 'center' }}>
                                        <Button variant="contained" onClick={(event) => this.onNewAccountAddClicked(event)}
                                            style={{ background: "blue", color: "#fff" }}> Add </Button>
                                        <Button variant="contained"
                                            onClick={(event) => this.setState({
                                                currentPayoutView: "selectAccount",
                                                addAccountData: {
                                                    account_number: "",
                                                    ifsc: "",
                                                    name: ""
                                                }
                                            })}
                                            style={{ marginLeft: "5px", background: "red", color: "#fff" }}>Cancel </Button>
                                    </div>
                                </React.Fragment>}

                            {currentPayoutView === "default" &&
                                <React.Fragment>
                                    <div style={{ paddingTop: "80px" }}>
                                        <i style={{ display: "block", fontSize: "24px" }} className="fa fa-search" aria-hidden="true"></i>
                                        Serach an user to add Bank Account </div>
                                </React.Fragment>}

                        </React.Fragment> :
                            <React.Fragment>
                                <Loader />
                            </React.Fragment>}
                            {this.state.showConfirmDialog ?
                                <ConfirmDialog
                                    dialogText={this.state.dialogText}
                                    dialogTitle={this.state.dialogTitle}
                                    show={this.state.showConfirmDialog}
                                    onConfirmed={()=>this.onForceUpdateBankDetail()}
                                    onCanceled={()=>this.handelCancelUpdate()} /> : ""}

                    </div>
                </Paper>
            </div>
        );
    }
}
BankDetail.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(BankDetail);