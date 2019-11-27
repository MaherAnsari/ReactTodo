import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    root: {
        display: 'table',
        width: '100%',
        height: '30vh',
        textAlign:"center"

    },
    branchdiv: {
        width: '10%',
        textAlign: '-webkit-center',
        display: 'table-cell',
        verticalAlign: 'middle'
    },
    pText: {
        fontSize: '14px',
        fontFamily: "Montserrat",
        fontWeight: 500,
        color: "#000"
    },
    defaultTemplate: { 
        height: '30vh', 
        paddingTop: '10vh'
    },
    defaultSpan: { display: 'grid', fontSize: '25px' },
    defaultIcon: { fontSize: '65px', color: "#384952" },

});


class NoDataAvailable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            primaryText: this.props.primaryText || 'Loading Data... Please wait',
        };
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.branchdiv}>
                <div className={classes.defaultTemplate}>
             <span className={classes.defaultSpan}>
                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>
          </div>
                </div>
            </div>
        )
    }
};


export default withStyles(styles)(NoDataAvailable);

