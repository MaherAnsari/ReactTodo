import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CachedIcon from '@material-ui/icons/Cached';
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
import DateFnsUtils from '@date-io/date-fns';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import EditTransactionModal from '../common/EditTransactionModal';
import Utils from './../../../app/common/utils';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import tickIcon from "../../../assets/images/icons/check.svg";
import faqIconReddish from "../../../assets/images/icons/faq_redish.svg";
import failedIcon from "../../../assets/images/icons/failed.svg";
import approvedIcon from "../../../assets/images/icons/approved.svg";
import hourglassIcon from "../../../assets/images/icons/hourglass.svg";
import cancelledIcon from "../../../assets/images/icons/cancelled.svg";
import payment_InitatedIcon from "../../../assets/images/icons/payment_Initated.svg";
import payment_failureIcon from "../../../assets/images/icons/payment_failure.svg";
// import transactionIcon from "../../../assets/images/icons/transaction.svg";
import AccountBalanceWalletSharpIcon from '@material-ui/icons/AccountBalanceWalletSharp';
import SelectTransactionTypeModal from '../common/SelectTransactionTypeModal';
import PayoutModal from '../common/PayoutModal';
import TransactionIfoModal from '../common/TransactionIfoModal';
import { getAccessAccordingToRole } from '../../../config/appConfig';
var moment = require('moment');

const theme = createMuiTheme({
    overrides: {
        MuiFormLabel: {
            root: {
                color: "White"
            }
        },
        MuiInput: {
            underline: {
                borderBottom: "1px solid rgb(255, 255, 255)"
            }
        },
        MuiIconButton: {
            root: {
                color: "#fff"
            }
        },
        MuiInputBase: {
            input: {
                color: "White"
            }
        },
        MuiPickersCalendarHeader: {
            iconButton: {
                color: "#000"
            }
        }
    }
});

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
    closeBtn: {
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
    formControl: {
        color: "#fff"
    },
    dataHeader: {
        width: "20%"
    },
    lightTooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// const statusOption = ["approved", "failed"];


class ViewTransactionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            groupedTransactionData: undefined,
            allTransactionsData: undefined,
            mobileNumber: this.props.mobileNumber,
            tableHeadData: ["status","id", "Supplier Name", "Supplier Bussiness Name", "Created Time",  "Payment mode","Payment type","Amount", "Supporting images"],
            expanded: "",
            invoiceModalData: [],
            showImageInvoiceModal: false,
            supplierNameMapping: {},
            buyerInfo: this.props.buyerInfo,
            showLoader: false,

            transDate: this.props.transDate,
            selectedTab: "all",

            editableData: undefined,
            showEditTransactionModal: false,
            isDataUpdated: false,
            
            rowsPerPage: 50,
            page: 0,

            statusAnchorEl:null,
            statusdropActionOpen: "",
            confirmDialogData:{ 
                                "text": "Are you sure to update the status of this payment?",
                                "title":"Are you sure to update the status of this payment?",
                            },
            showConfirmStatusDialoge: false,
            statusUpdateObj:{},
            showStatusChangeModal: false,

            showPayoutModal: false,
            payoutData: undefined,

            showTransactionInfoDialog: false,
            transactionInfoData : undefined
        }
    }

    componentDidMount() {
        this.getTransactionList(this.state.mobileNumber, this.state.transDate);
    }

    getTransactionList = async (mobno, dateparams) => {
        try {
            let resp = await paymentService.getTransactionDetailsOfBuyer(mobno, dateparams);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({
                    groupedTransactionData: respData["supplierWiseGrouped"],
                    allTransactionsData: respData["allTransactions"],
                    buyerInfo: respData["metainfo"],
                    supplierNameMapping: this.formatSupplierNameMapping(respData["supplierWiseGrouped"]),
                    page: 0
                });
            } else {
                this.setState({
                    groupedTransactionData: [],
                    allTransactionsData: [],
                });
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
                    names[key] = data[key][0]["supplier_fullname"] ? data[key][0]["supplier_fullname"] + " ( " + Utils.maskMobileNumber(key)+ " ) " : key;
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
            if (this.state.isDataUpdated) {
                this.props.onTransactionEdited();
            }
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

    getTransactionTypeColor(transaction_type) {
        if (transaction_type === "b_out") {
            return "rgb(212, 58, 58)"; // red

        } else if (transaction_type === "b_in") {
            return "rgb(56, 122, 57)"; // green

        } else {
            return "rgba(0, 0, 0, 0.87)" // default black color
        }
    }

    handelDateChange(dateVal, id) {
        var dates = this.state.transDate;
        dates[id] = this.formateDateForApi(dateVal);
        this.setState({ transDate: dates }, function () {
            this.getTransactionList(this.state.mobileNumber, this.state.transDate);
        });
    }

    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" + (dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            return dateVal;
        } else {
            return "";
        }
    }

    //edit option
    handelEditModalOpen(data) {
        this.setState({ editableData: data, showEditTransactionModal: true });
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
      };
    
      handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
      };

      handelRefreshModal( event ){
          this.setState({             
            groupedTransactionData: undefined,
            allTransactionsData: undefined}, function(){
                this.getTransactionList(this.state.mobileNumber, this.state.transDate);
            });
      }
    

      handelStatusOptionClick( row, event ){
          if(getAccessAccordingToRole("editPayment")){
            this.setState({ showStatusChangeModal : true, statusUpdateObj: row });
        }
      }


      getStatusOption( event , row ){
          if( (row["transaction_type"] === "b_out" && row["payment_mode"] === "bijak") ||  (row["transaction_type"] === "b_in" && row["payment_mode"] === "bank") ){
            
            if(  row["status"] === "transaction_failed" ){
                return(<span 
                    style={{ paddingLeft: "15%"}}  
                    data-toggle="tooltip" 
                    data-placement="center" 
                    title={row["status"] }>
                    <img src={ payment_failureIcon } alt={row["status"]} style={{ height: "22px",width: "22px"}}/>
                </span> );
               }else if(  row["status"] === "transaction_initiated" ){
            return(<span 
                style={{ paddingLeft: "15%"}}  
                data-toggle="tooltip" 
                data-placement="center" 
                title={row["status"] }>
                <img src={ payment_InitatedIcon } alt={row["status"]} style={{ height: "22px",width: "22px"}}/>
            </span> );
           }else if(  row["status"] === "payout_reversed" ||
                row["status"] === "payout_cancelled" || 
                row["status"] === "payout_rejected" ){
                return(<span 
                    style={{ paddingLeft: "15%"}}  
                    data-toggle="tooltip" 
                    data-placement="center" 
                    title={row["status"] }>
                    <img src={ cancelledIcon } alt={row["status"]} style={{ height: "22px",width: "22px"}}/>
                </span> );
            } else if(row["status"] === "payout_processed"){
                return(<span 
                    style={{ paddingLeft: "15%"}}  
                    data-toggle="tooltip" 
                    data-placement="center" 
                    title={row["status"] }>
                    <img src={ approvedIcon } alt={row["status"]} style={{ height: "22px",width: "22px"}}/>
                </span> );
            } else if(
                row["status"] === "payout_initiated" || 
                row["status"] === "payout_queued" || 
                row["status"] === "payout_pending" || 
                row["status"] === "payout_processing"){
                return(<span 
                    style={{ paddingLeft: "15%"}}  
                    data-toggle="tooltip" 
                    data-placement="center" 
                    title={row["status"] }>
                    <img src={ hourglassIcon } alt={row["status"]} style={{ height: "22px",width: "22px"}}/>
                </span> );
            } else if(row["status"] === "approved"){
                return( <Fab
                    variant="extended"
                    size="small"
                    aria-label="PAYOUT" 
                    onClick={( event )=> {if(getAccessAccordingToRole("makePayout")){this.setState({ showPayoutModal : true, payoutData : row })}}}
                    style={{ textTransform: "none", background: "#0c6523", color: "#ffffff", padding: "0 15px" }}
                >
                   PAYOUT
            </Fab>);
            }else if(row["status"] === "pending" || row["status"] === "pending_approved" || row["status"] === null ){
               return(
                   this.getActionAbleIcon( event , row )
                );
            }else if(row["status"] === "failed" ){
                return(<span 
                        style={{ paddingLeft: "15%"}}  
                        data-toggle="tooltip" 
                        data-placement="center" 
                        title={row["status"].toUpperCase() +(row["reason"] ? "\nReason : "+ row["reason"]: "")  }>
                            <img src={row["status"] === "failed" ?  failedIcon : "" } alt="failedIcon" 
                                style={{ height: "22px",width: "22px"}}/>
                    </span>)
            }
        }else{
            return ( <AccountBalanceWalletSharpIcon style={{color:"gray", marginLeft:"15%"}}/>);
        }
      }

      getActionAbleIcon( event , row ){
        return(
        <span style={{ width: "40px", height: "20px", paddingLeft:"15%"}}>
        <IconButton
            style={{ padding: "4px"}}
            data-toggle="tooltip" data-placement="center" title={row["status"] === "pending" || row["status"] === "pending_approved" || row["status"] === null ? "pending_approved" : row["status"] }
            aria-label="more"
            aria-controls={"long-menu"+row["id"] }
            aria-haspopup="true"
            onClick={this.handelStatusOptionClick.bind( event, row )}
        >
        <img src={row["status"] === "pending" || row["status"] === "pending_approved" || row["status"] === null ?  faqIconReddish : tickIcon } alt="statusIcon" 
            style={{ height: "22px",width: "22px"}}/>
        </IconButton>
      </span>)
      }

      checkIfAccountInfoAvaialble( data ){
        if( (data["transaction_type"] === "b_out" && data["payment_mode"] === "bijak") ||
          (data["transaction_type"] === "b_in" && data["payment_mode"] === "bank") ){
        if(  data &&
             data["bank_details"] &&
             (data["status"] === "payout_processed" || 
             data["status"] === "transaction_initiated" || 
             data["status"] === "payout_initiated" || 
             data["status"] === "payout_queued" || 
             data["status"] === "payout_pending" || 
             data["status"] === "payout_processing"
            ) &&
             data["bank_details"] !== "-" && 
             data["bank_details"]["bank_account_number"] &&
             data["bank_details"]["bank_ifsc_code"] && 
             data["bank_details"]["bank_account_holder_name"]){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
      }

      formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
        return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0] + " \n" + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
        // return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0]}</div>
    }
    
    render() {
        const { classes } = this.props;
        const { groupedTransactionData, transDate, allTransactionsData, expanded,
            supplierNameMapping, buyerInfo, selectedTab,
            showEditTransactionModal } = this.state;
        const { rowsPerPage, page } = this.state;
        const leftAlignedIndexs = [0,1, 2,3];
        const rightAlignedIndexs = [7];
        return (
            <div>
                <Dialog fullScreen open={true} onClose={(event) => { this.handelModalClose(event) }} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                        <IconButton
                                edge="start"
                                data-toggle="tooltip" data-html="true" title="Refresh"
                                color="inherit"
                                onClick={(event) => { this.handelRefreshModal(event) }}
                                aria-label="close">
                                <CachedIcon  style={{color:"#50a1cf"}}/>
                            </IconButton>
                            <Typography
                                variant="h6"
                                className={classes.title}>
                                {(buyerInfo["buyer_fullname"] ? buyerInfo["buyer_fullname"] +
                                    (buyerInfo["buyer_business_name"] ? " ( " +
                                        buyerInfo["buyer_business_name"] + " )" : "") +
                                    " - " : "") + (buyerInfo["buyer_mobile"] ? Utils.maskMobileNumber(buyerInfo["buyer_mobile"]) : "")}
                            </Typography>
                            <div style={{ display: "flex" }}>
                                <MuiThemeProvider theme={theme}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                        <KeyboardDatePicker
                                            id="date-picker-dialog"
                                            label="Transaction start date"
                                            format="dd-MMM-yyyy"
                                            maxDate={new Date()}
                                            value={transDate["startDate"]}
                                            onChange={(dateval) => {
                                                this.handelDateChange(dateval, "startDate");
                                            }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                        &nbsp;
                                        &nbsp;
                                    <KeyboardDatePicker
                                            id="date-picker-dialog"
                                            label="Transaction end date"
                                            format="dd-MMM-yyyy"
                                            value={transDate["endDate"]}
                                            maxDate={new Date()}
                                            onChange={(dateval) => {
                                                this.handelDateChange(dateval, "endDate");
                                            }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </MuiThemeProvider>
                            </div>
                            <Button autoFocus className={classes.closeBtn} color="inherit" onClick={(event) => { this.handelModalClose(event) }}>
                                Close
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <div style={{ textAlign: "center", display: "flex", padding: "10px", marginBottom: "5px", boxShadow: "2px -1px 15px 0px rgba(0,0,0,0.75)" }}>
                        <div className={classes.dataHeader}>
                            In amount : <span style={{ color: "rgb(56, 122, 57)" }}>₹ {(buyerInfo["b_in_amount"] ? Utils.formatNumberWithComma(buyerInfo["b_in_amount"]) : "0")}</span>
                        </div >
                        <div className={classes.dataHeader}>
                            Out amount : <span style={{ color: "rgb(212, 58, 58)" }}>₹ {(buyerInfo["b_out_amount"] ? Utils.formatNumberWithComma(buyerInfo["b_out_amount"]) : "0")}</span>
                        </div>
                        <div className={classes.dataHeader}>
                            Outstanding balance : <span style={{ color: buyerInfo["total_outstanding_balance"] && buyerInfo["total_outstanding_balance"] > 0 ? "rgb(212, 58, 58)" : "rgb(56, 122, 57)" }} >₹ {(buyerInfo["total_outstanding_balance"] ? Utils.formatNumberWithComma(buyerInfo["total_outstanding_balance"]) : "0")}</span>
                        </div>
                        <div className={classes.dataHeader} style={{ color: "rgb(230, 0, 138)" }}>
                            Bijak credit limit : <span style={{ color: buyerInfo["bijak_credit_limit"] && buyerInfo["bijak_credit_limit"] < 0 ? "rgb(212, 58, 58)" : "rgb(56, 122, 57)" }} >₹ {(buyerInfo["bijak_credit_limit"] ? Utils.formatNumberWithComma(buyerInfo["bijak_credit_limit"] ): "0")}</span>
                        </div>
                        <div className={classes.dataHeader} >
                            Available credit : <span style={{ color: buyerInfo["available_credit"] && buyerInfo["available_credit"] < 0 ? "rgb(212, 58, 58)" : "rgb(56, 122, 57)" }} >₹ {(buyerInfo["available_credit"] ? Utils.formatNumberWithComma(buyerInfo["available_credit"]) : "0")}</span>
                        </div>
                    </div>

                    <div style={{ paddingTop: "10px", textAlign: "center" }}>
                        <span
                            style={{ marginLeft: "10px" }}
                        >
                            {selectedTab === "all" &&
                                <i className="fa fa-caret-left translabelIcon" style={{ marginRight: "-0.75px" }} aria-hidden="true"></i>}
                            <span

                                onClick={() => this.setState({ selectedTab: "all" })}
                                className=" translabeltag  labeltag"
                                style={{ cursor: "pointer", color: "#fff", background: selectedTab === "all" ? "#60c1d8" : "#1d6b7d" }}>
                                All transaction
                                <span> </span>
                            </span>

                        </span>
                        <span style={{ marginLeft: "10px" }} >
                            {selectedTab === "grouped" &&
                                <i className="fa fa-caret-left translabelIcon" style={{ marginRight: "-0.75px" }} aria-hidden="true"></i>}
                            <span
                                onClick={() => this.setState({ selectedTab: "grouped" })}
                                className=" translabeltag  labeltag"
                                style={{ cursor: "pointer", color: "#fff", background: selectedTab === "grouped" ? "#60c1d8" : "#1d6b7d" }}>
                                Supplier wise grouped transaction
                                <span> </span>
                            </span>
                        </span>
                    </div>
                    {selectedTab === "grouped" ?
                        <div style={{ marginTop: 20 }}>
                            {groupedTransactionData ? Object.keys(groupedTransactionData).map((suplierNumber, itemIndex) => (
                                <div key={"expanpan" + suplierNumber}
                                    style={{ width: '98%', marginLeft: '1%', marginTop: itemIndex !== 0 ? "8px" : "" }} >
                                    <ExpansionPanel
                                        expanded={expanded === itemIndex}
                                        // onChange={(event) =>}
                                        onChange={(event) => this.onPanelExpanded(event, itemIndex)}
                                        style={{ width: '100%', borderLeft: itemIndex % 2 === 0 ? "5px solid #434690" : "5px solid #43906e", background: expanded === itemIndex ? "#f7f7f7" : "white" }}>

                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">
                                            <Typography style={{ fontSize: '18px', fontFamily: 'Lato' }} className={classes.heading}>{supplierNameMapping[suplierNumber] ?  supplierNameMapping[suplierNumber] :  suplierNumber}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>

                                            {groupedTransactionData[suplierNumber] && groupedTransactionData[suplierNumber].length > 0 &&
                                                <Table className='table-body'>
                                                    <TableHead style={{ borderLeft: "4px solid #05073a", borderRight: "4px solid #05073a" }}>
                                                        <TableRow   style={{borderBottom: "2px solid #858792"}} >
                                                            {this.state.tableHeadData.map((option, i) => (
                                                                <TableCell 
                                                                key={option} 
                                                                className={this.getTableCellClass(classes, i)} 
                                                                style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '',
                                                                textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                                             }}>{option}</TableCell>
                                                            ))}
                                                            <TableCell  className={this.getTableCellClass(classes, 0)} style={{ minWidth: '120px', paddingLeft:  '' }}></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {groupedTransactionData[suplierNumber].map((row, i) => {
                                                            return (
                                                                //tableHeadData:["id","Supplier Name","Supplier Bussiness Name","Created Time","Amount","Payment mode","Invoice images"],
                                                                <TableRow key={'table_' + i} style={{ background: i % 2 === 0 ? "#e5e8ec" : "#fff", borderLeft: `4px solid ${this.getTransactionTypeColor(row.transaction_type)}`, borderRight: `4px solid ${this.getTransactionTypeColor(row.transaction_type)}` }}>

                                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}  style={{textAlign: "left"}} >
                                                                    {this.checkIfAccountInfoAvaialble( row ) ? <i className="fa fa-info-circle" aria-hidden="true" 
                                                             onClick={(event )=> this.setState({ showTransactionInfoDialog : true , transactionInfoData : row  })}
                                                                            style={{ color: "#e72e89",marginLeft:"10px", cursor: "pointer", height: "18px", fontSize:"22px" }} /> : ""}
                                                                        {this.getStatusOption(this, row)}
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{textAlign: "left"}}>
                                                                    
                                                                   { !row.active && 
                                                                   <i className="fa fa-circle"
                                                                      data-toggle="tooltip" title={row.active ? "Enabled" : "Disabled"} 
                                                                      style={{ color: "#776969", fontSize:"17px" , cursor:"pointer", marginLeft: "-12%"}} 
                                                                      aria-hidden="true"></i>} &nbsp;
                                                                    
                                                                    {row.id ? row.id : "-"}
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{textAlign:"left"}}>
                                                                        {row.supplier_fullname ? row.supplier_fullname : "-"}
                                                                    </TableCell>
                                                                    <TableCell className={this.getTableCellClass(classes, 2)} style={{textAlign:"left"}}>
                                                                        <div className="text-ellpses">
                                                                            {row.supplier_business_name ? row.supplier_business_name : "-"}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className={this.getTableCellClass(classes, 3)}  >
                                                                        {/* <div className="text-ellpses">
                                                                            {row.createdtime ? Utils.formatDateData(row.createdtime.split("T")[0]) : "-"}
                                                                        </div> */}
                                                                          <div className="text-ellpses">
                                                            {row.createdtime ? this.formatDateAndTime(row.createdtime): "-"}
                                                        </div>
                                                                    </TableCell>
                                                                    
                                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                        {row.payment_mode ? row.payment_mode : "-"}
                                                                    </TableCell>
                                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                        {row.transaction_type ? row.transaction_type : "-"}
                                                                    </TableCell>
                                                                    <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: this.getTransactionTypeColor(row.transaction_type) , textAlign:"right"}}>
                                                                    ₹ {row.amount ? Utils.formatNumberWithComma(row.amount) : "-"}
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
                                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                       {getAccessAccordingToRole("editPayment") &&  <EditIcon
                                                                            className="material-Icon"
                                                                            onClick={() => this.handelEditModalOpen(row)}
                                                                            style={{ color: "#e72e89", cursor: "pointer", height: "18px", fontSize:"18px" }} />}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                    
                                                </Table>}
                                            {groupedTransactionData[suplierNumber].length > 0 ? "" :
                                                <div className={classes.defaultTemplate}>
                                                    {<span className={classes.defaultSpan}>
                                                        <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                                                </div>}


                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>)
                            ) : <Loader />}
                        </div>
                        :
                        (allTransactionsData ? <div style={{ margin: 20 }}>
                            {allTransactionsData && allTransactionsData.length > 0 &&
                                <Table className='table-body'>
                                    <TableHead style={{ borderLeft: "4px solid #05073a", borderRight: "4px solid #05073a" }}>
                                        <TableRow  style={{borderBottom: "2px solid #858792"}} >
                                            {this.state.tableHeadData.map((option, i) => (
                                                <TableCell 
                                                key={option} 
                                                className={this.getTableCellClass(classes, i)} 
                                                style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '',
                                                textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                            }}>{option}</TableCell>
                                            ))}
                                             <TableCell className={this.getTableCellClass(classes, 0)} style={{ paddingLeft:  '' }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                          (rowsPerPage > 0
                                            ? allTransactionsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : allTransactionsData
                                          ).map((row, i) => {
                                            return (
                                                //tableHeadData:["id","Supplier Name","Supplier Bussiness Name","Created Time","Amount","Payment mode","Invoice images"],
                                                <TableRow key={'table_' + i} style={{ background: (i % 2 === 0 ? "#e5e8ec" : "#fff"), borderLeft: `4px solid ${this.getTransactionTypeColor(row.transaction_type)}`, borderRight: `4px solid ${this.getTransactionTypeColor(row.transaction_type)}` }}>

                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}  style={{textAlign: "left"}} >

                                                    {this.checkIfAccountInfoAvaialble( row ) ? <i className="fa fa-info-circle" aria-hidden="true" 
                                                             onClick={(event )=> this.setState({ showTransactionInfoDialog : true , transactionInfoData : row  })}
                                                                            style={{ color: "#e72e89",marginLeft:"10px", cursor: "pointer", height: "18px", fontSize:"22px" }} /> : ""}

                                                    {this.getStatusOption(this, row)}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{textAlign: "left"}}>                                                   
                                                    { !row.active && 
                                                                   <i className="fa fa-circle"
                                                                      data-toggle="tooltip" title={row.active ? "Enabled" : "Disabled"} 
                                                                      style={{ color: "#776969", fontSize:"17px" , cursor:"pointer", marginLeft: "-12%"}} 
                                                                      aria-hidden="true"></i>} &nbsp;
                                                                    
                                                        {row.id ? row.id : "-"}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{textAlign: "left"}}>
                                                        {row.supplier_fullname ? row.supplier_fullname : "-"}
                                                    </TableCell>
                                                    <TableCell className={this.getTableCellClass(classes, 2)} style={{textAlign: "left"}}>
                                                        <div className="text-ellpses">
                                                            {row.supplier_business_name ? row.supplier_business_name : "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={this.getTableCellClass(classes, 3)}>
                                                        <div className="text-ellpses">
                                                            {row.createdtime ? this.formatDateAndTime(row.createdtime): "-"}
                                                        </div>
                                                    </TableCell>
                                                    
                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                        {row.payment_mode ? row.payment_mode : "-"}
                                                        {/* <span id="livetransactionId"> <img className="livetransaction" src={transactionIcon} alt="transacionIcon"/></span> */}
                                                    </TableCell>
                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                                        {row.transaction_type ? row.transaction_type : "-"}
                                                                    </TableCell>
                                                    <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: this.getTransactionTypeColor(row.transaction_type) , textAlign: "right"}}>
                                                    ₹ {row.amount ? Utils.formatNumberWithComma(row.amount) : "-"}
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
                                                    <TableCell className={this.getTableCellClass(classes, 4)}>
                                                        { getAccessAccordingToRole("editPayment") &&  <EditIcon
                                                            className="material-Icon"
                                                            onClick={() => this.handelEditModalOpen(row)}
                                                            style={{ color: "#e72e89", cursor: "pointer", height: "18px", fontSize: "18px"  }} />}
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter style={{ borderTop: "2px solid #858792" }}>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    colSpan={5}
                    count={allTransactionsData.length}
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
                            {allTransactionsData && allTransactionsData.length > 0 ? "" :
                                <div className={classes.defaultTemplate}
                                    style={{
                                        marginTop: "20%",
                                        textAlign: "center",
                                        fontSize: "24px"
                                    }}>
                                    {<span className={classes.defaultSpan}>
                                        <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No data available"}</span>}
                                </div>}
                            {/* {!allTransactionsData && <Loader />} */}
                        </div> : <Loader />)
                    }


                </Dialog>
                {this.state.showImageInvoiceModal &&
                    <TransactionInvoiceModal
                        openModal={this.state.showImageInvoiceModal}
                        onInvoiceModalClose={() => { this.setState({ showImageInvoiceModal: false, invoiceModalData: [] }) }}
                        invoiceUrlData={this.state.invoiceModalData} />}

                {showEditTransactionModal && this.state.editableData &&
                    <EditTransactionModal
                        open={showEditTransactionModal}
                        editableTransactionData={this.state.editableData}
                        onTransactionUpdated={(event) => this.setState({ showEditTransactionModal: false, isDataUpdated: true }, function () {
                            this.getTransactionList(this.state.mobileNumber, this.state.transDate);
                        })}
                        onEditModalCancel={(event) => this.setState({ showEditTransactionModal: false })}
                    />}


                    {/* for status change and reason add */}
                    {this.state.showStatusChangeModal &&
                    <SelectTransactionTypeModal
                        openModal={this.state.showStatusChangeModal}
                        rowDataObj={ this.state.statusUpdateObj }
                        onUpdateSuccessFull={ (event) => {this.setState({ showStatusChangeModal: false, statusUpdateObj: {} }); this.handelRefreshModal() }}
                        onStatusUpdateObjClose={() => { this.setState({ showStatusChangeModal: false, statusUpdateObj: {} }) }}
                         />}

             {this.state.showPayoutModal && this.state.payoutData && 
                    <PayoutModal
                        openPayoutModal={this.state.showPayoutModal}
                        onPayoutModalClose={() => { this.setState({ showPayoutModal: false, payoutData: undefined }) }}
                        onPayoutSuccessfull={(event) => this.setState({ showPayoutModal: false, payoutData: undefined }, function () {
                            this.getTransactionList(this.state.mobileNumber, this.state.transDate);
                        })}
                        payoutData={this.state.payoutData} />}

                        {this.state.showTransactionInfoDialog && 
                        <TransactionIfoModal
                            open={ this.state.showTransactionInfoDialog }
                            onTransactionInfoModalClose = {()=> this.setState({ showTransactionInfoDialog : false , transactionInfoData : undefined  })}
                            transactionInfoData={this.state.transactionInfoData}
                        />}

            </div>);

    }
}

ViewTransactionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewTransactionModal);