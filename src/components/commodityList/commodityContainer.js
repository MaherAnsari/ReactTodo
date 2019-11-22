import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CommodityTable from './component/commodityTable';
import  commodityService  from '../../app/commodityService/commodityService';
import Loader from '../common/Loader';

const styles = theme => ({
    root: {
        width: '98%',
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



class CommodityContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAddModal:false,
            dataList:null,
            showLoader:true
          
        };
    }

    

    async componentDidMount() {
       this.getData();
    
    }
    async getData(txt){
        let rows = [];
        let resp = await commodityService.getCommodityTable();
        // console.log(resp.data);
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ dataList: resp.data.result.data });
    
    
        }
     
      }

 
    
   
    handleClose(event) {
        this.setState({open :false,showAddModal:false,dataList:null});
        this.getData('a');
    }
    onModalCancel(event){
        this.setState({open :false,showAddModal:false});
    }

   
    handleClickOpen(event) {
        this.setState({ showAddModal:true,open: true });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.state.dataList ? <Card className={classes.card}>
                       <CommodityTable   tableData={this.state.dataList}   /> 
                       {/* <div className="updateBtndef">
                        <div className="updateBtnFixed"  style={{display:'flex'}}onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i><p>ADD LOCATION</p></div>
                    </div> */}

                </Card>    :<Loader />}        
       </div>
        )
    }
    
}

CommodityContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CommodityContainer);