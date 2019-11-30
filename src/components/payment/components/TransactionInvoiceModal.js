import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NoDataAvailable from "../../common/NoDataAvailable";
const styles = theme => ({

    dialogPaper: {
        minWidth: '600px',
        // maxWidth: '700px',
        // minHeight: '700px',
        // maxHeight: '500px'
    }
});

class TransactionInvoiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            invoiceUrlData: this.props.invoiceUrlData //["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRomJn5G16ybbQM4iICiUyC_4kM_96BhrVMvmD2Tsvc6dw5BWrEaA&s","https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg"]
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onInvoiceModalClose();
    }


    render() {
        const { classes } = this.props;
        return (<div>
            <Dialog style={{ zIndex: '9999' }}
                open={this.state.open}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '40px' }}
                    id="form-dialog-title">
                    <div>

                        <div style={{ float: "left", textAlign: "center", color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Supporting invoices
                        </div>

                    </div>
                </DialogTitle>
                <DialogContent>
                    {this.state.invoiceUrlData && this.state.invoiceUrlData.length > 0 ?
                        this.state.invoiceUrlData.map((url, index) =>
                            <div key={index + "imgs"} className="supportingimgCard" >
                                <img src={url} alt={url} style={{
                                    width: "100%",
                                    height: "500px"
                                }} />
                            </div>
                        )
                        :
                        (this.state.invoiceUrlData && this.state.invoiceUrlData.length === 0 &&
                            <NoDataAvailable style={{ color: "#fff", background: '#533381 !important' }} bvText={"No Data"} />
                        )}
                </DialogContent>
            </Dialog>
        </div>
        );
    }
}

TransactionInvoiceModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionInvoiceModal);