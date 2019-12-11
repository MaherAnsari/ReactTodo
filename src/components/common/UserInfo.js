import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InfoIcon from '@material-ui/icons/Info';
import ViewListIcon from '@material-ui/icons/ViewList';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import OrderTable from './OrderTable';
import EditUser  from './EditUser';
import UserDetail from './UserDetail';
const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '600px',
        // maxHeight: '500px'
    },
    formAddBtn: {
        width: '90%',
        borderRadius: '10px',
        fontSize: '20px',
        textTransform: 'uppercase',
        backgroundColor: '#4d9fa0 ',
        color: '#fff',
        height: '45px',
        marginBottom: '15px',
        marginTop: "11px",
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    formRoot: {
        // display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        // marginLeft: '25%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    },
    profile:{
        marginLeft: '30%',
    background: 'red',
    width: '40px',
    borderRadius: '10px'
    }

});

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            dataObj: {
                "mobile": "",
                "profile_completed": true,
                "fullname": "",
                "business_name": "",
                "locality": "",
                "district": "",
                "state": "",
                "role": this.props.role,
                "default_commodity": [],
                "bijak_verified": false,
                "bijak_assured": false,
                "exposure_cutoff_limit": 100,
                "active": true,
                "rating": 5
            },
            requiredKey: ['fullname', 'mobile', 'role'],
            roleList: ['la', 'ca', 'broker'],
            isUpdate: false,
            isInfo: false,
            payload: {},
            "districtList": [],
            currentView:"orders"



        }
    }
    componentDidMount() {


    }

 
    getHeader(){
        if(this.props.isInfo){
            return this.props.data.fullname ;
        }else{
            return "User Data";
        }
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    getProfileColor(data){
        if(data <= 2 ){
            return 'red';
        }else if(data >2 && data <= 5){
            return '#d8d805';
        }else{
            return "green";
        }
    }

    handleChange = (event, value) => {
        // console.log(event,value);
        this.setState({ currentView: value });
      };

    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
                    <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '20px',display:'flex',marginLeft:'35%',width:'60%' }}>{this.getHeader()}
    {this.props.isInfo && <p className={classes.profile} style={{background:this.getProfileColor(this.props.data.profile_segment)}}>{this.props.data.profile_segment}</p>}</div>  </DialogTitle> 
            <DialogContent style={{width:'100%',padding:'0'}}> 
            <Paper square className={classes.root}>
      <Tabs
        value={this.state.currentView}
        onChange={this.handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="icon label tabs example"
      >
        <Tab  label="User Info"  value="userInfo" />
        <Tab  label="Orders"  value="orders" />
        <Tab label="Edit User"  value="editUser"/>
      </Tabs>
    </Paper>
    
    {this.state.currentView === 'orders' ? <OrderTable openModal={this.state.open}
                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                        data={this.props.data}
                        /> : ""} 

{this.state.currentView === 'editUser' ? <EditUser openModal={this.state.open}
                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                        data={this.props.data}
                        onEditModalCancel = {this.handleDialogCancel.bind(this)}
                        /> : ""} 

{this.state.currentView === 'userInfo' ? <UserDetail openModal={this.state.open}
                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                        
                        data={this.props.data}
                        /> : ""} 

            </DialogContent>
        
        </Dialog>
      
        </div>
        );
    }
}

UserInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserInfo);