import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import bijakReceipt from './BijakReceipt';



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


class PreviewReceiptModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            transactionInfoData : this.props.transactionInfoData
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.OnPrevieCancled();
    }

    render() {
        const { classes } = this.props;
        const { transactionInfoData } = this.state;
        // const tem = bijakReceipt.getReceipt( transactionInfoData);
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
                                Preview Receipt </p>
                        </DialogTitle>
                        <DialogContent>
                            <React.Fragment>
                                {bijakReceipt.getReceipt( transactionInfoData )}
                            </React.Fragment>
                        </DialogContent>
                        <DialogActions>
                            <Button className={classes.formCancelBtn} onClick={()=>bijakReceipt.downloadAsPdf( transactionInfoData ) } color="primary">Download</Button>
                            <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Close</Button>
                        </DialogActions>
            </Dialog>
        </div>
        );
    }
}

PreviewReceiptModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewReceiptModal);