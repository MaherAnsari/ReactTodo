import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NoDataAvailable from './NoDataAvailable';

import Utils from '../../app/common/utils';
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
            open: this.props.openModal, tableBodyData: this.props.data
        }

    }
    componentDidMount() {


    }



    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    handleAddClick(event) {


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
    render() {
        const { classes } = this.props;
        return (<div style={{ width: '100%' }}>
            <Table className='table-body'>
                <TableHead>
                    <TableRow  >
                        {this.state.tableHeadData.map((option, i) => (
                            <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                        ))}
                        {/* <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod", textAlign: 'left' }}> Quantity </TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.tableBodyData.length > 0 && this.state.tableBodyData.map((row, i) => {
                        return (

                            <TableRow key={'table_' + i} style={i % 2 !== 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {row.supplier_fullname ? row.supplier_fullname : "-"}
                                </TableCell>
                                <TableCell className={this.getTableCellClass(classes, 2)}>
                                    <div className="text-ellpses">
                                        {row.supplier_business_name ? row.supplier_business_name : "-"}
                                    </div>
                                </TableCell>
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

            </Table>
            {!this.state.tableBodyData.length && < NoDataAvailable style={{ height: '25vh' }} />}

            {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
            {/* <Button style={{float:'right',marginRight:'28px'}} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button> */}

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