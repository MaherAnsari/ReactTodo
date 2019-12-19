import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fontWeight } from '@material-ui/system';

const styles = theme => ({
    root: {
        width: '100%',
        fontFamily: 'lato !important',
        marginTop: '15px',
        padding:'8px 24px'
        
    },
    head: {
        fontSize: '15px',
        fontWeight: 'bold',
        color:'#848383'
    },
    value: {
        fontSize: '15px',
        marginLeft:'6px',
        lineHieght:'2'
        // padding: '3px'
    },
    row:{
        display:'flex',
        width:'50%'
    },
    mainrow:{
        display:'flex',
        height:'30px',
        padding:'2px'
    },
    label:{
        background: 'red',
        borderRadius: '8px',
        padding:'0 10px 0 10px',
        fontSize:'13px',
        color:'#fff',
        height:'18px',
        marginTop:'4px'
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
        return (<div className={classes.root}>
            <div className={classes.mainrow}>
                <div className={classes.row}>
                <p className={classes.head}>Mobile : </p><p className={classes.value}> { this.props.data.mobile}</p>
                </div>
                <div className={classes.row}>
                <p className={classes.head}>Role : </p><p className={classes.value}> {this.getRole(this.props.data.role)}</p>
                </div>
            </div>
          
            <div className={classes.mainrow}>
            <div className={classes.row}>
                <p className={classes.head}>State : </p><p className={classes.value}>{this.props.data.state}</p>
            </div>
            <div className={classes.row}>
                <p className={classes.head}>District : </p><p className={classes.value}>{this.props.data.district}</p>
            </div>
            </div>
            <div className={classes.mainrow}>
            <div className={classes.row}>
                <p className={classes.head}>Second Mobile : </p><p className={classes.value}>{this.props.data.sec_mobile}</p>
            </div>
            <div className={classes.row}>
                <p className={classes.head}>Third Mobile: </p><p className={classes.value}>{this.props.data.third_mobile}</p>
            </div>
            </div>
            
            <div className={classes.mainrow}>
            <div className={classes.row}>
                <p className={classes.head}>Locality : </p><p className={classes.value}>{this.props.data.locality}</p>
            </div>
            <div className={classes.row}>
                <p className={classes.head}>Cutoff Limit : </p><p className={classes.value}>{this.props.data.exposure_cutoff_limit}</p>
            </div>
            </div>
            <div className={classes.mainrow}>
            <div className={classes.row}>
                <p className={classes.head}>Rating: </p><p className={classes.value}>{this.props.data.rating}</p>
            </div>
            <div className={classes.row}>
                <p className={classes.head}>Is Bijak Verified  </p><p className={classes.value,classes.label} style={{background:this.props.data.bijak_verified ? "green":"" ,lineHeight:'1.5',marginLeft:'10px'}}>{this.props.data.bijak_verified ? "Yes" :"No"}</p>
            </div>
            </div>
            <div className={classes.mainrow}>
            <div className={classes.row}>
                <p className={classes.head}>Is Bijak Assured  </p><p className={classes.value,classes.label} style={{background:this.props.data.bijak_assured ? "green":"" ,lineHeight:'1.5',marginLeft:'10px'}}>{this.props.data.bijak_assured ? "Yes" :"No"}</p>
            </div>
            <div className={classes.row}>
                <p className={classes.head}>Is User Enabled </p><p className={classes.value,classes.label} style={{background:this.props.data.active ? "green":"" ,lineHeight:'1.5' ,marginLeft:'10px'}}>{this.props.data.active ? "Yes" :"No"}</p>
            </div>
            </div>
           
            <div className={classes.mainrow}>
                <p className={classes.head}>FullName : </p><p className={classes.value}>{this.props.data.fullname}</p>
            </div>
            <div className={classes.mainrow}>
                <p className={classes.head}>FullName (Hindi) : </p><p className={classes.value}>{this.props.data.fullname_hindi}</p>
            </div>
            <div className={classes.mainrow}>
                <p className={classes.head}>Buisness Name : </p><p className={classes.value}>{this.props.data.business_name}</p>
            </div>
            <div className={classes.mainrow}>
                <p className={classes.head}>Buisness Name (Hindi) : </p><p className={classes.value}>{this.props.data.business_name_hindi}</p>
            </div>
            <div className={classes.mainrow}>
                <p className={classes.head}>Bijak Credit Limit : </p><p className={classes.value}>{this.props.data.bijak_credit_limit}</p>
            </div>
            <div className={classes.mainrow}>
                <p className={classes.head}>Partner Name : </p><p className={classes.value}>{this.props.data.partner_names}</p>
            </div>
            <div style={{ display: 'flex' }}>
                <p className={classes.head} style={{width:'15%'}}>Commodity  : </p><p className={classes.value} style={{width:'85%'}}>{this.props.data.default_commodity ? this.props.data.default_commodity.join() :"-"}</p>
            </div>
        </div >
        );
    }
}

UserDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDetail);