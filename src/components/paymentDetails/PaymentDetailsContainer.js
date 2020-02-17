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
import DownloadModalPayment from '../common/DownloadModalPayment';



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
            orderedListData: undefined,
            showLoader: false,
            datePayloads: { "startDate": "", "endDate": "" },
            params: {},

            showPaymentFilterOption: false,
            filterDataArray: [],
            transactionTypeArray: [],


            showAddTransactionModal: false,
            showDownloadModal: false

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
        this.setState({ params: params });
        // { "startDate": "", "endDate": "" }
        if (this.state.datePayloads["startDate"] !== "") {
            params["startDate"] = this.state.datePayloads["startDate"];
        }
        if (this.state.datePayloads["endDate"] !== "") {
            params["endDate"] = this.state.datePayloads["endDate"];
        }
        // params["supplierid"] = "9953368723";
        this.setState({ showLoader: true });
        try {
            let resp = await paymentDetailsService.getPaymentDetails(params);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({
                    allTransactionsData: respData["allTransactions"],
                    paymentMetaInfo: respData["metainfo"],
                    showLoader: false
                });
            } else {
                this.setState({
                    allTransactionsData: [],
                    showLoader: false
                });
            }

        } catch (err) {
            console.error(err);
            if (this.ismounted) { this.setState({ orderedListData: [], showLoader: false }); }
        }
    }

    componentWillUnmount() {
        this.ismounted = false;
    }

    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            this.getPaymentDetailsData(this.state.params);
        });
    }

    handelRefreshData() {
        this.getPaymentDetailsData(this.state.params);
    }

    onTransactionDataAdded(event) {
        this.setState({ showAddTransactionModal: false }, function () {
            this.getPaymentDetailsData(this.state.params);
        })
    }

    render() {
        const { classes } = this.props;
        const { allTransactionsData, paymentMetaInfo, showPaymentFilterOption, filterDataArray,
            transactionTypeArray, showAddTransactionModal, showDownloadModal } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div style={{ display: "flex" }}>
                        <i onClick={(event) => this.handelRefreshData(event)} style={{ padding: "18px", fontSize: "18px", color: "#50a1cf", cursor: "pointer" }} data-toggle="tooltip" data-html="true" title="Refresh" className="fa fa-refresh" aria-hidden="true"></i>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                        <div style={{ padding: "15px 15px 15px 0px" }}>
                            <Badge className={classes.margin} style={{ height: '25px' }}
                                badgeContent={filterDataArray.length + transactionTypeArray.length} color="primary">
                                <Button component="span" style={{ padding: '5px 10px', fontSize: 12, color: '#b1b1b1', margin: '0px 5px' }}
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
                        getPaymentDetailsData={this.getPaymentDetailsData.bind(this)} />




                    {this.state.showLoader ?
                        <Loader /> :
                        <PaymentDetailsTable
                            allTransactionsData={allTransactionsData}
                            paymentMetaInfo={paymentMetaInfo}
                            filterDataArray={filterDataArray}
                            transactionTypeArray={transactionTypeArray}
                            OnPaymentUpdated={() => this.getPaymentDetailsData({})} />}

                    {showPaymentFilterOption &&
                        <PaymentFilterOptionModal
                            openModal={showPaymentFilterOption}
                            filterDataArr={filterDataArray}
                            transactionTypeArray={transactionTypeArray}
                            onEditModalCancel={(event) => this.setState({ showPaymentFilterOption: false })}
                            onFilterAdded={(data) => this.setState({
                                filterDataArray: data["paymentType"],
                                transactionTypeArray: data["transactionType"],
                                showPaymentFilterOption: false
                            })} />}

                    {/* DownloadModalPayment */}
                    {showDownloadModal &&
                        <DownloadModalPayment
                            open={showDownloadModal}
                            onDownLoadModalCancelled={() => this.setState({ showDownloadModal: false })}
                            allTransactionsData={allTransactionsData} />}


                    <div className="updateBtndef">
                        <div className="updateBtnFixed"
                            style={{ right:"192px", display: 'flex', background: "#e72e89", borderRadius: "6px" }}
                            onClick={() => this.setState({ showDownloadModal: true })}>
                            <i className="fa fa-cloud-download add-icon" style={{ marginRight: 0, color: "white" }} aria-hidden="true"></i>
                        </div>
                        {getAccessAccordingToRole("addPayment") &&
                            <div
                                className="updateBtnFixed"
                                style={{ display: 'flex' }}
                                onClick={(event) => this.setState({ showAddTransactionModal: true })}
                            >
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