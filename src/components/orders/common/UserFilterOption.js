import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
    overrides: {

        MuiInputBase: {
            input: {
                color: "#000"
            }
        }
    }
});

const styles = theme => ({
    dialogPaper: {
        minWidth: '400px',
        // maxWidth: '700px',
        minHeight: '200px',
        // maxHeight: '500px'
    },
    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    },
    card: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '15px'
    },
    offDay: {
        textAlign: 'center',
        width: '48%',
        // marginTop: '33px',
        marginLeft: '10px'
    }
});

class UserFilterOption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            dataObj: {
                "supporting_images": "",
                "id": "",
                "bijak_amt": ""
            },
            supportingImagesOption: { "All": "All", "Yes": "yes", "No": "no" },
            amountCondition: {
                gt: "Greater then",
                lt: "Less then",
                lte: "Less than equal",
                gte: "Greater than equal",
                eq: "Equal to"
            },
            slectedCondition: "",
            showCodnError: false
        }
    }

    componentDidMount() {
        let filterProps = Object.assign({}, this.props.filterData); 
        console.log( filterProps )
        if( filterProps.hasOwnProperty("bijak_amt")){
            let filterAmt = filterProps["bijak_amt"].split("_");
            filterProps["bijak_amt"] = filterAmt[1];
            this.setState({ dataObj: filterProps, slectedCondition :   filterAmt[0] });
        }else{
            this.setState({ dataObj: filterProps });
        }
    }

    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        let val = event.target.value;
        if (id === "supporting_images") {
            data[id] = val;
        } else {
            if (val === "" || !isNaN(val)) {
                data[id] = val === "" ? "" : Number(val);
            }
        }
        this.setState({ dataObj: data });
    }


    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handleAddClick(event) {
        let fObj =  Object.assign({}, this.state.dataObj); ;
        console.log(fObj)
        let uObj = {};
        if (fObj.hasOwnProperty("supporting_images") && fObj["supporting_images"] !== "") {
            uObj["supporting_images"] = fObj["supporting_images"];
        }
        if (fObj.hasOwnProperty("id") && fObj["id"] !== "") {
            uObj["id"] = fObj["id"];
        }
        if (fObj.hasOwnProperty("bijak_amt") && fObj["bijak_amt"] !== "") {
            if (this.state.slectedCondition === "") {
                this.setState({ showCodnError: true })
                return;
            }else{
                uObj["bijak_amt"] = this.state.slectedCondition + "_" + fObj["bijak_amt"];
            }
            
        }
        console.log(uObj)
        this.props.onFilterAdded(uObj);
    }

    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}><div > <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ height: '60px' }} id="form-dialog-title"><div style={{ color: '#000', fontFamily: 'Lato', fontSize: '20px', display: 'flex' }}>Filter Option</div>  </DialogTitle>
                <DialogContent>

                    <div style={{}}>
                        <div style={{ width: '98%', display: 'flex' }}>
                            <TextField
                                select
                                id="supporting_images"
                                label="Supporting Images"
                                type="text"
                                style={{ marginRight: '2%', width: '98%', color: '#000', marginTop: '5px' }}
                                value={this.state.dataObj.supporting_images}
                                onChange={this.handleStateChange.bind(this, 'supporting_images')}
                            >
                                {Object.keys(this.state.supportingImagesOption).map((keys, i) => (
                                    <MenuItem key={i} value={this.state.supportingImagesOption[keys]} selected={true}>
                                        {keys}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        {/* ------order Id-------- */}
                        <div style={{ width: '98%', display: 'flex', marginTop: "5px" }}>
                            <div style={{ marginRight: '2%', width: '30%', color: '#000', marginTop: '5px', lineHeight: "2pc" }}>
                                Order Id &nbsp; :
                            </div> &nbsp;
                            <TextField
                                id="id"
                                type="text"
                                value={this.state.dataObj.id}
                                style={{ marginRight: '2%', width: '68%', color: '#000', marginTop: '5px' }}
                                onChange={this.handleStateChange.bind(this, 'id')}
                            >
                            </TextField>
                        </div>
                        {/* ------Bijak amount-------- */}
                        <div style={{ width: '98%', display: 'flex', marginTop: "5px" }}>
                            <div style={{ marginRight: '2%', width: '30%', color: '#000', marginTop: '5px', lineHeight: "2pc" }}>
                                Amount &nbsp; :
                            </div> &nbsp;
                            <TextField
                                select
                                id="slectedCondition"
                                // label="Condition"
                                type="text"
                                error={this.state.showCodnError}
                                style={{ marginRight: '2%', width: '38%', color: '#000', marginTop: '5px' }}
                                value={this.state.slectedCondition}
                                onChange={(event) => this.setState({ slectedCondition: event.target.value, showCodnError: false })}
                            >
                                {Object.keys(this.state.amountCondition).map((keys, i) => (
                                    <MenuItem key={i} value={keys} selected={true}>
                                        {this.state.amountCondition[keys]}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="bijak_amt"
                                type="text"
                                value={this.state.dataObj.bijak_amt}
                                style={{ marginRight: '2%', width: '30%', color: '#000', marginTop: '5px' }}
                                onChange={this.handleStateChange.bind(this, 'bijak_amt')}
                            >
                            </TextField>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Ok</Button>
                    <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>

            </div >
            </MuiThemeProvider>
        );
    }
}

UserFilterOption.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserFilterOption);