import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import  userListService  from './../../app/userListService/userListService';
import Loader from '../common/Loader';
import UserListTable from './component/UserListTable';
import UserDialog from './component/UserDialog';
import commodityService from '../../app/commodityService/commodityService';

const styles = theme => ({
    root: {
        width: '100%',
        // marginTop: '30px',
        // height: '88vh',
        overflow: 'auto',
        fontFamily: 'Lato !important',
        maxWidth:'1200px'
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
    },
  

});



class UserDataContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal:false,
            dataList:null,
            showLoader:true,
            commodityList:null
          
        };
    }

    

    async componentDidMount() {
       this.getData();
    //    this.getCommodityNames();
    
    }

    // async getCommodityNames() {
    //     try {
    //         let resp = await commodityService.getCommodityTable();
    //         if (resp.data.status === 1 && resp.data.result) {
    //             this.setState({ commodityList: resp.data.result.data });
    //         } else {
    //             this.setState({ commodityList: [] });
    //         }
    //     } catch (err) {
    //         console.error(err)
    //         this.setState({ commodityList: [] });
    //     }
    // }

   async getData(){
       this.setState({dataList:null});
    let resp = await userListService.getUserList();
    // console.log(resp.data);
    if ( resp.data.status === 1 && resp.data.result ) {

        this.setState({ dataList: resp.data.result.data });
       
    }
   }
    handleClose(event) {
        this.setState({open :false,showAddModal:false});
        this.getData();
    }
    onModalCancel(event){
        this.setState({open :false,showAddModal:false});
    }

   
    handleClickOpen(event) {
        this.setState({ showAddModal:true,open: true });
    }

    async getCommodityNames(txt) {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: resp.data.result.data });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.state.dataList ? <Card className={classes.card}>
                       <UserListTable  
                       tableData={this.state.dataList} 
                       onClose={this.getData.bind(this)} 
                       commodityList={ this.state.commodityList}  /> 

                       <div className="updateBtndef">
                        <div className="updateBtnFixed"  style={{display:'flex'}} onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i><p>ADD USER</p></div>
                    </div>
                </Card>    :<Loader />}        

                {this.state.showAddModal ? <UserDialog openModal={this.state.open}
                     onEditModalClosed={this.handleClose.bind(this)}
                     commodityList={ this.state.commodityList}
                     onEditModalCancel={this.onModalCancel.bind(this)}/> :""}
            </div>
        );
    }
}

UserDataContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserDataContainer);