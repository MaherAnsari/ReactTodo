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
import DateRangeSelector from '../common/DateRangeSelector';
import Fab from '@material-ui/core/Fab';
import paymentService from '../../../app/paymentService/paymentService';
import ViewTransactionModal from './ViewTransactionModal';
import Loader from '../../common/Loader';
import AddTransactionModal from './AddTransactionModal';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Utils from '../../../app/common/utils';
import FileUploader from '../../common/fileUploader';
import BusinessInfoDialog from '../../common/BusinessInfoDialog';

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
        fontSize: '18px',
        marginLeft: '8px',
        color: '#fd0671',
        cursor: 'pointer'
    },
    detailHeadmain: {

        padding: "4px 0px",

        // background: "#05073a"
    },
    inline: {
        display: 'inline',
    },
});


class PaymentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["Buyer Info", "Location", "No. of Transactions - in", "No. of Transactions - out", "Bijak amount in", "Bijak amount out", "Transactions"],
            tableBodyData: [],
            searchedText: "",
            open: false,

            datePayloads: { "startDate": "", "endDate": "" },
            paymentMetaInfo: undefined,
            // [{
            //     "count": "-",
            //     "sum": "-",
            //     "transaction_type":""
            // }],
            showTransactionModal: false,
            showLoader: false,
            defaultData: [],
            buyerInfo: {},
            showAddTransactionModal: false,

            rowsPerPage: 50,
            page: 0,
            showUploader: false,

            showUserInfo: false,
            userInfoData : undefined,
            isLimitUpdate: false


        }
    }

    componentDidMount() {
        var datePayloadsVal = this.state.datePayloads;
        datePayloadsVal["startDate"] = this.formateDateForApi(this.getPreviousDate(7));
        datePayloadsVal["endDate"] = this.formateDateForApi(new Date());
        this.setState({ datePayloads: datePayloadsVal }, function () {
            this.getPaymentInfoDetails(this.state.datePayloads);
        })

    }

    getPreviousDate(PreviousnoOfDays) {
        var date = new Date();
        return (new Date(date.setDate(date.getDate() - PreviousnoOfDays)));
    }

    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" +( dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            return dateVal;
        } else {
            return "";
        }
    }


    getPaymentInfoDetails = async (params) => {
        try {
            this.setState({ showLoader: true })
            let resp = await paymentService.getPaymentDetails(params);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result.data;
                this.setState({
                    defaultData: respData,
                    tableBodyData: respData,
                    paymentMetaInfo: resp.data.result["metainfo"],
                    page: 0
                });
            }
            this.setState({ showLoader: false })
        } catch (err) {
            console.error(err);
            this.setState({ showLoader: false })
        }
    }


    getTableCellClass(classes, index) {
        return classes.tableCell;
    }


    async handelFilter(event) {
        let searchedTxt = event.target.value;
        if (searchedTxt.trim() !== "") {
            this.getPaymentSearchedUser(searchedTxt)
            // var respData = [];
            // let resp = await paymentService.getPaymentSearchedUser(searchedTxt);
            // if (resp.data.status === 1 && resp.data.result) {
            //     respData = resp.data.result.data;
            // }
            // this.setState({ tableBodyData: respData, searchedText: searchedTxt });
        } else {
            this.setState({ tableBodyData: this.state.defaultData, searchedText: searchedTxt });
        }
    }

    async getPaymentSearchedUser(txt) {
        let payload = this.state.datePayloads;
        if (txt.trim() !== "") {
            payload["searchVal"] = txt;
        }
        var respData = [];
        var paymentMeta = [];
        let resp = await paymentService.getPaymentSearchedUser(payload);
        if (resp.data.status === 1 && resp.data.result) {
            respData = resp.data.result.data;

            paymentMeta = resp.data.result["metainfo"]
        }
        this.setState({ tableBodyData: respData, paymentMetaInfo: paymentMeta, searchedText: txt, page: 0 });
    }

    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            this.getPaymentSearchedUser(this.state.searchedText);
        });
    }

    handelShowTransactionModal(row, event) {
        this.setState({ buyerInfo: row, mobileNumber: row["buyer_mobile"] }, function () {
            this.setState({ showTransactionModal: true })
        })
    }

    onTransactionDataAdded(event) {
        this.setState({ showAddTransactionModal: false }, function () {
            this.getPaymentInfoDetails(this.state.datePayloads);
        })
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    async handelDownloadClicked() {
        try {
            var respData = [];
            let resp = await paymentService.getDownlaodAbleData(this.state.datePayloads);
            if (resp.data.status === 1 && resp.data.result) {
                respData = resp.data.result;
            }
            Utils.downloadDataInCSV(respData, "payment_data")
        } catch (err) {
            console.log(err);
            alert("An error occured while downloading the payment data ");
        }
    }

    async handleFileUploader(event) {
        try {
            let resp = await paymentService.uplaodPayment(event);
            if (resp.data.status === 1 && resp.data.result) {
                alert("Data Successfuly Uploaded ");
                this.getPaymentSearchedUser(" ");
                this.setState({ open: false, showUploader: false });
            }

        } catch (err) {
            console.error(err)
            this.setState({ open: false, showUploader: false });
            this.getPaymentSearchedUser(" ");
        }
    }

    onFileModalCancel(event) {
        this.setState({ open: false, showUploader: false });
    }

    handleUploaderClick(event) {
        this.setState({ showUploader: true });
    }

    getPaymentInOutInfo(type, key) {
        let arr = this.state.paymentMetaInfo
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            if (type === obj['transaction_type']) {
                return Utils.formatNumberWithComma(obj[key]);
            }
        }
        return "0";
    }

    handelRefreshData() {
        this.getPaymentInfoDetails(this.state.datePayloads);
    }

    onUserInfoModalCancel(event) {
        this.setState({ showUserInfo : false,  isInfo: false });
        if(this.state.isLimitUpdate){
            this.handelRefreshData();
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

    onInfoClick = (info, event) => {
        this.setState({ showUserInfo : true, userInfoData : JSON.parse(JSON.stringify(info)), isInfo: true });
    }

    render() {
        const { classes } = this.props;
        const { paymentMetaInfo, showLoader, showAddTransactionModal } = this.state;
        const { rowsPerPage, page } = this.state;
        const leftAlignedIndexs = [0, 1, 2];
        const rightAlignedIndexs = [5, 6];
        return (
            <MuiThemeProvider theme={theme}>
                {!showLoader ? <Paper className={classes.root} >
                    <div style={{ display: 'flex' }}>
                        <i onClick={(event) => this.handelRefreshData(event)} style={{ padding: "18px", fontSize: "18px", color: "#50a1cf", cursor: "pointer" }} data-toggle="tooltip" data-html="true" title="Refresh" className="fa fa-refresh" aria-hidden="true"></i>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                        <input
                            type="text"
                            placeholder="Search Buyer..."
                            className="search-input"
                            style={{ width: "82%" }}
                            onChange={this.handelFilter.bind(this)} />
                        <i style={{ marginTop: 22 }} className="fa fa-search"></i>
                    </div>
                    {paymentMetaInfo && <div className={classes.detailHeadmain}>
                        <div style={{ width: "100%", display: "flex" }}>
                            {/* <div style={{ width: "25%", fontSize: 15 ,padding: "28px"}}> */}
                            <List style={{ display: "contents" }}>
                                {/* <ListItem style={{ background: "rgb(46, 50, 71)", borderRadius: "5px" }} >
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
                                </ListItem> */}
                                <ListItem style={{ background: "rgb(46, 50, 71)", marginLeft: "10px", borderRadius: "5px" }} >
                                    <ListItemAvatar>
                                        <Icon style={{ color: "#61cb3e", fontSize: "34px" }}>redo</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={<React.Fragment>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: "rgb(97, 203, 66)", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
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
                                            style={{ color: "rgb(97, 203, 66)", fontFamily: "lato", fontWeight: 600, fontSize: "18px" }}
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
                    {this.state.tableBodyData ? <div><div style={{ maxHeight: "65vh", overflowY: "scroll" }}>
                        <Table className='table-body' stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow style={{ borderBottom: "2px solid #858792" }} >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)}
                                            style={{
                                                minWidth: '120px', paddingLeft: i === 0 ? '5px' : '',
                                                textAlign: leftAlignedIndexs.indexOf(i) > -1 ? "left" : rightAlignedIndexs.indexOf(i) > -1 ? "right" : ""
                                            }}>
                                            {option}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableBodyData &&
                                    (rowsPerPage > 0
                                        ? this.state.tableBodyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : this.state.tableBodyData
                                    ).map((row, i) => {
                                        return (
                                            // ["Buyer Name","Buyer Mobile","Location","Amount","No. of Transactions", "Transactions"],
                                            <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>

                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{ textAlign: "left" }}>
                                                    {/* {row.buyer_fullname ? row.buyer_fullname : "-"} */}
                                                    {/* </TableCell>
                                                <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)} style={{ textAlign:"left" }}> */}
                                                    {/* {row.buyer_mobile ? row.buyer_mobile : "-"} */}

                                                    <div className=" name-span" style={{ display: "grid", textAlign: "left", textTransform: "capitalize" , cursor: "pointer"}} 
                                                        onClick={this.onInfoClick.bind(this, row)}>
                                                        <span>{row.buyer_fullname}</span>
                                                        <span style={{ fontSize: "12px" }}>{"( " + row.buyer_mobile + " )"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 2)} style={{ textAlign: "left", textTransform: "capitalize" }}>
                                                    <div className="text-ellpses">
                                                        {row.buyer_locality ? row.buyer_locality + " , " : ""}
                                                        {row.buyer_district ? row.buyer_district + " , " : ""}
                                                        {row.buyer_state ? row.buyer_state : ""}
                                                    </div>
                                                </TableCell>

                                                <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: "#387a39" }}>
                                                    {row.b_in ? Utils.formatNumberWithComma(row.b_in) : "0"}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 4)} style={{ color: "#f91010" }}>
                                                    {row.b_out ? Utils.formatNumberWithComma(row.b_out) : "0"}
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 3)} style={{ color: "#387a39", textAlign: "right" }}>
                                                    <div className="text-ellpses">
                                                        ₹ {row.b_in_amount ? Utils.formatNumberWithComma(row.b_in_amount) : "0"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 3)} style={{ color: "#f91010", textAlign: "right" }}>
                                                    <div className="text-ellpses">
                                                        ₹ {row.b_out_amount ? Utils.formatNumberWithComma(row.b_out_amount) : "0"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={this.getTableCellClass(classes, 4)}>
                                                    <Fab
                                                        variant="extended"
                                                        size="small"
                                                        aria-label="add"
                                                        onClick={this.handelShowTransactionModal.bind(this, row)}
                                                        style={{ textTransform: "none", background: "#05073a", color: "#ffffff", padding: "0 35px" }}
                                                    >
                                                        View
                                                </Fab>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                            
                        </Table>
                        {this.state.tableBodyData.length > 0 ? "" :
                            <div className={classes.defaultTemplate}>
                                {this.state.searchedText.length > 0 ?
                                    <span className={classes.defaultSpan}>
                                        <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
                                        {"Your serach does not match any list"} </span> :
                                    <span className={classes.defaultSpan}>
                                        <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                            </div>}
                    </div>
                    {this.state.tableBodyData.length > 0 &&  <Table>
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
                    </Table>}
                    </div> :
                        <div style={{ paddingTop: "14%" }} >
                            <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-search-plus"} aria-hidden="true"></i>{"Search from above to check specific Orders"}</span>
                        </div>
                        }
                    {this.state.showTransactionModal &&
                            <ViewTransactionModal
                                open={this.state.showTransactionModal}
                                onTransactionModalClose={() => this.setState({ showTransactionModal: false })}
                                buyerInfo={this.state.buyerInfo}
                                transDate={this.state.datePayloads}
                                onTransactionEdited={() => this.getPaymentInfoDetails(this.state.datePayloads)}
                                mobileNumber={this.state.mobileNumber} />
                        }

                </Paper> : <Loader />}

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
                    <div className="updateBtndef">
                        <div
                            className="updateBtnFixed"
                            style={{ display: 'flex' }}
                            onClick={(event) => this.setState({ showAddTransactionModal: true })}
                        >
                            <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p>Add Transaction</p></div>
                    </div>
                    {/* <div className="updateBtndef" style={{ right: "205px" }} data-toggle="tooltip" data-html="true" title="Download" >
                        <div className="updateBtnFixed" style={{ display: 'flex', background: "#e72e89", borderRadius: "6px" }} onClick={this.handelDownloadClicked.bind(this)}>
                            <i className="fa fa-cloud-download add-icon" style={{ marginRight: 0, color: "white" }} aria-hidden="true"></i>
                        </div>
                    </div> */}
                    {showAddTransactionModal &&
                        <AddTransactionModal
                            open={showAddTransactionModal}
                            onTransactionAdded={(event) => this.onTransactionDataAdded(event)}
                            onEditModalCancel={(event) => this.setState({ showAddTransactionModal: false })}
                        />}

                    {this.state.showUploader ? <FileUploader openModal={this.state.showUploader}
                        onEditModalClosed={this.handleFileUploader.bind(this)}
                        //  commodityList={ this.state.commodityList}
                        onEditModalCancel={this.onFileModalCancel.bind(this)}
                    />
                        : ""}

                    {this.state.showUserInfo ? 
                        <BusinessInfoDialog 
                            openModal={this.state.showUserInfo}
                            onEditModalClosed={this.handleUserInfoClose.bind(this)}
                            data={this.state.userInfoData}
                            isInfo={true}
                            userId={ this.state.userInfoData["buyer_mobile"]}
                            onLimitUpdate= {this.changeLimitSucces.bind(this)}
                            onEditModalCancel={this.onUserInfoModalCancel.bind(this)} /> : ""}

            </MuiThemeProvider>
        );
            }
        }
        
PaymentComponent.propTypes = {
                    classes: PropTypes.object.isRequired,
            };
            
export default withStyles(styles)(PaymentComponent);