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
import SerachFilter from '../common/SerachFilter';
import DateRangeSelector from '../common/DateRangeSelector';
import Fab from '@material-ui/core/Fab';
import buyerService from '../../../app/buyerService/buyerService';
import paymentService from '../../../app/paymentService/paymentService';
import ViewTransactionModal from './ViewTransactionModal';
import Loader from '../../common/Loader';


const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px !important',
                fontFamily: 'lato !important',
                textTransform: 'uppercase'

            },
            body: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500,
                fontSize: '14px !important',
                fontFamily: 'lato !important',
                lineHeight: '1.5em',
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
        display: "flex",
        color: "white",
        padding: "5px",
        fontSize: "18px",
        background: "#05073a"
    }
});


class PaymentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["Buyer Name", "Buyer Mobile", "Location", "Amount", "No. of Transactions", "Transactions"],
            tableBodyData: [],
            rawTableBodyData: [],
            searchedText: "",
            editableData: {},
            showServerDialog: false,
            showOptionModal: false,
            anchorEl: null,
            showUserModal: false,
            open: false,
            userData: {},
            userId: null,
            payload: null,
            showAddModal: false,
            infoData: null,
            open: false,

            buyersList: this.props.buyersList,
            datePayloads: { "startDate": "", "endDate": "" },
            paymentMetaInfo: {
                "count": "-",
                "sum": "-"
            },
            showTransactionModal: false,
            showLoader: false,
            defaultData: []

        }
    }

    componentDidMount() {
        this.getBuyersList();
        this.getPaymentInfoDetails(this.state.datePayloads);
    }



    componentWillReceiveProps(nextprops) {

        if (this.state.tableBodyData !== nextprops.payoutData) {
            this.setState({ tableBodyData: nextprops.payoutData });
        }
    }

    getPaymentInfoDetails = async (params) => {
        try {
            this.setState({ showLoader: true })
            let resp = await paymentService.getPaymentDetails(params);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result.data;
                this.setState({ defaultData: respData, tableBodyData: respData, paymentMetaInfo: resp.data.result["metainfo"] });
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

    onModalCancel(event) {
        this.setState({ showAddModal: false, infoData: null, open: false })
    }

    async handelFilter(event) {
        let searchedTxt = event.target.value;
        console.log(searchedTxt)
        if (searchedTxt.trim() !== "") {
            var respData = [];
            let resp = await paymentService.getPaymentSearchedUser(searchedTxt);
            if (resp.data.status === 1 && resp.data.result) {
                respData = resp.data.result.data;
            }
            this.setState({ tableBodyData: respData, searchedText: searchedTxt });
        } else {
            this.setState({ tableBodyData: this.state.defaultData, searchedText: searchedTxt });
        }
    }

    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            // this.getPaymentInfoDetails( data );
        });
    }

    getBuyersList = async (payload) => {
        try {
            let resp = await buyerService.serchUser();

            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result.data;
                this.setState({ buyersList: respData });
            }
        } catch (err) {
            console.error(err);
        }
    }

    handelShowTransactionModal(row, event) {
        this.setState({ mobileNumber: row["buyer_mobile"] }, function () {
            this.setState({ showTransactionModal: true })
        })
    }

    render() {
        const { classes } = this.props;
        const { paymentMetaInfo, showLoader } = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                {!showLoader ? <Paper className={classes.root} >
                    <div style={{ display: 'flex' }}>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                        <input
                            type="text"
                            placeholder="Search Buyer..."
                            className="search-input"
                            onChange={this.handelFilter.bind(this)} />
                        <i style={{ marginTop: 22 }} className="fa fa-search"></i>
                    </div>
                    <div className={classes.detailHeadmain}>
                        <div style={{ width: "50%", fontSize: 15 }}> Total amount - <span style={{
                            fontWeight: 600,
                            fontSize: 16, color: "#e72e89"
                        }}>{paymentMetaInfo["sum"] ? paymentMetaInfo["sum"] : "0"}</span></div>
                        <div style={{ width: "50%", fontSize: 15 }}> Total no of payment - <span style={{
                            fontWeight: 600,
                            fontSize: 16, color: "#e72e89"
                        }}>{paymentMetaInfo["count"] ? paymentMetaInfo["count"] : "0"}</span></div>
                    </div>
                    {this.state.tableBodyData ? <div >
                        <Table className='table-body'>
                            <TableHead>
                                <TableRow  >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '120px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableBodyData && this.state.tableBodyData.map((row, i) => {
                                    return (
                                        // ["Buyer Name","Buyer Mobile","Location","Amount","No. of Transactions", "Transactions"],
                                        <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>

                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                {row.buyer_fullname ? row.buyer_fullname : "-"}
                                            </TableCell>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                {row.buyer_mobile ? row.buyer_mobile : "-"}
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 2)}>
                                                <div className="text-ellpses">
                                                    {row.buyer_locality ? row.buyer_locality + "," : ""}
                                                    {row.buyer_district ? row.buyer_district + "," : ""}
                                                    {row.buyer_state ? row.buyer_state : ""}
                                                </div>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 3)}>
                                                <div className="text-ellpses">
                                                    {row.sum ? row.sum : "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 4)}>
                                                {row.count ? row.count : "-"}
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
                            mobileNumber={this.state.mobileNumber} />
                    }

                </Paper> : <Loader />}


            </MuiThemeProvider>
        );
    }
}

PaymentComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaymentComponent);