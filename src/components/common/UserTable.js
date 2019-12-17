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
import userListService from '../../app/userListService/userListService';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PersonIcon from '@material-ui/icons/Person';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import Tooltip from '@material-ui/core/Tooltip';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import UserDialog from './UserInfo';
import StarIcon from '@material-ui/icons/Star';
import OrderTable from './OrderTable';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Utils from '../../app/common/utils';
import UserFilterDataView from './UserFilterDataView';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

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
        maxWidth: '180px',
        padding: '12px',
        maxHeight: '40px'
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
        fontSize: '18px',
        maxWidth: '800px',
    },
    info: {
        fontSize: '18px',
        marginRight: '8px',
        color: '#000000',
        cursor: 'pointer',
        float: 'right'
    },
    name:{
        fontWeight: '600',
        fontSize: '15px',
        color: '#242529'
    },
    container: {
        maxHeight: 440,
      },
});


class UserListTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["id", "fullname(business_name)", "mobile", "Order/Payment","rating","Locality/District", "commodity", "role","status"],
            tableBodyData: this.props.tableData,
            rawTableBodyData: [],
            searchedText: "",
            editableData: {},
            showServerDialog: false,
            showOptionModal: false,
            anchorEl: null,
            showUserModal: false,
            open: false,
            userData: {},
            userId: null,
            payload: null,
            showOrderModal: false,
            isInfo: false,
            stateList: this.getStateData(),


            rowsPerPage : 50,
            page:0,

            // commodityList:["dd"]

        }
    }
    // componentWillReceiveProps() {

    //     if (this.state.tableBodyData != this.props.tableData) {
    //         this.setState({ tableBodyData: this.pros.tableData });
    //     }
    // }

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

        // console.log(searchedTxt);
        let rows = [];
        let resp = await userListService.serchUser(data);
        // console.log(resp.data);
        if (resp.data.status === 1 && resp.data.result) {
            rows = resp.data.result.data;


        }
        this.setState({ tableBodyData: rows , page : 0});
    }


    onModalClosed(event) {

        this.setState({ editableData: {}, showServerDialog: false });
        this.props.onEditModalClosed(event);
    }
    // onModalCancel(event) {
    //     this.setState({ editableData: {}, showServerDialog: false });
    // }

    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    getInfoSTring(obj) {
        return obj.locality ? obj.locality : "-" +"/"+ obj.district ? obj.district : "-";
    }
    onModalClick(event) {
        this.setState({ show: true });
    }
    handleAnchorMenuClose = () => {
        this.setState({ anchorEl: null });
    };
    handleAnchorClick = (obj, event) => {
        this.setState({ anchorEl: event.currentTarget, userData: JSON.parse(JSON.stringify(obj)) });
    };

    onEditUserClick = (event) => {
        this.setState({ anchorEl: null, showUserModal: true, open: true });
    }
    onOrderDetailClick = (event) => {
        this.setState({ anchorEl: null, showOrderModal: true, open: true });
    }


    onAddAccount = (event) => {
        this.setState({ anchorEl: null });
    }

    handleClose(event) {
        this.setState({ open: false, showUserModal: false, showOrderModal: false, isInfo: false });
        this.props.onClose();
    }
    onModalCancel(event) {
        this.setState({ open: false, showUserModal: false, showOrderModal: false, isInfo: false });
    }


    handelConfirmUpdate = async () => {

        let resp = await userListService.addUserData(this.state.userId, this.state.payload);
        this.setState({ showConfirmDialog: false, alertData: {} });
        if (resp.data.status === 1) {
            alert("Succesfully submitted");
            this.props.onClose();
        } else {
            alert("Opps there was an error, while adding");
        }

    }
    hoverOn(){
        this.setState({ hover: true });
      }
      hoverOff(){ 
        this.setState({ hover: false });    
      }
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
    }
    getRole(row) {
        if (row.role === "ca") {
            return "buyer";
        } else if (row.role === 'la') {
            return "supplier";
        } else if (row.role === 'broker') {
            return "broker";
        } else {
            return "NA";
        }
    }
    getBackgroundColor(obj) {
        if (obj.role === "ca") {
            return "#f94141";
        } else if (obj.role === 'la') {
            return "#00a700";
        } else if (obj.role === 'broker') {
            return "#7070fd";
        } else {
            return "#757575";
        }
      
    }

    getOrderNoBackgroundColor(obj) {
        if (obj.ordercount === "0" || obj.paymentcount === "0") {
            return "#757575";
        }  else {
            return "#377c3b";
        }
    }
    onInfoClick = (info, event) => {
        this.setState({ showUserModal: true, open: true, userData: JSON.parse(JSON.stringify(info)), isInfo: true });
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page : newPage });
      };

      handleChangeRowsPerPage = event => {
        this.setState({ page : 0, rowsPerPage : parseInt(event.target.value, 10) });
      };

      getNameStr(row){
          return row.fullname +"("+row.business_name+")"
      }

      handelDownloadClicked=()=>{
        Utils.downloadDataInCSV(this.state.tableBodyData, this.props.downloadAbleFileName )
    }

    render() {
        const { classes } = this.props;
        const { rowsPerPage , page} = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <Paper className={classes.root} >
                    {/* <div style={{  textAlign: 'center', paddingLeft: '15px', paddingTop: '10px', fontSize: '20px',height:'50px' }}> Total Mandi ({this.state.dataList.length})  </div> */}
                    <div style={{ display: 'flex' }}>
                        <UserFilterDataView
                            stateList={this.state.stateList}
                            role={this.props.role}
                            //   districtList={this.state.districtList}
                            //   districtData={Utils.getDistrictData()}
                            onHeaderFilterChange={this.handelFilter.bind(this)}
                        />
                        {/* <div style={{ width: '40%', marginLeft: '58%' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                                onChange={this.handelFilter.bind(this)} /><i className="fa fa-search"></i>
                        </div> */}
                    </div>
                    <div style={{maxHeight:"70vh",overflowY:"scroll"}}>
            <Table  className='table-body' stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow  style={{borderBottom: "2px solid #858792"}} >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ textAlign: i == 1 ? "left" : "center",minWidth: i === 4 ? '50px' : '100px', paddingLeft: i === 0 ? '22px' : '',color:i == 4 ?  "goldenrod":""}}>{i ==4 ?<StarIcon />:option}</TableCell>
                                        // <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod" }}>  </TableCell>
                                    ))}
                                   
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableBodyData && this.state.tableBodyData &&
                                (rowsPerPage > 0
                                    ? this.state.tableBodyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : this.state.tableBodyData
                                  )
                                .map((row, i) => {
                                    return (
                                        <TableRow key={'table_' + i} style={{ background: i % 2 !== 0 ? "#e8e8e8" : "#fff" }}>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                <Tooltip title={row.active ? "Enabled" : "Disabled"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div style={{  color: "white",
                                                            background:row.active ? "green":"red",
                                                            padding: "4px 12px",width:'fit-content',marginLeft:'20%',
                                                            borderRadius: "13px"}}> {row.id}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                <Tooltip title={row.fullname ? row.fullname : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                <div style={{ display: "grid", textAlign: "left" }} className=" name-span" onClick={this.onInfoClick.bind(this, row)}>
                            <span>{row.fullname}</span>
                            <span style={{ fontSize: "12px" }}>{"( " + row.business_name + " )"}</span>
                          </div>
                                                    {/* <div onClick={this.onInfoClick.bind(this, row)} className="text-ellpses name-span" style={{cursor:'pointer',color:'#2e3247'}}><span className={classes.name}>{row.fullname}</span>{"("+row.business_name+")"}</div> */}
                                                </Tooltip>

                                            </TableCell>
                                      
                                            <TableCell className={this.getTableCellClass(classes, 3)}>{row.mobile}</TableCell>

                                            <TableCell className={this.getTableCellClass(classes, 4)}>
                                                <Tooltip title={row.ordercount+"/"+row.paymentcount} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses" style={{  color: "white",
                                                            background:this.getOrderNoBackgroundColor(row),
                                                            padding: "4px 12px",width:'fit-content',marginLeft:'20%',
                                                            borderRadius: "13px"}}>{row.ordercount+"/"+row.paymentcount}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ width: "90px" }} className={this.getTableCellClass(classes, 7)} >{row.rating}
                                             
                                             </TableCell>
                                             <TableCell style={{ width: "90px" }} className={this.getTableCellClass(classes, 7)} >{this.getInfoSTring(row)}
                                             
                                             </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 5)} >
                                                <Tooltip title={row.default_commodity ? row.default_commodity.join() : ""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses " >{row.default_commodity ? row.default_commodity.join() : ""}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 4)} > 
                                            <span style={{  color: "white",
                                                            background:this.getBackgroundColor(row),
                                                            padding: "4px 12px",
                                                            borderRadius: "13px"}}> {this.getRole(row)} </span></TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 6)} >
                                                <Tooltip title={row.profile_completed ? "Profile Completed : YES" : "Profile Completed : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <PersonIcon className="material-Icon" style={{ color: row.profile_completed ? '' : '#0000008a' , height: "18px", fontSize: "18px" }} />
                                                </Tooltip>
                                                <Tooltip title={row.bijak_verified ? "Bijak Verified : YES" : "Bijak Verified : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <DoneAllIcon className="material-Icon" style={{ color: row.bijak_verified ? '' : 'red' , height: "18px", fontSize: "18px" }} />
                                                </Tooltip>
                                                <Tooltip title={row.bijak_assured ? "Bijak Assured : YES" : "Bijak Assured : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <BeenhereIcon className="material-Icon" style={{ color: row.bijak_assured ? '#507705' : '#0000008a' , height: "18px", fontSize: "18px" }} />
                                                </Tooltip>
                                                <Tooltip title={row.kyc_completed ? "Kyc Completed: YES" : "Kyc Completed : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <HowToRegIcon className="material-Icon" style={{ color: row.kyc_completed ? '#507705' : '#0000008a' , height: "18px", fontSize: "18px" }} />
                                                </Tooltip>
                                            </TableCell>
                                           
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                            <TableFooter  style={{ borderTop: "2px solid #858792" }}>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[ 25,50,100 ]}
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
                                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                    </div>}
                    {this.state.showUserModal ? <UserDialog openModal={this.state.open}
                        onEditModalClosed={this.handleClose.bind(this)}
                        data={this.state.userData}
                        isInfo={this.state.isInfo}
                        commodityList={this.props.commodityList}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}
                    {this.state.showConfirmDialog ?
                        <ConfirmDialog
                            dialogText={this.state.dialogText}
                            dialogTitle={this.state.dialogTitle}
                            show={this.state.showConfirmDialog}
                            onConfirmed={this.handelConfirmUpdate}
                            onCanceled={this.handelCancelUpdate} /> : ""}
                    {this.state.showOrderModal ? <OrderTable openModal={this.state.open}
                        onEditModalClosed={this.handleClose.bind(this)}
                        data={this.state.userData}
                        onEditModalCancel={this.onModalCancel.bind(this)} /> : ""}

                                       {/* download */}
                    <div className="updateBtndef" style={{ right : "160px"}}>
                        <div className="updateBtnFixed" style={{ display: 'flex' }} onClick={this.handelDownloadClicked.bind(this)}>
                            <i className="fa fa-cloud-download add-icon" style={{marginRight: 0}}aria-hidden="true"></i>
                            </div>
                    </div>
                </Paper>
            </MuiThemeProvider>
        );
    }
}

UserListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserListTable);