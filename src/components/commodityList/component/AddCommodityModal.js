import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import commodityService from '../../../app/commodityService/commodityService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { Storage } from 'aws-amplify';
import Loader from '../../common/Loader';
import Utils from '../../../app/common/utils';

const styles = theme => ({

    dialogPaper: {
        minWidth: '450px',
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
    close: {
        color: '#000',
        fontSize: '20px'
    },
    card: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '15px'
    },
    muiSwitchroot: {
        float: "right"
    },
    input: {
        display: 'none',
    },


});

const commodity_category = ["featured", "general", "later"];

class AddCommodityModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            addCommodityDataObj: {
                "name":"",
                "category":"",
                "weight":"",
                "image_url":[],
                "active":true,
                "name_hindi":""
                },
            attachmentArray: [],
            showLoader: false
        }
    }

    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.openModal });
        }
    }


    handleChange = event => {
        let data = this.state.addCommodityDataObj;
        let id = event.target.id;
        let val = event.target.value;
        if (id === "weight") {
            data[id] = (val !== "" && !isNaN(val) ? Number(val) : 0);
        } else {
            data[id] = val;
        }
        this.setState({ addCommodityDataObj : data });
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

    }


    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }


    handleDialogCancel(event) {
        this.setState({ open: false }, function () {
            this.props.onEditModalCancel();
        })
    }


    handleStateChange = (id, event) => {
        let data = this.state.addCommodityDataObj;
        if (id === "active") {
            data[id] = event.target.checked;
        } else {
            let val = event.target.value;
                data[id] = val;
        }
        this.setState({ addCommodityDataObj: data });
    };


    handleAddCommodityClicked(event) {
        let obj =  this.state.addCommodityDataObj
        if (this.state.attachmentArray && this.state.attachmentArray.length > 0) {
            obj["image_url"] = this.state.attachmentArray[0]["image_url"];
        }

        if( this.checkIfValidForm( obj )){
        this.addCommodity(obj);
    }else{
        alert("Please fill all the fields")
    }
    }

    checkIfValidForm(data) {
        var isValid = true;
        for (var key in data) {
            if (data[key] === "") {
                isValid = false;
                console.log( key + "========="+ data[key])
            }
            if (key === "weight" && typeof (data[key]) === "string") {
                console.log( key + "========="+ data[key])
                isValid = false;
            }
        }
        return isValid;
    }


    async addCommodity(payload) {
        this.setState({ showLoader : true});
        let resp = await commodityService.addCommodity(payload);
        this.setState({ showLoader : false });
        if (resp.data.status === 1) {
            alert("Successfully added");
            this.props.onEditModalClosed();
        } else {
            alert("Oops! There was an error");
        }
    }



    fileChangedHandler = (event) => {
        let { selectedFileName, isFileLoading, file } = this.state;
        file = event.target.files[0];
        selectedFileName = file ? file.name : null;
        isFileLoading = !file ? false : true;
        this.setState({ selectedFileName, isFileLoading, file })
        let updatedFileName = Utils.getImageName(file.name);
        Storage.configure({
            level: 'public',
            AWSS3: {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',//Your bucket name;
                region: 'ap-south-1'//Specify the region your bucket was created in;
            }
        });

        let updatedNameOfFile = this.state.addCommodityDataObj["name"] + "." + file.name.split(".")[1];

        Storage.put("commodity/" + updatedFileName, file, {
            contentType: 'image/png'
        }).then(result => {
            let data = result
            let { attachmentArray } = this.state;
            attachmentArray = [];
            let attachmentObj = {
                bucket: 'bijakteaminternal-userfiles-mobilehub-429986086',
                filename: updatedFileName,
                key: result.key
            }
            Storage.get("commodity/" + updatedFileName)
                .then(result => {

                    console.log(result.split("?")[0]);
                    attachmentObj["image_url"] = result.split("?")[0];

                    attachmentArray.push(attachmentObj)
                    this.setState({
                        isFileUpload: false,
                        attachmentArray
                    })

                })
                .catch(err => console.log(err));
            console.log(data)
        }
        ).catch(err => {
            this.setState({
                isFileUpload: false
            })
            console.log(err)
        }
        );
    }

    deleteItem(key) {
        let { attachmentArray } = this.state;
        for (var i = 0; i < attachmentArray.length; i++) {
            var indFile = attachmentArray[i];
            if (indFile.key === key) {
                attachmentArray.splice(i, 1);
                this.setState({ attachmentArray });
            }
        }
    }


    render() {
        const { classes } = this.props;
        const {showLoader, addCommodityDataObj } = this.state;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                { !showLoader ? <div>
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '60px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', fontFamily: 'Lato', fontSize: '18px' }}
                    >Add commodity data</p>
                </DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%' }}>

                            <div >
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Commodity name"
                                    type="text"
                                    style={{ marginRight: '2%' }}
                                    value={addCommodityDataObj.name}
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                            </div>
                            <div >
                                <span style={{ lineHeight: "40px" }}>Enable / disable commodity</span>
                                <Switch
                                    classes={{ root: classes.muiSwitchroot }}
                                    checked={addCommodityDataObj.active}
                                    onChange={this.handleStateChange.bind(this, "active")}
                                    value={addCommodityDataObj.active}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />

                            </div>

                            <div >
                                <TextField
                                    select
                                    id="category"
                                    label="Select category"
                                    type="text"
                                    style={{ marginRight: '2%', width: "100%" }}
                                    value={addCommodityDataObj.category}
                                    onChange={this.handleStateChange.bind(this, 'category')}>
                                    {commodity_category.map((option, i) => (
                                        <MenuItem key={i} value={option} selected={true}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div >
                                <TextField
                                    margin="dense"
                                    id="name_hindi"
                                    label="Hindi name"
                                    type="text"
                                    style={{ marginRight: '2%' }}
                                    value={addCommodityDataObj.name_hindi}
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                            </div>
                            <div >
                                <TextField
                                    margin="dense"
                                    id="weight"
                                    label="Weight"
                                    type="text"
                                    style={{ marginRight: '2%' }}
                                    value={addCommodityDataObj.weight}
                                    onChange={this.handleChange.bind(this)}
                                    fullWidth
                                />
                            </div>

                            {/* image Option */}
                            {this.state.attachmentArray && this.state.attachmentArray.length !== 0 &&
                            <div style={{ fontFamily: "lato", padding: "10px" }}>
                                Uploaded Images
                        </div>}
                        <div style={{ display: "flex" }}>
                            {(this.state.attachmentArray && this.state.attachmentArray.length !== 0) && this.state.attachmentArray.map((keyObj, i) => (
                                // <div key={"imhs_" + i} style={{ width: "150px", marginLeft: "5px", boxShadow: " 0px 0px 10px 0px rgba(0,0,0,0.75)" }} >
                                //     <img src={key} alt={key} height="150px" />
                                // </div>
                                <div key={"imhs_" + i} className="transaction-supporting-image">
                                    <img src={keyObj["image_url"]} style={{ cursor: "zoom-in" }} onClick={() => window.open(keyObj["image_url"], "_blank")} alt={keyObj["image_url"]} height="150px" width="150px" />
                                    <div className="transaction-delete-icon" onClick={this.deleteItem.bind(this, keyObj.key)}>
                                        <i className="fa fa-trash fa-lg"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                            <div style={{ width: "423px" }}>

                                <Grid container direction="row" alignItems="stretch">
                                {this.state.attachmentArray && this.state.attachmentArray.length === 0 && <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'left', margin: "11px 0px 5px 0px", marginBottom: 5 }}>
                                    <input
                                        className={classes.input}
                                        id="flat-button2-file"
                                        type="file"
                                        onClick={(event) => {
                                            event.target.value = null
                                        }}
                                        onChange={this.fileChangedHandler.bind(this)}
                                    />
                                    <label htmlFor="flat-button2-file">
                                        <Button component="span" style={{ border: '1px solid #d5d2d2', padding: '5px 10px', fontSize: 12, backgroundColor: '#dbdbdb' }}  >
                                            Choose commodity image
                            </Button>
                                    </label>
                                </Grid>}
                                    {/* <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'left', margin: "11px 0px 5px 0px", marginBottom: 5 }}>
                                        <input
                                            className={classes.input}
                                            id="flat-button2-file"
                                            type="file"
                                            onClick={(event) => {
                                                event.target.value = null
                                            }}
                                            onChange={this.fileChangedHandler.bind(this)}
                                        />
                                        <label htmlFor="flat-button2-file">
                                            <Button component="span" style={{ border: '1px solid #d5d2d2', padding: '5px 10px', fontSize: 12, backgroundColor: '#dbdbdb' }}  >
                                                change commodity image
                            </Button>
                                        </label>
                                    </Grid> */}
                                    {/* <Grid item xs={12} sm={12} md={12}>
                                        {(this.state.attachmentArray && this.state.attachmentArray.length !== 0) &&
                                            <React.Fragment>
                                                {this.state.attachmentArray.map((indUpload, index) => (
                                                    <Grid key={index} container direction="row" style={{ border: '1px solid #cbccd4', padding: '2px 5px', backgroundColor: '#f4f4f4', borderRadius: 20, marginBottom: 5, alignItems: 'center' }}>
                                                        <React.Fragment>
                                                            <Grid item xs={1} sm={1} md={1} style={{ textAlign: 'center' }}>
                                                                <img src="https://img.icons8.com/plasticine/2x/file.png" alt="file" height="24" width="24"></img>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={10} >
                                                                <span target="_blank"><span style={{ margin: 0, fontSize: 13 }}>{indUpload.filename}</span></span>

                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={1} onClick={this.deleteItem.bind(this, indUpload.key)}>
                                                                <p style={{ margin: 0, fontSize: 13, color: '#547df9', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}>X</p>
                                                            </Grid>
                                                        </React.Fragment>
                                                    </Grid>
                                                ))}
                                            </React.Fragment>
                                        }
                                    </Grid> */}
                                </Grid>

                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleAddCommodityClicked.bind(this)} color="primary">Add</Button>
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

AddCommodityModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddCommodityModal);