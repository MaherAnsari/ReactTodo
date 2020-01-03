import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TodaysPaymentTable from './components/TodaysPaymentTable';

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

class TodaysPaymentContainer extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div>
                            <TodaysPaymentTable/>
                    </div>
                </Paper>
            </div>
        );
    }
}
TodaysPaymentContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(TodaysPaymentContainer);