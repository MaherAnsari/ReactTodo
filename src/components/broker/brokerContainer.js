import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Loader from '../common/Loader';
import UserListTable from '../common/UserTable';
import brokerService from '../../app/brokerService/brokerService';
import InfoDialog from '../common/InfoDialog';
import commodityService from './../../app/commodityService/commodityService';
// import sampleFile from '../sampleDownloadFiles/bulk-add-broker-data-sample.csv';
import FileUploader from '../common/fileUploader';
import userListService from './../../app/userListService/userListService';
import { getAccessAccordingToRole } from '../../config/appConfig';

const styles = theme => ({
    root: {
        width: '100%',
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



class BrokerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: null,
            showLoader: true,
            commodityList: [],
            showUploader:false

        };
    }



    async componentDidMount() {
        this.getData();
        this.getCommodityNames();
    }

    async getData() {
        this.setState({ dataList: null, showAddModal: false, showUploader: false  });
        let resp = await brokerService.getBrokerList(null);
        // console.log(resp.data);
        if (resp.data.status === 1 && resp.data.result) {

            this.setState({ dataList: resp.data.result.data });

        }
    }

    async getCommodityNames() {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: resp.data.result.data });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    handleClose(event) {
        this.setState({ open: false, showAddModal: false });
        this.getData();
    }
    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false ,showUploader:false});
    }


    handleClickOpen(event) {
        this.setState({ showAddModal: true, open: true });
    }

    async handleFileUploader(event) {
        // console.log(event);
        try {
            let resp = await userListService.uploadData(event);
            if (resp.data.status === 1 && resp.data.result) {
                alert("Data Successfuly Uploaded ");
                this.getData();

            }else{
                // alert("Oops an error occured while uploading");
                alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while uploading");
                
            }

        } catch (err) {
            console.error(err)
            this.getData();
        }
    }

    
    handleUploaderClick(event) {
        this.setState({ showUploader: true });
    }

    handelRefreshData( event ){
        this.getData();
    }
    
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.state.dataList ? <Card className={classes.card}>
                    <UserListTable 
                    tableData={this.state.dataList} 
                    role="broker" 
                    downloadAbleFileName="broker_list_data"
                    handelRefreshButtonClicked={( event )=> this.handelRefreshData( event )}
                    commodityList={this.state.commodityList} 
                    onClose={this.getData.bind(this)} />
                    
                    {getAccessAccordingToRole("addUser") && <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex', right:"2px" }} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>ADD BROKER</p></div>
                    </div>}
                    {/* <div className="fixedLeftBtnContainer">
                    <a download={"bulk-add-broker-data-sample.csv"} href={sampleFile} title="sampleFile">
                        <div className="fixedLeftBtn" style={{ display: 'flex' }}
                            // onClick={() => { window.open(sampleFile, 'Download'); }}
                            >
                            <i className="fa fa-cloud-download add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Download sample</p></div>
                            </a>
                    </div> */}

                     {/* <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex', left:"16%", background:"#4da443" }}
                            onClick={this.handleUploaderClick.bind(this)}
                            >
                            <i className="fa fa-cloud-upload add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Upload file</p></div>
                    </div> */}

                </Card> : <Loader />}
                {this.state.showAddModal ? <InfoDialog openModal={this.state.open}
                    role="broker"
                    commodityList={this.state.commodityList}
                    onEditModalClosed={this.handleClose.bind(this)}
                    onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

{this.state.showUploader ? <FileUploader openModal={this.state.showUploader}
onEditModalClosed={this.handleFileUploader.bind(this)}
//  commodityList={ this.state.commodityList}
onEditModalCancel={this.onModalCancel.bind(this)}
/>
: ""}


            </div>
        );
    }
}

BrokerContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(BrokerContainer);