import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from '../../app/common/utils';
import Tooltip from '@material-ui/core/Tooltip';
var moment = require('moment');

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
    },
    lightTooltip: {
        fontSize: '16px',
    },

});

class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        // console.log(this.props.data.role)
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

    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
        return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0] + " " + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
        // return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0]}</div>
    }

    getCommodityNames(data, classes) {
        if (data) {
            let cName = data.join(", ");
            if (cName.length > 45) {
                return (
                    <Tooltip title={cName} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                        <p
                            className={classes.value} style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }} >: &nbsp; {cName} </p>
                    </Tooltip>
                )
            } else {
                return (<p className={classes.value}>: &nbsp; {cName} </p>)
            }
        } else {
            return (<p className={classes.value}>: &nbsp; {"-"} </p>)
        }
    }

    render() {
        const { classes, creditLimitData } = this.props;
        return (
            <div className={classes.root}>
                <div style={{ width: "100%", display: "flex", marginTop: "5%" }}>
                    <div style={{ width: "49%" }}>

                        <div className={classes.row}>
                            <p className={classes.head}>Full Name  </p>
                            <p className={classes.value}
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>: &nbsp; {this.props.data.fullname}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Business Name  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.business_name}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Mobile No. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.mobile}</p>
                        </div>
                        <div className={classes.row}>
                            <p className={classes.head}>State </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.state ? this.props.data.state : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>District </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.district ? this.props.data.district : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Locality </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.locality ? this.props.data.locality : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Commodity </p>
                            {this.getCommodityNames(this.props.data.default_commodity, classes)}
                            {/* <p className={classes.value}>: &nbsp; {this.props.data.default_commodity ? this.getCommodityName(this.props.data.default_commodity) : "-"} </p> */}
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Second Mobile no. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.sec_mobile ? this.props.data.sec_mobile : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Third Mobile no. </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.third_mobile ? this.props.data.third_mobile : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Partner name </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.partner_names ? this.props.data.partner_names : ""}</p>
                        </div>

                    </div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "2%" }}></div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "49%" }}>
                        <div className={classes.row}>
                            <p className={classes.head}> Bijak credit limit  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.bijak_credit_limit ? this.props.data.bijak_credit_limit : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Available Credit Limit  </p>
                            <p className={classes.value}>: &nbsp; {creditLimitData ? creditLimitData : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Cutoff Limit </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.exposure_cutoff_limit ? this.props.data.exposure_cutoff_limit : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Rating </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.rating || this.props.data.rating === 0 ? this.props.data.rating : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Is Bijak Verified </p>
                            <p className={classes.value}>: &nbsp;
                            <span style={{
                                    background: (this.props.data.bijak_verified ? "#5bbc9b" : "#e63232"),
                                    padding: "4px",
                                    borderRadius: "3px",
                                    color: "#fff"
                                }}>
                                    {this.props.data.bijak_verified ? "Yes" : "No"}</span></p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Is Bijak Assured </p>
                            <p className={classes.value}>: &nbsp;
                            <span style={{
                                    background: (this.props.data.bijak_assured ? "#5bbc9b" : "#e63232"),
                                    padding: "4px",
                                    borderRadius: "3px",
                                    color: "#fff"
                                }}>
                                    {this.props.data.bijak_assured ? "Yes" : "No"}</span></p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Is User Enabled </p>
                            <p className={classes.value}>: &nbsp;
                            <span style={{
                                    background: (this.props.data.active ? "#5bbc9b" : "#e63232"),
                                    padding: "4px",
                                    borderRadius: "3px",
                                    color: "#fff"
                                }}>
                                    {this.props.data.active ? "Yes" : "No"}</span></p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Total Orders </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.ordercount ? this.props.data.ordercount : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Total Payments </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.paymentcount ? this.props.data.paymentcount : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Bank Account Connected </p>
                            <p className={classes.value}>: &nbsp; {""}</p>
                        </div>
                    </div>

                </div>

                <hr style={{ margin: "10px 0px 10px 0px" }} />
                <div style={{ width: "100%", display: "flex" }}>
                    <div style={{ width: "49%" }}>

                        <div className={classes.row}>
                            <p className={classes.head}>Created date  </p>
                            <p className={classes.value}>: &nbsp; {this.props.data.createdtime ? Utils.formatDateData(this.props.data.createdtime) : ""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}>Last updated  </p>
                            {/* <p className={classes.value}>: &nbsp; {this.props.data.updatedtime ?this.formatDateAndTime(this.props.data.updatedtime) : ""}</p> */}
                            <p className={classes.value}>: &nbsp; {this.props.data.updatedtime ? Utils.formatDateData(this.props.data.updatedtime) : ""}</p>
                        </div>

                    </div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "2%" }}></div>
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{ width: "49%" }}>
                        <div className={classes.row}>
                            <p className={classes.head}> Last Login  </p>
                            <p className={classes.value}>: &nbsp; {""}</p>
                        </div>

                        <div className={classes.row}>
                            <p className={classes.head}> Available Credit Limit  </p>
                            <p className={classes.value}>: &nbsp; {creditLimitData ? creditLimitData : ""}</p>
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

