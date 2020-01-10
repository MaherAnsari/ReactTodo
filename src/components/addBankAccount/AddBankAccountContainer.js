import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./common/FilterListComponent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import orderService from '../../app/orderService/orderService';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Loader from '../common/Loader';


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
                bank_account_number: "",
                bank_ifsc_code: "",
                bank_account_holder_name: ""
            },
            errorFields: {}
        }
    }

    getBankDetails = async (mobile) => {
        try {
            
            this.setState({ showLoader: true });
            let resp = await orderService.getOrderAcount(mobile);
            if (resp.data.status === 1) {
                if (resp.data.result) {
                    this.setState({ showLoader: false, currentPayoutView: "selectAccount", acctData: resp.data.result || [] });
                } else {
                    this.setState({ showLoader: false, acctData: resp.data.result })
                }
            } else {
                alert("An error occured while getting the account details");
            }
        } catch (err) {
            console.error(err);
            alert("An error occured while getting the account details")
        }
    }

    handleInputChange(event) {
        event.preventDefault()
        var intejarIds = ["bank_account_number"]; // this values need to be intejar
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
            addAccountDataVal[id] = val;
        }

        if (errors.hasOwnProperty(id)) {
            delete errors[id];
        }
        this.setState({
            addAccountData: addAccountDataVal,
            errorFields: errors
        })
        // console.log(addAccountDataVal)
    }

    onsearchCleared(event) {
        this.setState({
            acctData: [],
            currentPayoutView: "default",
            addAccountData: {
                bank_account_number: "",
                bank_ifsc_code: "",
                bank_account_holder_name: ""
            },
            errorFields: {}
        })
    }

    getStatusIcon(status) {
        if (status === "validated") {
            return "check";
        } else if (status === "pending") {
            return "cached";
        } else {
            return "disc_full";
        }
    }

    getStatusIconColor(status) {
        if (status === "validated") {
            return "green";
        } else if (status === "pending") {
            return "yellow";
        } else {
            return "red";
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
                                                        primary={obj["bank_account_holder_name"]}
                                                        secondary={"IFSC : " + obj["bank_ifsc_code"] + ", Account no. : " + obj["bank_account_number"]} />
                                                    <Icon edge="end" aria-label="comments" style={{ color: this.getStatusIconColor(obj["status"]) }}>
                                                        {this.getStatusIcon(obj["status"])}
                                                    </Icon>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                    <div style={{ paddingTop: "24px" }}>
                                        <Button variant="contained" onClick={(event) => this.setState({ currentPayoutView: "addAccount" })}
                                            style={{ background: "blue", color: "#fff" }}>Add a new Account</Button>

                                    </div>

                                </React.Fragment>}

                            {currentPayoutView === "addAccount" &&
                                <React.Fragment>
                                    <div> Enter the following details </div>
                                    <div style={{ padding: "0px 20%" }}>
                                        <TextField
                                            margin="dense"
                                            id="bank_account_number"
                                            error={errorFields["bank_account_number"] ? true : false}
                                            label="Account number"
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.bank_account_number}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />

                                        <TextField
                                            margin="dense"
                                            id="bank_ifsc_code"
                                            label="Ifsc"
                                            error={errorFields["bank_ifsc_code"] ? true : false}
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.bank_ifsc_code}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />

                                        <TextField
                                            margin="dense"
                                            id="bank_account_holder_name"
                                            label="Name of Account holder"
                                            error={errorFields["bank_account_holder_name"] ? true : false}
                                            type="text"
                                            style={{ width: '100%' }}
                                            value={addAccountData.bank_account_holder_name}
                                            onChange={this.handleInputChange.bind(this)}
                                            fullWidth />
                                    </div>
                                    <div style={{ paddingTop: "24px" }}>
                                        <Button variant="contained" onClick={(event) => this.onNewAccountSaveClicked(event)}
                                            style={{ background: "blue", color: "#fff" }}>Save </Button>
                                        <Button variant="contained"
                                            onClick={(event) => this.setState({
                                                currentPayoutView: "selectAccount",
                                                addAccountData: {
                                                    bank_account_number: "",
                                                    bank_ifsc_code: "",
                                                    bank_account_holder_name: ""
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