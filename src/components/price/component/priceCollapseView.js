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
import buyerService from '../../../app/buyerService/buyerService';
import { isUndefined } from 'util';
import Checkbox from '@material-ui/core/Checkbox'; 
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';

const theme = createMuiTheme({
  overrides: {
    head: {
      color: '#2e3247',
      fontWeight: 600,
      fontSize: '13px !important',
      fontFamily: 'lato !important',
      textTransform: 'uppercase',
      lineHeight: "1em"

    },
    body: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      fontSize: '14px !important',
      fontFamily: 'lato !important',
      // lineHeight: '1.5em',
    }, MuiTablePagination: {
      toolbar:{
        paddingRight:'200px'
      }
    },
  }
});

const styles = theme => ({
  detailsRoot: {
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
      itemExpanded: "",
      expansionpanelHeaderData: this.props.expansionpanelHeaderData,
      expansionpanelBodyData: [],
      specificBuyerList: undefined,
      dataList: this.props.expansionpanelHeaderData,
      selectedId: undefined,
      type:this.props.type,
      rowsPerPage: 50,
      page: 0,
    }
  }

  async handelFilter(event) {
    let searchedTxt = event.target.value;
    // console.log(searchedTxt);
    this.getData(searchedTxt);
  }

  async getData(txt) {
    let rows = [];
    let data = {};
    data['searchVal'] = encodeURIComponent(txt);
    let resp = await buyerService.serchUser(data);
    // console.log(resp.data);
    if (resp.data.status === 1 && resp.data.result) {
      rows = resp.data.result.data;


    }
    this.setState({ expansionpanelHeaderData: rows, page: 0 });
  }
  // handelFilter(event) {
  //   let searchedTxt = event.target.value;
  //   this.setState({ searchedText: searchedTxt });
  //   let initaialTableBodyData = this.state.dataList;
  //   let updatedRow = [];

  //   for (let i = 0; i < initaialTableBodyData.length; i++) {
  //     if (initaialTableBodyData[i].hasOwnProperty('fullname') && (initaialTableBodyData[i].fullname).toLowerCase().indexOf(searchedTxt) > -1) {
  //       updatedRow.push(initaialTableBodyData[i]);
  //     }
  //   }


  //   this.setState({ expansionpanelHeaderData: updatedRow });
  // }


  onPanelExpanded(event, i, id) {
    this.setState({ expanded: this.state.expanded === i ? "" : i, itemExpanded: "", specificBuyerList: undefined }, function () {
      if (this.state.expanded !== "") {
        this.setState({ selectedId: id });
        if(this.state.type === 'buyer'){
          this.getBuyerList(id);
        }else{
          this.getBroketList(id);
        }
        
      }
    })
  }

  async getBuyerList(id) {
    let resp = await priceService.getBuyerList(id);
    this.state.specificBuyerList = [];
    if (resp.data.status === 1 && resp.data.result) {
      this.setState({ specificBuyerList: resp.data.result });// full ( id )
    }
  }

  async getBroketList(id) {
    let resp = await priceService.getBroketList(id);
    this.state.specificBuyerList = [];
    if (resp.data.status === 1 && resp.data.result) {
      this.setState({ specificBuyerList: resp.data.result });// full ( id )
    }
  }

  onItemPanelExpanded(event, i, id) {
    this.setState({ itemExpanded: this.state.itemExpanded === i ? "" : i }, function () {
      // this.getBuyerList( id );
    })
  }
  onUpdate(event) {
    if(this.state.type === 'buyer'){
      this.getBuyerList(this.state.selectedId);
    }else{
      this.getBroketList(this.state.selectedId);
    }
  }
  handleCheckbox(id, event) {
    this.props.typeChange(id);
  }

  
  handleChangePage = (event, newPage) => {
    // console.log(newPage);
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };


  render() {
    const { classes } = this.props;
    const { expanded, itemExpanded } = this.state;
    const { rowsPerPage, page } = this.state;
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
            <div style={{ marginRight: '2%', width: '25%',paddingTop:'16px' }}>
              <Checkbox
                style={{ height: 24, width: 34 }}
                checked={this.state.type === 'buyer'}
                onClick={this.handleCheckbox.bind(this, "buyer")}
                tabIndex={-1}
                disableRipple
              />Buyer wise</div>
            <div style={{ marginRight: '2%', width: '25%' ,paddingTop:'16px' }}>
              <Checkbox
                style={{ height: 24, width: 34 }}
                checked={this.state.type === 'broker'}
                onClick={this.handleCheckbox.bind(this, "broker")}
                tabIndex={-1}
                disableRipple
              />Broker wise</div>
            <div style={{ width: '40%' }}>
              <input
                type="text"
                // value={searchedText}
                placeholder="Search..."
                className="search-input"
                onChange={this.handelFilter.bind(this)}
              /><i className="fa fa-search"></i>
            </div>
          </div>
          <div   >
            {this.state.expansionpanelHeaderData.length > 0  ? <div style={{
              marginTop: "18px",maxHeight:"70vh",overflowY:"scroll"
            }}> 
              {this.state.expansionpanelHeaderData &&   (rowsPerPage > 0
                                    ? this.state.expansionpanelHeaderData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : this.state.expansionpanelHeaderData
                                  ).map((row, i) => {
                return (
                 
                  <div key={"expanpan" + i} style={{ width: '100%', marginTop: '8px' }} >
                    <ExpansionPanel
                      expanded={expanded === i}
                      onChange={(event) => this.onPanelExpanded(event, i, row["id"])}
                      style={{ borderLeft: i % 2 === 0 ? "4px solid #3a7e40" : "4px solid #50a1cf", width: '100%', background: expanded === i ? "#f7f7f7" : "white" }}>

                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography style={{ fontSize: '16px', fontFamily: 'Lato', fontWeight: 600 }} className={classes.heading}>{row["fullname"] + " (" + row["id"] + ")"}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>

                        {this.state.specificBuyerList && this.state.specificBuyerList.length > 0 ? this.state.specificBuyerList.map((item, itemIndex) => {
                          return (
                            <div key={"expanpan" + item["commodity_name"]} style={{ width: '98%', marginLeft: '1%', marginTop: itemIndex !== 0 ? "8px" : "" }} >
                              <ExpansionPanel
                                expanded={itemExpanded === itemIndex}
                                onChange={(event) => this.onItemPanelExpanded(event, itemIndex, item["id"])}
                                style={{ width: '100%', background: itemExpanded === itemIndex ? "#f7f7f7" : "white" }}>

                                <ExpansionPanelSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1a-content"
                                  id="panel1a-header">

                                  <Typography style={{ fontSize: '16px', fontFamily: 'Lato', fontWeight: 500 }} className={classes.heading}>{item["commodity_name"]}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  <PriceTable tableData={item.brokers} onUpdate={this.onUpdate.bind(this)} />
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            </div>
                          );
                        }) : (!this.state.specificBuyerList ? <Loader height={'30px'} /> : < NoDataAvailable style={{ height: '25vh' }} />)}

                      </ExpansionPanelDetails>
                    </ExpansionPanel>
               
                  </div>
               
                );
              })}
             
            </div> : < NoDataAvailable style={{ height: '50vh' }} />}
            {this.state.expansionpanelHeaderData.length > 0  && <Table>
                  <TableFooter style={{ borderTop: "2px solid #858792" }}>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    colSpan={6}
                    style={{paddingRight:'150px !important'}}
                    count={this.state.expansionpanelHeaderData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={this.handleChangePage.bind(this)}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
                  />
                </TableRow>
              </TableFooter>
                  </Table>}
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