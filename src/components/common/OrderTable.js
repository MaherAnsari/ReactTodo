import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ConfirmDialog from './../../app/common/ConfirmDialog';
import NoDataAvailable from '../common/NoDataAvailable';

import "../../assets/css/order.scss";
const styles = theme => ({
    card: {
       width:'100%',
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
          boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
      },


});

class OrderTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["supplier_mobile", "buyer_mobile", "amount", "commodity", "Date"],
            open: this.props.openModal, tableBodyData: this.props.data
        }

    }
    componentDidMount() {


    }


    render() {
        const { classes } = this.props;
        return (<div style={{ width: '100%' }}>
            <div class="mdl-card mdl-shadow--2dp mdl-card--horizontal">
                <div class="mdl-card__media">
                    <img src="http://placehold.it/150x200/DC143C/FFFFFF" alt="img" />
                </div>
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">Welcome</h2>
                </div>
                <div class="mdl-card__supporting-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris sagittis pellentesque lacus eleifend lacinia...
    </div>
                <div class="mdl-card__actions mdl-card--border">
                    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple">Get Started</a>
                </div>
                <div class="mdl-card__menu">
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple"><i class="material-icons">share</i></button>
                </div>
            </div>



            \
                    {!this.state.tableBodyData.length && < NoDataAvailable style={{ height: '25vh' }} />}

            {/* <Button className={classes.formCancelBtn} onClick={this.handleAddClick.bind(this)} color="primary">Sumbit</Button> */}
            {/* <Button style={{float:'right',marginRight:'28px'}} onClick={this.handleDialogCancel.bind(this)} color="primary">Cancel</Button> */}

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