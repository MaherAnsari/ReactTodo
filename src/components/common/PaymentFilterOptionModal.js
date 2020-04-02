import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
    overrides: {

        MuiInputBase: {
            input: {
                color: "#000"
            }
        }
    }
});

const styles = theme => ({
    dialogPaper: {
        minWidth: '500px',
        // maxWidth: '700px',
        minHeight: '200px',
        maxHeight: '450px'
    },
    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    },
    card: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '15px'
    },
    offDay: {
        textAlign: 'center',
        width: '48%',
        // marginTop: '33px',
        marginLeft: '10px'
    }
});

const transactionType = [
    "bijak-in",
    "bijak-out",
    "historical"
]

const transactionTypeMapping = {
    "bijak-in": "b_in",
    "bijak-out": "b_out",
    "historical": "b_hist"
}
const transactionTypeReverseMapping = {
    "b_in": "bijak-in",
    "b_out": "bijak-out",
    "b_hist": "historical"
}

class PaymentFilterOptionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paymentFilterList: ["transaction_failed", "transaction_initiated", "payout_reversed", "payout_cancelled",
                "payout_rejected", "payout_processed", "payout_initiated", "payout_queued", "payout_pending", "payout_processing",
                "approved", "pending_approved", "failed"],

            // "payout_processed", "transaction_initiated", "payout_initiated",
            //                     "payout_queued", "payout_pending", "payout_processing", ""],
            open: this.props.openModal,
            filterDataArr: this.props.filterDataArr || [],
            transactionTypeArray: this.formatTransactionType(this.props.transactionTypeArray) || [],
            amountCondition: {
                gt: "Greater then",
                lt: "Less then",
                lte: "Less than equal",
                gte: "Greater than equal",
                eq: "Equal to"
            },
            slectedCondition: "",
            showCodnError: false,
            dataObj: {}
            // {
            //     "id": "",
            //     "linked_order_id": "",
            //     "amount": ""
            // },
        }
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
        this.handelAutoCompleteChangeTransactionTypeArray = this.handelAutoCompleteChangeTransactionTypeArray.bind(this);
    }

    componentDidMount() {
        this.setAdditionalFiilterAmount(this.props.additionalFilter);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterDataArr !== this.state.filterDataArr) {
            this.setState({ filterDataArr: nextProps.filterDataArr })
        }
        if (nextProps.transactionTypeArray !== this.state.transactionTypeArray) {
            this.setState({ transactionTypeArray: this.formatTransactionType(nextProps.transactionTypeArray) })
        }
        if (nextProps.additionalFilter !== this.state.dataObj) {
            this.setAdditionalFiilterAmount(nextProps.additionalFilter)
        }
    }

    setAdditionalFiilterAmount(filters) {
        let filterProps = Object.assign({}, filters);
        if (filterProps.hasOwnProperty("amount")) {
            let filterAmt = filterProps["amount"].split("_");
            filterProps["amount"] = filterAmt[1];
            this.setState({ dataObj: filterProps, slectedCondition: filterAmt[0] });
        } else {
            this.setState({ dataObj: filterProps });
        }
    }

    formatTransactionType(data) {
        let fData = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                fData.push(transactionTypeReverseMapping[data[i]]);
            }
        }
        return fData;
    }

    handelAutoCompleteChange = (event, values) => {
        this.setState({ filterDataArr: values })
    }

    handelAutoCompleteChangeTransactionTypeArray = (event, values) => {
        this.setState({ transactionTypeArray: values });
    }


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handleAddClick(event) {
        let tVal = [];
        let values = this.state.transactionTypeArray;
        if (values && values.length > 0) {
            for (let i = 0; i < values.length; i++) {
                tVal.push(transactionTypeMapping[values[i]]);
            }

        }
        this.props.onFilterAdded({
            "paymentType": this.state.filterDataArr,
            "transactionType": tVal,
            "additionalFilter": this.getExtraFilter()
        });
    }

    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        let val = event.target.value;
        if (val === "" || !isNaN(val)) {
            data[id] = (val === "" ? "" : Number(val));
        }
        this.setState({ dataObj: data });
    }

    getExtraFilter(event) {
        let fObj = Object.assign({}, this.state.dataObj);;
        let uObj = {};
        if (fObj.hasOwnProperty("id") && fObj["id"] !== "") {
            uObj["id"] = fObj["id"];
        }

        if (fObj.hasOwnProperty("linked_order_id") && fObj["linked_order_id"] !== "") {
            uObj["linked_order_id"] = fObj["linked_order_id"];
        }

        if (fObj.hasOwnProperty("amount") && fObj["amount"] !== "") {
            if (this.state.slectedCondition === "") {
                this.setState({ showCodnError: true })
                return {};
            } else {
                uObj["amount"] = this.state.slectedCondition + "_" + fObj["amount"];
            }
        }
        console.log(uObj)
        return uObj;
    }


    render() {
        const { classes } = this.props;
        const { paymentFilterList, filterDataArr, transactionTypeArray } = this.state;
        return (
            <MuiThemeProvider theme={theme}><div > <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ height: '60px' }}
                    id="form-dialog-title">
                    <div style={{ color: '#000', fontFamily: 'Lato', fontSize: '20px', display: 'flex' }}>
                        Filter
                                </div>
                </DialogTitle>
                <DialogContent>
                    <div >
                        <div style={{ width: '100%' }}>
                            <Autocomplete
                                multiple
                                id="fixed-demo"
                                options={paymentFilterList}
                                value={filterDataArr}
                                getOptionLabel={e => e}
                                onChange={this.handelAutoCompleteChange}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                style={{ width: "98%" }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Select payment status"
                                        placeholder="Search"
                                        fullWidth
                                    />
                                )}
                            />
                        </div>

                        <div style={{ width: '100%', marginTop: "2%" }}>
                            <Autocomplete
                                multiple
                                id="fixed-demo-transaction type"
                                options={transactionType}
                                value={transactionTypeArray}
                                getOptionLabel={e => e}
                                onChange={this.handelAutoCompleteChangeTransactionTypeArray}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                style={{ width: "98%" }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Select Transaction type"
                                        placeholder="Search"
                                        fullWidth
                                    />
                                )}
                            />
                        </div>
                        {/* ------Payment Id-------- */}

                        {/* "id": "",
                "linked_order_id": "",
                "amount": "" */}

                        <div style={{ width: '98%', display: 'flex', marginTop: "10px" }}>
                            <div style={{
                                marginRight: '2%', width: '40%', color: '#635656', marginTop: '5px', lineHeight: "2pc", fontFamily: "lato",
                                fontWeight: "500",
                                fontSize: "18px"
                            }}>
                                Payment Id &nbsp; :
                            </div> &nbsp;
                            <TextField
                                id="id"
                                type="text"
                                value={this.state.dataObj.id}
                                style={{
                                    marginRight: '2%', width: '58%', color: '#000', marginTop: '5px', fontFamily: "lato",
                                    fontWeight: "500",
                                    fontSize: "18px"
                                }}
                                onChange={this.handleStateChange.bind(this, 'id')}
                            >
                            </TextField>
                        </div>
                        {/* ------Linked Payment Id-------- */}

                        <div style={{ width: '98%', display: 'flex', marginTop: "5px" }}>
                            <div style={{
                                marginRight: '2%', width: '40%', color: '#635656', marginTop: '5px', lineHeight: "2pc", fontFamily: "lato",
                                fontWeight: "500",
                                fontSize: "18px"
                            }}>
                                Linked Payment Id &nbsp; :
                            </div> &nbsp;
                            <TextField
                                id="linked_order_id"
                                type="text"
                                value={this.state.dataObj.linked_order_id}
                                style={{
                                    marginRight: '2%', width: '58%', color: '#000', marginTop: '5px', fontFamily: "lato",
                                    fontWeight: "500",
                                    fontSize: "18px"
                                }}
                                onChange={this.handleStateChange.bind(this, 'linked_order_id')}
                            >
                            </TextField>
                        </div>
                        {/* ------Bijak amount-------- */}
                        <div style={{ width: '98%', display: 'flex', marginTop: "5px" }}>
                            <div style={{
                                marginRight: '2%', width: '30%', color: '#635656', marginTop: '5px', lineHeight: "2pc", fontFamily: "lato",
                                fontWeight: "500",
                                fontSize: "18px"
                            }}>
                                Amount &nbsp; :
                            </div> &nbsp;
                            <TextField
                                select
                                id="slectedCondition"
                                // label="Condition"
                                type="text"
                                error={this.state.showCodnError}
                                style={{
                                    marginRight: '2%', width: '38%', color: '#000', marginTop: '5px', fontFamily: "lato",
                                    fontWeight: "500",
                                    fontSize: "18px"
                                }}
                                value={this.state.slectedCondition}
                                onChange={(event) => this.setState({ slectedCondition: event.target.value, showCodnError: false })}
                            >
                                {Object.keys(this.state.amountCondition).map((keys, i) => (
                                    <MenuItem key={i} value={keys} selected={true}>
                                        {this.state.amountCondition[keys]}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="amount"
                                type="text"
                                value={this.state.dataObj.amount}
                                style={{
                                    marginRight: '2%', width: '30%', color: '#000', marginTop: '5px', fontFamily: "lato",
                                    fontWeight: "500",
                                    fontSize: "18px"
                                }}
                                onChange={this.handleStateChange.bind(this, 'amount')}
                            >
                            </TextField>
                        </div>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Ok</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>

            </div >
            </MuiThemeProvider>
        );
    }
}

PaymentFilterOptionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaymentFilterOptionModal);