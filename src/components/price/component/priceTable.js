import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import mandiDataService from '../../../app/mandiDataService/mandiDataService';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import PriceDialog from './priceDialog';
const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
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
      }
    },
  }
});

const styles = theme => ({
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
    maxWidth: '200px',
    padding:"8px"
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
    // minHeight: '80vh'
  },
  lightTooltip: {
    fontSize: '14px',
    maxWidth: 'none',
  },
});


class PriceTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHeadData: ["buyer", "broker", "commodity","rate","qunatity","unit"],
      tableBodyData: this.props.tableData,
      rawTableBodyData: [],
      searchedText: "",
      editableData: {},
      showServerDialog: false,
      deleteId: null,
      showEditDialog:false,
      open:false,
      userData:undefined

    }
    // console.log(this.props.tableData);
  }


  async handelFilter(event) {
    let searchedTxt = event.target.value;
    // console.log(searchedTxt);
    this.getData(searchedTxt);
  }

  // async getData(txt){
  //   let rows = [];
    
  //   let resp = await mandiDataService.getMandiData(encodeURIComponent(txt));
  //   // console.log(resp.data);
  //   if (resp.data.status === 1 && resp.data.result) {
  //     rows = resp.data.result.data;


  //   }
  //   this.setState({ tableBodyData: rows });
  // }

  handelConfirmUpdate = async () => {

    // let rows = [];
    let resp = await mandiDataService.deleteMandi(this.state.deleteId);
    this.setState({ showConfirmDialog: false, alertData: {} });
    if (resp.data.status === 1) {
      alert("Succesfully Deleted");
      this.getData('a');
    } else {
      alert("Opps there was an error, while deleted");
    }
   
  }
  onEditClicked(particularTaskData, event) {
    this.setState({ editableData: JSON.parse(JSON.stringify(particularTaskData)), showServerDialog: true });
  }

  onModalClosed(event) {

    this.setState({ editableData: {}, showServerDialog: false });
    this.props.onEditModalClosed(event);
  }
  onModalCancel(event) {
    this.setState({ editableData: {}, showServerDialog: false });
  }

  getTableCellClass(classes, index) {
    return classes.tableCell;
  }

  onDeleteMandi(id, event) {
    console.log(this.state.dataObj);
    let dialogText = "Are you sure to delete ?"

    this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true, deleteId: id });

  }
  handelCancelUpdate = () => {
    this.setState({ showConfirmDialog: false, alertData: {} });
  }
  handleDialogCancel(event) {
    this.props.onEditModalCancel();
  }


  onEditPriceCLick(obj,event){
    this.setState({showEditDialog:true,open:true,userData:obj})
  }

  handleClose(event){
    this.setState({showEditDialog:false,open:false,userData:null})
    this.props.onUpdate();
  }
  onModalCancel(event){
    this.setState({showEditDialog:false,open:false,userData:null})
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} >
          {/* <div style={{  textAlign: 'center', paddingLeft: '15px', paddingTop: '10px', fontSize: '20px',height:'50px' }}> Total Mandi ({this.state.dataList.length})  </div> */}
          {/* <div style={{ display: 'flex' }}>

            <div style={{ width: '40%', marginLeft: '58%' }}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                onChange={this.handelFilter.bind(this)} /><i className="fa fa-search"></i>
            </div>
          </div> */}
          <div >
            <Table className='table-body' style={{marginBottom:'0px'}}>
              <TableHead>
                <TableRow style={{borderBottom: "2px solid #858792"}} >
                  {this.state.tableHeadData.map((option, i) => (
                    <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '150px' }}>{option}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.tableBodyData.map((row, i) => {
                  return (
                    <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>
                      <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                        {row.buyer_name ? row.buyer_name:"-"}
                      </TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.broker_name?row.broker_name:"-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 3) + " market-val"} >{row.commodity}
                      </TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.rate}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.qnt}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 4)}>
                       {row.unit}<i style={{marginLeft:'6px',color:'#61cb42',fontSize:'20px',fontWeight:'bold'}} onClick= {this.onEditPriceCLick.bind(this,row)} class="fa fa-pencil-square-o" aria-hidden="true"></i>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {this.state.showEditDialog ? <PriceDialog openModal={this.state.open}
                    onEditModalClosed={this.handleClose.bind(this)}
                   data={this.state.userData}
                   isUpdate={true}
                    onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}
          {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
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
              onCanceled={this.handelCancelUpdate} /> : ""}
        </Paper>
      </MuiThemeProvider>
    );
  }
}
PriceTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PriceTable);