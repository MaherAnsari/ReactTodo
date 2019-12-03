import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import paymentService from '../../../app/paymentService/paymentService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TransactionInvoiceModal from './TransactionInvoiceModal';
import Fab from '@material-ui/core/Fab';
import Loader from '../../common/Loader';


const styles = theme => ({
    appBar: {
        position: 'relative',
        background: "#05073a",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontSize: "20px !important",
        fontFamily: "lato !important",
        fontWeight: 500
    },
    closeBtn:{
        fontSize: "15px !important",
        fontFamily: "lato !important",
        fontWeight: 500
    },
    tableCell: {
        paddingLeft: '4px',
        paddingRight: '4px',
        textAlign: 'center',
        maxWidth: '200px'
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ViewTransactionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            transactionData: undefined,
            mobileNumber: this.props.mobileNumber,
            tableHeadData: ["id", "Supplier Name", "Supplier Bussiness Name", "Created Time", "Amount", "Payment mode", "Supporting images"],
            expanded: "",
            invoiceModalData: [],
            showImageInvoiceModal: false,
            supplierNameMapping: {},
            buyerInfo: this.props.buyerInfo,
            showLoader: false
        }
    }

    componentDidMount() {
        this.getTransactionList(this.state.mobileNumber);
    }

    getTransactionList = async (params) => {
        try {
            let resp = await paymentService.getTransactionDetailsOfBuyer(params);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result.data;
                this.setState({ transactionData: respData, supplierNameMapping : this.formatSupplierNameMapping( respData ) });
            }
        } catch (err) {
            console.error(err);
        }
    }

    formatSupplierNameMapping(data) {
        var names = {};
        try {
        if (data) {
            for (var key in data) {
                 names[key] = data[key][0]["supplier_fullname"] ? data[key][0]["supplier_fullname"] + " ( " + key + " ) " : key;
            }
        }
        return names;
    } catch (err) {
        console.error(err);
        return names;

    }
    }

    onPanelExpanded(event, i) {
        this.setState({ expanded: this.state.expanded === i ? "" : i });
    }

    handelModalClose(event) {
        this.setState({ open: false }, function () {
            this.props.onTransactionModalClose();
        })
    }

    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    handelTransactionInvoiceModal(row, event) {
        this.setState({ invoiceModalData: row["images"] }, function () {
            this.setState({ showImageInvoiceModal: true })
        })
    }


    render() {
        const { classes } = this.props;
        const { transactionData, expanded,supplierNameMapping, buyerInfo } = this.state;
        return (
            <div>
                <Dialog fullScreen open={true} onClose={(event) => { this.handelModalClose(event) }} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={(event) => { this.handelModalClose(event) }} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {(buyerInfo["buyer_fullname"] ?buyerInfo["buyer_fullname"] +" - ": "")+ (buyerInfo["buyer_mobile"] ? buyerInfo["buyer_mobile"] : "")  }
                             </Typography>

                            <Button autoFocus className={classes.closeBtn} color="inherit" onClick={(event) => { this.handelModalClose(event) }}>
                                close
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div style={{ marginTop: 20 }}>
                        {transactionData ? Object.keys(transactionData).map((suplierNumber, itemIndex) => (
                            <div key={"expanpan" + suplierNumber}
                                style={{ width: '98%', marginLeft: '1%', marginTop: itemIndex !== 0 ? "8px" : "" }} >
                                <ExpansionPanel
                                    expanded={expanded === itemIndex}
                                    // onChange={(event) =>}
                                    onChange={(event) => this.onPanelExpanded(event, itemIndex)}
                                    style={{ width: '100%', background: expanded === itemIndex ? "#f7f7f7" : "white" }}>

                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography style={{ fontSize: '18px', fontFamily: 'Lato' }} className={classes.heading}>{supplierNameMapping[suplierNumber] ?supplierNameMapping[suplierNumber] : suplierNumber }</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>

                                        {transactionData[suplierNumber] && transactionData[suplierNumber].length > 0 &&
                                            <Table className='table-body'>
                                                <TableHead>
                                                    <TableRow  >
                                                        {this.state.tableHeadData.map((option, i) => (
                                                            <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {transactionData[suplierNumber].map((row, i) => {
                                                        return (
                                                            //tableHeadData:["id","Supplier Name","Supplier Bussiness Name","Created Time","Amount","Payment mode","Invoice images"],
                                                            <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>

                                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                                    {row.id ? row.id : "-"}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                                    {row.supplier_fullname ? row.supplier_fullname : "-"}
                                                                </TableCell>
                                                                <TableCell className={this.getTableCellClass(classes, 2)}>
                                                                    <div className="text-ellpses">
                                                                        {row.supplier_business_name ? row.supplier_business_name : "-"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={this.getTableCellClass(classes, 3)}>
                                                                    <div className="text-ellpses">
                                                                        {row.createdtime ? row.createdtime : "-"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                    {row.amount ? row.amount : "-"}
                                                                </TableCell>
                                                                <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                    {row.payment_mode ? row.payment_mode : "-"}
                                                                </TableCell>
                                                                <TableCell className={this.getTableCellClass(classes, 4)}>

                                                                    <Fab
                                                                        variant="extended"
                                                                        size="small"
                                                                        aria-label="add"
                                                                        onClick={this.handelTransactionInvoiceModal.bind(this, row)}
                                                                        style={{ textTransform: "none", background: "#05073a", color: "#ffffff", padding: "0 35px" }}
                                                                    >
                                                                        View
                                                </Fab>

                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>}
                                        {transactionData[suplierNumber].length > 0 ? "" :
                                            <div className={classes.defaultTemplate}>
                                                {<span className={classes.defaultSpan}>
                                                    <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                                            </div>}


                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>)
                        ): <Loader />}
                    </div>
                   

                </Dialog>
                {this.state.showImageInvoiceModal &&
                    <TransactionInvoiceModal
                        openModal={this.state.showImageInvoiceModal}
                        onInvoiceModalClose={() => { this.setState({ showImageInvoiceModal: false, invoiceModalData: [] }) }}
                        invoiceUrlData={this.state.invoiceModalData} />}

            </div>);
    }
}

ViewTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewTransactionModal);