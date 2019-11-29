import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NoDataAvailable from "../../common/NoDataAvailable";
const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '600px',
        // maxWidth: '700px',
        // minHeight: '700px',
        // maxHeight: '500px'
    },
    formAddBtn: {
        width: '90%',
        borderRadius: '10px',
        fontSize: '20px',
        textTransform: 'uppercase',
        backgroundColor: '#4d9fa0 ',
        color: '#fff',
        height: '45px',
        marginBottom: '15px',
        marginTop: "11px",
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    formRoot: {
        flexWrap: 'wrap',
        width: '100%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    }

});

class TransactionInvoiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            invoiceUrlData : this.props.invoiceUrlData //["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRomJn5G16ybbQM4iICiUyC_4kM_96BhrVMvmD2Tsvc6dw5BWrEaA&s","https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg"]
        }
    }
    componentDidMount() {
        
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onInvoiceModalClose();
    }


    render() {
        const { classes } = this.props;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '40px' }}
                    id="form-dialog-title">
                    <div>

                        <div style={{ float: "left", textAlign:"center",color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                            Transaction Invoices
                        </div>

                    </div>
                </DialogTitle>
                <DialogContent>
                    {this.state.invoiceUrlData && this.state.invoiceUrlData.length > 0 ?
                        this.state.invoiceUrlData.map((url, index)=>
                        <img key={index+"imgs"} src={url} alt={url} style={{ width: "100%",
                            height: "500px"}} />
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