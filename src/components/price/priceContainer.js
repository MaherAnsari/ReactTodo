import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import priceService from '../../app/priceService/priceService';
import buyerService from '../../app/buyerService/buyerService';
import brokerService from '../../app/brokerService/brokerService';
import Loader from '../common/Loader';
import PriceDialog from './component/priceDialog';
import PriceCollapseView from './component/priceCollapseView';
const styles = theme => ({
    root: {
        width: '98%',
        // marginTop: '30px',
        // height: '88vh',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px'
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
    },


});



class PriceContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: null,
            buyerList: null,
            brokerList: [],
            commodityList: [],
            showLoader: true

        };
    }



    componentDidMount() {
        this.getBuyerList();
        this.getPriceList();
        this.getBrokerList();
        
        this.getCommodityList();

    }
    async getPriceList() {
        let resp = await priceService.getPriceList();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ dataList: resp.data.result.data});


        }
        // this.setState({dataList:rows});

    }

    async getBrokerList() {
        let resp = await brokerService.getBrokerList();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ brokerList: resp.data.result.data });


        }

    }

    async getBuyerList() {
        let resp = await buyerService.getBuyerList();
       
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ buyerList: resp.data.result.data });// full ( id )
        }

    }


    async getCommodityList() {
        let resp = await priceService.getCommodityList();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ commodityList: resp.data.result.data });


        }

    }

    handleClose(event) {
        this.setState({ open: false, showAddModal: false, dataList: null });
        this.getPriceList();

    }
    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false });
    }


    handleClickOpen(event) {
        this.setState({ showAddModal: true, open: true });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                 { this.state.dataList ?
                    <Card className={classes.card}>
                        {/* <PriceTable   tableData={this.state.dataList}   />  */}
                     
                       <PriceCollapseView
                            expansionpanelHeaderData={ this.state.dataList} />
                        <div className="updateBtndef">
                            <div className="updateBtnFixed" style={{ display: 'flex' }} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i><p>ADD PRICE</p></div>
                        </div>

                    </Card>
                    : <Loader />}
                {/* {this.state.showLoader ?<Loader />:""} */}
                {this.state.showAddModal ? <PriceDialog openModal={this.state.open}
                    onEditModalClosed={this.handleClose.bind(this)}
                    brokerList={this.state.brokerList}
                    buyerList={this.state.buyerList}
                    commodityList={this.state.commodityList}
                    onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

            </div>
        );
    }
}

PriceContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PriceContainer);