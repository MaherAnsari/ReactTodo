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
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import EditIcon from '@material-ui/icons/Edit';
import EditMandiDataModal from './EditMandiDataModal';
import Utils from '../../../app/common/utils';
import FilterDataView from '../common/FilterDataView';

import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

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
      },
      MuiTypography: {
        colorInherit: {
          color: "white"
        }
      },
      MuiInputBase: {
        input: {
          color: "#ffffff"
        }
      },
      MuiTablePagination: {
        selectIcon: {
          color: "#ffffff"
        },
        menuItem: {
          color: "#000"
        }
      },
      MuiIconButton: {
        colorInherit: {
          color: "#ffffff"
        },
        root: {
          "Mui-disabled": {
            color: "#ffffff"
          }
        }
      },
      // Mui: {
      //   disabled: {
      //     color: "#717070"
      //   }
      // }
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
    maxWidth: "120px", //'200px',
    padding: '12px'
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


class MandiListTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHeadData: ["state", "state (Hindi)", "district", "market", "market (Hindi)", "district (Hindi)", "Mandi Grade", "Mandi Grade (Hindi)", "APMC", "Mandi Status", "Lat/Long", "Action"],
      tableBodyData: this.props.tableData,
      rawTableBodyData: [],
      searchedText: "",
      showServerDialog: false,
      deleteMarket: null,

      showEditDataModal: false,
      editableData: undefined,
      "stateList": this.getStateData(),
      districtData: Utils.getDistrictData(),

      
      rowsPerPage : 10,
      page:0,

    }
  }

  getStateData() {
    let data = Utils.getStateData();
    var optionsData = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        optionsData.push({ label: data[i].toLowerCase(), value: data[i].toLowerCase() });
      }
    }
    return optionsData;
  }



  async handelFilter(data) {

    console.log(data);
    if (data) {
      this.getData(data);
    }

  }

  async getData(params) {
    let rows = [];
    // encodeURIComponent(txt)
    let resp = await mandiDataService.getMandiSearchData(params);
    if (resp.data.status === 1 && resp.data.result) {
      rows = resp.data.result.data;
    }
    this.setState({ tableBodyData: rows });
  }

  handelConfirmUpdate = async () => {
    let resp = await mandiDataService.deleteSpecificMandi(this.state.deleteMarket);
    this.setState({ showConfirmDialog: false, alertData: {} });
    if (resp.data.status === 1) {
      alert("Succesfully Deleted");
      this.getData({ "query": "haryana" });
    } else {
      alert("Opps there was an error, while deleted");
    }
  }

  getTableCellClass(classes, index) {
    return classes.tableCell;
  }

  onDeleteMandi(market, event) {
    let dialogText = "Are you sure to delete ?"
    this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true, deleteMarket: market });
  }

  handelCancelUpdate = () => {
    this.setState({ showConfirmDialog: false, alertData: {} });
  }

  handelEditModalOpen(data) {
    this.setState({ editableData: data, showEditDataModal: true })
  }

  handelEditModalClose() {
    this.setState({ editableData: undefined, showEditDataModal: false });
    let params = { "query": "haryana" };
    this.getData(params);
  }
  handelEditModalCancel() {
    this.setState({ editableData: undefined, showEditDataModal: false });
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page : newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page : 0, rowsPerPage : parseInt(event.target.value, 10) });
  };

  render() {
    const { classes } = this.props;
    const { rowsPerPage , page} = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} >
          {/* <div style={{  textAlign: 'center', paddingLeft: '15px', paddingTop: '10px', fontSize: '20px',height:'50px' }}> Total Mandi ({this.state.dataList.length})  </div> */}
          <div style={{ display: 'flex' }}>
            {this.state.districtData ?
              <FilterDataView
                stateList={this.state.stateList}
                districtList={this.state.districtList}
                districtData={Utils.getDistrictData()}
                onHeaderFilterChange={this.handelFilter.bind(this)}
              />
              : ""}

            {/* <div style={{ width: '40%' }}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                onChange={this.handelFilter.bind(this)} /><i className="fa fa-search"></i>
            </div> */}
          </div>
          <div >
            <Table className='table-body'>
              <TableHead>
                <TableRow  >
                  {this.state.tableHeadData.map((option, i) => (
                    <TableCell key={option} className={this.getTableCellClass(classes, i)}>{option}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/*  ["state","state (Hindi)","district", "market","market (Hindi)","district (Hindi)", "Mandi Grade","Mandi Grade( HINDI)", "APMC","Mandi Off Day","Location","Action"], */}
                {this.state.tableBodyData &&
                (rowsPerPage > 0
                  ? this.state.tableBodyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : this.state.tableBodyData
                ).map((row, i) => {
                  return (
                    <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                      <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                        {row.state}</TableCell>
                      <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                        {row.state_hindi ? row.state_hindi : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.district}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 3) + " market-val"} >{row.market}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.market_hindi ? row.market_hindi : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.district_hindi ? row.district_hindi : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.mandi_grade ? row.mandi_grade : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.mandi_grade_hindi ? row.mandi_grade_hindi : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{row.apmc_req ? (row.apmc_req ? "Yes" : "No") : "-"}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>
                        {row.is_open ? <LockOpenIcon className="material-Icon" /> :
                          <LockIcon className="material-Icon" style={{ color: 'red' }} />}
                      </TableCell>
                      <TableCell className={this.getTableCellClass(classes, 2)}>{(row.loc_lat ? row.loc_lat : "-") + "/\n" + (row.loc_long ? row.loc_long : "-")}</TableCell>
                      <TableCell className={this.getTableCellClass(classes, 4)}>
                        {row.businessAddedPlace ? <PersonIcon className="material-Icon" style={{ color: row.profile_completed ? '' : '#0000008a' }} />
                          : <DoneAllIcon className="material-Icon" />}
                        {row.businessAddedPlace ? <DeleteIcon className="material-Icon" onClick={this.onDeleteMandi.bind(this, row.market)} style={{ color: 'red', cursor: 'pointer' }} /> : ""
                        }
                        <EditIcon
                          className="material-Icon"
                          onClick={() => this.handelEditModalOpen(row)}
                          style={{ color: "#e72e89", cursor: "pointer" }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={this.state.tableBodyData.length}
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
            </Table>
          </div>
          {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
            {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
              <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
              {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No data available"}</span>}
          </div>}
          {this.state.showConfirmDialog ?
            <ConfirmDialog
              dialogText={this.state.dialogText}
              dialogTitle={this.state.dialogTitle}
              show={this.state.showConfirmDialog}
              onConfirmed={this.handelConfirmUpdate}
              onCanceled={this.handelCancelUpdate} /> : ""}

          {this.state.showEditDataModal && this.state.editableData &&
            <EditMandiDataModal openModal={this.state.showEditDataModal}
              stateList={Utils.getStateData()}
              districtMap={Utils.getDistrictData()}
              editableData={this.state.editableData}
              onEditModalClosed={this.handelEditModalClose.bind(this)}
              onEditModalCancel={this.handelEditModalCancel.bind(this)}
            />}
        </Paper>
      </MuiThemeProvider>
    );
  }
}

MandiListTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MandiListTable);