import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GraphComponent from './GraphComponent';
import mandiDataService from '../../../app/mandiDataService/mandiDataService';
import Loader from '../../common/Loader';
import NoDataAvailable from "../../common/NoDataAvailable";

const styles = theme => ({
    heading: {
        fontSize: '21px',
        fontWeight: '500',
        marginTop: '0',
        marginBottom: '0',
        fontFamily: 'Montserrat, sans-serif',
    },
    dialogPaper: {
        minWidth: '800px',
        // maxWidth: '700px',
        // minHeight: '700px',
        // maxHeight: '500px'
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
        flexWrap: 'wrap',
        width: '100%',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 6px 0px  rgba(0,0,0,0.3)',
        borderRadius: '4px',
        marginBottom: '20px',
        marginTop: '8%',
        padding: '25px',
        textAlign: 'center'
    }

});

class UserDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.openModal,
            graphPayloads : this.props.graphPayloads,
            graphData: undefined
        }
    }
    componentDidMount() {
        this.getGraphData( this.state.graphPayloads)
    }

    async getGraphData( params ) {
        try {
            console.log( params )
            let resp = await mandiDataService.commoditypricetrendGraphData( params );
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ graphData: resp.data.result.data });
            } else {
                this.setState({ graphData: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ graphData: [] });
        }
    }

    handleDialogCancel(event) {
        this.setState({ open: false })
        this.props.onModalClose();
    }

    render() {
        const { classes } = this.props;
        return (<div>
            <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle
                    style={{ background: '#05073a', textAlign: 'center', height: '40px' }}
                    id="form-dialog-title">
                    <p style={{ color: '#fff', marginTop: '-10px', fontFamily: 'Lato', fontSize: '18px' }}>
                    {this.state.graphPayloads["market"] + "  ( "+ this.state.graphPayloads["commodity"]+" )" }
                    </p>
                </DialogTitle>
                <DialogContent>
                    {this.state.graphData && this.state.graphData.length > 0 ?
                        <GraphComponent
                            graphData={this.state.graphData} />
                        :
                        (this.state.graphData && this.state.graphData.length === 0 ? 
                            <NoDataAvailable style={{ color: "#fff", background: '#533381 !important' }} bvText={"No Data"} />
                            :
                        <Loader />)}
                </DialogContent>
            </Dialog>
        </div>
        );
    }
}

UserDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDialog);