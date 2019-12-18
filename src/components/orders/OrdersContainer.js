import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./components/FilterListComponent";
import brokerService from './../../app/brokerService/brokerService';
import buyerService from './../../app/buyerService/buyerService';
import supplierService from './../../app/supplierService/supplierService';
import orderService from './../../app/orderService/orderService';
import OrderListTable from "./components/OrderListTable";
import DateRangeSelector from "./components/DateRangeSelector";
import sampleFile from '../sampleDownloadFiles/bulk-add-order-data-sample.csv';

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



class OrdersContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buyersList: [],
            brokersList: [],
            suppliersList: [],
            orderedListData: undefined,
            showLoader: false,
            datePayloads: { "startDate": "", "endDate": "" }

        }
        this.ismounted = true;
    }

    componentDidMount() {
        this.getBuyersList();
        this.getBrokersList();
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

    async getBrokersList() {
        try {
            let resp = await brokerService.getBrokerList();
            if (this.ismounted) {
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ brokersList: this.formatDataForDropDown(resp.data.result.data, "fullname", "id") });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

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
                optionsData.push({ label: data[i][labelKey], value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    async getSearchedOrderListData(params) {

        // { "startDate": "", "endDate": "" }
        if (this.state.datePayloads["startDate"] !== "") {
            params["startDate"] = this.state.datePayloads["startDate"];
        }
        if (this.state.datePayloads["endDate"] !== "") {
            params["endDate"] = this.state.datePayloads["endDate"];
        }


        this.setState({ showLoader: true });
        try {
            let resp = await orderService.getOrderListData(params);
            if (this.ismounted) {
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ orderedListData: resp.data.result.data, showLoader: false });
                } else {
                    this.setState({ orderedListData: [], showLoader: false });
                }
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
            this.getSearchedOrderListData({});
        });
    }



    render() {
        const { classes } = this.props;
        const { showAddModal } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                    </div>
                    <FilterListComponent
                        buyersList={this.state.buyersList}
                        brokersList={this.state.brokersList}
                        suppliersList={this.state.suppliersList}
                        getSearchedOrderListData={this.getSearchedOrderListData.bind(this)} />
                    
                   
                    <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex' }}
                            onClick={() => { window.open(sampleFile, 'Download'); }}>
                            <i className="fa fa-cloud-download add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Download sample</p></div>
                    </div>

                     <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex', left:"16%", background:"#4da443" }}
                            // onClick={this.handleClickOpen.bind(this)}
                            >
                            <i className="fa fa-cloud-upload add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Upload file</p></div>
                    </div>
                   
                    {this.state.showLoader ? 
                    <Loader /> : 
                    <OrderListTable 
                    tableData={this.state.orderedListData} 
                    onOrderAdded={()=> this.getSearchedOrderListData({}) } />}
                 

                </Paper>
            </div>
        );
    }
}
OrdersContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(OrdersContainer);