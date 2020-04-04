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
import OrderTable from './OrderTable';
import EditUser from './EditUser';
import UserDetail from './UserDetail';
import commodityService from '../../app/commodityService/commodityService';
import orderService from '../../app/orderService/orderService';
import PaymentTable from './PaymentTable';
import paymentService from '../../app/paymentService/paymentService';
import CreditLimitDialog from './CreditLimitDialog';
import BankDetail from './bankDetail';
import UserDetailsFooter from './UserDetailsFooter';
import creditLimitService from '../../app/creditLimitService/creditLimitService';
import SweetAlertPage from '../../app/common/SweetAlertPage';
import Utils from '../../app/common/utils';

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

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commodityList:  { options:[], optionN_E :{}, optionE_N:{}},
            open: this.props.openModal,
            isUpdate: false,
            isInfo: false,
            currentView: "userInfo",
            orderList: undefined,
            paymentList: undefined,
            orderLabel: "Orders (" + this.props.data.ordercount + ")",
            paymentLabel: "Payments (" + this.props.data.paymentcount + ")",

            showAddTransactionModal: false,
            showAddOrderModal: false,
            creditLimitData: ""



        }
    }
    componentDidMount() {
        this.getCommodityNames();
        let param = { "limit": 10000 };
        if (this.props.data.role === 'ca') {
            param["buyerid"] = this.props.data.mobile;
        } else if (this.props.data.role === 'broker') {
            param["brokerid"] = this.props.data.id;
        } else if (this.props.data.role === 'la') {
            param["supplierid"] = this.props.data.mobile;
        } else {
            param["na"] = this.props.data.mobile;
        }
        if (Object.keys(param).length) {
            this.getListData(param);
        }
        this.getTransactionList();
        this.getCreditLimit();
    }



    async getCreditLimit() {
        let param = {};
        if (this.props.data.mobile) {
            param['mobile'] = this.props.data.mobile;
            try {
                let resp = await creditLimitService.getCreditLimit(this.props.data.mobile);
                console.log(resp);
                if (resp.data.status === 1 && resp.data.result) {
                    this.setState({ creditLimitData: resp.data.result });
                } else {
                    // this.setState({ creditLimitData: "-" });
                    // alert(resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the credit limit");

                    let sweetAlrtData = this.state.sweetAlertData;
                    sweetAlrtData["type"] = "error";
                    sweetAlrtData["title"] = "Error";
                    sweetAlrtData["text"] = resp && resp.data && resp.data.message ? resp.data.message : "Oops an error occured while getting the credit limit";
                    this.setState({
                        creditLimitData: "-",
                        showSweetAlert: true,
                        sweetAlertData: sweetAlrtData
                    });
                }
            } catch (err) {
                console.error(err)
            }
        }
    }


    async getListData(params) {
        this.setState({ showLoader: true });
        try {
            params["userInfo"] = true;
            let resp = await orderService.getOrderListData(params);
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ orderList: resp.data.result.data, showLoader: false });
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
                this.setState({ commodityList: Utils.getCommodityNamesArrayKeysMap(resp.data.result.data) });
            } else {
                this.setState({ commodityList:  { options:[], optionN_E :{}, optionE_N:{}} });
            }
        } catch (err) {
            console.error(err)
        }
    }

    getHeader() {
        if (this.props.isInfo) {
            return this.props.data.fullname;
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
        console.log(event, value);
        this.setState({ currentView: value });
    };

    handleClose(event) {
        this.props.onEditModalClosed();
    }
    getTransactionList = async () => {
        try {
            let param = { "limit": 10000, "role": this.props.data.role, userInfo: true }
            let resp = await paymentService.getTransactionDetailsOfBuyer(this.props.data.mobile, param);
            if (resp.data.status === 1 && resp.data.result) {
                var respData = resp.data.result;
                this.setState({

                    paymentList: respData["allTransactions"]
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

    handelSweetAlertClosed() {
        this.setState({ showSweetAlert: false }, () => {
            if (this.state.sweetAlertData.type !== "error") {
                // this.handelGetData();
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { showSweetAlert, sweetAlertData } = this.state;

        return (<MuiThemeProvider theme={theme}>
            <div> <Dialog style={{ zIndex: '1' }}
                open={this.state.open}
                classes={{ paper: classes.dialogPaper }}
                onClose={this.handleDialogCancel.bind(this)}
                aria-labelledby="form-dialog-title"                >
                <DialogTitle style={{ background: '#05073a', textAlign: 'center', height: '60px' }} id="form-dialog-title"><div style={{ color: '#fff', fontFamily: 'Lato', fontSize: '20px', display: 'flex', marginLeft: '35%', width: '60%' }}>{this.getHeader()}
                    {this.props.isInfo && <p className={classes.profile} style={{ background: this.getProfileColor(this.props.data.profile_segment) }}>{this.props.data.profile_segment}</p>}</div>  </DialogTitle>
                <DialogContent style={{ width: '100%', padding: '0' }}>
                    <div style={{ position: "fixed", width: '850px' }}><Paper square className={classes.root}>
                        <Tabs
                            value={this.state.currentView}
                            onChange={this.handleChange}
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

                    {this.state.currentView === 'orders' ?
                        <OrderTable openModal={this.state.open}
                            onEditModalClosed={this.handleDialogCancel.bind(this)}
                            onEditModalCancel={this.handleDialogCancel.bind(this)}
                            showAddOrderModal={this.state.showAddOrderModal}
                            onOrderAdded={(data) => this.getListData(data)}
                            onAddOrderModalClosed={() => this.setState({ showAddOrderModal: false })}
                            data={this.state.orderList}
                            userdata={this.props.data}
                            role={this.props.data.role}
                        /> : ""}

                    {this.state.currentView === 'editUser' ?
                        <EditUser openModal={this.state.open}
                            onEditModalClosed={this.handleClose.bind(this)}
                            data={this.props.data}
                            commodityList={this.state.commodityList}
                            onEditModalCancel={this.handleDialogCancel.bind(this)}
                        /> : ""}

                    {this.state.currentView === 'userInfo' ?
                        <UserDetail openModal={this.state.open}
                            onEditModalClosed={this.handleDialogCancel.bind(this)}
                            onEditModalCancel={this.handleDialogCancel.bind(this)}
                            creditLimitData={this.state.creditLimitData}
                            data={this.props.data}
                        /> : ""}

                    {this.state.currentView === 'payment' ?
                        <PaymentTable openModal={this.state.open}
                            onEditModalClosed={this.handleDialogCancel.bind(this)}
                            onEditModalCancel={this.handleDialogCancel.bind(this)}
                            showAddTransactionModal={this.state.showAddTransactionModal}
                            onPaymentAdded={() => this.getTransactionList()}
                            onTransactionModalClosed={() => this.setState({ showAddTransactionModal: false })}
                            data={this.state.paymentList}
                            userdata={this.props.data}
                            role={this.props.data.role}
                        /> : ""}
                    {this.state.currentView === 'creditLimit' ?
                        <CreditLimitDialog openModal={this.state.open}
                            onEditModalClosed={this.handleDialogCancel.bind(this)}
                            onEditModalCancel={this.handleDialogCancel.bind(this)}
                            userdata={this.props.data}
                            onLimitChange={this.onLimitChange.bind(this)}
                        /> : ""}

                    {this.state.currentView === 'accountDetail' ? <BankDetail openModal={this.state.open}
                        onEditModalClosed={this.handleDialogCancel.bind(this)}
                        onEditModalCancel={this.handleDialogCancel.bind(this)}
                        userdata={this.props.data}
                    /> : ""}

                    {this.state.currentView === 'userInfo' &&
                        <UserDetailsFooter
                            onFooterButtonClicked={(data) => this.onFooterButtonClickedAction(data)} />}

                </DialogContent>

                {showSweetAlert &&
                    <SweetAlertPage
                        show={true}
                        type={sweetAlertData.type}
                        title={sweetAlertData.title}
                        text={sweetAlertData.text}
                        sweetAlertClose={() => this.handelSweetAlertClosed()}
                    />}

            </Dialog>

            </div>
        </MuiThemeProvider>
        );
    }
}

UserInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserInfo);