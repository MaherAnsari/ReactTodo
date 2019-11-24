import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PriceTable from './priceTable';
import priceService from '../../../app/priceService/priceService';
import Loader from '../../common/Loader';
import NoDataAvailable from '../../common/NoDataAvailable';

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      head: {
        color: '#fff',
        fontWeight: 600,
        fontSize: '15px !important',
        fontFamily: 'lato !important',
        textTransform: 'uppercase'

      },
      body: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 500,
        fontSize: '15px !important',
        fontFamily: 'lato !important',
        lineHeight: '1.5em',
      }
    },
  }
});

const styles = theme => ({
  detailsRoot:{
    display: "unset"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    verticalAlign: "middle",
    marginRight: theme.spacing.unit,
    fontSize: 10,
  },
  tableCell: {
    paddingLeft: '4px',
    paddingRight: '4px',
    textAlign: 'center',
    maxWidth: '200px'
  },
  titleText: { width: '50%', textAlign: 'left', paddingLeft: '15px', paddingTop: '7px', fontFamily: 'lato !important', },
  defaultTemplate: { height: '30vh', paddingTop: '10vh', },
  defaultSpan: { display: 'grid', fontSize: '25px' },
  defaultIcon: { fontSize: '65px', color: "#384952" },
  editIcon: { fontSize: '20px', color: "#1e459c", paddingLeft: 3, cursor: 'pointer', marginRight: '2px', float: 'left' },
  infoIcon: { color: '#d46262', fontSize: '18px', cursor: 'pointer' },
  cellDiv: {
    maxWidth: '180px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  root: {
    width: '100%',
    minHeight: '80vh'
  },
  lightTooltip: {
    fontSize: '14px',
    maxWidth: 'none',
  },
});


class PriceCollapseView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: "",
      itemExpanded:"",
      searchedText: "",
      expansionpanelHeaderData: this.props.expansionpanelHeaderData || [],
      expansionpanelBodyData:  [],
      dataList:this.props.expansionpanelHeaderData,
      specificBuyerList : undefined
    }
  }

  handelFilter(event) {
    let searchedTxt = event.target.value;
    this.setState({ searchedText: searchedTxt });
    let initaialTableBodyData = this.state.dataList;
    let updatedRow = [];

    for (let i = 0; i < initaialTableBodyData.length; i++) {
      if (initaialTableBodyData[i].hasOwnProperty('fullname') && (initaialTableBodyData[i].fullname).toLowerCase().indexOf(searchedTxt) > -1) {
        updatedRow.push(initaialTableBodyData[i]);
      }
    }


    this.setState({ expansionpanelHeaderData: updatedRow });
  }

  onPanelExpanded( event , i, id ){
    this.setState({ expanded: this.state.expanded === i ? "" : i, itemExpanded :"" , specificBuyerList : undefined }, function(){
      if( this.state.expanded !== ""){this.getBuyerList( id );}
    })
  }

  async getBuyerList( id ) {
    let resp = await priceService.getBuyerList( id );
    this.state.specificBuyerList = []; 
    if (resp.data.status === 1 && resp.data.result) {
        this.setState({ specificBuyerList : resp.data.result });// full ( id )
    }
}

onItemPanelExpanded( event , i, id ){
  this.setState({ itemExpanded: this.state.itemExpanded === i ? "" : i }, function(){
    // this.getBuyerList( id );
  })
}


  render() {
    const { classes } = this.props;
    const { expanded, itemExpanded, searchedText } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} >
          <div style={{ display: 'flex' }}>
          <div style={{ 
            width: "30%",
            padding: "14px",
            textAlign: "left",
            fontSize: "24px"
          }} > Rate List </div>
            <div style={{ width: '40%', marginLeft: '40%' }}>
              <input
                type="text"
                value={searchedText}
                placeholder="Search..."
                className="search-input"
                onChange={this.handelFilter.bind(this)} 
              /><i className="fa fa-search"></i>
            </div>
          </div>
          <div >
            <div style={{ marginTop: "18px"
                          }}>
            {this.state.expansionpanelHeaderData.map((row, i) => {
              return (
                <div key={"expanpan"+ i} style={{ width: '100%',marginTop:'8px'}} >
                  <ExpansionPanel
                    expanded={expanded === i}
                    onChange={( event ) => this.onPanelExpanded(event, i, row["id"])}
                    style={{ width: '100%',background :expanded === i ? "#f7f7f7" :  "white"  }}>

                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography style={{fontSize:'18px',fontFamily:'Lato'}}className={classes.heading}>{row["fullname"] + " (" + row["id"] + ")"}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{root: classes.detailsRoot}}>
                      
                    {this.state.specificBuyerList && this.state.specificBuyerList.length > 0 ? this.state.specificBuyerList.map((item, itemIndex ) => {
              return (
                <div key={"expanpan"+ item["commodity_name"]} style={{ width: '98%',marginLeft:'1%' ,marginTop: i != 0 ? "8px":""}} >
                  <ExpansionPanel
                    expanded={itemExpanded === itemIndex }
                    onChange={( event ) => this.onItemPanelExpanded(event, itemIndex, item["id"])}
                    style={{ width: '100%',background : itemExpanded === itemIndex ? "#f7f7f7" : "white" }}>

                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">

                      <Typography style={{fontSize:'18px',fontFamily:'Lato'}} className={classes.heading}>{item["commodity_name"]}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <PriceTable tableData={item.brokers} />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  </div>
              );
            }): ( !this.state.specificBuyerList ? <Loader height={'30px'}/> : < NoDataAvailable style={{height:'25vh'}}/>) }

                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  </div>
              );
            })}
          </div>
          </div>
          {/* {this.state.expansionpanelHeaderData.length == 0 ?  < NoDataAvailable style={{height:'25vh'}}/>:""} */}
          {/* {this.state.expansionpanelHeaderData.length > 0 ? "" : <div className={classes.defaultTemplate}>
            {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
              <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
              {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
          </div>}
          {this.state.showConfirmDialog ?
            <ConfirmDialog
              dialogText={this.state.dialogText}
              dialogTitle={this.state.dialogTitle}
              show={this.state.showConfirmDialog}
              onConfirmed={this.handelConfirmUpdate}
              onCanceled={this.handelCancelUpdate} /> : ""} */}
        </Paper>
      </MuiThemeProvider>
    );
  }
}
PriceCollapseView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PriceCollapseView);