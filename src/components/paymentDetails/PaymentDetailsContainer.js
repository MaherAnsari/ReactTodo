import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./components/FilterListComponent";
import buyerService from './../../app/buyerService/buyerService';
import supplierService from './../../app/supplierService/supplierService';
// import OrderListTable from "./components/OrderListTable";
import DateRangeSelector from "./components/DateRangeSelector";
import paymentDetailsService from '../../app/paymentDetailsService/paymentDetailsService';
import PaymentDetailsTable from './components/PaymentDetailsTable';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import PaymentFilterOptionModal from '../common/PaymentFilterOptionModal';
import { getAccessAccordingToRole } from '../../config/appConfig';
import AddTransactionModal from '../payment/components/AddTransactionModal';


const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px',
        minHeight: '80vh',
    },
    card: {
        maxWidth: '100%',
        marginTop: '15px',
        height: '97%',
    },
    heading: {
        marginTop: '15px',
        fontSize: '20px',
        alignTtems: 'center',
        display: '-webkit-inline-box'
    }
});



class PaymentDetailsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buyersList: [],
            brokersList: [],
            suppliersList: [],
            allTransactionsData: [],
            showLoader: false,
            datePayloads: { "startDate": "", "endDate": "" },
            params: {
                limit: 1000, // total amount of data 
                offset: 0 // data from which data needs to be get
            },
            totalDataCount: 0,

            showPaymentFilterOption: false,
            filterDataArray: [],
            transactionTypeArray: [],
            additionalFilter: {},


            showAddTransactionModal: false,
            paymentMetaInfo: undefined,
            isTableDataLoading: false

        }
        this.ismounted = true;
    }

    componentDidMount() {
        this.getBuyersList();
        // this.getBrokersList();
        this.getSuppliersList();
    }

    async getBuyersList() {
        try {
            let resp = await buyerService.getBuyerList();
            if (this.ismounted) {
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ buyersList: this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile") });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    // async getBrokersList() {
    //     try {
    //         let resp = await brokerService.getBrokerList();
    //         if (this.ismounted) {
    //             if (resp.data.status === 1 && resp.data.result) {
    //                 this.setState({ brokersList: this.formatDataForDropDown(resp.data.result.data, "fullname", "id") });
    //             }
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    async getSuppliersList() {
        try {
            let resp = await supplierService.getSupplierList();
            if (this.ismounted) {
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ suppliersList: this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile") });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    formatDataForDropDown(data, labelKey, valuekey) {

        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                // optionsData.push({ label: data[i][labelKey] + " (" + data[i][valuekey] + " )", value: data[i][valuekey] });
                optionsData.push({ label: data[i]["fullname"] + ",  " + data[i]["business_name"] + " \n  (" + data[i]["locality"] + " , " + data[i][valuekey] + " )", value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    async getPaymentDetailsData(params) {
        if (!params.hasOwnProperty("limit")) {
            params["limit"] = this.state.params["limit"];
        }
        if (!params.hasOwnProperty("offset")) {
            params["offset"] = this.state.params["offset"];
        }

        if (this.state.filterDataArray.length > 0) {
            params["filter_status"] = this.state.filterDataArray.toString();
        } else {
            if (params.hasOwnProperty("filter_status")) {
                delete params["filter_status"];
            }
        }

        if (this.state.transactionTypeArray.length > 0) {
            params["filter_transaction_type"] = this.state.transactionTypeArray.toString();
        } else {
            if (params.hasOwnProperty("filter_transaction_type")) {
                delete params["filter_transaction_type"];
            }
        }


        this.setState({ params: params });
        // { "startDate": "", "endDate": "" }
        if (this.state.datePayloads["startDate"] !== "") {
            params["startDate"] = this.state.datePayloads["startDate"];
        }
        if (this.state.datePayloads["endDate"] !== "") {
            params["endDate"] = this.state.datePayloads["endDate"];
        }
        // params["supplierid"] = "9953368723";
        let updatedParams = { ...params, ...this.state.additionalFilter };
        try {
            let resp = await paymentDetailsService.getPaymentDetails(updatedParams);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                console.log(respData)
                this.setState({
                    allTransactionsData: this.state.allTransactionsData.concat(respData["allTransactions"]),
                    totalDataCount: respData.totalCount && respData.totalCount[0] && respData.totalCount[0]["count"] ? parseInt(respData.totalCount[0]["count"], 10) : 0,
                    paymentMetaInfo: respData["metainfo"],
                    showLoader: false,
                    isTableDataLoading: false
                });
            } else {
                this.setState({
                    allTransactionsData: [],
                    totalDataCount: 0,
                    paymentMetaInfo: [],
                    showLoader: false,
                    isTableDataLoading: false
                });
            }

        } catch (err) {
            console.error(err);
            if (this.ismounted) { this.setState({ allTransactionsData: [], totalDataCount: 0, showLoader: false, isTableDataLoading: false }); }
        }
    }

    componentWillUnmount() {
        this.ismounted = false;
    }

    // this function brings default selected date from the DateRangeSelection and call the Api 
    //when first Landed on this page
    onDefaultDateFromDateRangeShown(data) {
        this.setState({ datePayloads: data }, function () {
            this.handelGetData(this.state.params);
        });
    }

    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            // this.getPaymentDetailsData(this.state.params);
        });
    }

    handelRefreshData() {
        this.handelGetData(this.state.params);
    }

    onTransactionDataAdded(event) {
        this.setState({ showAddTransactionModal: false }, function () {
            this.handelGetData(this.state.params);
        })
    }

    resetOffsetAndGetData() {
        let paramsval = this.state.params;
        paramsval["offset"] = paramsval["offset"] + 1000;
        this.setState({ params: paramsval, isTableDataLoading: true }, function () {
            this.getPaymentDetailsData(paramsval);
        })
    }

    handelGetData(param) {
        param["offset"] = 0;
        param["limit"] = 1000;
        this.setState({ allTransactionsData: [], resetPageNumber: true, showLoader: true }, () =>
            this.getPaymentDetailsData(param)
        )
    }

    render() {
        const { classes } = this.props;
        const { allTransactionsData, paymentMetaInfo, showPaymentFilterOption, filterDataArray,
            transactionTypeArray,additionalFilter, showAddTransactionModal } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div style={{ display: "flex" }}>
                        <i onClick={(event) => {
                            this.setState({
                                filterDataArray: [],
                                transactionTypeArray: [],
                                additionalFilter:{}
                            }, () => this.handelRefreshData(event))
                        }} style={{ padding: "18px", fontSize: "18px", color: "#50a1cf", cursor: "pointer" }} data-toggle="tooltip" data-html="true" title="Refresh" className="fa fa-refresh" aria-hidden="true"></i>
                        <DateRangeSelector
                            onDateChanged={this.onDateChaged.bind(this)}
                            onDefaultDateFromDateRangeShown={this.onDefaultDateFromDateRangeShown.bind(this)} />

                        <div style={{ padding: "15px 15px 15px 0px" }}>
                            <Badge
                                className={classes.margin} style={{ height: '25px' }}
                                badgeContent={filterDataArray.length + transactionTypeArray.length + Object.keys(additionalFilter).length} color="primary">
                                <Button
                                    component="span"
                                    style={{ padding: '5px 10px', fontSize: 12, color: '#b1b1b1', margin: '0px 5px' }}
                                    onClick={() => this.setState({ showPaymentFilterOption: true })}>
                                    Filter
                                </Button>
                            </Badge>
                        </div>
                    </div>

                    <FilterListComponent
                        buyersList={this.state.buyersList}
                        // brokersList={this.state.brokersList}
                        suppliersList={this.state.suppliersList}
                        getPaymentDetailsData={this.handelGetData.bind(this)} />




                    {this.state.showLoader &&
                        <Loader />}
                    <PaymentDetailsTable
                        allTransactionsData={allTransactionsData}
                        paymentMetaInfo={paymentMetaInfo}
                        OnPaymentUpdated={() => this.handelGetData({})}

                        resetOffsetAndGetData={() => this.resetOffsetAndGetData()}
                        currentOffset={this.state.params["offset"]}
                        resetPageNumber={this.state.resetPageNumber}
                        showLoader={this.state.showLoader}
                        setPageNumber={() => this.setState({ resetPageNumber: false })}
                        totalDataCount={this.state.totalDataCount}
                        isTableDataLoading={this.state.isTableDataLoading}

                    />

                    {showPaymentFilterOption &&
                        <PaymentFilterOptionModal
                            openModal={showPaymentFilterOption}
                            filterDataArr={filterDataArray}
                            transactionTypeArray={transactionTypeArray}
                            additionalFilter={additionalFilter}
                            onEditModalCancel={(event) => this.setState({ showPaymentFilterOption: false })}
                            onFilterAdded={(data) => this.setState({
                                filterDataArray: data["paymentType"],
                                transactionTypeArray: data["transactionType"],
                                additionalFilter: data["additionalFilter"],
                                showPaymentFilterOption: false
                            })} />}

                    <div className="updateBtndef">
                        {getAccessAccordingToRole("addPayment") &&
                            <div
                                className="updateBtnFixed"
                                style={{ display: 'flex' }}
                                onClick={(event) => this.setState({ showAddTransactionModal: true })}>
                                <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                                <p>Add Payment</p></div>}
                    </div>

                    {showAddTransactionModal &&
                        <AddTransactionModal
                            open={showAddTransactionModal}
                            onTransactionAdded={(event) => this.onTransactionDataAdded(event)}
                            onEditModalCancel={(event) => this.setState({ showAddTransactionModal: false })}
                        />}

                </Paper>
            </div>
        );
    }
}
PaymentDetailsContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PaymentDetailsContainer);