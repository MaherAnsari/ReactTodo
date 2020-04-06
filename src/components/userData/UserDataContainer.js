import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import userListService from './../../app/userListService/userListService';
import Loader from '../common/Loader';
import UserListTable from '../common/UserTable';
import InfoDialog from './../common/InfoDialog';
import commodityService from '../../app/commodityService/commodityService';
import FileUploader from '../common/fileUploader';
// import sampleFile from '../sampleDownloadFiles/bulk-add-user-data-sample.csv';
import { getAccessAccordingToRole } from '../../config/appConfig';
import SweetAlertPage from '../../app/common/SweetAlertPage';

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



class UserDataContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: [],
            // showLoader: true,
            commodityList: null,
            showUploader: false,

            params: {
                limit: 1000, // total amount of data 
                offset: 0 // data from which data needs to be get
            },
            totalDataCount: 0,
            showLoader: false,
            isTableDataLoading: false,
            resetPageNumber: false,

            showSweetAlert: false,
            sweetAlertData: {
                "type": "",
                "title": "",
                "text": ""
            }

        };
    }

    async componentDidMount() {
        this.handelGetData();
    }

    async getData(params) {
        try {
            let sweetAlrtData = this.state.sweetAlertData;
            this.setState({ showAddModal: false, showUploader: false });
            let resp = await userListService.getUserList(params);

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
                sweetAlrtData["type"] = "error";
                sweetAlrtData["title"] = "Error";
                sweetAlrtData["text"] = resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the data";

                this.setState({
                    dataList: [],
                    totalDataCount: 0,
                    showLoader: false,
                    isTableDataLoading: false,
                    showSweetAlert: true,
                    sweetAlertData: sweetAlrtData
                });
                // alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the data");
            }
        } catch (err) {
            console.log(err);
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
                // alert("Data Successfuly Uploaded ");
                // this.handelGetData();
                let sweetAlrtData = this.state.sweetAlertData;
                sweetAlrtData["type"] = "success";
                sweetAlrtData["title"] = "Success";
                sweetAlrtData["text"] = "Data Successfuly Uploaded";
                this.setState({
                    showSweetAlert: true,
                    sweetAlertData: sweetAlrtData
                });
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

    handelSweetAlertClosed() {
        this.setState({ showSweetAlert: false }, () => {
            if (this.state.sweetAlertData.type !== "error") {
                this.handelGetData();
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { showSweetAlert, sweetAlertData } = this.state;
        return (
            <div className={classes.root}>

                {this.state.showLoader && <Loader />}
                <Card className={classes.card} style={{ display: this.state.showLoader ? "none" : "unset" }}>

                    <UserListTable
                        tableData={this.state.dataList}
                        onClose={() => this.handelGetData()}
                        downloadAbleFileName="user_list_data"
                        handelRefreshButtonClicked={(event) => this.handelRefreshData(event)}
                        commodityList={this.state.commodityList}
                        // onAnyUpdateComple={()=> this.handelGetData()}
                        resetOffsetAndGetData={() => this.resetOffsetAndGetData()}
                        resetPageNumber={this.state.resetPageNumber}
                        setPageNumber={() => this.setState({ resetPageNumber: false })}
                        totalDataCount={this.state.totalDataCount}
                        showLoader={this.state.showLoader}
                        isTableDataLoading={this.state.isTableDataLoading}
                    />

                    {getAccessAccordingToRole("addUser") && <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex' }} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>ADD USER</p></div>
                    </div>}

                    {/* <div className="fixedLeftBtnContainer">
                    <a download={"bulk-add-user-data-sample.csv"} href={sampleFile} title="sampleFile">
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
                            onClick={this.handleUploaderClick.bind(this)}>
                            <i className="fa fa-cloud-upload add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Upload file</p></div>
                    </div> */}

                </Card>



                {this.state.showAddModal ?
                    <InfoDialog openModal={this.state.open}
                        onEditModalClosed={this.handleClose.bind(this)}
                        commodityList={this.state.commodityList}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

                {this.state.showUploader ?
                    <FileUploader
                        openModal={this.state.showUploader}
                        onEditModalClosed={this.handleFileUploader.bind(this)}
                        //  commodityList={ this.state.commodityList}
                        onEditModalCancel={this.onModalCancel.bind(this)}
                    />
                    : ""}
                {showSweetAlert &&
                    <SweetAlertPage
                        show={true}
                        type={sweetAlertData.type}
                        title={sweetAlertData.title}
                        text={sweetAlertData.text}
                        sweetAlertClose={() => this.handelSweetAlertClosed()}
                    />}
            </div>
        );
    }
}

UserDataContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserDataContainer);