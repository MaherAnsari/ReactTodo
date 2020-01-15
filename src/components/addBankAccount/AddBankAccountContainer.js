import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./common/FilterListComponent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Loader from '../common/Loader';
import commonService from '../../app/commonService/commonService';

const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px',
        padding: "0px 20%",
        minHeight: '80vh',
    },
    card: {
        maxWidth: '100%',
        minHeight: '70vh',
        marginTop: '15px',
        height: '97%',
    }
});



class AddBankAccountContainer extends React.Component {

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
                bank_name: ""

            },

            errorFields: {},
            currentSelectedUserDetails: undefined
        }
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
                    addAccountDataVal[id] = Number(val);
                }
            } else {
                if( id === "bank_name"){
                    addAccountDataVal[id] = val;
                }else{
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
                bank_name: ""
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
                        bank_name: this.state.addAccountData["bank_name"]
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


    render() {
        const { classes } = this.props;
        const { showLoader, acctData, currentPayoutView, addAccountData, errorFields } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        <FilterListComponent
                            onsearchCleared={this.onsearchCleared.bind(this)}
                            getSearchedOrderListData={this.getBankDetails.bind(this)} />

                        {!showLoader ? <React.Fragment>
                            {currentPayoutView === "selectAccount" &&
                                <React.Fragment>

                                    {acctData && acctData.length > 0 ?
                                        <div style={{ textAlign: "left", padding: "0 10px" }}> Existing Accounts</div> :
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
                                                    <span style={{ "textTransform": "capitalize" }}>{obj["status"] ? obj["status"] : ""} </span>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                    <div style={{ paddingTop: "24px" }}>
                                        <Button variant="contained"
                                            onClick={(event) =>
                                                this.setState({
                                                    errorFields: {},
                                                    currentPayoutView: "addAccount",
                                                    addAccountData: {
                                                        account_number: "",
                                                        ifsc: "",
                                                        name: "",
                                                        bank_name: ""
                                                    }
                                                })}
                                            style={{ background: "blue", color: "#fff" }}>Add a new Account</Button>

                                    </div>

                                </React.Fragment>}

                            {currentPayoutView === "addAccount" &&
                                <React.Fragment>
                                    <div> Enter the following details </div>
                                    <div style={{ padding: "0px 20%" }}>
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
                                            id="bank_name"
                                            error={errorFields["bank_name"] ? true : false}
                                            label="Bank name "
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.bank_name}
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
                                    </div>
                                    <div style={{ paddingTop: "24px" }}>
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

                    </div>
                </Paper>
            </div>
        );
    }
}
AddBankAccountContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AddBankAccountContainer);