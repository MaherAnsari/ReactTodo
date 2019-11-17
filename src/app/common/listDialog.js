import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Utils from '../../app/common/utils';
const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    header: {
        width: '100%',
        textAlign: 'center',
        paddingLeft: '15px',
        color: '#fff',
        height: '40px',
        fontSize: '18px',
        fontFamily: 'lato',
        background: '#618849',
        paddingTop: '4px',
        position: 'fixed',
        maxWidth: '550px',
        zIndex: '1'
    },
    mainDiv: {
        maxHeight: '500px',
        minWidth: '550px',
        marginTop:'40px'

    },
    PLeft: {
        float: 'left',
        marginLeft: '5px',
        width: '70%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingTop: '5px'

    },
    PRight: {
        float: 'right',
        marginRight: '5px',
        width: '25%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingTop: '5px'

    },
    list: {
        fontSize: '14px',
        fontFamily: 'Lato',
        height: '35px',
        background: '#d8f1f0',
        paddingTop: '5px',

    },
    list1: {
        fontSize: '14px',
        fontFamily: 'Lato',
        height: '35px',
        background: '#fff',
        color: '#0f2035',
        paddingTop: '5px'
    },
    taskName: {
        fontSize: '16px',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    lightTooltip: {
        fontSize: '16px',
    },
})
class ListDialog extends React.Component {
    state = {
        open: this.props.show || true,
        dialogTitle: this.props.dialogTitle,
        type:this.props.type
    };

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.show || true,
            dialogTitle: this.props.dialogTitle,
            list: this.props.list,
            type:this.props.type
        };
    }
    componentWillReceiveProps() {
        if (this.props !== this.state) {
            this.setState({ open: this.props.show });
        }
    }



    handleConfirmed = (event) => {

        // this.props.onConfirmed();
    };


    handleClose = () => {
        this.setState({ open: false });
        this.props.onCanceled();
    };

    render() {
        const { classes } = this.props;
        // const { fullScreen } = this.props;

        return (
            <div>
                <Dialog
                    fullScreen={false}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <div className={classes.header} style={{ background: "#778070" }}> {this.state.dialogTitle} </div>
                    {(this.state.list.length > 0 && this.props.type === 1) &&
                        <div className={classes.mainDiv}>
                             {this.state.list.map((row, i) => {
                                return (
                                    <div key={'runnng' + i} className={i % 2 === 0 ? classes.list : classes.list1}>
                                        <Tooltip title={row.uniquekey} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                            <div className={classes.PLeft} >
                                                {row.taskname}
                                            </div>
                                        </Tooltip>
                                        <div className={classes.PRight}>  <i style={{ color: "#8a1212", marginLeft: '6px' }} className="fa fa-clock-o"> </i> {Utils.getTaskDuration(row.duration)}</div>
                                    </div>
                                )
                            })}                          
                        </div>}
                        {(this.state.list.length > 0 && this.props.type === 2) &&
                        <div className={classes.mainDiv}>                          
                            {this.state.list.map((row, i) => {

                                return (
                                    <div  key={'id' + i} style={{ cursor: 'pointer',textAlign:'center' }} className={i % 2 === 0 ? classes.list : classes.list1}>
                                        <Tooltip title={row.uniquekey} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                            <p className={classes.taskName}>{row.taskname}</p>
                                        </Tooltip>
                                    </div>
                                )
                            })}
                        </div>}
                        {(this.state.list.length > 0 && this.props.type === 3) &&
                        <div className={classes.mainDiv}>
                          
                            {this.state.list.map((row, i) => {

                                return (
                                    <div key={'id' + i} className={i % 2 === 0 ? classes.list : classes.list1}>
                                    <Tooltip title={row.taskname} placement="top" classes={{ tooltip: classes.lightTooltip }}>
                                             <div className={classes.PLeft} >
                                                 {row.taskname}
                                             </div>
                                         </Tooltip>
                                     <div className={classes.PRight}>  <i style={{ color: "#8a1212", marginLeft: '6px' }} className="fa fa-ban"> </i> {row.failcount}</div>
                                 </div>
                                )
                            })}
                        </div>}
                </Dialog>
            </div>
        );
    }
}

ListDialog.propTypes = {
    //   fullScreen: PropTypes.bool.isRequired,
    classes: PropTypes.object,
};

export default (withMobileDialog(), withStyles(styles))(ListDialog);
