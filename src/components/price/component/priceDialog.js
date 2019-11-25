import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import priceService from '../../../app/priceService/priceService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '500px',
        // maxWidth: '700px',
        minHeight: '500px',
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
    },
    slash:{
        fontSize:'20px',
        marginTop:'px'
    }

});

class PriceDialog extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: {
                "buyerid":"",
                "brokerid":"",
                "commodity":"",
                "rate":0,
                "qnt":0,
                "unit":"quantil",
                "commission_rate":0,
                "commission_unit":"quantil",
                "rate_unit":"quantil",
                "brokermobile":null,
                "buyermobile":null
            },
            commodityList:[],
            unitArr:["quantil","ton"]
        }

        this._isMounted = false;

    }

    // componentWillReceiveProps() {
    //     if (this.props !== this.state) {
    //         this.setState({ open: this.props.openModal });
    //     }
    // }
    componentDidMount() {
        this._isMounted = true;}
    componentWillUnmount() {
        this._isMounted = false;
     }

    handleChange = event => {
        let data = this.state.dataObj;
        let id = event.target.id;
        data[id] = event.target.value;
        this.setState({dataObj:data});
    }



    handelConfirmUpdate = async () => {
        // console.log(this.state.dataObj);

        let obj = {'data':this.state.dataObj}
        let resp = await priceService.addPrice(obj);
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onEditModalClosed();
        } else {
            alert("Opps there was an error, while adding");
        }
        this.setState({ showSweetAlert: false, alertData: {} });
    }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    handleStateChange  = (id,event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({dataObj:data});
        // console.log(event.target.value);
        if(id == 'buyerid'){
            this.handleCommodity(event.target.value);
        }
        if(id == 'brokerid'){
            this.handleMobile(event.target.value);
        }
    };


    handleCommodity =(id) =>{
        let data =  this.props.buyerList;
        let obj = this.state.dataObj;
        for(let i=0;i<data.length;i++){
            if(data[i]['id'] == id){
                obj['buyermobile'] = data[i]['mobile']
                this.setState({commodityList:data[i]['default_commodity'],dataObj:obj});
                return;
            }
        }
     
    }

    handleMobile = (id) =>{
        let data =  this.props.brokerList;
        let obj = this.state.dataObj;
        for(let i=0;i<data.length;i++){
            if(data[i]['id'] == id){
                obj['brokermobile'] = data[i]['mobile']
                this.setState({dataObj:obj});
                return;
            }
        }
    }
    handleAddClick(event){
        // this.setState({ alertData: { alertType: "success", title: "Success", text: "Succesfully added" }, showSweetAlert: true ,open:false});
        let dialogText = "Are you sure to add ?"
     //   if (this.state.dataObj.state && this.state.dataObj.state != "" && this.state.dataObj.market && this.state.dataObj.market != "" && this.state.dataObj.district && this.state.dataObj.district != ""
      //  && this.state.dataObj.market_hindi && this.state.dataObj.market_hindi != "" && this.state.dataObj.district_hindi && this.state.dataObj.district_hindi != "") {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        // } else {
        //     alert("All fields are required");
        // }
    }
    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>Commodity Price Data</p>  </DialogTitle>
            <DialogContent>
            <div >
                    <TextField
                        select
                        id="buyerid"
                        label="Buyer"
                        type="text"
                        style={{ marginRight: '2%', width: '100%', marginTop: '5px' }}
                        value={this.state.dataObj.buyerid}
                        onChange={this.handleStateChange.bind(this,'buyerid')}
                    
                    >
                         

                        {this.props.buyerList.map((option, i) => (
                            <MenuItem key={i} value={option.id}  selected={true}>
                                {option.fullname } {"("+option.business_name+")"}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
                    <div >
                    <TextField
                        select
                        id="brokerid"
                        label="Broker"
                        type="text"
                        style={{ marginRight: '2%', width: '100%', marginTop: '5px' }}
                        value={this.state.dataObj.brokerid}
                        onChange={this.handleStateChange.bind(this,'brokerid')}

                    >

                        {this.props.brokerList.map((option, i) => (
                            <MenuItem key={i} value={option.id} selected={true}>
                                 {option.fullname } {"("+option.business_name+")"}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
                <div >
                <TextField
                        select
                        id="commodity"
                        label="Commodity"
                        type="text"
                        style={{ marginRight: '2%', width: '100%', marginTop: '5px' }}
                        value={this.state.dataObj.commodity}
                        onChange={this.handleStateChange.bind(this,'commodity')}

                    >

                        {this.state.commodityList.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
                
                <div style={{display:'flex'}}>
                    <TextField
                        margin="dense"
                        id="rate"
                        label="Rate"
                        type="number"
                        style={{ marginRight: '2%',width:'50%' }}
                        value={this.state.dataObj.rate}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                    
                    <TextField
                        select
                        id="rate_unit"
                        label="Rate Unit"
                        type="text"
                        style={{ marginRight: '2%',marginLeft: '2%', width: '30%', marginTop: '5px' }}
                        value={this.state.dataObj.rate_unit}
                        onChange={this.handleStateChange.bind(this,'rate_unit')}

                    >

                        {this.state.unitArr.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
                   
                       <div style={{display:'flex'}}>
                       <TextField
                        margin="dense"
                        id="qnt"
                        label="Qnt"
                        type="number"
                        style={{ marginRight: '2%' ,width:'50%'}}
                        value={this.state.dataObj.qnt}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                      <TextField
                        select
                        id="unit"
                        label="Unit"
                        type="text"
                        style={{ marginRight: '2%', marginLeft: '2%',width: '30%', marginTop: '5px' }}
                        value={this.state.dataObj.unit}
                        onChange={this.handleStateChange.bind(this,'unit')}

                    >

                        {this.state.unitArr.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
                    <div style={{display:'flex'}}>
                    <TextField
                        margin="dense"
                        id="commission_rate"
                        label="Commision"
                        type="number"
                        style={{ marginRight: '2%',width:'50%' }}
                        value={this.state.dataObj.commission_rate}
                        onChange={this.handleChange.bind(this)}
                        fullWidth
                    />
                   <TextField
                        select
                        id="commission_unit"
                        label="commision Unit"
                        type="text"
                        style={{ marginRight: '2%', marginLeft: '2%', width: '30%', marginTop: '5px' }}
                        value={this.state.dataObj.unit}
                        onChange={this.handleStateChange.bind(this,'commission_unit')}

                    >

                        {this.state.unitArr.map((option, i) => (
                            <MenuItem key={i} value={option} selected={true}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    </div>
            </DialogContent>
            <DialogActions>
                <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Add</Button>
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
        </div>
        );
    }
}

PriceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PriceDialog);