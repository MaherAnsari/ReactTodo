import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import paymentService from '../../../app/paymentService/paymentService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import Loader from '../../common/Loader';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import 'date-fns';
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
import AccountBalanceWalletSharpIcon from '@material-ui/icons/AccountBalanceWalletSharp';
import SelectTransactionTypeModal from '../../payment/common/SelectTransactionTypeModal';
import EditTransactionModal from '../../payment/common/EditTransactionModal';
import PayoutModal from '../../payment/common/PayoutModal';
import TransactionInvoiceModal from '../../payment/components/TransactionInvoiceModal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import BusinessInfoDialog from '../../common/BusinessInfoDialog';
import TransactionIfoModal from '../../payment/common/TransactionIfoModal';
import DateRangeSelector from './DateRangeSelector';

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
                paddingRight: '270px'
            }
        },
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
        padding:"8px",
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
    inline: {
        display: 'inline',
    },
    detailHeadmain: {
        padding: "4px 0px",
    },
    defaultTemplate: { 
        height: '30vh', 
        paddingTop: '10vh'
     },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const statusOption = ["approved", "failed"];


class TodaysPaymentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allTransactionsData: undefined,
            tableHeadData: ["status","id", "Supplier Name", "Supplier Bussiness Name", "Created Time",  "Payment mode","Payment type","Amount", "Supporting images"],
            invoiceModalData: [],
            showImageInvoiceModal: false,
            editableData: undefined,
            showEditTransactionModal: false,
            isDataUpdated: false,
            
            rowsPerPage: 50,
            page: 0,

            statusUpdateObj:{},
            showStatusChangeModal: false,

            showPayoutModal: false,
            payoutData: undefined,

            showUserInfo: false,
            userInfoData : undefined,
            isLimitUpdate: false,

            showTransactionInfoDialog: false,
            transactionInfoData : undefined,
            datePayloads: { "startDate": "" },
        }
    }

    componentDidMount() {
        // this.getTodaysTransactionList( this.state.datePayloads );
    }

    getTodaysTransactionList = async ( datePayloads ) => {
        try {
            let resp = await paymentService.getTodaysPaymentDataApi( datePayloads );
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({
                    allTransactionsData: respData["allTransactions"],
                    paymentMetaInfo : respData["metainfo"],
                    page: 0
                });
            } else {
                this.setState({
                    allTransactionsData: [],
                });
            }
        } catch (err) {
            console.error(err);
        }
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
            allTransactionsData: undefined}, function(){
                this.getTodaysTransactionList( this.state.datePayloads );
            });
      }
    

      handelStatusOptionClick( row, event ){
            this.setState({ showStatusChangeModal : true, statusUpdateObj: row });
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
                    onClick={( event )=> this.setState({ showPayoutModal : true, payoutData : row })}
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

    getPaymentInOutInfo(type, key) {
        let arr = this.state.paymentMetaInfo
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            if (type == obj['transaction_type']) {
                return Utils.formatNumberWithComma(obj[key]);
            }
        }
        return "0";
    }

    
    onUserInfoModalCancel(event) {
        this.setState({ showUserInfo : false,  isInfo: false });
        if(this.state.isLimitUpdate){
            this.getTodaysTransactionList( this.state.datePayloads );
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

    onUserInfoClicked = (info, event) => {
        this.setState({ showUserInfo : true, userInfoData : JSON.parse(JSON.stringify(info)), isInfo: true });
    }

    handelRefreshData(){
        this.handelRefreshModal();
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
             data["status"] === "payout_processing") &&
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
    }

    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            this.getTodaysTransactionList( data );
        });
    }

    render() {
        const { classes } = this.props;
        const { paymentMetaInfo, allTransactionsData,showEditTransactionModal, rowsPerPage, page  } = this.state;
        const leftAlignedIndexs = [0,1, 2,3];
        const rightAlignedIndexs = [7];
        return (
            
            <div>
                <MuiThemeProvider theme={theme}>

                    <div>
                    <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                    </div>
           
           {paymentMetaInfo && <div className={classes.detailHeadmain}>
                        <div style={{ width: "100%", display: "flex" }}>
                        <i 
                            onClick={(event) => this.handelRefreshData(event)} 
                            style={{ padding: "12px",lineHeight: "50px", fontSize: "18px", color: "#50a1cf", cursor: "pointer" }} 
                            data-toggle="tooltip" 
                            data-html="true" 
                            title="Refresh" 
                            className="fa fa-refresh" 
                            aria-hidden="true"></i>
                            <List style={{ display: "contents" }}>
                                <ListItem style={{ background: "rgb(46, 50, 71)", borderRadius: "5px" }} >
                                    <ListItemAvatar>
                                        <Icon style={{ color: "#5ab8cf", fontSize: "34px" }} >youtube_searched_for</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={<React.Fragment>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: "rgb(97, 203, 66)", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
                                        >
                                            ₹ {this.getPaymentInOutInfo('b_in', 'sum')}
                                        </Typography>
                                    </React.Fragment>
                                    } secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                style={{ color: "#afb1b9", fontFamily: "lato", fontWeight: 500, fontSize: "14px" }}
                                            >
                                                Total in amount
                                            </Typography>
                                        </React.Fragment>
                                    } />
                                </ListItem>
                                <ListItem style={{ background: "rgb(46, 50, 71)", marginLeft: "10px", borderRadius: "5px" }} >
                                    <ListItemAvatar>
                                        <Icon style={{ color: "#f9e646", fontSize: "34px" }}>playlist_add_check</Icon>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<React.Fragment>
                                            <Typography
                                                component="div"
                                                variant="body2"
                                                className={classes.inline}
                                                style={{ color: "rgb(97, 203, 66)", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
                                            >
                                                {this.getPaymentInOutInfo('b_in', 'count')}
                                            </Typography>
                                        </React.Fragment>
                                        } secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    style={{ color: "#afb1b9", fontFamily: "lato", fontWeight: 500, fontSize: "14px" }}
                                                >
                                                    Total no. of in payment
                                        </Typography>
                                            </React.Fragment>
                                        } />
                                </ListItem>
                                <ListItem style={{ background: "rgb(46, 50, 71)", marginLeft: "10px", borderRadius: "5px" }} >
                                    <ListItemAvatar>
                                        <Icon style={{ color: "#61cb3e", fontSize: "34px" }}>redo</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={<React.Fragment>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: "#e6343a", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
                                        >
                                            ₹ {this.getPaymentInOutInfo('b_out', 'sum')}
                                        </Typography>
                                    </React.Fragment>
                                    } secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                style={{ color: "#afb1b9", fontFamily: "lato", fontWeight: 500, fontSize: "14px" }}
                                            >
                                                Total out amount
                                        </Typography>
                                        </React.Fragment>
                                    } />
                                </ListItem>
                                <ListItem style={{ background: "rgb(46, 50, 71)", marginLeft: "10px", borderRadius: "5px" }} >
                                    <ListItemAvatar>
                                        <Icon style={{ color: "#50a1cf", fontSize: "34px" }}>low_priority</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={<React.Fragment>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: "#e6343a", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
                                        >
                                            {this.getPaymentInOutInfo('b_out', 'count')}
                                        </Typography>
                                    </React.Fragment>
                                    } secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                style={{ color: "#afb1b9", fontFamily: "lato", fontWeight: 500, fontSize: "14px" }}
                                            >
                                                Total no. of out payment
                                        </Typography>
                                        </React.Fragment>
                                    } />
                                </ListItem>
                            </List>

                        </div>
                    </div>}
                        {allTransactionsData ? <div style={{ marginTop : 14,maxHeight: "65vh", overflowY: "scroll" }}>
                            {allTransactionsData && allTransactionsData.length > 0 &&
                                <Table  className='table-body' stickyHeader aria-label="sticky table">
                                    <TableHead style={{ borderLeft: "4px solid #05073a", borderRight: "4px solid #05073a" }}>
                                        <TableRow  style={{borderBottom: "2px solid #858792"}} >
                                            {this.state.tableHeadData.map((option, i) => (
                                                <TableCell 
                                                key={option} 
                                                className={classes.tableCell} 
                                                style={{ width:(option === "id" ? "70px":""), minWidth: (option === "id" ? "70px":"120px"), paddingLeft: i === 0 ? '22px' : '',
                                                textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                            }}>{option}</TableCell>
                                            ))}
                                             <TableCell className={classes.tableCell} style={{ paddingLeft:  '' }}></TableCell>
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

                                                    <TableCell component="th" scope="row" className={classes.tableCell}  style={{textAlign: "left"}} >
                                                   <div>
                                                        {this.checkIfAccountInfoAvaialble( row ) ? <i className="fa fa-info-circle" aria-hidden="true" 
                                                             onClick={(event )=> this.setState({ showTransactionInfoDialog : true , transactionInfoData : row  })}
                                                                            style={{ color: "#e72e89",marginRight:"10px", cursor: "pointer", height: "18px", fontSize:"22px" }} /> : ""}
                                                    {this.getStatusOption(this, row)}
                                                    </div>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className={classes.tableCell} style={{textAlign: "left"}}>                                                   
                                                    { !row.active && 
                                                                   <i className="fa fa-circle"
                                                                      data-toggle="tooltip" title={row.active ? "Enabled" : "Disabled"} 
                                                                      style={{ color: "#776969", fontSize:"17px" , cursor:"pointer", marginLeft: "-12%"}} 
                                                                      aria-hidden="true"></i>} &nbsp;
                                                                    
                                                        {row.id ? row.id : "-"}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className={classes.tableCell} style={{textAlign: "left", cursor: "pointer"}}
                                                    onClick={this.onUserInfoClicked.bind(this, row)}>
                                                        <div className=" name-span">
                                                        {row.supplier_fullname ? row.supplier_fullname : "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} style={{textAlign: "left"}}>
                                                        <div className="text-ellpses">
                                                            {row.supplier_business_name ? row.supplier_business_name : "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        <div className="text-ellpses">
                                                            {/* {row.createdtime ? Utils.formatDateData(row.createdtime.split("T")[0]) : "-"} */}
                                                            {row.createdtime ? this.formatDateAndTime(row.createdtime): "-"}
                                                        </div>
                                                    </TableCell>
                                                    
                                                    <TableCell className={classes.tableCell}>
                                                        {row.payment_mode ? row.payment_mode : "-"}
                                                        {/* <span id="livetransactionId"> <img className="livetransaction" src={transactionIcon} alt="transacionIcon"/></span> */}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                                        {row.transaction_type ? row.transaction_type : "-"}
                                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} style={{ color: this.getTransactionTypeColor(row.transaction_type) , textAlign: "right"}}>
                                                    ₹ {row.amount ? Utils.formatNumberWithComma(row.amount) : "-"}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>

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
                                                    <TableCell className={classes.tableCell}>
                                                        <EditIcon
                                                            className="material-Icon"
                                                            onClick={() => this.handelEditModalOpen(row)}
                                                            style={{ color: "#e72e89", cursor: "pointer", height: "18px", fontSize: "18px"  }} />
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                 
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
                        </div> : <Loader />}
                        {allTransactionsData && allTransactionsData.length > 0 &&
                                <Table>  
                                    <TableFooter style={{ borderTop: "2px solid #858792" }}>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    colSpan={1}
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
                            this.getTodaysTransactionList();
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
                            this.getTodaysTransactionList();
                        })}
                        payoutData={this.state.payoutData} />}

                                {this.state.showUserInfo ? 
                        <BusinessInfoDialog 
                            openModal={this.state.showUserInfo}
                            onEditModalClosed={this.handleUserInfoClose.bind(this)}
                            data={this.state.userInfoData}
                            isInfo={true}
                            userId={ this.state.userInfoData["supplier_mobile"]}
                            onLimitUpdate= {this.changeLimitSucces.bind(this)}
                            onEditModalCancel={this.onUserInfoModalCancel.bind(this)} /> : ""}

                    {this.state.showTransactionInfoDialog && 
                        <TransactionIfoModal
                            open={ this.state.showTransactionInfoDialog }
                            onTransactionInfoModalClose = {()=> this.setState({ showTransactionInfoDialog : false , transactionInfoData : undefined  })}
                            transactionInfoData={this.state.transactionInfoData}
                        />}
                        </MuiThemeProvider>
            </div>);

    }
}

TodaysPaymentTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TodaysPaymentTable);