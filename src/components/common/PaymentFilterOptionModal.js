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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
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
        minWidth: '500px',
        // maxWidth: '700px',
        minHeight: '200px',
        maxHeight: '300px'
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

class PaymentFilterOptionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paymentFilterList: ["transaction_failed", "transaction_initiated", "payout_reversed", "payout_cancelled",
                "payout_rejected", "payout_processed", "payout_initiated", "payout_queued", "payout_pending", "payout_processing",
                "approved", "pending_approved", "failed"],

            // "payout_processed", "transaction_initiated", "payout_initiated",
            //                     "payout_queued", "payout_pending", "payout_processing", ""],
            open: this.props.openModal,
            filterDataArr: this.props.filterDataArr || []
        }
        console.log( this.props.filterDataArr )
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterDataArr !== this.state.filterDataArr) {
            this.setState({ filterDataArr: nextProps.filterDataArr })
        }
    }

    handelAutoCompleteChange = (event, values) => {
        this.setState({ filterDataArr: values })
    }

    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handleAddClick(event) {
        this.props.onFilterAdded(this.state.filterDataArr);
    }


    render() {
        const { classes } = this.props;
        const { paymentFilterList, filterDataArr } = this.state;
        return (
            <MuiThemeProvider theme={theme}><div > <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ height: '60px' }}
                    id="form-dialog-title">
                    <div style={{ color: '#000', fontFamily: 'Lato', fontSize: '20px', display: 'flex' }}>
                        Filter by status
                                </div>
                </DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%' }}>
                            <Autocomplete
                                multiple
                                id="fixed-demo"
                                options={paymentFilterList}
                                value={ filterDataArr }
                                getOptionLabel={e => e} 
                                onChange={this.handelAutoCompleteChange}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                style={{ width: "98%" }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Select payment status"
                                        placeholder="Search"
                                        fullWidth
                                    />
                                )}
                            />
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

PaymentFilterOptionModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaymentFilterOptionModal);