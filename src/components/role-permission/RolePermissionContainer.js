import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import RoleDialog from '../common/roleDialog';
import roleService from '../../app/roleService/roleService';
import NoDataAvailable from '../common/NoDataAvailable';
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



class RolePermissionContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showModal:false,
            userList:null,
            isupdate:false,
            editdata:null
        }
    }

    handleClickOpen(event){
        this.setState({showModal:true})
    }

    componentDidMount(){
        this.getRoleList();
    }

    getRoleList = async () => {
        try {
            this.setState({ showLoader: true })
            let resp = await roleService.getListOfUser();
            if (resp.data.status === 1 && resp.data.result) {
               console.log(resp.data.result);
               this.setState({userList:resp.data.result});
            }
            this.setState({ showLoader: false })
        } catch (err) {
            console.error(err);
            this.setState({ showLoader: false })
        }
    }

    handleDialogClose(event){
        this.setState({userList:null,showModal:false,isupdate:false,editdata:null});
        this.getRoleList();
    }

    handleDialogCancel(event){
        this.setState({showModal:false,isupdate:false,editdata:null});
        // this.getRoleList();
    }


    onUserClick(row,event){
        console.log(row,event);
        this.setState({isupdate:true,editdata:row,showModal:true});
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.card} >
                    <div className="orderList" style={{backgroundColor:'#2e3247',fontSize:'18px'}}>
                        <div style={{ width: "25%" }}>User</div>
                        <div style={{ width: "75%" }}>Role/Permission</div>

                    </div>
                    {this.state.userList ? <div style={{ maxHeight: "70vh", overflowY: "scroll" }} >
                    {this.state.userList.map((row, i) => {
                                            return (
                        <div key={i} style={{height:'40px',display:'flex',paddingTop:'10px',backgroundColor:i % 2 === 0?'':'#f2f4f5'}}>
                        <div style={{ width: "25%",cursor:'pointer' }} onClick={this.onUserClick.bind(this,row)} className=" name-span" >{row.name+'('+row.mobile+')'}</div>
                        <div style={{ width: "75%" }}>{row.permissions}</div>
                       
                        </div>
                         )
                        })}
                    </div>:<NoDataAvailable />}
                </Paper>
                {this.state.showModal ? <RoleDialog openModal={this.state.showModal}
                        onEditModalClosed={this.handleDialogClose.bind(this)}
                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                        editdata={this.state.editdata}
                        isupdate={this.state.isupdate}
                    /> : ""}
                <div className="updateBtndef">
                        <div className="updateBtnFixed" style={{ display: 'flex', right:"2px" }} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                            <p style={{
                                fontSize: "14px",
                                fontFamily: "lato",
                                fontWeight: 600
                            }}>ADD USER</p></div>
                    </div>
            </div>
        );
    }
}
RolePermissionContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(RolePermissionContainer);