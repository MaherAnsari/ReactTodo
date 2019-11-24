import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
// import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./components/FilterListComponent";
import orderService from '../../app/orderService/orderService';
import OrderListTable from "./components/OrderListTable";
import Utils from '../../app/common/utils';
import commodityService from '../../app/commodityService/commodityService';
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



class MandiRateContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateList: null,
            districtList: null,
            commodityList: null,
        }
    }

    componentDidMount() {
        this.getCommodityNames();
        this.setState({stateList:this.getStateData()
        ,districtList:this.formatDistrictData() })
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.formatDataForDropDown(resp.data.result.data, "name" ,"id" )});
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }


    getStateData() {
        let data = Utils.getStateData();
        // console.log(data);
        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i], value: data[i] });
            }
        }
        return optionsData;
    }
   
    formatDistrictData() {

        let dataList = Utils.getDistrictData();
                var optionsData = [];
                if (dataList) {
                    for(let key in dataList){
                        let data = dataList[key];
                        // console.log(data);
                        for (var i = 0; i < data.length; i++) {
                            optionsData.push({ label: data[i]['district_name'], value: data[i]['id'] });
                        }
                        // console.log(optionsData);
                    }
                   
                }
              
                return optionsData;
            }
    formatDataForDropDown(data, labelKey, valuekey) {
// console.log(data);
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
                   {this.state.commodityList ? <FilterListComponent
                        stateList={this.state.stateList}
                        districtList={this.state.districtList}
                        commodityList={this.state.commodityList} 
                        getSearchedOrderListData={this.getSearchedOrderListData.bind( this )}/>:""}

                        <OrderListTable  tableData={this.state.orderedListData}  /> 
                </Paper>
            </div>
        );
    }
}
MandiRateContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(MandiRateContainer);