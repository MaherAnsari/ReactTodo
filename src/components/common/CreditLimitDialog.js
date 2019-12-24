import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
  overrides: {
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
    }, MuiTablePagination: {
      toolbar: {
        paddingRight: '200px'
      }
    },
  }
});

const styles = theme => ({
  root: {
    width: '100%',
    fontFamily: 'lato !important',
    marginTop: '50px',
    padding: '8px 24px'

  },
  button: {
    height: '35px',
    marginTop: '20px'
  }

});

class CreditLimitDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      obj: {
        "bijak_credit_limit": 0,
        "remark": ""
      },
      showConfirmDialog:false

    }
  }
  componentDidMount() {
    //  console.log(this.props.userdata);
  }


  handleChange = (event) => {
    let data = this.state.obj;
    let id = event.target.id;

    data[id] = event.target.value;

    this.setState({ obj: data });
  };

  handelCancelUpdate(event) {
    this.setState({ showConfirmDialog: false });
  }
  handelConfirmUpdate = async () => {
    console.log(this.state.obj);
  }

  handleAddClick(event) {
  
    let dialogText = "Are you sure  to update ?";

    this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });

  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TextField
          margin="dense"
          id="bijak_credit_limit"
          label="bijak Credit Limit"
          type="number"
          maxLength="10"
          // disabled={this.state.isUpdate} 
          style={{ width: '55%' }}
          value={this.state.obj.bijak_credit_limit}
          onChange={this.handleChange.bind(this)}
          fullWidth
        />
        <div style={{ display: "flex" }}>
          <TextField
            margin="dense"
            id="remark"
            label="Remark"
            type="text"
            style={{ marginRight: '2%', width: '55%' }}
            value={this.state.obj.remark}
            onChange={this.handleChange.bind(this)}
            fullWidth
          />
          <Button className={classes.button} onClick={this.handleAddClick.bind(this)} color="primary">UPDATE</Button>
        </div>

        {this.state.showConfirmDialog ?
          <ConfirmDialog
            dialogText={this.state.dialogText}
            dialogTitle={this.state.dialogTitle}
            show={this.state.showConfirmDialog}
            onConfirmed={this.handelConfirmUpdate}
            onCanceled={this.handelCancelUpdate} /> : ""}
      </div>

      // </MuiThemeProvider>
    );
  }
}

CreditLimitDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreditLimitDialog);