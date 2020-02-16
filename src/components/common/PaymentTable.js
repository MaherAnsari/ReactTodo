import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NoDataAvailable from './NoDataAvailable';
import AddTransactionModal from './../payment/components/AddTransactionModal';
import Utils from '../../app/common/utils';
import paymentService from '../../app/paymentService/paymentService';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { getAccessAccordingToRole } from '../../config/appConfig';
import AccountBalanceWalletSharpIcon from '@material-ui/icons/AccountBalanceWalletSharp';


const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '80%',
        // maxWidth: '700px',
        minHeight: '700px',
        // maxHeight: '500px'
    },
    tableCell: {
        paddingLeft: '4px',
        paddingRight: '4px',
        textAlign: 'center',
        maxWidth: '200px'
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
        // display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        // marginLeft: '25%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    }

});

class PaymentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["Supplier Name", "Supplier Bussiness Name", "Created Time", "Payment mode", "Amount"],
            open: this.props.openModal, 
            // data: this.props.data,
            showAddTransactionModal: false,
            rowsPerPage: 50,
            page: 0
        }

    }
    componentDidMount() {
        if (this.props.userdata.role === "la") {
            let tableHeadData = ["Buyer Name", "Buyer Bussiness Name", "Created Time", "Payment mode","Amount"];
            this.setState({ tableHeadData: tableHeadData });
        this.getTransactionList();
        }
    }
    

    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    handleAddClick(event) {

    }
    onTransactionDataAdded(event) {
        this.setState({ showAddTransactionModal: false }, function () {
            this.getTransactionList();
        })
    }

    getTransactionList = async () => {
        try {
            let param = { "limit": 10, "role": this.props.role }
            let resp = await paymentService.getTransactionDetailsOfBuyer(this.props.userdata.mobile, param);
            console.log( resp.data )
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
               
                this.setState({

                    data: respData["allTransactions"]
                });
            } else {
                this.setState({
                    data: []
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    getTransactionTypeColor(transaction_type) {
        if (transaction_type === "b_out") {
            return "rgb(212, 58, 58)"; // red

        } else if (transaction_type === "b_in") {
            return "rgb(56, 122, 57)"; // green

        } else {
            return "rgba(0, 0, 0, 0.87)" // default black color
        }
    }

    getBackgroundColor(type) {
        if (type === 'bank') {
            return "#00a700";
        } else if (type === 'cash') {
            return "#f50057";
        } else {
            return "#757575";
        }

    }
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };


    getStatusOption(event, row) {
        if ((row["transaction_type"] === "b_out" && row["payment_mode"] === "bijak") || (row["transaction_type"] === "b_in" && row["payment_mode"] === "bank")) {

            if (row["status"] === "transaction_failed") {
                return (<span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "red"}} aria-hidden="true"></i>
                </span>);
            } else if (row["status"] === "transaction_initiated") {
                return (<span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "green"}} aria-hidden="true"></i>
                </span>);
            } else if (row["status"] === "payout_reversed" ||
                row["status"] === "payout_cancelled" ||
                row["status"] === "payout_rejected") {
                return (<span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "red"}} aria-hidden="true"></i>
                </span>);
            } else if (row["status"] === "payout_processed") {
                return (<span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "green"}} aria-hidden="true"></i>
                </span>);
            } else if (
                row["status"] === "payout_initiated" ||
                row["status"] === "payout_queued" ||
                row["status"] === "payout_pending" ||
                row["status"] === "payout_processing") {
                return (<span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "yellow"}} aria-hidden="true"></i>
                </span>);
            } else if (row["status"] === "approved") {
                return (
                    <span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "green"}} aria-hidden="true"></i>
                </span>
                );
            } else if (row["status"] === "pending" || row["status"] === "pending_approved" || row["status"] === null) {
                return (
                    <span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "green"}} aria-hidden="true"></i>
                </span>
                );
            } else if (row["status"] === "failed") {
                return ( <span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "red"}} aria-hidden="true"></i>
                </span>)
            }else{
                return ( <span
                    style={{ paddingRight: "4%" }}
                    data-toggle="tooltip"
                    data-placement="center"
                    title={row["status"]}>
                    <i className="fa fa-circle" style={{color: "red"}} aria-hidden="true"></i>
                </span>)
            }
        } else {
            return (<span
                style={{ paddingRight: "4%" }}
                >
            <AccountBalanceWalletSharpIcon style={{ color: "gray", height: "16px" }} />
            </span>);
        }

    }


    render() {
        const { classes } = this.props;
        const { rowsPerPage, page } = this.state;
        const leftAlignedIndexs = [0, 1];
        const rightAlignedIndexs = [4];
        // console.log(this.props.data);
        return (<div style={{ width: '100%', marginTop: '50px', height: "550px", overflowY: "scroll" }}>
            {/* <AddTransactionModal open={true} /> */}
            <Table stickyHeader aria-label="sticky table" className='table-body'>
                <TableHead>
                    <TableRow  >
                        {this.state.tableHeadData.map((option, i) => (
                            <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{
                                minWidth: '120px', paddingLeft: i === 0 ? '10px' : ''
                                , textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : "",
                                paddingRight: i === 4 ? "10px" : '', textTransform: 'uppercase'
                            }}>{option}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.data && this.props.data.length > 0 && this.props.data.map((row, i) => {
                        return (

                            <TableRow key={'table_' + i} style={i % 2 !== 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                                {this.props.userdata.role === "la" ?
                                    <TableCell component="th" style={{ paddingLeft: '10px', textAlign: "left" }} scope="row" className={this.getTableCellClass(classes, 0)}>
                                        {this.getStatusOption(this, row)}
                                        {row.buyer_fullname ? row.buyer_fullname : "-"}
                                    </TableCell>
                                    : <TableCell component="th" style={{ paddingLeft: '10px', textAlign: "left" }} scope="row" className={this.getTableCellClass(classes, 0)}>
                                        {this.getStatusOption(this, row)}
                                        {row.supplier_fullname ? row.supplier_fullname : "-"}
                                    </TableCell>}
                                {this.props.userdata.role === "la" ? <TableCell style={{ textAlign: "left" }} className={this.getTableCellClass(classes, 2)}>
                                    <div className="text-ellpses">
                                        {row.buyer_business_name ? row.buyer_business_name : "-"}
                                    </div>
                                </TableCell> : <TableCell style={{ textAlign: "left" }} className={this.getTableCellClass(classes, 2)}>
                                        <div className="text-ellpses">
                                            {row.supplier_business_name ? row.supplier_business_name : "-"}
                                        </div>
                                    </TableCell>

                                }
                                <TableCell className={this.getTableCellClass(classes, 3)}>
                                    <div className="text-ellpses" style={{ fontSize: '12px' }}>
                                        {row.createdtime ? Utils.formatDateData(row.createdtime.split("T")[0]) : "-"}
                                    </div>
                                </TableCell>

                                <TableCell className={this.getTableCellClass(classes, 4)} >

                                    <span style={{
                                        color: "white",
                                        background: this.getBackgroundColor(row.payment_mode),
                                        padding: "4px 12px",
                                        borderRadius: "13px"
                                    }} >   {row.payment_mode ? row.payment_mode : "-"} </span>
                                </TableCell>
                               
                                <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: this.getTransactionTypeColor(row.transaction_type), textAlign: "right", paddingRight: '10px' }}>
                                    ₹ {row.amount ? row.amount : "-"}
                                </TableCell>


                            </TableRow>
                        );
                    })}
                </TableBody>
                {this.props.data && this.props.data.length > 0 && <TableFooter style={{ borderTop: "2px solid #858792" }}>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[25, 50, 100]}
                            colSpan={6}
                            count={this.props.data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={this.handleChangePage.bind(this)}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
                        />
                    </TableRow>
                </TableFooter>}
            </Table>
            {!this.props.data.length && < NoDataAvailable style={{ height: '25vh' }} />}

            {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
            {/* <Button style={{float:'right',marginRight:'28px'}} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button> */}

            {getAccessAccordingToRole("addPayment") && this.props.userdata && (this.props.userdata.role === "la" || this.props.userdata.role === "ca") && <div className="updateBtndef">
                <div
                    className="updateBtnFixedModal"
                    style={{ display: 'flex' }}
                    onClick={(event) => this.setState({ showAddTransactionModal: true })}
                >
                    <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                    <p>Add Payment</p></div>
            </div>}

            {this.state.showAddTransactionModal &&
                <AddTransactionModal
                    open={this.state.showAddTransactionModal}
                    userdata={this.props.userdata}
                    onTransactionAdded={(event) => this.onTransactionDataAdded(event)}
                    onEditModalCancel={(event) => this.setState({ showAddTransactionModal: false })}
                />}
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
        </div>
        );
    }
}

PaymentTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaymentTable);