import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Loader from '../../common/Loader';
import PreviewReceiptModal from '../../common/PreviewReceiptModal';
import TextField from '@material-ui/core/TextField';
import WhatsAppNumberSelectionModal from './WhatsAppNumberSelectionModal';
var moment = require('moment');



const styles = theme => ({

    dialogPaper: {
        minWidth: '600px',
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


class TransactionIfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            transactionInfoData: this.props.transactionInfoData,
            showLoader: false,
            currentModalView: "previewModal" // "downloadModal", "whatsappModal"

        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onTransactionInfoModalClose();
    }

    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
        return <div style={{ display: "inline-block" }}> {fdate.split(" ")[0] + ", " + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
    }

    handelInputChange(event) {
        let transactionInfoDataval = this.state.transactionInfoData;
        let id = event.target.id;
        let val = event.target.value;
        transactionInfoDataval[id] = val;
        this.setState({ transactionInfoData: transactionInfoDataval })

    }

    render() {
        const { classes } = this.props;
        const { showLoader, transactionInfoData, currentModalView } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '99999' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                {!showLoader ?
                    <div>
                        <DialogTitle
                            style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                            id="form-dialog-title">
                            <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                                Transaction Info</p>
                        </DialogTitle>
                        <DialogContent>
                            {currentModalView === "previewModal" &&
                                <React.Fragment>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> Order Id   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["linked_order_id"] && transactionInfoData["linked_order_id"] !== "-" ? transactionInfoData["linked_order_id"] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}>App_pay_id </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["pay_id"] && transactionInfoData["pay_id"] !== "-" ? transactionInfoData["pay_id"] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> App_Order_Id   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {(transactionInfoData["pay_data"] && transactionInfoData["pay_data"]['related_order_id']) ? transactionInfoData["pay_data"]['related_order_id'] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> Utr   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["utr"] && transactionInfoData["utr"] !== "-" ? transactionInfoData["utr"] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> Mode   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["mode"] && transactionInfoData["mode"] !== "-" ? transactionInfoData["mode"] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> Status   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["status"] && transactionInfoData["status"] !== "-" ? transactionInfoData["status"] : "N.A"}</strong>  </span>
                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                        <span className={classes.actcardtext} style={{ width: "35%" }}> Transaction Date/Time    </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                            &nbsp; <strong> {transactionInfoData["createdtime"] && transactionInfoData["createdtime"] !== "-" ? this.formatDateAndTime(transactionInfoData["createdtime"]) : "N.A"}</strong>  </span>
                                    </div>
                                    <div className={classes.actCardc} >
                                        <div className={classes.actcardtext} style={{
                                            textDecoration: "underline",
                                            textTransform: "uppercase",
                                            paddingBottom: "4px"
                                        }}> Account details </div>
                                        {transactionInfoData && transactionInfoData["bank_details"] &&
                                            transactionInfoData["bank_details"] !== "-" && transactionInfoData["bank_details"] !== "" ?
                                            <span>
                                                <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Number     </span>: &nbsp;<strong className={classes.actcardtext} > {transactionInfoData["bank_details"]["bank_account_number"]} </strong> </div>
                                                <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Ifsc               </span>: &nbsp;<strong className={classes.actcardtext} style={{ textTransform: "uppercase" }} > {transactionInfoData["bank_details"]["bank_ifsc_code"]} </strong> </div>
                                                <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Holder Name</span>: &nbsp;<strong className={classes.actcardtext} > {transactionInfoData["bank_details"]["bank_account_holder_name"]} </strong> </div>
                                            </span> :
                                            <div style={{ padding: "14px" }} className={classes.actcardtext}>
                                                Oops no bank account available.
                                    </div>}


                                    </div>
                                    <form noValidate autoComplete="off">
                                        <div style={{ display: "flex" }} >
                                            <TextField style={{ width: "49%" }}
                                                id="internal_reference_number"
                                                value={transactionInfoData["internal_reference_number"]}
                                                label="Internal Reference Number" onChange={this.handelInputChange.bind(this)} />
                                            &nbsp; &nbsp;
                                            <TextField style={{ width: "49%" }}
                                                id="invoive_no" label="Invoice Number"
                                                value={transactionInfoData["invoive_no"]}
                                                onChange={this.handelInputChange.bind(this)} />
                                        </div>
                                    </form>
                                </React.Fragment>}

                            {currentModalView === "downloadModal" &&
                                <PreviewReceiptModal
                                    open={currentModalView === "downloadModal"}
                                    OnPrevieCancled={() => this.setState({ currentModalView: "previewModal" })}
                                    transactionInfoData={transactionInfoData} />}

                            {currentModalView === "whatsappModal" &&
                                <WhatsAppNumberSelectionModal
                                    open={currentModalView === "whatsappModal"}
                                    OnModalCancelled={() => this.setState({ currentModalView: "previewModal" })}
                                    transactionInfoData={transactionInfoData} />}

                        </DialogContent>
                        <DialogActions>
                            <Button className={classes.formCancelBtn} onClick={() => this.setState({ currentModalView: "whatsappModal" })} color="primary">
                                <i className="fa fa-whatsapp" style={{ paddingRight: "4px", fontSize: "18px" }} aria-hidden="true"></i> Send to Whatsapp</Button>
                            <Button className={classes.formCancelBtn} onClick={() => this.setState({ currentModalView: "downloadModal" })} color="primary">Preview Receipt</Button>
                            <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Close</Button>
                        </DialogActions>
                    </div> :
                    <Loader primaryText="Please wait.." />}
            </Dialog>


        </div>
        );
    }
}

TransactionIfoModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionIfoModal);