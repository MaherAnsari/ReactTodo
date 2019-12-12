import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import MandiListTable from './component/MandiListTable';
import mandiDataService from './../../app/mandiDataService/mandiDataService';
import Loader from '../common/Loader';
import DataUploader from './component/dataUploader';
const styles = theme => ({
    root: {
        width: '100%',
        // marginTop: '30px',
        // height: '88vh',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '100%'
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



class MandiDataContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: null,
            showLoader: true

        };
    }

    async componentDidMount() {
        this.getData();

    }

    async getData() {
        try {
            // let params = { "query": txt }
            let resp = await mandiDataService.getMandiSearchData();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ dataList: resp.data.result.data });
            }
        } catch (err) {
            console.log(err)
        }
    }

    handleClose(event) {
        this.setState({ open: false, showAddModal: false, dataList: null });
        this.getData();
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

                {this.state.dataList ? <Card className={classes.card}>
                    <MandiListTable tableData={this.state.dataList} />
                    <div className="updateBtndef">
                        <div className="updateBtnFixed" 
                        style={{ display: 'flex', right: "50px" }} 
                        onClick={this.handleClickOpen.bind(this)}>
                        <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                        <p style={{fontSize: "14px",
                                    fontFamily: "lato",
                                    fontWeight: 600}}>ADD LOCATION</p></div>
                    </div>

                </Card> : <Loader />}

                {/* {this.state.showLoader ?<Loader />:""} */}
                {this.state.showAddModal ?
                    <DataUploader openModal={this.state.open}
                        onEditModalClosed={this.handleClose.bind(this)}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

            </div>
        );
    }
}

MandiDataContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(MandiDataContainer);