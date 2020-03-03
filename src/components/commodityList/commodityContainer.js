import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CommodityTable from './component/commodityTable';
import commodityService from '../../app/commodityService/commodityService';
import Loader from '../common/Loader';
import AddCommodityModal from './component/AddCommodityModal';
// import { IoTThingsGraph } from 'aws-sdk';

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



class CommodityContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: null,
            showLoader: true,
            showAddCommodityModal: false

        };
    }



    async componentDidMount() {
        this.getData();

    }

    async getData() {

        let resp = await commodityService.getCommodityTable();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ dataList: resp.data.result.data });
        } else {
            // alert("Oops there was an error while getting commodity list")
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error while getting commodity list");
        }

    }




    handleClose(event) {
        this.setState({ dataList: null }, function () {
            this.getData();
        });

    }
    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false });
    }


    handleClickOpen(event) {
        this.setState({ showAddModal: true, open: true });
    }
    render() {
        const { classes } = this.props;
        const { showAddCommodityModal } = this.state;
        return (
            <div className={classes.root}>
                {this.state.dataList ? <Card className={classes.card}>
                    <CommodityTable onClose={this.handleClose.bind(this)} tableData={this.state.dataList} />


                    <div className="updateBtndef">
                        <div
                            className="updateBtnFixed"
                            style={{ display: 'flex' }}
                            onClick={(event) => this.setState({ showAddCommodityModal: true })}>
                            <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p>Add Commodity</p>
                        </div>
                    </div>

                    {showAddCommodityModal && <AddCommodityModal
                        openModal={this.state.showAddCommodityModal}
                        onEditModalClosed={() => this.setState({ showAddCommodityModal: false, dataList: null }, () => this.getData())}
                        onEditModalCancel={() => this.setState({ showAddCommodityModal: false })}
                    />}

                </Card> : <Loader />}
            </div>
        )
    }

}

CommodityContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CommodityContainer);