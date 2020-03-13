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
import { getAccessAccordingToRole } from '../../../config/appConfig';


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
        // lineHeight: '1.5em',
      },
      MuiTypography: {
        body2: {
          color: "red",
          fontFamily: "lato",
          fontWeight: 600
        },
        colorInherit: {
          color: "white"
        }

      },
      MuiInputBase: {
        input: {
          color: "#ffffff"
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
      MuiSvgIcon: {
        root: {
          height: "18px",
          fontSize: "18px"
        }
      }
    },
    MuiTablePagination: {
      toolbar: {
        paddingRight: '250px'
      }

    }
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
  tableCellCyan: {
    paddingLeft: '4px',
    paddingRight: '4px',
    textAlign: 'center',
    maxWidth: "120px", //'200px',
    padding: '12px',
    // color: "#022361"
    color: "#2f2f2f"
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
      tableHeadData: ["market", "district", "state", "Mandi Grade", "APMC", "Mandi Status", "Lat/Long", "Opening Time", "Action"],
      tableHeadDataKey: ["market", "district", "state", "mandi_grade", "mandi_grade_hindi", "apmc_req", "is_open", "loc_lat", ""],
      tableBodyData: this.props.tableData,
      rawTableBodyData: [],
      searchedText: "",
      showServerDialog: false,
      deleteMarket: null,

      showEditDataModal: false,
      editableData: undefined,
      "stateList": this.getStateData(),
      districtData: Utils.getDistrictData(),


      rowsPerPage: 50,
      page: 0,
      sort: {
        column: null,
        direction: 'desc',
      }

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
    this.setState({ tableBodyData: rows, page: 0 });
  }

  handelConfirmUpdate = async () => {
    let resp = await mandiDataService.deleteSpecificMandi(this.state.deleteMarket);
    this.setState({ showConfirmDialog: false, alertData: {} });
    if (resp.data.status === 1) {
      alert("Succesfully Deleted");
      this.getData("");
    } else {
      // alert("Opps there was an error, while deleted");
      alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops there was an error, while deleted");
    }
  }

  getTableCellClass(classes, index) {
    return classes.tableCell;
  }

  getTableCustomBgCellClass(classes) {
    return classes.tableCellCyan;
  }


  onDeleteMandi(market, event) {
    let dialogText = "Are you sure to delete ?"
    this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true, deleteMarket: market });
  }

  handelCancelUpdate = () => {
    this.setState({ showConfirmDialog: false, alertData: {} });
  }

  handelEditModalOpen(data) {
    this.setState({ editableData: Object.assign({},data), showEditDataModal: true })
  }

  handelEditModalClose() {
    this.setState({ editableData: undefined, showEditDataModal: false });
    // let params = { "query": "haryana" };
    this.getData("");
  }
  handelEditModalCancel() {
    this.setState({ editableData: undefined, showEditDataModal: false });
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  onSort = (column) => {
    if (column !== "") {
      return e => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc'
        const sortedUsers = this.state.tableBodyData.sort((a, b) => {
          if (a[column] && a[column] !== null && b[column] && b[column] !== null) {
            if (typeof (a[column]) === 'string') {
              const nameA = a[column].toUpperCase() // ignore upper and lowercase
              const nameB = b[column].toUpperCase() // ignore upper and lowercase

              if (nameA < nameB)
                return -1
              if (nameA > nameB)
                return 1
              else return 0
            }
            else {
              return a[column] - b[column]
            }
          }
        })

        if (direction === 'desc') {
          sortedUsers.reverse()
        }
        this.setState({
          tableBodyData: sortedUsers,
          sort: {
            column,
            direction,
          },
        })
      }
    }
  }

  setArrow = (column) => {
    let iconClass = 'fa fa-arrow-';

    if (this.state.sort.column === column) {
      iconClass += this.state.sort.direction === 'asc' ? 'down' : 'up';
    }
    return iconClass;
  };


  render() {
    const { classes } = this.props;
    const { rowsPerPage, page, tableHeadDataKey } = this.state;
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
          <div>
          <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
            <Table className='table-body' stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow style={{ borderBottom: "2px solid #858792" }} >
                  {this.state.tableHeadData.map((option, i) => (
                    <TableCell
                      onClick={this.onSort(tableHeadDataKey[i])}
                      key={option}
                      style={{ textAlign: i < 3 ? "left" : "center", cursor: tableHeadDataKey[i] !== "" ? "pointer" : "unset" }}
                      className={this.getTableCellClass(classes, i)}>{option}
                      {tableHeadDataKey[i] !== "" && <i className={this.setArrow(tableHeadDataKey[i])} aria-hidden="true"></i>}
                    </TableCell>
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
                      <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>
                        <TableCell component="th" scope="row" className={this.getTableCustomBgCellClass(classes, 0)}>
                          <div style={{ display: "grid", textAlign: "left" }}>
                            <span>{row.market}</span>
                            <span style={{ fontSize: "12px" }}>{"( " + row.market_hindi + " )"}</span>
                          </div>
                        </TableCell>
                        <TableCell className={this.getTableCellClass(classes, 2)} style={{ textAlign: "left" }} >
                          {/* {row.district + " (" + row.district_hindi + ")"} */}
                          <div style={{ display: "grid", textAlign: "left" }}>
                            <span>{row.district}</span>
                            <span style={{ fontSize: "12px" }}>{"( " + row.district_hindi + " )"}</span>
                          </div>
                        </TableCell>
                        <TableCell className={this.getTableCellClass(classes)} style={{ textAlign: "left" }}>
                          <div style={{ display: "grid", textAlign: "left" }}>
                            <span>{row.state}</span>
                            <span style={{ fontSize: "12px" }}>{"( " + row.state_hindi + " )"}</span>
                          </div>
                        </TableCell>
                        {/* <TableCell className={this.getTableCellClass(classes, 2)}>{row.district_hindi ? row.district_hindi : "-"}</TableCell> */}
                        <TableCell className={this.getTableCellClass(classes, 2)} > {row.mandi_grade ? row.mandi_grade + " (" + row.mandi_grade_hindi ? row.mandi_grade_hindi : "-)" : "-"}</TableCell>
                        {/* <TableCell className={this.getTableCellClass(classes, 2)}>{row.mandi_grade_hindi ? row.mandi_grade_hindi : "-"}</TableCell> */}
                        <TableCell className={this.getTableCellClass(classes, 2)}>{row.apmc_req ? (row.apmc_req ? "Yes" : "No") : "-"}</TableCell>
                        <TableCell className={this.getTableCellClass(classes, 2)}>
                          {row.is_open ? <LockOpenIcon className="material-Icon" style={{ height: "18px", fontSize: "18px" }} /> :
                            <LockIcon className="material-Icon" style={{ color: 'red', height: "18px", fontSize: "18px" }} />}
                        </TableCell>
                        <TableCell className={this.getTableCellClass(classes, 2)}>{(row.loc_lat ? row.loc_lat : "-") + "/\n" + (row.loc_long ? row.loc_long : "-")}</TableCell>
                        <TableCell className={this.getTableCellClass(classes, 2)}>{(row.opening_time ? row.opening_time : "-")}</TableCell>
                        <TableCell className={this.getTableCellClass(classes, 4)}>
                          <div>
                            {row.businessAddedPlace ?
                              <PersonIcon className="material-Icon" style={{ color: row.profile_completed ? '' : '#0000008a', height: "18px", fontSize: "18px" }} />
                              :
                              <DoneAllIcon className="material-Icon" style={{ height: "18px", fontSize: "18px" }} />}
                            {row.businessAddedPlace ?
                              <DeleteIcon className="material-Icon" onClick={this.onDeleteMandi.bind(this, row.market)} style={{ height: "18px", fontSize: "18px", color: 'red', cursor: 'pointer' }} /> : ""
                            }
                            {getAccessAccordingToRole("editMandi") && <EditIcon
                              className="material-Icon"
                              onClick={() => this.handelEditModalOpen(row)}
                              style={{ color: "#e72e89", cursor: "pointer", height: "18px", fontSize: "18px" }} />}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
        
          </Table>
         
          </div>
          {this.state.tableBodyData && this.state.tableBodyData.length > 0 && <Table>
          <TableFooter style={{ borderTop: "2px solid #858792" }}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
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
            </Table>}
          </div>
          {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
            {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
              <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
              {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No data available"}</span>}
          </div>}
          {/* {this.state.tableBodyData.length > 0 && } */}
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