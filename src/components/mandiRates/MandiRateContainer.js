import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import FilterListComponent from "./components/FilterListComponent";
import OrderListTable from "./components/OrderListTable";
import Utils from '../../app/common/utils';
import commodityService from '../../app/commodityService/commodityService';
import mandiDataService from '../../app/mandiDataService/mandiDataService';
import AddRatesDialog from './components/AddRatesDialog';
import { getAccessAccordingToRole } from '../../config/appConfig';

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
            stateList: [],
            districtList: [],
            commodityList: [],
            districtData: null,
            mandiListData: {}, showLoader: false,
            open: false,
            showAddModal: false,

        }
    }

    componentDidMount() {
        this.getCommodityNames();
        this.getDistrictData();
        this.setState({ stateList: this.getStateData() })
        this.getSearchedOrderListData({"stateid":"haryana"})
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.formatDataForDropDown(resp.data.result.data, "name", "name") });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    async getDistrictData() {
        let resp = await mandiDataService.getDistrictList();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ districtData: resp.data.result.data });
        }



    }


    getStateData() {
        let data = Utils.getStateData();
        // console.log(data);
        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i].toLowerCase(), value: data[i].toLowerCase() });
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

    async getSearchedOrderListData(params) {
        // console.log(params);
        this.setState({ showLoader: true });
        let obj = {
            "commodity": params.commodityid,
            "district": params.districtid,
            "state": params.stateid
        }
        try {
            let resp = await commodityService.getCommodityData(obj);
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ mandiListData: resp.data.result.data, showLoader: false });
            } else {
                this.setState({ mandiListData: [], showLoader: false });
            }
        } catch (err) {
            console.error(err);
            this.setState({ mandiListData: [], showLoader: false });
        }
    }

    handleClickOpen(event) {
        this.setState({ showAddModal: true, open: true });
    }

    handleClose(event) {
        this.setState({ open: false, showAddModal: false});
        // this.getData("haryana");
    }

    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    {this.state.districtData ? <FilterListComponent
                        stateList={this.state.stateList}
                        districtList={this.state.districtList}
                        commodityList={this.state.commodityList}
                        districtData={this.state.districtData}
                        getSearchedOrderListData={this.getSearchedOrderListData.bind(this)} /> : ""}

                    {(this.state.showLoader || !this.state.districtData) ? <Loader /> : <OrderListTable tableData={this.state.mandiListData} />
                    }

                    {getAccessAccordingToRole("addMandiRates") && <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex', right: "50px" }} onClick={this.handleClickOpen.bind(this)}>
                        <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                        <p style={{fontSize: "14px",
                                    fontFamily: "lato",
                                    fontWeight: 600}}>ADD MANDI RATES</p></div>
                    </div>}

                </Paper>
                {this.state.showAddModal ?
                    <AddRatesDialog openModal={this.state.open}
                    commodityList={this.state.commodityList}
                        onEditModalClosed={this.handleClose.bind(this)}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}
            </div>
        );
    }
}
MandiRateContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(MandiRateContainer);