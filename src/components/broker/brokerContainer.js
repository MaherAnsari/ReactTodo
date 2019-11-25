import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Loader from '../common/Loader';
import BrokerTable from './component/brokerTable';
import brokerService from '../../app/brokerService/brokerService';
import InfoDialog from '../common/InfoDialog';

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



class BrokerContainer extends React.Component {
    
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

   async getData(){
       this.setState({dataList:null});
    let resp = await brokerService.getBrokerList(null);
    // console.log(resp.data);
    if ( resp.data.status === 1 && resp.data.result ) {

        this.setState({ dataList: resp.data.result.data });
       
    }
   }
    handleClose(event) {
        this.setState({open :false,showAddModal:false,blockList:null});
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
                       <BrokerTable  tableData={this.state.dataList} onClose={this.getData.bind(this)}   /> 
                       {/* <div className="updateBtndef">
                        <div className="updateBtnFixed"  style={{display:'flex'}}onClick={this.handleClickOpen.bind(this)}><i className="fa fa-plus-circle add-icon" aria-hidden="true"></i><p>ADD BROKER</p></div>
                    </div> */}

                </Card>    :<Loader />}        
{this.state.showAddModal ? <InfoDialog openModal={this.state.open}
role="broker"
onEditModalClosed={this.handleClose.bind(this)}
onEditModalCancel={this.onModalCancel.bind(this)}/> :""}

            </div>
        );
    }
}

BrokerContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(BrokerContainer);