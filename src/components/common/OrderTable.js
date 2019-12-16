import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NoDataAvailable from '../common/NoDataAvailable';
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

class OrderTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["buyer_name", "buyer_mobile", "commodity", "Date", "amount"],
            open: this.props.openModal, tableBodyData: this.props.data,
            rowsPerPage: 50,
            page: 0,
        }

    }
    componentDidMount() {
     if(this.props.role === "ca"){
        let tableHeadData =  ["supplier_name", "supplier_mobile", "commodity", "Date", "amount"];
        this.setState({ tableHeadData : tableHeadData});
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
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
      };
    
      handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
      };
    
    render() {
        const { classes } = this.props;
        const { rowsPerPage, page } = this.state;
        return (<div style={{ width: '100%',marginTop:'50px' }}>
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
                               {this.props.role === "ca"? <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {row.supplier_name}

                                </TableCell>:<TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {row.buyer_name}

                                </TableCell>}
                              {this.props.role === "ca"?  <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {/* <Tooltip title={row.active ? "Enabled" : "Disabled"} placement="top" classes={{ tooltip: classes.lightTooltip }}> */}
                                    {row.supplier_mobile}
                                    {/* </Tooltip> */}
                                </TableCell>: <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                    {/* <Tooltip title={row.active ? "Enabled" : "Disabled"} placement="top" classes={{ tooltip: classes.lightTooltip }}> */}
                                    {row.buyer_mobile}
                                    {/* </Tooltip> */}
                                </TableCell>}
                               
                               
                               
                                <TableCell className={this.getTableCellClass(classes, 6)} >{row.commodity}</TableCell>
                                <TableCell className={this.getTableCellClass(classes, 7)} >{row.createdtime.split("T")[0]}
                                </TableCell>

                                <TableCell className={this.getTableCellClass(classes, 5)} >
                                ₹ {row.bijak_amt}
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

OrderTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);