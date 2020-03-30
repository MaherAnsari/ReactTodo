import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DateRangeSelector from './component/DateRangeSelector';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../app/common/utils';
import commonService from '../../app/commonService/commonService';
import EmailInputModal from './component/EmailInputModal';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px',
        padding: "15px 20%",
        minHeight: '80vh',
    },
    card: {
        maxWidth: '100%',
        minHeight: '70vh',
        paddingTop: "10%",
        marginTop: '15px',
        height: '97%',
    }
});



class DownloadNetContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            // currentPayoutView: "default", //selectAccount, addAccount,loading
            datePayloads: { "startDate": "", "endDate": "" },
            "type": "lanet",
            dropOptions: {
                "alluser": "All User",
                "la": "CA Data (Buyer)",
                "ca": "LA Data (Supplier)",
                "lanet": "LA net",
                "canet": "CA net",
                "orders": "Orders",
                "payments": "Payments"
            },
            isEmailSentSuccess: "emailView",
            isAlltimeChecked : false

        }
    }

    componentDidMount() {
        var datePayloadsVal = this.state.datePayloads;
        datePayloadsVal["startDate"] = this.formateDateForApi(new Date("01/01/2019"));
        datePayloadsVal["endDate"] = this.formateDateForApi(new Date());
        this.setState({ datePayloads: datePayloadsVal })

    }

    getPreviousDate(PreviousnoOfDays) {
        var date = new Date();
        return (new Date(date.setDate(date.getDate() - PreviousnoOfDays)));
    }

    onDownloadClicked = async () => {
        try {
            // if (this.state.type === "lanet" || this.state.type === "canet") {
            //     this.downLoadDataCAandLA();
            // } else {
            this.setState({ isDownlaodModalOpen: true });
            // }
        } catch (err) {
            console.log(err)
        }
    }

    downloadOtherData = async (email) => {
        try {
            this.setState({ showLoader: true, isEmailSentSuccess: "loading" });
            let payload = {
                "startDate": this.formateDateForApi(this.state.datePayloads["startDate"]),
                "endDate": this.formateDateForApi(this.state.datePayloads["endDate"]),
                "email": email
            }

            if( this.state.isAlltimeChecked ){
                payload["startDate"] = this.formateDateForApi(new Date("01/01/2019"));
                payload["endDate"] = this.formateDateForApi(new Date());
            }
            
            let resp = "";
            if (this.state.type === "orders") {
                resp = await commonService.getOrdersBulkDataForDownload(payload);
            } else if (this.state.type === "payments") {
                resp = await commonService.getPaymentBulkDataForDownload(payload);
            } else if (this.state.type === "lanet" || this.state.type === "canet") {
                payload["type"] = this.state.type;
                resp = await commonService.getCAnetAndLAnetDataForDownload(payload);
            } else if (this.state.type === "la" || this.state.type === "ca") {
                payload["role"] = this.state.type;
                resp = await commonService.getUserDataForDownload(payload);
            } else if (this.state.type === "alluser") {
                resp = await commonService.getUserDataForDownload(payload);
            }

            this.setState({ showLoader: false });
            if (resp.data.status === 1) {
                if (resp.data.result !== "-" && resp.data.result.length !== 0) {
                    this.setState({ isEmailSentSuccess: "success" });
                } else {
                    this.setState({ isEmailSentSuccess: "failed" });
                }
            } else {
                this.setState({ isEmailSentSuccess: "failed" });
                alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while downloading the data.");
            }
        } catch (err) {
            this.setState({ isEmailSentSuccess: "failed" });
            console.log(err)
        }
    }

    downLoadDataCAandLA = async () => {
        try {
            this.setState({ showLoader: true });

            let payload = {
                "type": this.state.type,
                "startDate": this.formateDateForApi(this.state.datePayloads["startDate"]),
                "endDate": this.formateDateForApi(this.state.datePayloads["endDate"]),
            }
            let resp = await commonService.getNetDataForDownload(payload)
            this.setState({ showLoader: false });
            if (resp.data.status === 1) {
                if (resp.data.result !== "-" && resp.data.result.length !== 0) {
                    this.onDownLoadAPiSuccess(resp.data.result);
                } else {
                    alert("No data available")
                }
            } else {
                alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while downloading the data.");
            }
        } catch (err) {
            console.log(err)
        }
    }

    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" + (dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            return dateVal;
        } else {
            return "";
        }
    }

    onDownLoadAPiSuccess(data) {
        let fileName = this.state.type + "_payment_details";
        Utils.formatDownloadDataInCSVThroughApi(data, fileName);
    }


    onDateChaged(data) {
        this.setState({ datePayloads: data }, function () {
            // this.onDownloadClicked();
        });
    }

    handleStateChange = (id, event) => {
        // let data = this.state.type;
        // data[id] = event.target.value;
        this.setState({ type: event.target.value });

    };

    handelCancelUpdate(event) {
        this.setState({ showConfirmDialog: false, forceUpdateData: undefined });
    }

    render() {
        const { classes } = this.props;
        const { showLoader, type, isDownlaodModalOpen, dropOptions, isAlltimeChecked } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div style={{ paddingRight: '10%' }}>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                    </div>
                    <div>

                        <React.Fragment>
                            <div>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={isAlltimeChecked}
                                        onChange={( event ) =>  this.setState({ isAlltimeChecked : event.target.checked })}
                                        name="checkedA" />}
                                    label="All Time"
                                />
                            </div>
                            <div >
                                <TextField
                                    select
                                    id="type"
                                    label="Select "
                                    type="text"
                                    style={{ marginRight: '2%', width: '48%', marginTop: '5px' }}
                                    value={type}
                                    onChange={this.handleStateChange.bind(this, 'type')}

                                >

                                    {Object.keys(dropOptions).map((option, i) => (
                                        <MenuItem key={i} value={option} selected={true}>
                                            {dropOptions[option]}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </div>

                            <Button style={{ marginTop: "10%", background: "#e74a52", "color": "#fff" }}
                                onClick={this.onDownloadClicked.bind(this)}
                                disabled={showLoader}
                                color="primary" autoFocus>
                                {showLoader && <i className="fa fa-spinner fa-spin" />}
                                Continue
                                 </Button>
                        </React.Fragment>

                        {isDownlaodModalOpen &&
                            <EmailInputModal
                                show={isDownlaodModalOpen}
                                isEmailSentSuccess={this.state.isEmailSentSuccess}
                                onModalClose={(ModalStatus) => { this.setState({ isDownlaodModalOpen: false }); }}
                                onCanceled={() => { this.setState({ isDownlaodModalOpen: false }) }}
                                onConfirmed={(emailId) => {
                                    // alert(emailId);
                                    // this.setState({ isEmailSentSuccess: "success" });
                                    // this.setState({  isEmailSentSuccess: "failed" });
                                    // , function(){
                                    this.downloadOtherData(emailId);
                                }} />}
                    </div>
                </Paper>
            </div>
        );
    }
}
DownloadNetContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(DownloadNetContainer);