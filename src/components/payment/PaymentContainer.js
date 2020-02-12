import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PaymentComponent from './components/PaymentComponent';
// import sampleFile from '../sampleDownloadFiles/bulk-add-payment-data-sample.csv';

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
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        <PaymentComponent />
                    {/* <div className="fixedLeftBtnContainer">
                    <a download={"bulk-add-payment-data-sample.csv"} href={sampleFile} title="sampleFile">
                        <div className="fixedLeftBtn" style={{ display: 'flex' }}>
                            <i className="fa fa-cloud-download add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>Download sample</p></div>
                                                    
                    </a>
                    </div> */}

                   
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