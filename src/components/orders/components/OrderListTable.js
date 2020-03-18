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
import Loader from '../../common/Loader';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import ViewSupportingInvoiceModal from '../common/ViewSupportingInvoiceModal';
import AddOrderModal from '../common/AddOrderModal';
import Utils from '../../../app/common/utils';
import EditOrderDataModal from '../common/EditOrderDataModal';
import EditIcon from '@material-ui/icons/Edit';
import commodityService from '../../../app/commodityService/commodityService';
import FileUploader from '../../common/fileUploader';
import orderService from '../../../app/orderService/orderService';
import Fab from '@material-ui/core/Fab';
import PayoutOrderModal from '../common/PayoutOrderModal';
import BusinessInfoDialog from '../../common/BusinessInfoDialog';
import { getAccessAccordingToRole } from '../../../config/appConfig';


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
        MuiTablePagination: {
            toolbar: {
                paddingRight: '250px'
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
    },
    textEllpses:{
        textOverflow: "ellipsis",
        overflow: "hidden",
        maxWidth: "110px",
        lineHeight: "18px",
        display: "block"
    }
});


class OrderListTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["order Id", "Old Id", "buyer Name/ Business Name", "supplier Name/ Business Name", "Unsettled Amt Pltf", "Date", "source/target", "commodity", "", "Order Amt  "],
            tableBodyData: this.props.tableData,
            totalDataCount: this.props.totalDataCount || 0,
            currentOffset : this.props.currentOffset || 0,
            rawTableBodyData: [],
            searchedText: "",
            editableData: {},
            showServerDialog: false,
            showOptionModal: false,
            anchorEl: null,
            showUserModal: false,
            userData: {},
            // userId: null,
            payload: null,
            showAddModal: false,
            infoData: null,
            open: false,

            rowsPerPage: 50,
            page: 0,

            showSupportingInvoiceModal: false,
            invoiceModalData: [],

            showAddOrderModal: false,

            showEditDataModal: false,
            commodityList: [],
            showUploader: false,

            showPayoutModal:false,
            payoutData : undefined,

            showUserInfo: false,
            userInfoData : undefined,
            isLimitUpdate: false,
            userId: undefined
        }
        this.getCommodityNames();
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.getCommodityNamesArray(resp.data.result.data) });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    getCommodityNamesArray(data) {
        try {
            var listData = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["name"]) {
                        listData.push(data[i]["name"])
                    }
                }
            }
            return listData;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.tableBodyData !== nextprops.tableData) {
            this.setState({ tableBodyData: nextprops.tableData });
        }
        if (this.state.totalDataCount !== nextprops.totalDataCount) {
            this.setState({ totalDataCount: nextprops.totalDataCount });
        }
        if (this.state.currentOffset !== nextprops.currentOffset) {
            this.setState({ currentOffset: nextprops.currentOffset });
        }
        if( this.state.isTableDataLoading !== nextprops.isTableDataLoading ){
            this.setState({ isTableDataLoading : nextprops.isTableDataLoading });
        }
        if (nextprops.resetPageNumber) {
            this.setState({ page : 0 },()=>
            this.props.setPageNumber());
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
        if(  this.state.tableBodyData.length === (newPage *this.state.rowsPerPage ) ){
            this.props.resetOffsetAndGetData();
        }
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
        return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0] + " \n" + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
        // return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0]}</div>
    }

    handleClickOpen() {
        this.setState({ showAddOrderModal: true })
    }

    onOrderDataAdded() {
        this.setState({ showAddOrderModal: false, showEditDataModal  : false  }, function () {
            this.props.onOrderAdded();
        });
    }

    handelDownloadClicked = () => {
        // Utils.downloadDataInCSV(this.state.tableBodyData, "order_data")
        let fHeader = {
            "id": "Txn",
            "createdtime": "Date",
            "commodity": "Commodity",
            "type": "Type",
            // "": "Pkt",
            "qnt": "Qty",
            "unit": "Unit",
            "rate": "Rate",
            "rate_unit": "Unit",
            "bijak_amt": "Bijak Amount",
            "transport_info": "Truck No.",
            // "": "Total Amount",
            // "": "Bank Transfer",
            "source_location": "Source",
            "target_location": "Destination",
            // "": "Cashback (LA)",
            // "": "Cashback (CA)",
            "supplierid": "LA ID",
            "buyerid":"CA ID",
            
            "supplier_mobile":"LA Phone",
            "buyer_mobile":"CA Phone",
            "supplier_name":"LA Name",
            "supplier_businessname":"LA Business Name",
            "buyer_name":"CA Name",
            "buyer_businessname":"CA Businesss Name",
            "old_system_order_id":"Old System Order Id"
        }
        Utils.downloadFormattedDataInCSV(this.state.tableBodyData, "Order ", fHeader)
    }

    //edit option
    handelEditModalOpen(data) {
        this.setState({ editableData: Object.assign({},data), showEditDataModal: true });
    }

    async handleFileUploader(event) {
        console.log(event);
        try {
            let resp = await orderService.uploadOrder(event);
            if (resp.data.status === 1 && resp.data.result) {
                alert("Data Successfuly Uploaded ");
                this.props.onOrderAdded();
                this.setState({ open: false, showUploader: false });
            }else{
                alert(resp && resp.data && resp.data.message ? resp.data.message : "An error occured");
            }

        } catch (err) {
            console.error(err)
            this.setState({ open: false, showUploader: false });
            this.props.onOrderAdded();
        }
    }

    onFileModalCancel(event) {
        this.setState({ open: false, showUploader: false });
    }

    handleUploaderClick(event) {
        this.setState({ showUploader: true });
    }

    getActionButton(row) {
        if (row &&  row["unsettled_amount_pltf"] > 0 ) {
            return (<Fab
                variant="extended"
                size="small"
                aria-label="PAYOUT"
                disabled={ !getAccessAccordingToRole("payViaCredit")}
                onClick={( event )=> this.setState({ showPayoutModal : true, payoutData : row })}
                style={{ cursor:(getAccessAccordingToRole("payViaCredit")?"pointer":"no-drop"),textTransform: "none", background: (getAccessAccordingToRole("payViaCredit") ? "#108ad0" : "gray"), color: "#ffffff", padding: "0 8px" }}
            >
                Pay via credit
    </Fab>);
        } else {
            return (<span> {row["status"]} </span>)
        }
    }

    onUserInfoModalCancel(event) {
        this.setState({ showUserInfo : false,  isInfo: false });
        if(this.state.isLimitUpdate){
            this.props.onOrderAdded();
        }
    }

    changeLimitSucces(event){
        let obj = this.state.userInfoData;
        obj['bijak_credit_limit'] = event;
        this.setState({ userInfoData:obj, isLimitUpdate:true });
    }

    handleUserInfoClose(event) {
        this.setState({ showUserInfo: false, isInfo: false });
    }

    onUserInfoClicked = ( info, type , event) => {
        let id = "";
        if( type === "supplier_name"){
            id = info["supplier_mobile"];
        }else{
            id = info["buyer_mobile"];
        }
        this.setState({ userId :id,  showUserInfo : true, userInfoData : JSON.parse(JSON.stringify(info)), isInfo: true });
    }

    render() {
        const { classes,showLoader } = this.props;
        const { rowsPerPage, page, showAddOrderModal, showEditDataModal, editableData, totalDataCount, commodityList, isTableDataLoading } = this.state;
        const leftAlignedIndexs = [2, 3];
        const rightAlignedIndexs = [3, 8];
        return (
            <MuiThemeProvider theme={theme}>
                { !showLoader && <Paper className={classes.root} >
                    {this.state.tableBodyData ? <div> <div style={{ maxHeight: "65vh", overflowY: "scroll" }}>
                        <Table className='table-body' stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow style={{ borderBottom: "2px solid #858792" }} >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell
                                            key={option}
                                            className={this.getTableCellClass(classes, i)}
                                            style={{
                                                minWidth:( i === 0 || i === 1 || i === 4 || i === 5 || i === (this.state.tableHeadData.length -1 )) ? (i !== 1 ? "100px" : "66px" ) : '120px',
                                                textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                            }}>{option}</TableCell>
                                    ))}
                                    {/* <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod", textAlign: 'left' }}> Quantity </TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { !isTableDataLoading && this.state.tableBodyData &&

                                    (rowsPerPage > 0
                                        ? this.state.tableBodyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : this.state.tableBodyData
                                    ).map((row, i) => {
                                        return (

                                            <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>
                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} >
                                                {/* {row.is_added_by_platform ? <span><i className="fa fa-mobile" aria-hidden="true"></i> </span>: " "} */}
                                                { !row.is_added_by_platform && <i style ={{fontSize:"24px",marginRight:"4px",color:"#50aa35"}} class="fa fa-mobile" aria-hidden="true"></i>}
                                                    <span
                                                        data-toggle="tooltip" data-placement="center" title="info"
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
                                                
                                                <TableCell className={classes.tableCell}>
                                                        {row.old_system_order_id ? row.old_system_order_id : "-"}
                                                    </TableCell>

                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                    <div className=" name-span" style={{ display: "grid", textAlign: "left", textTransform: "capitalize" , cursor: "pointer"}}
                                                    onClick={this.onUserInfoClicked.bind(this, row, "buyer_name")}>
                                                        <span>{row.buyer_name ? row.buyer_name : ""} </span>
                                                        <span style={{ fontSize: "12px" }}>{row.buyer_businessname ? row.buyer_businessname :" "}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                    <div className=" name-span" style={{ display: "grid", textAlign: "left", textTransform: "capitalize" , cursor: "pointer"}}
                                                    onClick={this.onUserInfoClicked.bind(this, row, "supplier_name")}>
                                                        <span>{row.supplier_name ? row.supplier_name : ""} </span>
                                                        <span style={{ fontSize: "12px" }}>{ row.supplier_businessname ? row.supplier_businessname :" "}</span>
                                                    </div>
                                                </TableCell>
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

                                                <TableCell className={this.getTableCellClass(classes, 4)} style={{ textAlign: "right" }}>
                                                ₹ {row.unsettled_amount_pltf ? Utils.formatNumberWithComma(row.unsettled_amount_pltf) : 0}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 5)} style={{ padding: "0px", textAlign: 'center', borderBottom: 0 }} >

                                                    {this.formatDateAndTime(row.createdtime)}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 4)} >
                                                
                                                {/* {(row.source_location ? row.source_location : "-")+"/"+ (row.target_location ? row.target_location : "-")} */}
                                                
                                                <Tooltip title={(row.source_location ? row.source_location : "-")+"/\n"+ (row.target_location ? row.target_location : "-")} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                        <div className={classes.textEllpses}>{(row.source_location ? row.source_location : "-")+"/\n"+ (row.target_location ? row.target_location : "-")}</div>
                                                    </Tooltip>
                                                    
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 6)}  >
                                                    <span style={{
                                                        color: "white",
                                                        background: row.commodity ? "rgb(58, 126, 63)" : "",
                                                        padding: "4px 8px",
                                                        display:"inline-block",
                                                        textTransform: "capitalize",
                                                        borderRadius: "13px"
                                                    }}>{row.commodity}</span> </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 4)} >
                                                    {this.getActionButton(row)}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 7)} style={{ textAlign: "right" }}>
                                                <span style={{ fontWeight: ( row.invalidimg ? 600 : 400)}}> ₹ </span>{row.bijak_amt ? Utils.formatNumberWithComma(row.bijak_amt) : 0}
                                                    {getAccessAccordingToRole("editOrder") && <EditIcon
                                                        className="material-Icon"
                                                        onClick={() => this.handelEditModalOpen(row)}
                                                        style={{ color: "#e72e89", cursor: "pointer", height: "18px", fontSize: "18px" }} />}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) }
                            </TableBody>
                        </Table>
                        {isTableDataLoading && <div><Loader/> </div>}
                        {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
                            {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
                                {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                                    <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                        </div>}

                    </div>
                        {this.state.tableBodyData.length > 0 && <Table>
                            <TableFooter style={{ borderTop: "2px solid #858792", background: "#fafafa" }}>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[25, 50, 100]}
                                        // rowsPerPageOptions={[1,2,3]}
                                        colSpan={6}
                                        count={totalDataCount}
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

                    {/* <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex', left: "16%", background: "#4da443" }}
                            onClick={this.handleUploaderClick.bind(this)}
                        >
                            <i className="fa fa-cloud-upload add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Upload file</p></div>
                    </div> */}
                    {getAccessAccordingToRole("addOrder") && <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex' }} onClick={this.handleClickOpen.bind(this)}>
                            <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Add Order</p></div>
                    </div>}

                    {/* {getAccessAccordingToRole("allowDownload") &&  <div className="updateBtndef" style={{ right: "160px" }} data-toggle="tooltip" data-html="true" title="Download">
                        <div className="updateBtnFixed" style={{ display: 'flex', background: "#e72e89", borderRadius: "6px" }} onClick={this.handelDownloadClicked.bind(this)}>
                            <i className="fa fa-cloud-download add-icon" style={{ marginRight: 0, color: "white" }} aria-hidden="true"></i>
                        </div>
                    </div>} */}
                    {showAddOrderModal &&
                        <AddOrderModal
                            open={showAddOrderModal}
                            commodityList={commodityList}
                            onOrderDataAdded={(event) => this.onOrderDataAdded(event)}
                            onAddModalCancel={(event) => this.setState({ showAddOrderModal: false })}
                        />}
                    {showEditDataModal && 
                        <EditOrderDataModal
                            open={showEditDataModal}
                            commodityList={commodityList}
                            editableData={editableData}
                            onOrderDataUpdated={(event) => this.onOrderDataAdded(event)}
                            onEditModalCancel={(event) => this.setState({ showEditDataModal: false })}
                        />}

                    {this.state.showUploader ? <FileUploader openModal={this.state.showUploader}
                        onEditModalClosed={this.handleFileUploader.bind(this)}
                        //  commodityList={ this.state.commodityList}
                        onEditModalCancel={this.onFileModalCancel.bind(this)}
                    />
                        : ""}

                    {this.state.showPayoutModal && this.state.payoutData &&
                        <PayoutOrderModal
                            openPayoutModal={this.state.showPayoutModal}
                            onPayoutModalClose={() => { this.setState({ showPayoutModal: false, payoutData: undefined }) }}
                            onPayoutSuccessfull={(event) => this.setState({ showPayoutModal: false, payoutData: undefined }, function () {
                                this.props.onOrderAdded();
                            })}
                            payoutData={this.state.payoutData} />}

                    {this.state.showUserInfo ? 
                        <BusinessInfoDialog 
                            openModal={this.state.showUserInfo}
                            onEditModalClosed={this.handleUserInfoClose.bind(this)}
                            data={this.state.userInfoData}
                            isInfo={true}
                            userId={ this.state.userId}
                            onLimitUpdate= {this.changeLimitSucces.bind(this)}
                            onEditModalCancel={this.onUserInfoModalCancel.bind(this)} /> : ""}

                </Paper>}
            </MuiThemeProvider>
        );
    }
}

OrderListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderListTable);