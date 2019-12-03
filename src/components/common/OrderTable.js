import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import orderService from './../../app/orderService/orderService';
import NoDataAvailable from '../common/NoDataAvailable';


const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '80%',
        // maxWidth: '700px',
        minHeight: '700px',
        // maxHeight: '500px'
    },
    tableCell: {
        paddingLeft: '4px',
        paddingRight: '4px',
        textAlign: 'center',
        maxWidth: '200px'
    },
    formAddBtn: {
        width: '90%',
        borderRadius: '10px',
        fontSize: '20px',
        textTransform: 'uppercase',
        backgroundColor: '#4d9fa0 ',
        color: '#fff',
        height: '45px',
        marginBottom: '15px',
        marginTop: "11px",
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    formRoot: {
        // display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        // marginLeft: '25%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    }

});

class OrderTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["supplier_mobile", "buyer_mobile", "supplier_name", "buyer_name", "broker_name", "amount", "commodity", "Date"],
            open: this.props.openModal,tableBodyData:[]
            }
   
    }
    componentDidMount() {
        console.log(this.props.data);
       let param ={};
        if(this.props.data.role === 'ca'){
            param["buyerid"] = this.props.data.mobile;
        }else  if(this.props.data.role === 'la'){
            param["brokerid"] = this.props.data.id;
        }else  if(this.props.data.role === 'broker'){
            param["supplierid"] = this.props.data.mobile;
        }
        if(Object.keys(param).length){
            this.getListData(param);
        }
        
    }


    async getListData(params) {
        this.setState({showLoader:true});

        try {
            let resp = await orderService.getOrderListData(params);
           
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ tableBodyData: resp.data.result.data ,showLoader:false});
                } else {
                    // this.setState({ tableBodyData: [] ,showLoader:false});
                }
       
        } catch (err) {
            console.error(err);
            if (this.ismounted) { 
                // this.setState({ tableBodyData: [],showLoader:false });
             }
        }
    }
    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    handleAddClick(event) {
       

    }
    render() {
        const { classes } = this.props;
        return (<div> <Dialog style={{ zIndex: '1' }}
            open={this.state.open}
            classes={{ paper: classes.dialogPaper }}
            onClose={this.handleDialogCancel.bind(this)}
            aria-labelledby="form-dialog-title"                >
            <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><p style={{ color: '#fff', marginTop: '-6px', fontFamily: 'Lato', fontSize: '20px' }}>Order Detail</p>  </DialogTitle>
            <DialogContent  style={{width:'100%',padding:'0'}}>
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
                                {this.state.tableBodyData.length >0 && this.state.tableBodyData.map((row, i) => {
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
                                            <TableCell className={this.getTableCellClass(classes, 7)} >{row.createdtime.split("T")[0]}
</TableCell>


                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                          
                        </Table>
                        { !this.state.tableBodyData.length &&  < NoDataAvailable style={{height:'25vh'}}/> }
            </DialogContent>
            <DialogActions>
                {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
                <Button className={classes.formCancelBtn} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
            {this.state.showConfirmDialog ?
                <ConfirmDialog
                    dialogText={this.state.dialogText}
                    dialogTitle={this.state.dialogTitle}
                    show={this.state.showConfirmDialog}
                    onConfirmed={this.handelConfirmUpdate}
                    onCanceled={this.handelCancelUpdate} /> : ""}
        </div>
        );
    }
}

OrderTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);