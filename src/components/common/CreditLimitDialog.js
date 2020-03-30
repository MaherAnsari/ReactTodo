import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import ConfirmDialog from '../../app/common/ConfirmDialog';
import Button from '@material-ui/core/Button';
import creditLimitService from './../../app/creditLimitService/creditLimitService';
import { getAccessAccordingToRole } from '../../config/appConfig';

var moment = require('moment');
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
    padding: '8px 24px',
    height:'60vh'

  },
  button: {
    height: '35px',
    marginTop: '10px',
    background: '#060a3b !important',
    color: '#fff'
  },
  header: {
    height: "25px",
    background: '#e9eff1',
    color: '#000',
    padding: '3px',
    fontSize: '14px',
    display: 'flex',
    borderRadius: '8px',
    marginTop: '20px'
  },
  row: {
    display: 'flex',
    height: '20px',
    padding: '2px',
    fontSize: '12px',
    color: '#000'
  },
  credit: {
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '18px'
  }

});

class CreditLimitDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      obj: {
        "bijak_credit_limit": "",
        "remarks": "",
        "mobile": this.props.userdata.mobile,
        "id": this.props.userdata.id
      },
      showConfirmDialog: false,
      tableBodyData: [],
      creditLimit:"-"

    }
  }
  componentDidMount() {
    //  console.log(moment.utc().utcOffset("+05:30").format('HH'));


    this.getCreditHiistory();
    this.getCreditLimit();
  }


  async getCreditLimit() {
    let param = {};

    if (this.props.userdata.mobile ) {
      param['mobile'] = this.props.userdata.mobile;
      // param['id'] = this.props.userdata.id;


      try {
        let resp = await creditLimitService.getCreditLimit(this.props.userdata.mobile);
        if (resp.data.status === 1 && resp.data.result) {
          this.setState({ creditLimit: resp.data.result });
        } else {
          // this.setState({ tableBodyData: [] });
          // alert("Oops an error occured while getting the credit limit");
          alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the credit limit");
        }
      } catch (err) {
        console.error(err)
        // this.setState({ tableBodyData: [] });
      }
    }
  }


  async getCreditHiistory() {
    let param = {};
    let obj = {
      "bijak_credit_limit": "",
      "remarks": "",
      "mobile": this.props.userdata.mobile,
      "id": this.props.userdata.id
    }
    this.setState({ showConfirmDialog: false, obj: obj });
    if (this.props.userdata.mobile && this.props.userdata.id) {
      param['mobile'] = this.props.userdata.mobile;
      param['id'] = this.props.userdata.id;


      try {
        let resp = await creditLimitService.getHistory(param);
        if (resp.data.status === 1 && resp.data.result) {
          this.setState({ tableBodyData: resp.data.result });
        } else {
          // alert("Oops an error occured while getting the list");
          alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the list");
          this.setState({ tableBodyData: [] });
        }
      } catch (err) {
        console.error(err)
        this.setState({ tableBodyData: [] });
      }
    }
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
    let limit =  this.state.obj.bijak_credit_limit;
    try {
      let resp = await creditLimitService.updateCreditLimit(this.state.obj);
      if (resp.data.status === 1 && resp.data.result) {
        this.getCreditHiistory();
        this.props.onLimitChange(limit);
      } else {
        this.getCreditHiistory();
      }
    } catch (err) {
      console.error(err)
      this.getCreditHiistory();
    }
  }

  handleAddClick(event) {
    console.log(this.state.obj);
    let dialogText = "Are you sure  to update ?";
    if (this.state.obj.bijak_credit_limit && this.state.obj.bijak_credit_limit !== "" && this.state.obj.remarks && this.state.obj.remarks !== "") {
      this.setState({ dialogText: dialogText, dialogTitle: "Alert", showConfirmDialog: true });
    } else {
      alert("Please check required field");
    }


  }

  formatDateAndTime = (dateval) => {
    var fdate = moment.utc(new Date(dateval)).utcOffset("+05:30").format('DD-MMM-YYYY HH:mm')
    // console.log(fdate);
    return fdate;
}

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider>
        <div className={classes.root}>
          {getAccessAccordingToRole("updateCreditLimit") && <div>

            <div style={{fontSize:'20px',textAlign:'center'}}>
                Available Credit Limit : {this.state.creditLimit}
            </div>
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
            required
          />
          <div style={{ display: "flex" }}>
            <TextField
              margin="dense"
              id="remarks"
              label="Remark"
              type="text"
              style={{ marginRight: '2%', width: '55%' }}
              value={this.state.obj.remarks}
              onChange={this.handleChange.bind(this)}
              fullWidth
              required
            />
            <Button className={classes.button} onClick={this.handleAddClick.bind(this)} color="primary">UPDATE</Button>
          </div>
          </div>}
          <div className={classes.credit}>Credit History :</div>
          <div className={classes.header}>
            <div style={{ width: "20%", marginLeft: '5px' }}>update By</div>
            <div style={{ width: "20%" }}>Credit Value</div>
            <div style={{ width: "20%" }}>Updated Time</div>
            <div style={{ width: "40%" }}>Remark</div>
          </div>
          {(this.state.tableBodyData && this.state.tableBodyData.length>0) ? <div style={{ maxHeight: "40vh", overflowY: "scroll" }} >
            {this.state.tableBodyData.map((option, i) => {
              return (<div className={classes.row} style={{ background: i % 2 === 0 ? '#fff' : '#e8e8e8' }} key={option} >
                <div style={{ width: "20%", marginLeft: '5px' }}>{option.updateBy}</div>
                <div style={{ width: "20%" }}>{option.bijak_credit_limit}</div>
                <div style={{ width: "20%" }}>{this.formatDateAndTime(option.createddate)}</div>
                <div style={{ width: "40%", textOverflow: "ellipsis", overflow: 'overlay' }}>{option.remarks}</div>
              </div>
              )
            })}
          </div> :<div style={{textAlign:'center',marginTop:'20px',fontSize:'20px'}}> No History Available</div>}
          <div>

          </div>
          {this.state.showConfirmDialog ?
            <ConfirmDialog
              dialogText={this.state.dialogText}
              dialogTitle={this.state.dialogTitle}
              show={this.state.showConfirmDialog}
              onConfirmed={this.handelConfirmUpdate}
              onCanceled={this.handelCancelUpdate} /> : ""}
        </div>

      </MuiThemeProvider>
    );
  }
}

CreditLimitDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreditLimitDialog);