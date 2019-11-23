import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Icon from '@material-ui/core/Icon';

class ConfirmDialog extends React.Component {
  state = {
    open: this.props.show,
    dialogText: this.props.dialogText,
    dialogTitle: this.props.dialogTitle || "Do you want to update the followings",
  };

  constructor(props){
    super(props);
    this.state = {
      open: this.props.show,
      dialogText:this.props.dialogText,
      dialogTitle: this.props.dialogTitle || "Do you want to update the followings",
    };
  }
  componentWillReceiveProps(){
    if(this.props!== this.state){
      this.setState({ open:  this.props.show});
    }
  }

  handleConfirmed = () => {
    this.setState({ open: false });
    this.props.onConfirmed();
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.onCanceled();
  };

  render() {
    // const { fullScreen } = this.props;

    return (
      <div>
        <Dialog
          // fullScreen={fullScreen}
          style={{minWidth:'250px'}}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <Icon style={{ color: 'red' }} className="fa fa-bell faa-ring animated">
            </Icon>
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: 'Lato', fontSize: '20px', color: '#000000d6' }}>
              {this.state.dialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleConfirmed} color="primary" autoFocus>
              Yes !
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ConfirmDialog);
