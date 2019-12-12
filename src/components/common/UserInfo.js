import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import OrderTable from './OrderTable';
import EditUser  from './EditUser';
import UserDetail from './UserDetail';
import commodityService from '../../app/commodityService/commodityService';

const styles = theme => ({
    dialogPaper: {
        minWidth: '700px',
        // maxWidth: '700px',
        minHeight: '600px',
        // maxHeight: '500px'
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
            isUpdate: false,
            isInfo: false,
            currentView:"userInfo"



        }
    }
    componentDidMount() {
        this.getCommodityNames();

    }

    async getCommodityNames(txt) {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.getCommodityNamesArray(resp.data.result.data) });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    getCommodityNamesArray(data) {
        try {
            var listData = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["name"]) {
                        listData.push(data[i]["name"])
                    }
                }
            }
            return listData;
        } catch (err) {
            console.log(err);
            return [];
        }
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
                        commodityList = {this.state.commodityList}
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