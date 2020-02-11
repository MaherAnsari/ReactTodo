import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NoDataAvailable from '../common/NoDataAvailable';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import AddOrderModal from '../orders/common/AddOrderModal';
import orderService from '../../app/orderService/orderService';
import Utils from '../../app/common/utils';
import { getAccessAccordingToRole } from '../../config/appConfig';

var moment = require('moment');

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
    },
    info: {
        fontSize: '14px',
        marginLeft: '8px',
        color: '#fd0671',
        cursor: 'pointer'
    }

});

class OrderTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["order id", "buyer info", "broker name", "Date", "location", "commodity", "Amount  "],

            open: this.props.openModal, tableBodyData: this.props.data,
            rowsPerPage: 50,
            page: 0,
            showAddOrderModal: false
        }

    }
    componentDidMount() {
        console.log(this.props.data);
        let tableHeadData = ["order id", "buyer info", "broker name", "Date", "location", "commodity", "Amount  "];
        if (this.props.userdata.role === "ca") {
            tableHeadData = ["order id", "supplier info", "broker name", "Date", "location", "commodity", "Amount  "];
        } else if (this.props.userdata.role === "broker") {
            tableHeadData = ["order id", "supplier info", "buyer info", "Date", "location", "commodity", "Amount  "];
        } 
        
       
            this.setState({ tableHeadData: tableHeadData });
       

    }



    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    async getListData(params) {
        this.setState({ showLoader: true });

        try {
            let resp = await orderService.getOrderListData(params);

            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ tableBodyData: resp.data.result.data });
            } else {
                // this.setState({ tableBodyData: [] ,showLoader:false});
            }

        } catch (err) {
            console.error(err);
            if (this.ismounted) {
                // this.setState({ tableBodyData: [],showLoader:false });
            }
        }
    }


    handleAddClick(event) {

    }
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    onOrderDataAdded() {
        this.setState({ showAddOrderModal: false }, function () {
            // this.props.onOrderAdded();
            let param = { "limit": 10000 };
            if (this.props.userdata.role === "ca") {
                param["buyerid"] = this.props.userdata.mobile;
            } else if (this.props.userdata.role === "broker") {
                param["brokerid"] = this.props.userdata.id;
            } else if (this.props.userdata.role === "la") {
                param["supplierid"] = this.props.userdata.mobile;
            } else {
                param["na"] = this.props.userdata.mobile;
            }
            // console.log(param);
            if (Object.keys(param).length) {
                this.getListData(param);
            }
        });
    }

    handleClickOpen() {

        this.setState({ showAddOrderModal: true });
    }
    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
        return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0] + " \n" +   fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
        // return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0]}</div>
    }

    render() {
        const { classes } = this.props;
        const { rowsPerPage, page } = this.state;
        const leftAlignedIndexs = [1, 2];
        const rightAlignedIndexs = [6];
        return (<div style={{ marginTop: '50px' }}> <div style={{ maxHeight: "65vh", overflowY: "scroll" }}>
            <Table className='table-body' stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow style={{ borderBottom: "2px solid #858792" }} >
                        {this.state.tableHeadData.map((option, i) => (
                            <TableCell
                                key={option}
                                className={this.getTableCellClass(classes, i)}
                                style={{
                                    textTransform: 'uppercase',
                                    minWidth: i === 0 ? "80px" : '120px', paddingRight: i === 5 ? "10px" : '',
                                    textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                }}>{option}</TableCell>
                        ))}
                        {/* <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod", textAlign: 'left' }}> Quantity </TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.tableBodyData &&

                        (rowsPerPage > 0
                            ? this.state.tableBodyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : this.state.tableBodyData
                        ).map((row, i) => {
                            return (

                                <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>
                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} >
                                        <span
                                            data-toggle="tooltip" data-placement="center" title="info"
                                            // onClick={this.onInfoClick.bind(this, row)}
                                            style={{ color: "#3f51b5", borderBottom: "2px solid #3f51b5", padding: "0px 2px"}}>
                                            {row.id}
                                        </span>
                                        <i style={{ paddingTop: "11px" }}
                                            data-toggle="tooltip" data-placement="right" title="Supporting images"
                                            // onClick={this.onShowSupportinInvoiceModal.bind(this, row)}
                                            className={"fa fa-camera " + classes.info} aria-hidden="true"></i>
                                        <sup>{row.supporting_images ? row.supporting_images.length : 0}</sup>
                                    </TableCell>
                                    {this.props.role !== "la"  && <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                        <div style={{ display: "grid", textAlign: "left", textTransform: "capitalize" }}>
                                            <span>{row.supplier_name ? row.supplier_name : ""} </span>
                                            <span style={{ fontSize: "12px" }}>{"( " +  Utils.maskMobileNumber(row.supplier_mobile )+ " )"}</span>
                                        </div>
                                    </TableCell>}

                                    {(this.props.role == "la" || this.props.role === "broker") && <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                        <div style={{ display: "grid", textAlign: "left", textTransform: "capitalize" }}>
                                            <span>{row.buyer_name ? row.buyer_name : ""} </span>
                                            <span style={{ fontSize: "12px" }}>{"( " + Utils.maskMobileNumber( row.buyer_mobile) + " )"}</span>
                                        </div>
                                    </TableCell>}
                                    {/* <TableCell className={this.getTableCellClass(classes, 2)}>
                                    <Tooltip title={row.supplier_name ? row.supplier_name : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                        <div className="text-ellpses">{row.supplier_name}</div>
                                    </Tooltip>

                                </TableCell> */}
                                    {/* <TableCell className={this.getTableCellClass(classes, 3)}>
                                    <Tooltip title={row.buyer_name ? row.buyer_name : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                        <div className="text-ellpses">{row.buyer_name}</div>
                                    </Tooltip>
                                </TableCell> */}

                                   {this.props.role !== "broker" && <TableCell className={this.getTableCellClass(classes, 4)} style={{ textAlign: "left" }}>
                                        {row.broker_name}
                                    </TableCell>}
                                    <TableCell className={this.getTableCellClass(classes, 5)} style={{ padding: "0px", textAlign: 'center', borderBottom: 0 }} >

                                        {this.formatDateAndTime(row.createdtime)}
                                    </TableCell>
                                    <TableCell className={this.getTableCellClass(classes, 4)} >
                                        {row.source_location ? row.source_location : "-"}
                                    </TableCell>
                                    <TableCell className={this.getTableCellClass(classes, 6)}  >
                                        <span style={{
                                            color: "white",
                                            background: "rgb(58, 126, 63)",
                                            padding: "4px 12px",
                                            borderRadius: "13px"
                                        }}>{row.commodity}</span> </TableCell>
                                    <TableCell className={this.getTableCellClass(classes, 7)} style={{ textAlign: "right", paddingRight: '10px' }}>
                                        ₹ {Utils.formatNumberWithComma(row.bijak_amt)}

                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
         
            </Table>
           

        </div>
            {this.state.tableBodyData && this.state.tableBodyData.length > 0 && <Table>
                <TableFooter style={{ borderTop: "2px solid #858792", background: "#fafafa" }}>
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
                </TableFooter>
            </Table>}
            {!this.state.tableBodyData.length && < NoDataAvailable style={{ height: '25vh' }} />}

            {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
            {/* <Button style={{float:'right',marginRight:'28px'}} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button> */}

            {getAccessAccordingToRole("addOrder") && this.props.userdata && (this.props.userdata.role === "la" || this.props.userdata.role === "ca" || this.props.userdata.role === "broker") && <div className="updateBtndef">
                <div className="updateBtnFixedModal" style={{ display: 'flex' }} onClick={this.handleClickOpen.bind(this)}>
                    <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                    <p style={{
                        fontSize: "14px",
                        fontFamily: "lato",
                        fontWeight: 600
                    }}>Add Order</p></div>
            </div>}
            {this.state.showAddOrderModal &&
                <AddOrderModal
                    open={this.state.showAddOrderModal}
                    userdata={this.props.userdata}
                    onOrderDataAdded={(event) => this.onOrderDataAdded(event)}
                    onAddModalCancel={(event) => this.setState({ showAddOrderModal: false })}
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

OrderTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);