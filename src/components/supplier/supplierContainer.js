import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import supplierService from './../../app/supplierService/supplierService';
import Loader from '../common/Loader';
import UserTable from '../common/UserTable';
import InfoDialog from '../common/InfoDialog';
import commodityService from './../../app/commodityService/commodityService';
import sampleFile from '../sampleDownloadFiles/bulk-add-supplier-data-sample.csv';
import FileUploader from '../common/fileUploader';
import userListService from './../../app/userListService/userListService';

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



class SupplierContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal: false,
            dataList: null,
            showLoader: true,
            showUploader:false

        };
    }



    async componentDidMount() {
        this.getData();

    }

    async getData() {
        this.setState({ dataList: null ,showAddModal: false, showUploader: false  });
        let resp = await supplierService.getSupplierList();
        // console.log(resp.data);
        if (resp.data.status === 1 && resp.data.result) {

            this.setState({ dataList: resp.data.result.data });

        }
    }
    handleClose(event) {
        this.setState({ open: false, showAddModal: false });
        this.getData();
    }
    onModalCancel(event) {
        this.setState({ open: false, showAddModal: false,showUploader:false });
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
                    <UserTable
                        tableData={this.state.dataList}
                        role="la"
                        handelRefreshButtonClicked={( event )=> this.handelRefreshData( event )}
                        downloadAbleFileName="supplier_list_data"
                        onClose={this.getData.bind(this)} />

                    <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex', right: "-5px" }} onClick={this.handleClickOpen.bind(this)}>
                            <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>ADD SUPPLIER</p></div>
                    </div>

                    {/* <div className="fixedLeftBtnContainer">
                    <a download={"bulk-add-supplier-data-sample.csv"} href={sampleFile} title="sampleFile">
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
                </Card> : <Loader />}

                {this.state.showAddModal ? <InfoDialog openModal={this.state.open}
                    onEditModalClosed={this.handleClose.bind(this)}
                    role="la"
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

SupplierContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SupplierContainer);