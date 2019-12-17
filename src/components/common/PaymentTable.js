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
            tableHeadData: ["Supplier Name", "Supplier Bussiness Name","Created Time", "Payment mode", "Amount"],
            open: this.props.openModal, tableBodyData: this.props.data,
            showAddTransactionModal:false,
            rowsPerPage: 50,
            page: 0
        }

    }
    componentDidMount() {
        if(this.props.userdata.role  === "la"){
            let tableHeadData = ["Buyer Name","Buyer Bussiness Name" ,"Created Time", "Payment mode", "Amount"];
            this.setState({tableHeadData:tableHeadData});
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
            let param = {"limit":10,"role":this.props.role}
            let resp = await paymentService.getTransactionDetailsOfBuyer(this.props.userdata.mobile, param);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({

                    tableBodyData: respData["allTransactions"]
                });
            } else {
                this.setState({
                    tableBodyData: []
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

    getBackgroundColor(type){
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
    render() {
        const { classes } = this.props;
        const { rowsPerPage, page } = this.state;
        return (<div style={{ width: '100%',marginTop:'50px', height:"550px",overflowY:"scroll" }}>
            {/* <AddTransactionModal open={true} /> */}
            <Table stickyHeader aria-label="sticky table" className='table-body'>
                <TableHead>
                    <TableRow  >
                        {this.state.tableHeadData.map((option, i) => (
                            <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.tableBodyData.length > 0 && this.state.tableBodyData.map((row, i) => {
                        return (

                            <TableRow key={'table_' + i} style={i % 2 !== 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                             {this.props.userdata.role === "la" ?   
                              <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                              {row.buyer_fullname ? row.buyer_fullname : "-"}
                          </TableCell>
                             :<TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {row.supplier_fullname ? row.supplier_fullname : "-"}
                                </TableCell>}
                                {this.props.userdata.role === "la" ?  <TableCell className={this.getTableCellClass(classes, 2)}>
                                    <div className="text-ellpses">
                                        {row.buyer_business_name ? row.buyer_business_name : "-"}
                                    </div>
                                </TableCell>:      <TableCell className={this.getTableCellClass(classes, 2)}>
                                    <div className="text-ellpses">
                                        {row.supplier_business_name ? row.supplier_business_name : "-"}
                                    </div>
                                </TableCell>
                               
                                }
                                <TableCell className={this.getTableCellClass(classes, 3)}>
                                    <div className="text-ellpses" style={{fontSize:'12px'}}>
                                        {row.createdtime ? Utils.formatDateData(row.createdtime.split("T")[0]) : "-"}
                                    </div>
                                </TableCell>

                                <TableCell className={this.getTableCellClass(classes, 4)} >
                                
                                <span style={{  color: "white",
                                background:this.getBackgroundColor(row.payment_mode),
                                padding: "4px 12px",
                                borderRadius: "13px"}} >   {row.payment_mode ? row.payment_mode : "-"} </span>
                                
                                </TableCell>
                                <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: this.getTransactionTypeColor(row.transaction_type) }}>
                                    ₹ {row.amount ? row.amount : "-"}
                                </TableCell>


                            </TableRow>
                        );
                    })}
                </TableBody>
                {this.state.tableBodyData.length>0 && <TableFooter style={{ borderTop: "2px solid #858792" }}>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[25, 50, 100]}
                                        colSpan={6}
                                        count={this.state.tableBodyData.length}
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
            {!this.state.tableBodyData.length && < NoDataAvailable style={{ height: '25vh' }} />}

            {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
            {/* <Button style={{float:'right',marginRight:'28px'}} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button> */}

          {this.props.userdata && (this.props.userdata.role === "la" || this.props.userdata.role === "ca") &&  <div className="updateBtndef">
                    <div
                        className="updateBtnFixedModal"
                        style={{ display: 'flex' }}
                        onClick={(event) => this.setState({ showAddTransactionModal: true })}
                    >
                        <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                        <p>Add Transaction</p></div>
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