import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getAccessAccordingToRole } from '../../config/appConfig';

const styles = theme => ({
    root: {
        width: '100%',
        fontFamily: 'lato !important',
        marginTop: '15px',
        padding: '8px 24px'

    },
    span_main: {
        height: "32px",
        fontFamily: "Roboto",
        fontSize: "15px",
        fontWeight: 500,
        padding: "8px",
        color: "#fff",
        borderRadius: "5px",
        marginLeft: "10px",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: 2,
        letterSpacing: "normal",
        color: "#ffffff",
        cursor:"pointer"
    }

});

class UserDetailsFooter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaymentInfoModal : this.props.isPaymentInfoModal || false
        }
    }

    onButtonClicked( btnName ){
        let type = "redirect";
        if(["orders", "payment"].indexOf( btnName ) > -1 ){
            type = "modal"
        }
        this.props.onFooterButtonClicked({ type ,btnName })
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{ marginTop: "10px",marginBottom:'10px', bottom: "25px" ,position: "absolute"}}>
                { !this.state.isPaymentInfoModal &&  getAccessAccordingToRole("addOrder") && 
                <span className={classes.span_main}
                onClick={( event )=> this.onButtonClicked( "orders" )}
                    style={{
                        backgroundColor: "#8da47e",
                        marginLeft: "15px"
                    }}>
                    ADD ORDER
                </span>}

                { !this.state.isPaymentInfoModal && getAccessAccordingToRole("addPayment") &&
                <span className={classes.span_main}
                onClick={( event )=> this.onButtonClicked( "payment" )}
                    style={{
                        backgroundColor: "#3498db"
                    }}>
                    ADD PAYMENT
                </span>}

                <span className={classes.span_main}
                onClick={( event )=> this.onButtonClicked( "editUser" )}
                    style={{
                        backgroundColor: "#c54b6c"
                    }}>
                    EDIT USER
                </span>

                <span className={classes.span_main}
                onClick={( event )=> this.onButtonClicked( "creditLimit" )}
                    style={{
                        backgroundColor: "#8fa2a6"
                    }}>
                    CREDIT LIMIT MODIFICATION
                </span>

                <span className={classes.span_main}
                onClick={( event )=> this.onButtonClicked( "accountDetail" )}
                    style={{
                        backgroundColor: "#ff906b"
                    }}>
                    ACCOUNT DETAILS MODIFICATION
                </span>

            </div>
        )
    }
}

UserDetailsFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDetailsFooter);

