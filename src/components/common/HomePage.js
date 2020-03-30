import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../../assets/css/app.css';
import ListItems from '../../containers/SidebarComponent';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import { Route } from "react-router-dom";
import { Auth } from "aws-amplify";
import cookie from "react-cookies";
import { withRouter } from 'react-router-dom';
import MandiDataContainer from '../mandiData/MandiDataContainer';
import UserDataContainer from '../userData/UserDataContainer';
import BrokerContainer from '../broker/brokerContainer';
import BuyerContainer from '../buyer/buyerContainer';
import SupplierContainer from '../supplier/supplierContainer';
import PriceContainer from '../price/priceContainer';
import mandiDataService from '../../app/mandiDataService/mandiDataService';
import CommodityContainer from '../commodityList/commodityContainer';
import OrdersContainer from '../orders/OrdersContainer';
import PaymentContainer from '../payment/PaymentContainer';
import TodaysPaymentContainer from '../todaysPayments/TodaysPaymentContainer';
import Utils from '../../app/common/utils';
import MandiRateContainer from '../mandiRates/MandiRateContainer';
import ChangePasswordPage from '../auth/ChangePasswordPage';
import Icon from '@material-ui/core/Icon';
import AddBankAccountContainer from '../addBankAccount/AddBankAccountContainer';
import commonService from '../../app/commonService/commonService';
import RolePermissionContainer from '../role-permission/RolePermissionContainer';
import { getStatusOfRole } from '../../config/appConfig';
import PaymentDetailsContainer from '../paymentDetails/PaymentDetailsContainer';
import DownloadNetContainer from '../downloadData/DownloadNetContainer';

const drawerWidth = 250;

const styles = theme => ({
  root: {
    flexGrow: 1,
    // height: "100vh",
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  toolbarRoot: {
    flexGrow: 1

  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#f5f3f3',
    textColor: "#50a3b4",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  barBrandName: {
    marginLeft: '10px',
    marginTop: '20px',
    fontSize: '16px',
    color: '#ffffff',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'fixed',
    whiteSpace: 'nowrap',
    // backgroundColor: '#f5f5fa',
    backgroundColor: '#2e3247',
    borderRight: "0 !important",
    backgroundImage: "#2e3247 !important",
    // backgroundImage: "linear-gradient(to left, #3c3f3f, #333535, #292c2c, #212323, #181a1a)",
    // backgroundImage: "linear-gradient(to right bottom, #478e89, #25828b, #00748c, #00668c, #005687)",
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 7,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    background: 'white',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: theme.spacing.unit * 3,
    // paddingLeft: theme.spacing.unit * 3,
    // paddingRight: theme.spacing.unit * 3,
    marginTop: '30px',
  },
  Icon: {
    // float: 'left',
    marginTop: '15px',
    width: '32%',
    float: 'right',
    height: '20px',
    display: "flex"
  },
  IconFirstDiv: {
    width: '33%',
    float: 'left'
  },
  IconSecondDiv: {
    width: '33%',
    float: 'left'
  },
  badgeNotify: {
    color: '#fff',
    background: 'red',
    position: 'relative',
    top: '-40px',
    marginLeft: '16px',
    width: '30px',
    textAlign: 'center',
    borderRadius: '5px',
    fontSize: '12px'

  },
  lightTooltip: {
    fontSize: '14px',
  },
});

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      auth: true,
      anchorEl: null,
      dbImgUrl: "",
      isSetGlobal: false,
      globalDbSwitched: {
        isGlobalset: false,
        isChangedNow: false,
      },
      drainingTask: 0,
      runningTask: 0,
      failedTask: 0,
      healthyLabsCount: 0,
      dbNameList: { 'runningTask': [], 'drainingTask': [], 'failedTask': [], "healthyLabs": {} },
      showUnHealthyList: false,

      showChangePasswordView: false,
      currentTabName: ""
    };
    this.logoutUser = this.logoutUser.bind(this)
    this.changePasswordViewClick = this.changePasswordViewClick.bind(this)
    this.getDbLogo = this.getDbLogo();
  }


  componentWillMount() {
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
  }

  async componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.getUserRole(user.attributes.phone_number);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getData() {
    let resp = await mandiDataService.getDistrictList();
    if (resp.data.status === 1 && resp.data.result) {
      Utils.setDistrictData(resp.data.result.data)
    }else{
      // alert("Oops an error occured while getting the district list");
      alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the district list");
    }
  }

  async getUserRole(mobile) {
    // // alert( mobile );
    try {
      // sessionStorage.setItem("userRole","SuperAdmin");
      let resp = await commonService.getUserSpecificRole(mobile);
      if (resp.data.status === 1 && resp.data.result && resp.data.result.length > 0 &&
        resp.data.result[0].permissions && resp.data.result[0].permissions !== "") {
        sessionStorage.setItem("userRole", resp.data.result[0].permissions);
        sessionStorage.setItem("userName", resp.data.result[0].name);
        sessionStorage.setItem("userMobile", resp.data.result[0].mobile);
        this.getData();
      } else {
        sessionStorage.setItem("userRole", "restricted");
        this.props.history.push("/access-denied");
      }
    } catch (err) {
      console.error(err)
      sessionStorage.setItem("userRole", "restricted");
      this.props.history.push("/access-denied");
    }
  }



  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  callTaskApiEveryOneMinutes() {

  }


  logoutUser = () => {
    try {
      Auth.signOut()
        .then(data => {
          cookie.remove('bijak_token', { path: '/' })
          cookie.remove('username', { path: '/' });
          this.props.history.push("/");
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err)
    }
  }

  changePasswordViewClick = () => {
    try {
      this.setState({ showChangePasswordView: true, anchorEl: null })

    } catch (err) {
      console.log(err)
    }
  }

  async getDbLogo() {

  }

  handelGlobalDbSwitched = isGlobalOption => {
    // alert(isGlobalOption);
  }

  handelGlobalData(event) {
    Utils.setGlobalMode(!this.state.isSetGlobal);
    this.setState({ isSetGlobal: !this.state.isSetGlobal }, function () {
      // this.props.onGlobalDbSwitched(this.state.isSetGlobal);
      this.props.history.push("/" + Utils.getDbName() + '/home/dbChanged');
    });
  }



  render() {

    const { classes } = this.props;
    const { anchorEl, showChangePasswordView } = this.state;
    const open = Boolean(anchorEl);
    // const username = cookie.load('username');

    return (
      <div className={classes.root}>
        <AppBar position="fixed" style={{ background: "#2e3247", boxShadow: 'none' }}
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
          <Toolbar>

            <div className={this.props.classes.toolbarRoot}>
              <Grid container spacing={8}>
                <Grid item xs={6} sm={1}>

                  {
                    this.state.open ?
                      <IconButton onClick={this.handleDrawerClose}>
                        <MenuIcon style={{ color: "#fff" }} />
                      </IconButton> :
                      <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerOpen}
                        className={classNames(classes.menuButton, this.state.open && classes.hide)}
                      >
                        {/* <img src={logo} className="App-logo2" alt="logo2" /> */}
                        <MenuIcon style={{ color: "#fff" }} />
                      </IconButton>
                  }
                </Grid>
                {/* <Grid style={{marginLeft:'5px',padding: "47px 0px"}} > */}
                <div style={{ color: "white", margin: "auto", display: "flex", width: "22%", height: "25px" }}>
                  <Icon style={{ color: "#50a1cf", fontSize: "24px" }}>play_arrow</Icon>
                  <span style={{ lineHeight: "26px" }}> {this.state.currentTabName}</span>
                </div>
                {/* </Grid> */}

                <Grid style={{ marginLeft: '34%' }} item xs={3} sm={4}>
                  {!cookie.load('bijak_token')

                    ? <div></div>
                    : <div style={{ textAlign: "right", display: "flex", float: "right" }}>
                      <div style={{ display: "grid" }}>
                        <span  style={{ fontSize: "17px", fontWeight: 500, fontFamily: "lato" }} > {sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : ""}</span>
                        <span  style={{ fontSize: "13px", fontWeight: 500, fontFamily: "lato" }}>  {sessionStorage.getItem("userMobile") ? sessionStorage.getItem("userMobile") : ""}</span>
                      </div>
                      <IconButton
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                      >
                        <AccountCircle style={{ color: "#ed4b53" }} />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={open}
                        onClose={this.handleClose}
                      >
                        <MenuItem style={{ fontSize: "14px", fontWeight: 500, fontFamily: "lato" }}
                          onClick={this.changePasswordViewClick}>Change Password
                        </MenuItem>
                        <MenuItem style={{ fontSize: "14px", fontWeight: 500, fontFamily: "lato" }}
                          onClick={this.logoutUser}>Logout</MenuItem>

                      </Menu>
                    </div>
                  }
                </Grid>
              </Grid>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}

          open={this.state.open}

        >

          {/* <Divider /> */}
          <List id="binod" style={{ padding: '0' }}>
            <ListItems
              globalModeOption={this.state.isSetGlobal}
              isdrawerOpen={this.state.open}
              dbImageUrl={this.state.dbImgUrl}
              onRouteClicked={(rname) => this.setState({ currentTabName: rname })}
              labname={this.state.labname} />
          </List>
        </Drawer>
        <main className={classes.content} style={this.state.open ? { marginLeft: '250px' } : { marginLeft: '56px' }}>

          {getStatusOfRole("BasicUser") && <Route path='/home/user-list' exact component={UserDataContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/buyer-list' exact component={BuyerContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/broker-list' exact component={BrokerContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/supplier-list' exact component={SupplierContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/rate-list' exact component={PriceContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/orders-list' exact component={OrdersContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/payment' exact component={PaymentContainer} />}
          {getStatusOfRole("BasicUser") && <Route path='/home/payment-details' exact component={PaymentDetailsContainer} />}
          {/* {getStatusOfRole("BasicUser") && <Route path='/home/todays-payment' exact component={TodaysPaymentContainer} />} */}
          {getStatusOfRole("BasicUser") && <Route path='/home/add-bank-account' exact component={AddBankAccountContainer} />}
          {getStatusOfRole("DownloadData") && <Route path='/home/downlaod-net' exact component={DownloadNetContainer} />}

          {getStatusOfRole("SupportingDataManagement") && <Route path='/home/comodity-list' exact component={CommodityContainer} />}
          {getStatusOfRole("SupportingDataManagement") && <Route path='/home/mandi-data' exact component={MandiDataContainer} />}
          {getStatusOfRole("SupportingDataManagement") && <Route path='/home/mandi-rates' exact component={MandiRateContainer} />}

          {getStatusOfRole("SuperAdmin") &&
            <Route path='/home/role-permission' exact component={RolePermissionContainer} />}
        </main>

        {showChangePasswordView &&
          <ChangePasswordPage
            openModal={this.state.showChangePasswordView}
            onModalClose={() => this.setState({ showChangePasswordView: false })} />}
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(Home));