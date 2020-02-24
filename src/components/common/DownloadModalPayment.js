import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../app/common/utils';



const styles = theme => ({

    dialogPaper: {
        minWidth: '400px',
        // maxWidth: '700px',
        // minHeight: '700px',
        // maxHeight: '500px'
    },
    dialogPaperdefaultpayout: {
        minWidth: '400px',
        maxWidth: '500px',
        // minHeight: '700px',
        // maxHeight: '500px'
    },
    minWidth: '600px',
    actcardtext: {
        fontSize: "15px",
        fontFamily: "lato"
    },
    actCardc: {
        boxShadow: "0px 0px 7px 0px rgba(0,0,0,0.75)",
        padding: "10px",
        margin: "10px",
        // width:"80%",
        borderLeft: "5px solid #ec7596",
        borderRadius: "5px"
    }
});


class DownloadModalPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            allTransactionsData: this.props.allTransactionsData,
            downloadType: "Amt in"
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onDownLoadModalCancelled();
    }


    handelDownloadClicked = () => {
        let fHeader = {};
        let filteredData = [];
        if (this.state.downloadType === "Amt in") {

            filteredData = this.props.allTransactionsData.filter(e => {
                return (e["transaction_type"] === "b_in")
            });

            fHeader = {
                "transaction_date": "Date",
                "buyer_fullname": "Buyer Details",
                "supplier_fullname": "Supp. Details",
                "bank_id": "Bank ID/ Razorpay",
                "amount": "Amount",
                "amount_bank_entry": "Bank Entry",
                "id": "Txn",
                "bank_trxn_id": "Reference No",
                // "":"Comments"

                
                "supplier_mobile": "LA Phone",
                "buyer_mobile": "CA Phone",
                "supplier_fullname": "LA Name",
                "supplier_business_name": "LA Business Name",
                "buyer_fullname": "CA Name",
                "buyer_business_name": "CA Businesss Name"

            }

      
        } else {
            filteredData = this.props.allTransactionsData.filter(e => {
                return (e["transaction_type"] === "b_out")
            });
            fHeader = {
                "transaction_date": "Date",
                "pay_id": "Txn",
                "reason": "Reason",
                "bank_id": "Bank ID/Razorpay",
                "amount": "Amount",
                // "":"Comments",
                "bank_trxn_id": "Reference No",
                "supplierid": "LA ID",
                "buyerid": "CA ID",

                "supplier_mobile": "LA Phone",
                "buyer_mobile": "CA Phone",
                "supplier_fullname": "LA Name",
                "supplier_business_name": "LA Business Name",
                "buyer_fullname": "CA Name",
                "buyer_business_name": "CA Businesss Name"

            }
        }



        this.downloadFormattedDataInCSV_forPayment(filteredData, this.props.downloadFilename + "_" + this.state.downloadType, fHeader)
        this.handleDialogCancel();
    }

    checkIfOmittedStatusKeys(row) {
        let isValid = true;
        let statusKeysToOmit = ["failed", "rejected", "reversed", "cancelled", "transaction_initiated"]
        if (row && row["status"]) {
            for (let i in statusKeysToOmit) {
                if (row["status"].indexOf(statusKeysToOmit[i]) > -1) {
                    isValid = false;
                    break;
                }
            }

        }
        return isValid;
    }

    downloadFormattedDataInCSV_forPayment(json, filename, keysInFile) {
        try {

            var csv = "";
            var keys = (keysInFile && Object.keys(keysInFile)) || [];
            var values = (keysInFile && Object.values(keysInFile)) || [];
            csv += values.join(',') + '\n';
            for (let line of json) {
                if (!this.checkIfOmittedStatusKeys(line)) {
                    // ignore this lines for omit keys
                } else {
                    csv += keys.map(key => {


                        if (line[key] && typeof (line[key]) === "object" && line[key].length > 0) {
                            let fstr = line[key].toString();
                            fstr = fstr.replace(/,/g, "|");
                            return fstr;
                        }

                        if (line[key] && typeof (line[key]) === "string" && line[key].indexOf(",") > -1) {
                            let fArry = [];
                            fArry.push(line[key].replace(/,/g, "|"));
                            return fArry;
                        }

                        return line[key]
                    }).join(',') + '\n';
                }
            }
            // console.log(csv);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = (filename + ".csv");
            // console.log(csv);
            hiddenElement.click();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { classes } = this.props;
        const { downloadType } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '99999' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                        Select Transaction Type </p>
                </DialogTitle>
                <DialogContent>
                    <React.Fragment>
                        <TextField
                            select
                            id="download_type"
                            name="download_type"
                            label="Select transaction type"
                            type="text"
                            style={{ width: '98%' }}
                            value={downloadType}
                            onChange={(event) => this.setState({ downloadType: event.target.value })}>
                            {["Amt in", "Amt out"].map((key, i) => (
                                <MenuItem key={i} value={key} selected={true}>
                                    {key}
                                </MenuItem>
                            ))}
                        </TextField>
                    </React.Fragment>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={(event) => this.handelDownloadClicked(event)} color="primary">Download</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

DownloadModalPayment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DownloadModalPayment);