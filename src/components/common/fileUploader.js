import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// import blockListService from '../../../app/blockListService/blockListService';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import SweetAlertPage from '../../app/common/SweetAlertPage';
// import Utils from '../../app/common/utils';
const csv = require('csvtojson')
const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '400px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },
    formAddBtn: {
        width: '90%',
        borderRadius: '10px',
        fontSize: '20px',
        textTransform: 'uppercase',
        backgroundColor: '#4d9fa0 ',
        color: '#fff',
        height: '45px',
        marginBottom: '15px',
        marginTop: "11px",
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    formRoot: {
        // display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        // marginLeft: '25%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    }

});

class FileUploader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            selectedFile: null,
            dataArr: null,
            displayUpload: false,

            showSweetAlert: false,
            sweetAlertData: {
                "type": "",
                "title": "",
                "text": ""
            }
        }

    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }
    fileChangedHandler = (event) => {
        let file = event.target.files[0];
        // var fileName = file.name;
        var fileSize = file.size;
        // var fileExtension = fileName.substring(fileName.indexOf(".") + 1);
        if (fileSize < 20000000) {
            this.handleFiles(event);

        } else {
            // this.setState({ isLoding: false })
            // alert('Please select a proper file (type is CSV and size less than 20MB)')
            
        let sweetAlrtData = this.state.sweetAlertData;
            sweetAlrtData["type"] = "error";
            sweetAlrtData["title"] = "Error";
            sweetAlrtData["text"] = "Please select a proper file (type is CSV and size less than 20MB)";
            this.setState({
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });
        }

    }


    handleFiles(e) {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            this.getAsText(e);
        } else {
            // alert('FileReader are not supported in this browser.');
            let sweetAlrtData = this.state.sweetAlertData;
            sweetAlrtData["type"] = "error";
            sweetAlrtData["title"] = "Error";
            sweetAlrtData["text"] = 'FileReader are not supported in this browser.';
            this.setState({
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });
        }
    }

    async getAsText(e) {
        var reader = new FileReader();
        let ref = this;
        reader.onload = function (e) {
            csv()
                .fromString(reader.result)
                .then((csvLine) => {
                    // // csvLine =>  "1,2,3" and "4,5,6"
                    // csvData = csvLine;
                    ref.setState({ dataArr: csvLine });

                })

        }

        this.setState({ displayUpload: true });
        reader.readAsText(e.target.files[0]);
        reader.onerror = this.errorHandler;
    }


    onSubmitClick = () => {
        // console.log(this.state.dataArr);
        let dialogText = `Are you sure to add Upload?`

        if (this.state.dataArr && this.state.dataArr.length > 0) {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            // alert("Oops there was an error, while adding");
            let sweetAlrtData = this.state.sweetAlertData;
            sweetAlrtData["type"] = "error";
            sweetAlrtData["title"] = "Error";
            sweetAlrtData["text"] = "Oops there was an error, while adding";
            this.setState({
                showSweetAlert: true,
                sweetAlertData: sweetAlrtData
            });
            
        }
    }

    handelConfirmUpdate = async () => {

        let param = { data: this.state.dataArr };

        this.props.onEditModalClosed(param);

        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handelSweetAlertClosed() {
        this.setState({ showSweetAlert: false }, () => {
            if (this.state.sweetAlertData.type !== "error") {
                // this.handelGetData();
            }
        });
    }
    render() {
        const { classes } = this.props;
        const { showSweetAlert, sweetAlertData } = this.state;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#0f6e6f', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>Upload Data</p>  </DialogTitle>
            <DialogContent>

                <div className={classes.formRoot}>
                    <i className="fa fa-cloud-upload" aria-hidden="true" style={{ fontSize: "65px", color: "#7080ed" }}></i>
                    <p className={classes.heading}>Upload CSV File</p>
                    <input type="file" id="file" onClick={(event) => {
                        event.target.value = null
                    }} ref={(ref) => this.upload = ref} onChange={this.fileChangedHandler.bind(this)} style={{ display: "none" }} />
                    <Button variant="contained" color="primary" className={classes.fabEtendedButton} onClick={(e) => this.upload.click()} >
                        Select File
                        </Button>
                    {this.state.displayUpload &&
                        <Button variant="contained" style={{ marginLeft: "5px" }} color="primary" className={classes.fabEtendedButton} onClick={this.onSubmitClick.bind(this)}  >Submit</Button>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
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

FileUploader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileUploader);