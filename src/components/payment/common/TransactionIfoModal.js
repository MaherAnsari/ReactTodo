import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Loader from '../../common/Loader';

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
            transactionInfoData : this.props.transactionInfoData,
            showLoader: false

        }
    }

    componentWillMount() { }


    
    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onTransactionInfoModalClose();
    }

    render() {
        const { classes } = this.props;
        const { showLoader , transactionInfoData} = this.state;
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
                        <React.Fragment>
                            <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                <span className={classes.actcardtext} style={{ width: "60%" }}> Utr  :
                                 &nbsp; <strong> {transactionInfoData["utr"] && transactionInfoData["utr"] !== "-"? transactionInfoData["utr"]  : "N.A" }</strong>  </span>
                            </div>

                            <div className={classes.actCardc} >
                                <div className={classes.actcardtext} style={{
                                    textDecoration: "underline",
                                    textTransform: "uppercase",
                                    paddingBottom: "4px"
                                }}> Account details </div>
                                {transactionInfoData && transactionInfoData["bank_details"] &&
                                transactionInfoData["bank_details"]  !== "-" && transactionInfoData["bank_details"]  !== "" ?
                                    <span>
                                        <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Number     </span>: &nbsp;<strong className={classes.actcardtext} > { transactionInfoData["bank_details"]["bank_account_number"]} </strong> </div>
                                        <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Ifsc               </span>: &nbsp;<strong className={classes.actcardtext} > { transactionInfoData["bank_details"]["bank_ifsc_code"]} </strong> </div>
                                        <div style={{ display: "flex" }}> <span className={classes.actcardtext} style={{ width: "40%" }}> Account Holder Name</span>: &nbsp;<strong className={classes.actcardtext} > { transactionInfoData["bank_details"]["bank_account_holder_name"]} </strong> </div>
                                    </span> :
                                    <div style={{ padding: "14px" }} className={classes.actcardtext}>
                                        Oops no bank account available.
                                    </div>}
                            </div>
                            </React.Fragment>
                    </DialogContent>
                    <DialogActions>
                        <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
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