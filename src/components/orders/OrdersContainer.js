import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
// import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./components/FilterListComponent";
import brokerService from './../../app/brokerService/brokerService';
import buyerService from './../../app/buyerService/buyerService';
import supplierService from './../../app/supplierService/supplierService';
import orderService from './../../app/orderService/orderService';
import OrderListTable from "./components/OrderListTable";

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
            buyersList: ["buy1", "buy2", "buy3", "buy4"],
            brokersList: ["bro1", "bro2", "bro3", "bro4"],
            suppliersList: ["sup1", "sup2", "sup3", "sup4"],
            orderedListData : undefined
        }
    }

    componentDidMount() {
        this.getBuyersList();
        this.getBrokersList();
        this.getSuppliersList();
    }

    async getBuyersList() {
        try {
            let resp = await buyerService.getBuyerList();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ buyersList: this.formatDataForDropDown(resp.data.result.data, "fullname" ,"id" )});
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getBrokersList() {
        try {
            let resp = await brokerService.getBrokerList();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ brokersList: this.formatDataForDropDown(resp.data.result.data, "fullname" ,"id" ) });
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getSuppliersList() {
        try {
            let resp = await supplierService.getSupplierList();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ suppliersList: this.formatDataForDropDown(resp.data.result.data, "fullname" ,"id" ) });
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

    async getSearchedOrderListData( params ) {
        try {
            let resp = await orderService.getOrderListData( params );
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ orderedListData : resp.data.result.data });
            }else{
                this.setState({ orderedListData : []});
            }
        } catch (err) {
            console.error(err);
            this.setState({ orderedListData : []});
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <FilterListComponent
                        buyersList={this.state.buyersList}
                        brokersList={this.state.brokersList}
                        suppliersList={this.state.suppliersList} 
                        getSearchedOrderListData={this.getSearchedOrderListData.bind( this )}/>

                        <OrderListTable  tableData={this.state.orderedListData}  /> 
                </Paper>
            </div>
        );
    }
}
OrdersContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(OrdersContainer);