import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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

const transactionType = [
     "bijak-in",
     "bijak-out",
     "historical"
]

const transactionTypeMapping = {
    "bijak-in":"b_in",
    "bijak-out":"b_out",
    "historical": "b_hist"
}
const transactionTypeReverseMapping = {
    "b_in":"bijak-in",
    "b_out": "bijak-out",
    "b_hist":"historical"
}

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
            filterDataArr: this.props.filterDataArr || [],
            transactionTypeArray : this.formatTransactionType(this.props.transactionTypeArray) || []
        }
        console.log( this.props.filterDataArr )
        console.log( this.props.transactionTypeArray )
        console.log( this.formatTransactionType(this.props.transactionTypeArray) )
        this.handelAutoCompleteChange = this.handelAutoCompleteChange.bind(this);
        this.handelAutoCompleteChangeTransactionTypeArray = this.handelAutoCompleteChangeTransactionTypeArray.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterDataArr !== this.state.filterDataArr) {
            this.setState({ filterDataArr: nextProps.filterDataArr })
        }
        if (nextProps.transactionTypeArray !== this.state.transactionTypeArray) {
            this.setState({ transactionTypeArray: this.formatTransactionType(nextProps.transactionTypeArray) })
        }
    }
    
    formatTransactionType( data ){
        let fData = [];
        if(data && data.length  > 0){
            for( let i = 0; i < data.length ; i++ ){
                fData.push(transactionTypeReverseMapping[data[i]]);
            }
        }
        return fData;
    }

    handelAutoCompleteChange = (event, values) => {
        this.setState({ filterDataArr: values })
    }

    handelAutoCompleteChangeTransactionTypeArray = (event, values) => {
        console.log( values );
        this.setState({ transactionTypeArray : values });
    }
    

    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }

    handleAddClick(event) {
        console.log( this.state.transactionTypeArray )
        let tVal = [];
        let values = this.state.transactionTypeArray;
        if( values && values.length > 0 ){
            for( let i = 0; i < values.length ; i++){
                tVal.push( transactionTypeMapping[ values[i] ]  );
            }

        }
        console.log( tVal )
        this.props.onFilterAdded({
            "paymentType":this.state.filterDataArr,
            "transactionType": tVal });
    }


    render() {
        const { classes } = this.props;
        const { paymentFilterList, filterDataArr, transactionTypeArray } = this.state;
        return (
            <MuiThemeProvider theme={theme}><div > <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ height: '60px' }}
                    id="form-dialog-title">
                    <div style={{ color: '#000', fontFamily: 'Lato', fontSize: '20px', display: 'flex' }}>
                        Filter 
                                </div>
                </DialogTitle>
                <DialogContent>
                    <div x>
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

                        <div style={{ width: '100%' , marginTop:"2%"}}>
                            <Autocomplete
                                multiple
                                id="fixed-demo-transaction type"
                                options={transactionType}
                                value={ transactionTypeArray  }
                                getOptionLabel={e => e} 
                                onChange={this.handelAutoCompleteChangeTransactionTypeArray}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={ option } {...getTagProps({ index })} />
                                    ))
                                }
                                style={{ width: "98%" }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Select Transaction type"
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