import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DateRangeSelector from '../payment/common/DateRangeSelector';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../app/common/utils';
import commonService from '../../app/commonService/commonService';
import EmailInputModal from './component/EmailInputModal';

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
            "type": "CA net"

        }
    }

    componentDidMount() {
        var datePayloadsVal = this.state.datePayloads;
        datePayloadsVal["startDate"] = this.formateDateForApi(this.getPreviousDate(7));
        datePayloadsVal["endDate"] = this.formateDateForApi(new Date());
        this.setState({ datePayloads: datePayloadsVal })

    }

    getPreviousDate(PreviousnoOfDays) {
        var date = new Date();
        return (new Date(date.setDate(date.getDate() - PreviousnoOfDays)));
    }

    onDownloadClicked = async () => {
        try {
            this.setState({ isDownlaodModalOpen: true });
            return;
            this.setState({ showLoader: true });

            let payload = {
                "type": this.state.type === "LA net" ? "lanet" : "canet",
                "startDate": this.formateDateForApi(this.state.datePayloads["startDate"]),
                "endDate": this.formateDateForApi(this.state.datePayloads["endDate"]),
            }
            // console.log( payload )
            // let resp = {};
            let resp = await commonService.getNetDataForDownload(payload)
            this.setState({ showLoader: false });
            // console.log( resp )
            if (resp.data.status === 1) {
                if (resp.data.result !== "-" && resp.data.result.length !== 0) {
                    this.onDownLoadAPiSuccess(resp.data.result);
                } else {
                    alert("No data available")
                }
            } else {
                // alert("Oops an error occured while downloading the data.");
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
        const { showLoader, type, isDownlaodModalOpen } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div style={{ paddingRight: '10%' }}>
                        <DateRangeSelector onDateChanged={this.onDateChaged.bind(this)} />
                    </div>
                    <div>

                        <React.Fragment>
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

                                    {["CA net", "LA net"].map((option, i) => (
                                        <MenuItem key={i} value={option} selected={true}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </div>

                            <Button style={{ marginTop: "10%", background: "#e74a52", "color": "#fff" }}
                                onClick={this.onDownloadClicked.bind(this)}
                                disabled={showLoader}
                                color="primary" autoFocus>
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
                                    alert( emailId );
                                    this.setState({ isEmailSentSuccess: "success" });
                                    // this.setState({  isEmailSentSuccess: "failed" });
                                    // , function(){
                                    // this.connectDownLoadThroughEmail(emailId);
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