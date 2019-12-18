import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PaymentComponent from './components/PaymentComponent';
import sampleFile from '../sampleDownloadFiles/bulk-add-payment-data-sample.csv';

const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth: '1200px',
        minHeight: '80vh',
    },
    card: {
        maxWidth: '100%',
        marginTop: '15px',
        height: '97%',
    }
});



class PayOutContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showAddTransactionModal: false
        }
    }

    render() {
        const { classes } = this.props;
        const { showAddTransactionModal } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        <PaymentComponent />
                        {/* <div className="updateBtndef">
                            <div
                                className="updateBtnFixed"
                                style={{ display: 'flex' }}
                                onClick={(event) => this.setState({ showAddTransactionModal: true })}
                            >
                                <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                                <p>Add Transaction</p></div>
                        </div> */}
                        {/* {showAddTransactionModal &&
                            <AddTransactionModal
                                open={showAddTransactionModal}
                                onTransactionAdded={(event)=> this.onTransactionDataAdded()}
                                onEditModalCancel={(event) => this.setState({ showAddTransactionModal: false })}
                            />} */}
                    <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex' }}
                            onClick={() => { window.location.href = sampleFile }}
                            >
                            <i className="fa fa-cloud-download add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Download sample</p></div>
                    </div>

                     <div className="fixedLeftBtnContainer">
                        <div className="fixedLeftBtn" style={{ display: 'flex', left:"16%", background:"#4da443" }}
                            // onClick={this.handleClickOpen.bind(this)}
                            >
                            <i className="fa fa-cloud-upload add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Upload file</p></div>
                    </div>
                    </div>
                </Paper>
            </div>
        );
    }
}
PayOutContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PayOutContainer);