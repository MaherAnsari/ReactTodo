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
            dataObj: {},
            supportingImagesOption: { "All": "All", "Yes": "yes", "No": "no" },
            filterDataArr: []



        }
    }
    componentDidMount() {
        this.setState({ dataObj: this.props.filterData });
    }

    handleStateChange = (id, event) => {
        let data = this.state.dataObj;
        data[id] = event.target.value;
        this.setState({ dataObj: data });
    }


    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handleAddClick(event) {
        this.props.onFilterAdded(this.state.dataObj);
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

                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '98%' }}>
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