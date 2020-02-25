import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Utils from '../../../app/common/utils';


const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '600px',
        // maxWidth: '700px',
        minHeight: '600px',
        maxHeight: '600px'
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

class InfoDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyArr: ["supplier_mobile", "buyer_mobile", "source_location", "target_location", "commodity", "qnt",
                "unit", "type", "bijak_amt", "transport_info", "author_name", "author_mobile", "status",
                "remark", "actual_dispatch_date", "actual_arrival_date", "expected_arrival_date", "createdtime",
                "updatedtime", "brokerid", "other_info", "supplierid", "buyerid", "rate", "commission_rate",
                "commission_unit", "rate_unit", "buyer_name", "buyer_businessname", "broker_name", "broker_businessname",
                "supplier_name", "supplier_businessname"],
            dataObj: {}
        }

    }
    componentDidMount() {
        if (this.props.data) {
            let data = this.props.data;
            let arr = this.state.keyArr
            for (let i = 0; i < arr.length; i++) {
                if (data.hasOwnProperty(arr[i]) && (!data[arr[i]] || data[arr[i]] === "null")) {
                    data[arr[i]] = "";
                }
            }

            this.setState({ dataObj: this.props.data });
        }


    }


    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }




    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.props.openModal}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', fontFamily: 'Lato', fontSize: '18px' }}>Order Info</p>  </DialogTitle>
            <DialogContent>

                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="supplier_mobile"
                        label="Supplier Mobile"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={Utils.maskMobileNumber(this.state.dataObj.supplier_mobile)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="buyer_mobile"
                        label="Buyer Mobile"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={Utils.maskMobileNumber(this.state.dataObj.buyer_mobile)}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="buyer_name"
                        label="Buyer Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.buyer_name}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="buyer_businessname"
                        label="Buyer Buisness Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.buyer_businessname}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="broker_name"
                        label="Broker Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.broker_name}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="broker_businessname"
                        label="Broker Buisness Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.broker_businessname}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="supplier_name"
                        label="Supplier Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.supplier_name}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="supplier_businessname"
                        label="Supplier Buisness Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.supplier_businessname}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="source_location"
                        label="Source Location"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.source_location}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="target_location"
                        label="Target Location"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.target_location}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="commodity"
                        label="commodity"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.commodity}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="qnt"
                        label="Qunatity"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.qnt}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="unit"
                        label="Unit"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.unit}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="mobile"
                        label="Mobile"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={Utils.maskMobileNumber(this.state.dataObj.mobile)}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="type"
                        label="Type"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.type}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.bijak_amt}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="transport_info"
                        label="Transport Info"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.transport_info}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="author_name"
                        label="Author Name"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.author_name}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="author_mobile"
                        label="Author Mobile"
                        type="text"
                        maxLength="10"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={Utils.maskMobileNumber(this.state.dataObj.author_mobile)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="status"
                        label="Status"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.status}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="remark"
                        label="Remark"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.remark}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="actual_dispatch_date"
                        label="Dispatch Date"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.actual_dispatch_date}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="actual_arrival_date"
                        label="Arrival Date"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.actual_arrival_date}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="expected_arrival_date"
                        label="Expected Arrival date"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.expected_arrival_date}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="createdtime"
                        label="Created Time"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.createdtime}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="updatedtime"
                        label="Updated Time"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.updatedtime}
                        fullWidth
                    />

                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="brokerid"
                        label="Broker Id"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.brokerid}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="other_info"
                        label="Other Info"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.other_info}
                        fullWidth
                    />


                </div>
                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="supplierid"
                        label="Supplier Id"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.supplierid}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="buyerid"
                        label="Buyer Id"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.buyerid}
                        fullWidth
                    />
                </div>

                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="rate"
                        label="Rate"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.rate}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="commission_rate"
                        label="Commision rate"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.commission_rate}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>

                    <TextField
                        margin="dense"
                        id="commission_unit"
                        label="Commision unit"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.commission_unit}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="rate_unit"
                        label="Rate Unit"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.rate_unit}
                        fullWidth
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        margin="dense"
                        id="unsettled_amount_pltf"
                        label="Unsettled Amount Pltf"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.unsettled_amount_pltf}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        id="creator_role"
                        label="Creater Role"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.creator_role}
                        fullWidth
                    />
                </div>
                {/*--------------- newly Added---------------- */}
                <div style={{ display: "flex" }} >

                    <TextField
                        margin="dense"
                        id="broker_mobile"
                        label="Broker Mobile"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.broker_mobile}
                        fullWidth />
                    &nbsp;
                    &nbsp;
<TextField
                        margin="dense"
                        id="bijak_total_amount"
                        label="Bijak total Amount"
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.bijak_total_amount}
                        disabled={true}
                        fullWidth />
                </div>

                <div style={{ display: "flex" }} >

                    <TextField
                        margin="dense"
                        id="invoice_no"
                        label="Invoice No."
                        disabled={true}
                        type="text"
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.invoice_no}
                        fullWidth />
                    &nbsp;
                    &nbsp;
                <TextField
                        margin="dense"
                        id="old_system_order_id"
                        label="Old System Order id"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.old_system_order_id}
                        fullWidth />
                </div>

                <div style={{ display: "flex" }} >

                    <TextField
                        margin="dense"
                        id="pkt"
                        label="Pkt"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.pkt}
                        fullWidth />
                    &nbsp;
                    &nbsp;
                <TextField
                        margin="dense"
                        id="brokerage"
                        label="brokerage"
                        type="text"
                        disabled={true}
                        style={{ marginRight: '2%', width: '48%' }}
                        value={this.state.dataObj.brokerage}
                        fullWidth />
                </div>


                {/*--------------- newly Added ends---------------- */}
                <div style={{ padding: "12px 0px", color: "#9e9e9e" }}>
                    {(this.state.dataObj["supporting_images"] &&
                        this.state.dataObj["supporting_images"] !== null &&
                        this.state.dataObj["supporting_images"].length > 0) ?
                        <div> Supporting Images </div> : <div> No supporting Images added </div>}
                </div>
                <div style={{ display: 'flex' }}>
                    {this.state.dataObj["supporting_images"] &&
                        this.state.dataObj["supporting_images"] !== null &&
                        this.state.dataObj["supporting_images"].length > 0 &&

                        this.state.dataObj["supporting_images"].map((imgKey, i) => (
                            <div key={"imhs_" + i} className="transaction-supporting-image">
                                <img src={imgKey} alt={imgKey} height="150px" width="150px"
                                  onError={(e)=>{e.target.onerror = null; e.target.src="https://bijakteaminternal-userfiles-mobilehub-429986086.s3.ap-south-1.amazonaws.com/public/no_data_found.png" }}
                                  />
                            </div>
                        ))}
                </div>


            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </div>
        );
    }
}

InfoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoDialog);