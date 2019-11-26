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
import buyerService from '../../../app/buyerService/buyerService';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PersonIcon from '@material-ui/icons/Person';
import ConfirmDialog from '../../../app/common/ConfirmDialog';
import Tooltip from '@material-ui/core/Tooltip';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StarIcon from '@material-ui/icons/Star';

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
        minHeight: '80vh'
    },
    lightTooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
});


class BrokerTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["id", "fullname", "business_name", "mobile", "Info", "commodity", "status"],
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
            payload: null

        }
    }
    componentWillReceiveProps() {

        if (this.state.tableBodyData !== this.props.tableData) {
            this.setState({ tableBodyData: this.pros.tableData });
        }
    }

    async handelFilter(event) {
        let searchedTxt = event.target.value;
        // console.log(searchedTxt);
        let rows = [];
        let resp = await buyerService.serchUser(searchedTxt);
        // console.log(resp.data);
        if (resp.data.status === 1 && resp.data.result) {
            rows = resp.data.result.data;


        }
        this.setState({ tableBodyData: rows });
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

    getInfoSTring(obj) {
        return obj.locality?obj.locality:"" + " , " + obj.district?obj.district:"";
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

    onAddAccount = (event) => {
        this.setState({ anchorEl: null });
    }

    handleClose(event) {
        this.setState({ open: false, showUserModal: false });
        this.props.onClose();
    }
    // onModalCancel(event) {
    //     this.setState({ open: false, showUserModal: false });
    // }


 
    handelCancelUpdate = () => {
        this.setState({ showConfirmDialog: false, alertData: {} });
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
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth: i === 0 ? '50px' : '125px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                                    ))}
                                    <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod", textAlign: 'left' }}> <StarIcon /> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableBodyData.map((row, i) => {
                                    return (
                                        <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                <Tooltip title={row.active ? "Enabled" : "Disabled"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                   <div> <FiberManualRecordIcon style={{ color: row.active ? "" : "red" }} className="buisness-icon" /> {row.id}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                            <Tooltip title={row.fullname} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{row.fullname}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 2)}>
                                            <Tooltip title={row.business_name} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{row.business_name}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 3)}>{row.mobile}</TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 4)}>
                                                <Tooltip title={this.getInfoSTring(row)} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{this.getInfoSTring(row)}</div>
                                                    </Tooltip>
                                                    </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 5)} >
                                                <Tooltip title={row.default_commodity ? row.default_commodity.join():""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{row.default_commodity ? row.default_commodity.join():""}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 6)} >
                                                <Tooltip title={row.profile_completed ? "Profile Completed : YES" : "Profile Completed : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <PersonIcon className="material-Icon" style={{ color: row.profile_completed ? '' : '#0000008a' }} />
                                                </Tooltip>
                                                <Tooltip title={row.bijak_verified ? "Bijak Verified : YES" : "Bijak Verified : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <DoneAllIcon className="material-Icon" style={{ color: row.bijak_verified ? '' : 'red' }} />
                                                </Tooltip>
                                                <Tooltip title={row.bijak_assured ? "Bijak Assured : YES" : "Bijak Assured : NO"} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <BeenhereIcon className="material-Icon" style={{ color: row.bijak_assured ? '#507705' : '#0000008a' }} />
                                                </Tooltip>

                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 7)} >{row.rating}
                                               
                                            </TableCell>
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

BrokerTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BrokerTable);