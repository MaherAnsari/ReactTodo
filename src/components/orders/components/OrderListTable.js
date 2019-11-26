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
import Tooltip from '@material-ui/core/Tooltip';
import InfoDialog from './infoDialog';
const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px !important',
                fontFamily: 'lato !important',
                textTransform: 'uppercase'

            },
            body: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500,
                fontSize: '14px !important',
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
        fontSize: '15px',
        maxWidth: 'none',
    },
    info:{
        fontSize: '18px',
        marginLeft: '8px',
        color: '#fd0671',
        cursor: 'pointer'
    }
});


class OrderListTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["supplier_mobile", "buyer_mobile", "supplier_name", "buyer_name", "broker_name", "amount", "commodity", "Date"],
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
            showAddModal:false,
            infoData:null,
            open:false

        }
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.tableBodyData !== nextprops.tableData) {
            this.setState({ tableBodyData: nextprops.tableData });
        }
    }


    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    getInfoSTring(obj) {
        return obj.source_location ? obj.source_location : "- , " + obj.target_location ? obj.target_location : "-";
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
            return "#82af82";
        } else if (obj.role === 'broker') {
            return "#7070fd";
        } else {
            return "#e5e8ec";
        }
    }

    onInfoClick = (info,event)=>{
        this.setState({
            infoData:info,showAddModal:true,open:true
        })
    }

    onModalCancel(event){
        this.setState({showAddModal:false,infoData:null,open:false})
    }
    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Paper className={classes.root} >
                    {this.state.tableBodyData ? <div >
                        <Table className='table-body'>
                            <TableHead>
                                <TableRow  >
                                    {this.state.tableHeadData.map((option, i) => (
                                        <TableCell key={option} className={this.getTableCellClass(classes, i)} style={{ minWidth:'120px', paddingLeft: i === 0 ? '22px' : '' }}>{option}</TableCell>
                                    ))}
                                    {/* <TableCell key="star" className={this.getTableCellClass(classes, 4)} style={{ minWidth: '50px', color: "goldenrod", textAlign: 'left' }}> Quantity </TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableBodyData && this.state.tableBodyData.map((row, i) => {
                                    return (
                                       
                                        <TableRow key={'table_' + i} style={i % 2 === 0 ? { background: "#e5e8ec" } : { background: "#fff" }}>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                                {/* <Tooltip title={row.active ? "Enabled" : "Disabled"} placement="top" classes={{ tooltip: classes.lightTooltip }}> */}
                                                {row.supplier_mobile}
                                                {/* </Tooltip> */}
                                            </TableCell>
                                            <TableCell component="th" scope="row" className={this.getTableCellClass(classes, 0)}>
                                            {row.buyer_mobile}

                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 2)}>
                                                <Tooltip title={row.supplier_name?row.supplier_name:""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{row.supplier_name}</div>
                                                </Tooltip>

                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 3)}>
                                            <Tooltip title={row.buyer_name?row.buyer_name:""} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                                    <div className="text-ellpses">{row.buyer_name}</div>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell className={this.getTableCellClass(classes, 4)}>
                                               {row.broker_name}
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 5)} >
                                               {row.bijak_amt}
                                            </TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 6)} >{row.commodity}</TableCell>
                                            <TableCell className={this.getTableCellClass(classes, 7)} >{row.createdtime.split("T")[0]}<i onClick={this.onInfoClick.bind(this,row)} className={"fa fa-info-circle "+classes.info} aria-hidden="true"></i>
</TableCell>


                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {this.state.tableBodyData.length > 0 ? "" : <div className={classes.defaultTemplate}>
                        {this.state.searchedText.length > 0 ? <span className={classes.defaultSpan}>
                            <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>
                            {"Your serach does not match any list"} </span> : <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-frown-o"} aria-hidden="true"></i>{"No Data Available"}</span>}
                    </div>}
                    </div> :
                        <div style={{paddingTop: "14%"}} >
                            <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-search-plus"} aria-hidden="true"></i>{"Search from above to check specific Orders"}</span>
                        </div>
                    }
                    
{this.state.showAddModal ? <InfoDialog openModal={this.state.open}
data={ this.state.infoData}
onEditModalCancel={this.onModalCancel.bind(this)}/> :""}
                </Paper>
            </MuiThemeProvider>
        );
    }
}

OrderListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderListTable);