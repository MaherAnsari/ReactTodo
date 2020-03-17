import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import buyerService from './../../app/buyerService/buyerService';
import Loader from '../common/Loader';
import UserListTable from '../common/UserTable';
import InfoDialog from '../common/InfoDialog';
// import sampleFile from '../sampleDownloadFiles/bulk-add-buyer-data-sample.csv';
import userListService from './../../app/userListService/userListService';
import FileUploader from '../common/fileUploader';
import { getAccessAccordingToRole } from '../../config/appConfig';
import Utils from '../../app/common/utils';

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



class BuyerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: [],
            showUploader: false,

            params: {
                limit: 1000, // total amount of data 
                offset: 0 // data from which data needs to be get
            },
            totalDataCount: 0,
            showLoader: false,
            isTableDataLoading: false,
            resetPageNumber: false

        };
    }



    async componentDidMount() {
        // this.getData();
        this.handelGetData();

    }

    async getData(params) {
        this.setState({ showAddModal: false, showUploader: false });
        let resp = await buyerService.getDefaultBuyerList(params);
        if (resp.data.status === 1 && resp.data.result) {
            let respData = resp.data.result;
            console.log(respData);
            this.setState({
                dataList: this.state.dataList.concat(respData.data),
                totalDataCount: respData.totalCount && respData.totalCount[0] && respData.totalCount[0]["count"] ? parseInt(respData.totalCount[0]["count"], 10) : 0,
                showLoader: false,
                isTableDataLoading: false
            });
        } else {
            this.setState({
                dataList: [],
                totalDataCount: 0,
                showLoader: false,
                isTableDataLoading: false
            });
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the list");
        }
    }

    handleClose(event) {
        this.setState({ open: false, showAddModal: false });
        this.handelGetData();
    }
    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false, showUploader: false });
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
                this.handelGetData();
            } else {
                // alert("Oops an error occured while uploading the data")
                alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while uploading the data");
            }

        } catch (err) {
            console.error(err)
            this.handelGetData();
        }
    }


    handleUploaderClick(event) {
        this.setState({ showUploader: true });
    }

    handelRefreshData(event) {
        this.handelGetData();
    }

    handelDownloadClicked = () => {
        let fHeader = {
            "id": "CA ID",
            "fullname": "CA Name",
            "business_name": "Firm Name",
            "default_commodity": "Commodity",
            "mobile": "Phone",
            "bijak_verified": "KYC",
            "createdtime": "Date",
            "locality": "Locality",
            "state": "State",
            "district": "District"
        }
        Utils.downloadFormattedDataInCSV(this.state.dataList, "CA Data (Buyer)", fHeader)
    }

    handelGetData() {
        this.setState({ dataList: [], resetPageNumber: true, showLoader: true, params: { limit: 1000, offset: 0 } }, () =>
            this.getData(this.state.params)
        );
    }

    resetOffsetAndGetData() {
        let paramsval = this.state.params;
        paramsval["offset"] = paramsval["offset"] + 1000;
        this.setState({ params: paramsval, isTableDataLoading: true }, function () {
            this.getData(paramsval);
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.state.showLoader && <Loader />}

                <Card className={classes.card} style={{ display: this.state.showLoader ? "none" : "unset" }}>
                    <UserListTable
                        tableData={this.state.dataList}
                        role="ca"
                        downloadAbleFileName="buyer_list_data"
                        handelRefreshButtonClicked={(event) => this.handelRefreshData(event)}
                        onClose={()=>this.handelGetData(this)}


                        resetOffsetAndGetData={() => this.resetOffsetAndGetData()}
                        resetPageNumber={this.state.resetPageNumber}
                        setPageNumber={() => this.setState({ resetPageNumber: false })}
                        totalDataCount={this.state.totalDataCount}
                        showLoader={this.state.showLoader}
                        isTableDataLoading={this.state.isTableDataLoading}
                    />

                    {getAccessAccordingToRole("addUser") && <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex', right: "10px" }} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>ADD BUYER</p></div>
                    </div>}
                    {/* <div className="fixedLeftBtnContainer">
                    <a download={"bulk-add-buyer-data-sample.csv"} href={sampleFile} title="sampleFile">
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
                    </div>

                     <div className="fixedLeftBtnContainer">
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


                    {/* {getAccessAccordingToRole("allowDownload") && <div className="updateBtndef" style={{ right: "160px" }} data-toggle="tooltip" data-html="true" title="Download">
                        <div className="updateBtnFixed" style={{ display: 'flex', background: "#e72e89", borderRadius: "6px" }} onClick={this.handelDownloadClicked.bind(this)}>
                            <i className="fa fa-cloud-download add-icon" style={{ marginRight: 0, color: "white" }} aria-hidden="true"></i>
                        </div>
                    </div>} */}

                </Card>

                {this.state.showAddModal ?
                    <InfoDialog
                        openModal={this.state.open}
                        role="ca"
                        onEditModalClosed={this.handleClose.bind(this)}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> :
                    ""}


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

BuyerContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(BuyerContainer);