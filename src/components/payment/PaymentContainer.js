import React from 'react';
import PropTypes from 'prop-types';
// import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../common/Loader';
import Paper from '@material-ui/core/Paper';
import PaymentComponent from './components/PaymentComponent';
import buyerService from './../../app/buyerService/buyerService';

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
    },
    heading: {
        marginTop: '15px',
        fontSize: '20px',
        alignTtems: 'center',
        display: '-webkit-inline-box'
    }
});



class PayOutContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            buyersList: undefined,
            // payoutData: []

        }
        this.ismounted = true;
    }

    componentDidMount() {

    }

    formatDataForDropDown(data, labelKey, valuekey) {

        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i][labelKey], value: data[i][valuekey] });
            }
        }
        return optionsData;
    }

    componentWillUnmount() {
        this.ismounted = false;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                        <PaymentComponent
                            buyersList={this.state.buyersList} />
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