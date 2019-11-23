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
import Switch from '@material-ui/core/Switch';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import  commodityService  from '../../../app/commodityService/commodityService';

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
  toggle:{
    marginTop:'12px',
    fontSize:'15px',
    color:'#000'
  }
});


class CommodityTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHeadData: ["name", "category", "weight"],
      tableBodyData: this.props.tableData,
      dataList: this.props.tableData,
      rawTableBodyData: [],
      searchedText: "",
      editableData: {},
      showServerDialog: false,
      deleteId: null

    }
  }



  handelFilter(event) {
    let searchedTxt = event.target.value;
    this.setState({ searchedText: searchedTxt });
    let initaialTableBodyData = this.state.dataList;
    let updatedRow = [];

    for (let i = 0; i < initaialTableBodyData.length; i++) {
      if (initaialTableBodyData[i].name.indexOf(searchedTxt) > -1) {
        updatedRow.push(initaialTableBodyData[i]);
      }
    }


    this.setState({ tableBodyData: updatedRow });
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
    // console.log(this.state.dataObj);
    let dialogText = "Are you sure to delete ?"

    this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true, deleteId: id });

  }
  handelCancelUpdate = () => {
    this.setState({ showConfirmDialog: false, alertData: {} });
  }
  handleDialogCancel(event) {
    this.props.onEditModalCancel();
  }
  handleChange(row,event){
    console.log()
    let obj = {"data":{
      "name":row.name,
      "active":!row.active
    }}
    this.updateCommodity(obj);
  }


  async updateCommodity(payload){
    // let rows = [];
    let resp = await commodityService.updateCommodity(payload);
    // console.log(resp.data);
    if (resp.data.status === 1) {
      alert("Successfully Update");
       this.props.onClose();
    }else{
      alert("Ooops! there was an error");
    }
 
  }


  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} >
          {/* <div style={{  textAlign: 'center', paddingLeft: '15px', paddingTop: '10px', fontSize: '20px',height:'50px' }}> Total Mandi ({this.state.dataList.length})  </div> */}
          <div style={{ display: 'flex' }}>

            <div style={{ width: '40%', marginLeft: '58%' }}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                onChange={this.handelFilter.bind(this)} /><i className="fa fa-search"></i>
            </div>
          </div>
          <div >
            <Table className='table-body'>
              <TableHead>
                <TableRow  >
                  {this.state.tableHeadData.map((option, i) => (
                    <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: '120px' }}>{option}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.tableBodyData.map((row, i) => {
                  return (
                    <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                      <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                        {row.name}
                      </TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.category}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 3) + " market-val"} >{row.weight}
                      </TableCell>
                      <div style={{display:'flex'}}> 
                      <Switch
                        checked={row.active}
                        onChange={this.handleChange.bind(this,row)}
                        value={row.active}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      /><p className={classes.toggle}>Active</p></div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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

CommodityTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommodityTable);