import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import { fontWeight } from '@material-ui/system';

const styles = theme => ({
    root: {
        width: '100%',
        fontFamily: 'lato !important',
        marginTop: '15px',
        padding: '8px 24px'

    },
    head: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#848383',
        width: "45%",
        
    padding: "5PX 0PX"
    },
    value: {
        fontSize: '15px',
        marginLeft: '6px',
        lineHieght: '2',
        width: "45%"
        // padding: '3px'
    },
    row: {
        display: 'flex',
        // width: '50%'
    },
    mainrow: {
        display: 'flex',
        height: '30px',
        padding: '2px'
    },
    label: {
        background: 'red',
        borderRadius: '8px',
        padding: '0 10px 0 10px',
        fontSize: '13px',
        color: '#fff',
        height: '18px',
        marginTop: '4px'
    }

});

class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        console.log(this.props.data.role)
    }
    componentDidMount() {


    }

    getRole(role) {
        if (role === "ca") {
            return "buyer";
        } else if (role === 'la') {
            return "supplier";
        } else if (role === 'broker') {
            return "broker";
        } else {
            return "NA";
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div style={{ width: "100%", display: "flex", marginTop: "5%" }}>
                    <div style={{ width: "49%" }}>

                        <div className={classes.row}>
                            <p className={classes.head}>Full Name  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Business Name  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Mobile No. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>
                        <div className={classes.row}>
                            <p className={classes.head}>State </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>District </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Locality </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Commodity </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Second Mobile no. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Third Mobile no. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Partner name </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                    </div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "2%" }}></div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "49%" }}>
                        <div className={classes.row}>
                            <p className={classes.head}> Bijak credit limit  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Available Credit Limit  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Cutoff Limit </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Rating </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Is Bijak Verified </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Is Bijak Verified </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Is Bijak Assured </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Is User Enabled </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Total Orders </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Total Payments </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Bank Account Connected </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>
                    </div>

                </div>

                <hr style={{ margin: "10px 0px 10px 0px" }} />
                <div style={{ width: "100%", display: "flex" }}>
                    <div style={{ width: "49%" }}>

                        <div className={classes.row}>
                            <p className={classes.head}>Created date  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Last updated  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                    </div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "2%" }}></div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "49%" }}>
                        <div className={classes.row}>
                            <p className={classes.head}> Last Login  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Available Credit Limit  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>
                    </div>
                    </div>



                </div>
                )
            }
        }
        
UserDetail.propTypes = {
                    classes: PropTypes.object.isRequired,
            };
            
            export default withStyles(styles)(UserDetail);
            
