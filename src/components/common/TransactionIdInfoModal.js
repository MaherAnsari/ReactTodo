import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const styles = theme => ({

    dialogPaper: {
        minWidth: '500px',
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


class TransactionIdInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            transactionInfoData: this.props.transactionInfoData
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onTransactionIDInfoModalClose();
    }

    render() {
        const { classes } = this.props;
        const { transactionInfoData } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '99999' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                disableBackdropClick={true}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >

                <div>
                    <DialogTitle
                        style={{ background: '#05073a', textAlign: 'center', height: '50px' }}
                        id="form-dialog-title">
                        <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Info {" ( " + transactionInfoData.id + " )"}
                        </p>
                    </DialogTitle>
                    <DialogContent>
                        <React.Fragment>
                            <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                <span className={classes.actcardtext} style={{ width: "35%" }}> Bank id</span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                    &nbsp; <strong> {transactionInfoData["bank_id"] && transactionInfoData["bank_id"] !== "-" ? transactionInfoData["bank_id"] : "N.A"}</strong>  </span>
                            </div>
                            <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                <span className={classes.actcardtext} style={{ width: "35%" }}> Utr </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                    &nbsp; <strong> {transactionInfoData["utr"] && transactionInfoData["utr"] !== "-" ? transactionInfoData["utr"] : "N.A"}</strong>  </span>
                            </div>
                            <div style={{ display: "flex", paddingBottom: "5px", paddingTop: '5px' }}>
                                <span className={classes.actcardtext} style={{ width: "35%" }}> Remarks   </span> :
                            <span className={classes.actcardtext} style={{ width: "60%" }}>
                                    &nbsp; <strong> {transactionInfoData["remarks"] ? transactionInfoData["remarks"] : "N.A"}</strong>  </span>
                            </div>
                        </React.Fragment>
                    </DialogContent>
                    <DialogActions>
                        <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Close</Button>
                    </DialogActions>
                </div>
            </Dialog>


        </div>
        );
    }
}

TransactionIdInfoModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionIdInfoModal);