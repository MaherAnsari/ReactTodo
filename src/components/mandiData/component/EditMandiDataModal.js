import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import mandiDataService from '../../../app/mandiDataService/mandiDataService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../../app/common/utils';
import Loader from '../../common/Loader';

const styles = theme => ({

    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '400px',
        // maxHeight: '500px'
    },
    offDay: {
        textAlign: 'center',
        width: '48%',
        marginTop: '33px',
        marginLeft: '10px'
    },
    close:{
        color:'#000',
        fontSize:'20px'
    },
    card:{
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    padding: '10px',
    borderRadius: '10px',
    marginTop:'15px'
    }

});

class EditMandiDataModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            dataObj: this.props.editableData,
            mandiGradeOptions: ["A", "B", "C", "D", "E", "F"],
            mandiGradeHindiOptions: ['क', 'ख', 'ग', 'घ', 'ङ', 'च'],
            // dataObj: {
            //     'state': '',
            //     'market': '',
            //     'district': '',
            //     'market_hindi': '',
            //     'district_hindi': '',
            //     'state_hindi': '-'

            // },
            "stateList": this.props.stateList,
            "districtMap": this.props.districtMap,
            "districtList": [],
            "isManuallyAdded": this.props.editableData && this.props.editableData["businessAddedPlace"] ? this.props.editableData["businessAddedPlace"] : false,
            dayArr: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
            dayType: ['first', "second", "third", "fourth", "last"],
            typeArr: ["dates", "every","all"],
            offDayArr: [],
            timeoption:["am","pm"],
            showLoader: false

        }

    }

    componentDidMount() {
        // console.log(this.props.editableData);
        let data = this.props.editableData.mandi_off_date ? this.props.editableData.mandi_off_date:[];
        let offDayData=[];
        for(let i=0;i<data.length;i++){
            let obj = { "offType": "", "dayType": "", "day": "", "dates": "" };
            // let  "every|first|monday"
            let arr = data[i].split("|");
            // console.log(arr[0]);
            if(arr[0] === "every"){
                obj["offType"] = arr[0];
                obj["dayType"] =  arr[1];
                obj["day"] =  arr[2];
             }else if(arr[0] === "all"){
                obj["offType"] = arr[0];
                obj["day"] =  arr[1];
             }else{
                obj["offType"] = arr[0];
                obj["dates"] =  arr[1];
            }


            offDayData.push(obj);

        }
        // "openingHour":"00",
        // "openingMin":"00",
        // "time":"AM",
        // "opening_time":"00:00 AM",
        // let time = "AM";
        // let openingHour = "00";
        // let openingMin = "00";
        let dataObj = this.props.editableData;
        if(this.props.editableData.opening_time){
            let str = this.props.editableData.opening_time.split(" ");
            dataObj['time'] = str[1];
            dataObj['openingHour'] = str[0].split(":")[0];
            dataObj['openingMin'] = str[0].split(":")[1];
        }
        // console.log(dataObj);
        this.setState({ districtList: Utils.getDistrictData()[this.props.editableData["state"].toLowerCase()] ,offDayArr:offDayData,
                dataObj:dataObj});
    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }


    handleChange = event => {
        let data = this.state.dataObj;
        let id = event.target.id;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
    }

    onSubmitClick = () => {
        let dialogText = "Are you sure to add ?"
        if (this.state.dataArr && this.state.dataArr.length > 0) {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            alert("Opps there was an error, while adding");
        }
    }

    handelConfirmUpdate = async () => {
        // console.log(this.state.dataObj);
        this.setState({ showLoader : true });
        var data = this.state.dataObj;
        var payload = {
            "market": data["market"],
            "apmc_req": data["apmc_req"],
            "mandi_grade": data["mandi_grade"],
            "mandi_grade_hindi": data["mandi_grade_hindi"],
            "loc_lat": data["loc_lat"],
            "loc_long": data["loc_long"],
            "mandi_off_date":data["mandi_off_date"],
            "opening_time":data["opening_time"]
        }
        // console.log(payload)
        let resp = await mandiDataService.updateMandiData( payload );
        this.setState({ showLoader : false });
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onEditModalClosed();
        } else {
            // alert("Opps there was an error, while adding");
            alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while adding");
        }
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    checkForValid


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }


    handleDialogCancel(event) {
        this.setState({ open: false }, function () {
            this.props.onEditModalCancel();
        })
    }


    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
        if (id === "state") {
            let val = event.target.value;
            if (this.state.districtMap.hasOwnProperty(val.toLowerCase())) {
                let list = this.state.districtMap[val.toLowerCase()];
                this.setState({ districtList: list });
            }
        }
    };


    handleUpdateClick(event) {
        let offdata = this.state.offDayArr;
        let offDayArr = []
        for (let i = 0; i < offdata.length; i++) {
            let str = "";
            if (offdata[i]['offType'] === "every") {
                str = "every|"+ offdata[i]['dayType'] + "|" + offdata[i]['day'];
            }else if (offdata[i]['offType'] === "all") {
                str = "all|" + offdata[i]['day'];
            } else {
                str = "dates|" + offdata[i]['dates'];
            }
            // console.log(str);
            offDayArr.push(str);
        }
        this.state.dataObj.mandi_off_date = offDayArr;
        this.state.dataObj.opening_time = this.state.dataObj.openingHour+":"+this.state.dataObj.openingMin+" "+this.state.dataObj.time;
        let dialogText = "Are you sure to add ?"
        if (this.state.dataObj.state && this.state.dataObj.state !== "" && this.state.dataObj.market && this.state.dataObj.market !== "" && this.state.dataObj.district && this.state.dataObj.district !== ""
            && this.state.dataObj.market_hindi && this.state.dataObj.market_hindi !== "" && this.state.dataObj.district_hindi && this.state.dataObj.district_hindi !== "") {
            this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
        } else {
            alert("All fields are required");
        }
    }

    onAddOffDayClick(event) {
        let obj = { "offType": "every", "dayType": "first", "day": "monday", "dates": "" };
        let arr = this.state.offDayArr;
        arr.push(obj);
        this.setState({ offDayArr: arr });
    }

    handleOffDayChange(index, id, event) {
        // console.log(index);
        // console.log(event.target.value);
        // console.log(id);
        let data = this.state.offDayArr;
        data[index][id] = event.target.value;
        this.setState({ offDayArr: data });
    }
    onCancelClick(id,event){
        let data = this.state.offDayArr;
        data.splice(id,1);
        this.setState({ offDayArr: data });
    }

    render() {
        const { classes } = this.props;
        const { showLoader, isManuallyAdded, mandiGradeOptions, mandiGradeHindiOptions ,timeoption} = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                { !showLoader ? <div>
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', fontFamily: 'Lato', fontSize: '18px' }}>Edit Mandi Data</p>  </DialogTitle>
                <DialogContent>
                <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                    <div >
                        <TextField
                            margin="dense"
                            id="market"
                            label="Market"
                            type="text"
                            disabled={true}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.market}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        /></div>
                    <div >
                        <TextField
                            select
                            id="state"
                            label="State"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%', width: '100%' }}
                            value={this.state.dataObj.state}
                            onChange={this.handleStateChange.bind(this, 'state')}>
                            {this.state.stateList.map((option, i) => (
                                <MenuItem key={i} value={option.toLowerCase()} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div >
                        <TextField
                            select
                            id="district"
                            label="District"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%', width: '100%' }}
                            value={this.state.dataObj.district}
                            onChange={this.handleStateChange.bind(this, 'district')}>
                            {this.state.districtList.map((option, i) => (
                                <MenuItem key={i} value={option.district_name} selected={true}>
                                    {option.district_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="state_hindi"
                            label="State (Hindi)"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.state_hindi}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="district_hindi"
                            label="District (Hindi)"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.district_hindi}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        /></div>
                    <div >
                        <TextField
                            margin="dense"
                            id="market_hindi"
                            label="Market (Hindi)"
                            type="text"
                            disabled={!isManuallyAdded}
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.market_hindi}
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>

                    <div >
                        <TextField
                            select
                            id="mandi_grade"
                            label="Mandi Grade"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.mandi_grade }
                            onChange={this.handleStateChange.bind(this, 'mandi_grade')}>
                            {mandiGradeOptions.map((option, i) => (
                                <MenuItem key={i} value={option.toLowerCase()} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            select
                            id="mandi_grade_hindi"
                            label="Mandi Grade ( Hindi )"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.mandi_grade_hindi || ""}
                            onChange={this.handleStateChange.bind(this, 'mandi_grade_hindi')}>
                            {mandiGradeHindiOptions.map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            select
                            id="apmc_req"
                            label="APMC"
                            type="text"
                            style={{ marginRight: '2%', width: '100%', marginTop: "8px" }}
                            value={this.state.dataObj.apmc_req}
                            onChange={this.handleStateChange.bind(this, 'apmc_req')}>
                            {[true, false].map((option, i) => (
                                <MenuItem key={i} value={option} selected={true}>
                                    {option ? "Yes" : "No"}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="loc_lat"
                            label="Latitude"
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.loc_lat }
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>
                    <div >
                        <TextField
                            margin="dense"
                            id="loc_long"
                            label="Longitude"
                            type="text"
                            style={{ marginRight: '2%' }}
                            value={this.state.dataObj.loc_long }
                            onChange={this.handleChange.bind(this)}
                            fullWidth
                        />
                    </div>
                    <div style={{marginTop:'5px',fontSize:'16px'}}>Mandi Opening Time :</div>                
                            <div style={{display:'flex'}}>
                                <TextField
                                    margin="dense"
                                    id="openingHour"
                                    label="Hour"
                                    type="text"
                                    style={{ marginRight: '2%',width:'30%' }}
                                    value={this.state.dataObj.openingHour}
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                                 <TextField
                                    margin="dense"
                                    id="openingMin"
                                    label="Minute"
                                    type="text"
                                    style={{ marginRight: '2%',width:'30%' }}
                                    value={this.state.dataObj.openingMin}
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                                  <TextField
                                    select
                                    id="time"
                                    label="Time"
                                    type="text"
                                    style={{ marginRight: '2%', width: '30%' ,paddingTop:'20px'}}
                                    value={this.state.dataObj.time}
                                    onChange={this.handleStateChange.bind(this, 'time')}>
                                    {timeoption.map((option, i) => (
                                        <MenuItem key={i} value={option} selected={true}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                    </div>
                        <div className={classes.offDay}>
                            Mandi Off Day<i style={{ fontSize: '20px', marginLeft: '5px', color: 'red', cursor: 'pointer' }} onClick={this.onAddOffDayClick.bind(this)} className="fa fa-plus-circle" aria-hidden="true"></i>
                            {this.state.offDayArr.map((row, i) => {
                                return (<div key={i} className={classes.card} >
                                    <div >
                                        <TextField
                                            select
                                            id="offType"
                                            label="Select Type"
                                            type="text"
                                            style={{ marginRight: '2%', width: '86%',marginLeft:'5%' }}
                                            value={row.offType}
                                            onChange={this.handleOffDayChange.bind(this, i, 'offType')} >
                                            {this.state.typeArr.map((option, i) => (
                                                <MenuItem key={i} value={option} selected={true}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <i className={"fa fa-window-close "  +classes.close} onClick={this.onCancelClick.bind(this,i)} aria-hidden="true"></i>
                                    </div>
                                    {row.offType === "every" && <div >
                                        <TextField
                                            select
                                            id="dayType"
                                            label="Day Type"
                                            type="text"
                                            style={{ marginRight: '2%', width: '88%' }}
                                            value={row.dayType}
                                            onChange={this.handleOffDayChange.bind(this, i, 'dayType')} >
                                            {this.state.dayType.map((option, i) => (
                                                <MenuItem key={i} value={option} selected={true}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>}
                                    {row.offType !== "dates" && <div >
                                        <TextField
                                            select
                                            id="day"
                                            label="Select Day"
                                            type="text"
                                            style={{ marginRight: '2%', width: '88%' }}
                                            value={row.day}
                                            onChange={this.handleOffDayChange.bind(this, i, 'day')} >
                                            {this.state.dayArr.map((option, i) => (
                                                <MenuItem key={i} value={option} selected={true}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>}
                                    {row.offType === "dates" && <div >
                                        <TextField
                                            margin="dense"
                                            id="dates"
                                            label="Enter Dates (colon Seprates)"
                                            type="text"
                                            style={{ marginRight: '2%', width: '88%' }}
                                            value={row.dates}
                                            onChange={this.handleOffDayChange.bind(this, i, 'dates')}
                                            fullWidth
                                        />
                                    </div>}
                                </div>);
                            })}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleUpdateClick.bind(this)} color="primary">Update</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
                </div>:
                 <Loader primaryText="Please wait.."/>}
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

EditMandiDataModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditMandiDataModal);