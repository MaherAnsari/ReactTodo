import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import EditUser from './EditUser';
import UserDetail from './UserDetail';
import commodityService from '../../app/commodityService/commodityService';
import CreditLimitDialog from './CreditLimitDialog';
import commonService from '../../app/commonService/commonService';
import Loader from './Loader';
import BankDetail from './bankDetail';
import UserDetailsFooter from './UserDetailsFooter';
import OrderTable from './OrderTable';
import PaymentTable from './PaymentTable';
import orderService from '../../app/orderService/orderService';
import creditLimitService from '../../app/creditLimitService/creditLimitService';
import paymentService from '../../app/paymentService/paymentService';

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
    dialogPaper: {
        minWidth: '850px',
        // maxWidth: '700px',
        minHeight: '700px',
        // maxHeight: '500px'
    },
    profile: {
        marginLeft: '30%',
        background: 'red',
        width: '40px',
        borderRadius: '10px'
    }

});

class BusinessInfoDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList: [],
            open: this.props.openModal,
            isUpdate: false,
            isInfo: false,
            currentView: "userInfo",
            userInfoData: {},
            orderList: [],
            paymentList: [],
            orderLabel: "Orders (" + 0 + ")",
            paymentLabel: "Payments (" + 0 + ")",
            creditLimitData: "",
            userRole: ""
        }
        console.log(this.props.userInfoData)
        console.log(this.props.data)
    }

    componentDidMount() {
        this.getCommodityNames();
        this.getUserInfo(this.props.userId);

    }

    async getCreditLimit( mobileno ) {
        let param = {};
        if (mobileno) {
            param['mobile'] = mobileno;
            try {
                let resp = await creditLimitService.getCreditLimit(mobileno);
                console.log(resp);
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ creditLimitData: resp.data.result });
                } else {
                    this.setState({ creditLimitData: "" });
                    alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the credit limit");
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    async getUserInfo(id) {
        this.setState({ showLoader: true });
        try {
            let resp = await commonService.getUserInfo(id);
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({
                    userInfoData: resp.data.result,
                    userRole: resp.data.result.role
                });

                let param = { "limit": 10000 };
                if (resp.data.result.role === 'ca') {
                    param["buyerid"] = resp.data.result.mobile;
                } else if (resp.data.result.role === 'broker') {
                    param["brokerid"] = resp.data.result.id;
                } else if (resp.data.result.role === 'la') {
                    param["supplierid"] = resp.data.result.mobile;
                } else {
                    param["na"] = resp.data.result.mobile;
                }
                if (Object.keys(param).length) {
                    this.getListData(param);
                    this.getTransactionList(resp.data.result.role, resp.data.result.mobile);
                    this.getCreditLimit(resp.data.result.mobile);
                }
                
            } else {
                // this.setState({ tableBodyData: [] ,showLoader:false});
                // alert("Oops an error occured while getting the info");
                alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the info");
            }
        } catch (err) {
            console.error(err);
            if (this.ismounted) {
                // this.setState({ tableBodyData: [],showLoader:false });
            }
        }
    }

    async getListData(params) {
        // this.setState({ showLoader: true });
        try {
            let resp = await orderService.getOrderListData(params);
            console.log(resp)
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({
                    orderList: resp.data.result.data,
                    orderLabel: "Orders (" + resp.data.result.data.length + ")",
                    showLoader: false
                });
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

    async getCommodityNames(txt) {
        try {
            let resp = await commodityService.getCommodityTable();
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ commodityList: this.getCommodityNamesArray(resp.data.result.data) });
            } else {
                this.setState({ commodityList: [] });
            }
        } catch (err) {
            console.error(err)
            this.setState({ commodityList: [] });
        }
    }

    getCommodityNamesArray(data) {
        try {
            var listData = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["name"]) {
                        listData.push(data[i]["name"])
                    }
                }
            }
            return listData;
        } catch (err) {
            console.log(err);
            return [];
        }
    }


    getHeader() {
        if (this.props.isInfo) {
            return this.state.userInfoData.fullname;
        } else {
            return "User Data";
        }
    }

    handleDialogCancel(event) {
        this.props.onEditModalCancel();
    }


    getProfileColor(data) {
        if (data <= 2) {
            return 'red';
        } else if (data > 2 && data <= 5) {
            return '#d8d805';
        } else {
            return "green";
        }
    }

    handleChange = (event, value) => {
        // console.log(event,value);
        this.setState({ currentView: value });
    };

    handleClose(event) {
        this.props.onEditModalClosed();
    }

    getTransactionList = async (role, mobile) => {
        try {
            let param = { "limit": 10000, "role": role }
            let resp = await paymentService.getTransactionDetailsOfBuyer(mobile, param);
            console.log(resp)
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({
                    paymentList: respData["allTransactions"],
                    paymentLabel: "Payments (" + (respData["allTransactions"] ? respData["allTransactions"].length : 0) + ")"
                });
            } else {
                this.setState({
                    paymentList: []
                });
            }
        } catch (err) {
            console.error(err);
        }
    }


    onLimitChange(event) {
        // console.log(event);
        this.props.onLimitUpdate(event);
    }

    onFooterButtonClickedAction(data) {
        // console.log( data );
        if (data.type === "redirect") {
            this.setState({ currentView: data.btnName })
        } else {
            this.setState({
                currentView: data.btnName,
                showAddTransactionModal: (data.btnName === "payment" ? true : false),
                showAddOrderModal: (data.btnName === "orders" ? true : false)
            });
        }

    }

    render() {
        const { classes } = this.props;
        const { showLoader } = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Dialog style={{ zIndex: '1' }}
                        open={this.state.open}
                        classes={{ paper: classes.dialogPaper }}
                        onClose={this.handleDialogCancel.bind(this)}
                        aria-labelledby="form-dialog-title"                >
                        <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title">
                            <div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '20px' }}>
                                {this.getHeader()}
                                {/* {this.props.isInfo && 
                            <p 
                            className={classes.profile} 
                            style={{ background: this.getProfileColor(this.state.userInfoData.profile_segment) }}>
                            {this.state.userInfoData.profile_segment}</p>} */}
                            </div>
                        </DialogTitle>
                        <DialogContent style={{ width: '100%', padding: '0' }}>
                            <div style={{ position: "fixed", width: '850px' }}><Paper square className={classes.root}>
                                <Tabs
                                    value={this.state.currentView}
                                    onChange={this.handleChange}
                                    // variant="fullWidth"
                                    variant="scrollable"
                                    indicatorColor="secondary"
                                    textColor="secondary"
                                    aria-label="icon label tabs example"
                                >
                                    <Tab label="User Info" value="userInfo" />
                                    <Tab label={this.state.orderLabel} value="orders" />
                                    <Tab label={this.state.paymentLabel} value="payment" />
                                    <Tab label="Edit User" value="editUser" />
                                    <Tab label="Credit Limit" value="creditLimit" />
                                    <Tab label="Account Info" value="accountDetail" />
                                </Tabs>
                            </Paper></div>


                            {!showLoader ? <div>
                                {this.state.currentView === 'userInfo' ?
                                    <UserDetail
                                        openModal={this.state.open}
                                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                        creditLimitData={this.state.creditLimitData}
                                        data={this.state.userInfoData}
                                    /> : ""}

                                {this.state.currentView === 'orders' ?
                                    <OrderTable openModal={this.state.open}
                                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                        showAddOrderModal={this.state.showAddOrderModal}
                                        onAddOrderModalClosed={() => this.setState({ showAddOrderModal: false })}
                                        onOrderAdded={( data )=> this.getListData( data ) }
                                        data={this.state.orderList}
                                        userdata={this.state.userInfoData}
                                        role={this.state.userRole}
                                    /> : ""}

                                {this.state.currentView === 'payment' ?
                                    <PaymentTable openModal={this.state.open}
                                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                        showAddTransactionModal={this.state.showAddTransactionModal}
                                        onTransactionModalClosed={() => this.setState({ showAddTransactionModal: false })}
                                        data={this.state.paymentList}
                                        userdata={this.state.userInfoData}
                                        role={this.state.userRole}
                                    /> : ""}

                                {this.state.currentView === 'editUser' ?
                                    <EditUser
                                        openModal={this.state.open}
                                        onEditModalClosed={this.handleClose.bind(this)}
                                        data={this.state.userInfoData}
                                        commodityList={this.state.commodityList}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                    /> : ""}
                                {this.state.currentView === 'creditLimit' ?
                                    <CreditLimitDialog
                                        openModal={this.state.open}
                                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                        userdata={this.state.userInfoData}
                                        onLimitChange={this.onLimitChange.bind(this)}
                                    /> : ""}

                                {this.state.currentView === 'accountDetail' ?
                                    <BankDetail
                                        openModal={this.state.open}
                                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                                        userdata={this.state.userInfoData}

                                    /> : ""}
                            </div>
                                :
                                <Loader />}

                            {this.state.currentView === 'userInfo' &&
                                <UserDetailsFooter
                                    // isPaymentInfoModal={true}
                                    onFooterButtonClicked={(data) => this.onFooterButtonClickedAction(data)} />}


                        </DialogContent>

                    </Dialog>

                </div>
            </MuiThemeProvider>
        );
    }
}

BusinessInfoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BusinessInfoDialog);