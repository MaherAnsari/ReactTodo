import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import InfoDialog from './infoDialog';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import ViewSupportingInvoiceModal from '../common/ViewSupportingInvoiceModal';
import AddOrderModal from '../common/AddOrderModal';
var moment = require('moment');


const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#2e3247',
                fontWeight: 600,
                fontSize: '13px !important',
                fontFamily: 'lato !important',
                textTransform: 'uppercase',
                lineHeight: "1em"

            },
            body: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500,
                fontSize: '14px !important',
                fontFamily: 'lato !important',
            }
        },
    }
});

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        verticalAlign: "middle",
        marginRight: theme.spacing.unit,
        fontSize: 10,
    },
    tableCell: {
        paddingLeft: '4px',
        paddingRight: '4px',
        textAlign: 'center',
        maxWidth: '200px'
    },
    titleText: { width: '50%', textAlign: 'left', paddingLeft: '15px', paddingTop: '7px', fontFamily: 'lato !important', },
    defaultTemplate: { height: '30vh', paddingTop: '10vh', },
    defaultSpan: { display: 'grid', fontSize: '25px' },
    defaultIcon: { fontSize: '65px', color: "#384952" },
    editIcon: { fontSize: '20px', color: "#1e459c", paddingLeft: 3, cursor: 'pointer', marginRight: '2px', float: 'left' },
    infoIcon: { color: '#d46262', fontSize: '18px', cursor: 'pointer' },
    cellDiv: {
        maxWidth: '180px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    root: {
        width: '100%',
        minHeight: '80vh'
    },
    lightTooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    info: {
        fontSize: '14px',
        marginLeft: '8px',
        color: '#fd0671',
        cursor: 'pointer'
    }
});


class OrderListTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["order Id", "supplier_mobile", "buyer_mobile", "supplier_name", "buyer_name", "broker_name", "Date", "commodity", "Amount"],
            tableBodyData: this.props.tableData,
            rawTableBodyData: [],
            searchedText: "",
            editableData: {},
            showServerDialog: false,
            showOptionModal: false,
            anchorEl: null,
            showUserModal: false,
            userData: {},
            userId: null,
            payload: null,
            showAddModal: false,
            infoData: null,
            open: false,

            rowsPerPage: 50,
            page: 0,

            showSupportingInvoiceModal: false,
            invoiceModalData: [],

            showAddOrderModal: false

        }
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.tableBodyData !== nextprops.tableData) {
            this.setState({ tableBodyData: nextprops.tableData });
        }
    }


    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    getInfoSTring(obj) {
        return obj.source_location ? obj.source_location : "- , " + obj.target_location ? obj.target_location : "-";
    }

    getRole(row) {
        if (row.role === "ca") {
            return "buyer";
        } else if (row.role === 'la') {
            return "supplier";
        } else if (row.role === 'broker') {
            return "broker";
        } else {
            return "NA";
        }
    }
    getBackgroundColor(obj) {
        if (obj.role === "ca") {
            return "#f94141";
        } else if (obj.role === 'la') {
            return "#82af82";
        } else if (obj.role === 'broker') {
            return "#7070fd";
        } else {
            return "#e5e8ec";
        }
    }

    onInfoClick = (info, event) => {
        this.setState({
            infoData: info, showAddModal: true, open: true
        })
    }

    onShowSupportinInvoiceModal = (info, event) => {
        this.setState({
            invoiceModalData: info["supporting_images"], showSupportingInvoiceModal: true
        })
    }

    onModalCancel(event) {
        this.setState({ showAddModal: false, infoData: null, open: false })
    }


    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).utcOffset("+05:30").format('DD-MMM-YYYY HH:mm A')
        return <div style={{ width: "95px" }}> {fdate.split(" ")[0] + " \n" + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
    }

    formatNumberWithComma(x) {
        try {
            x = x.toString();
            var lastThree = x.substring(x.length - 3);
            var otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            return res;
        } catch (err) {
            console.log(err);
            return x;
        }
    }

    handleClickOpen() {
        this.setState({ showAddOrderModal: true })
    }

    onOrderDataAdded() {
        this.setState({ showAddOrderModal: false });
        this.props.getSearchedOrderListData();
    }

    render() {
        const { classes } = this.props;
        const { rowsPerPage, page, showAddOrderModal } = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <Paper className={classes.root} >
                    {this.state.tableBodyData ? <div >
                        <Table className='table-body'>
                            <TableHead>
                                <TableRow style={{ borderBottom: "2px solid #858792" }} >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: i === 0 ? "80px" : '120px' }}>{option}</TableCell>
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
                                                        data-toggle="tooltip" data-placement="right" title="info"
                                                        onClick={this.onInfoClick.bind(this, row)}
                                                        style={{ color: "#3f51b5", borderBottom: "2px solid #3f51b5", padding: "0px 2px", cursor: "pointer" }}>
                                                        {row.id}
                                                    </span>
                                                    <i style={{ paddingTop: "11px" }}
                                                        data-toggle="tooltip" data-placement="right" title="Supporting images"
                                                        onClick={this.onShowSupportinInvoiceModal.bind(this, row)}
                                                        className={"fa fa-camera " + classes.info} aria-hidden="true"></i>
                                                    <sup>{row.supporting_images ? row.supporting_images.length : 0}</sup>
                                                </TableCell>
                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                    {row.supplier_mobile}
                                                </TableCell>
                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                    {row.buyer_mobile}

                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 2)}>
                                                    <Tooltip title={row.supplier_name ? row.supplier_name : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                        <div className="text-ellpses">{row.supplier_name}</div>
                                                    </Tooltip>

                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 3)}>
                                                    <Tooltip title={row.buyer_name ? row.buyer_name : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                        <div className="text-ellpses">{row.buyer_name}</div>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell className={this.getTableCellClass(classes, 4)}>
                                                    {row.broker_name}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 5)} style={{ padding: "0px", borderBottom: 0 }} >

                                                    {this.formatDateAndTime(row.createdtime)}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 6)}  >
                                                    <span style={{
                                                        color: "white",
                                                        background: "rgb(58, 126, 63)",
                                                        padding: "4px 12px",
                                                        borderRadius: "13px"
                                                    }}>{row.commodity}</span> </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 7)} >
                                                    {/* {row.createdtime.split("T")[0]+"\n"+row.createdtime.split("T")[1] } */}
                                                    ₹ {this.formatNumberWithComma(row.bijak_amt)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                            <TableFooter style={{ borderTop: "2px solid #858792" }}>
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
                        </Table>
                        {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
                            {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
                                {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                                    <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                        </div>}
                    </div> :
                        <div style={{ paddingTop: "14%" }} >
                            <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-search-plus"} aria-hidden="true"></i>{"Search from above to check specific Orders"}</span>
                        </div>
                    }

                    {this.state.showAddModal ?
                        <InfoDialog openModal={this.state.open}
                            data={this.state.infoData}
                            onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

                    {this.state.showSupportingInvoiceModal &&
                        <ViewSupportingInvoiceModal
                            openModal={this.state.showSupportingInvoiceModal}
                            onInvoiceModalClose={() => { this.setState({ showSupportingInvoiceModal: false, invoiceModalData: [] }) }}
                            invoiceUrlData={this.state.invoiceModalData} />}

                    <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex' }} onClick={this.handleClickOpen.bind(this)}>
                            <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Add Order</p></div>
                    </div>
                    {showAddOrderModal &&
                        <AddOrderModal
                            open={showAddOrderModal}
                            onTransactionAdded={(event) => this.onOrderDataAdded(event)}
                            onAddModalCancel={(event) => this.setState({ showAddOrderModal: false })}
                        />}

                </Paper>
            </MuiThemeProvider>
        );
    }
}

OrderListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderListTable);