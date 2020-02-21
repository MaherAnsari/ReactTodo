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
            // orderList: [],
            // paymentList:[],
            // orderLabel:"Orders ("+this.props.userInfoData.ordercount+")",
            // paymentLabel:"Payments ("+this.props.userInfoData.paymentcount+")"
        }
        console.log(this.props.userInfoData)
        console.log(this.props.data)
    }

    componentDidMount() {
        this.getCommodityNames();
        // let param = {"limit":10000};
        // if (this.props.userInfoData.role === 'ca') {
        //     param["buyerid"] = this.props.userInfoData.mobile;
        // } else if (this.props.userInfoData.role === 'broker') {
        //     param["brokerid"] = this.props.userInfoData.id;
        // } else if (this.props.userInfoData.role === 'la') {
        //     param["supplierid"] = this.props.userInfoData.mobile;
        // }else{
        //     param["na"] = this.props.userInfoData.mobile;
        // }
        // if (Object.keys(param).length) {
        //     this.getListData(param);
        // }

        this.getUserInfo(this.props.userId);
    }

    async getUserInfo(id) {
        this.setState({ showLoader: true });
        try {
            let resp = await commonService.getUserInfo(id);
            if (resp.data.status === 1 && resp.data.result) {
                this.setState({ userInfoData: resp.data.result, showLoader: false });
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

    // async getListData(params) {
    //     this.setState({ showLoader: true });

    //     try {
    //         let resp = await orderService.getOrderListData(params);

    //         if (resp.userInfoData.status === 1 && resp.userInfoData.result) {
    //             this.setState({ orderList: resp.userInfoData.result.userInfoData, showLoader: false });
    //         } else {
    //             // this.setState({ tableBodyData: [] ,showLoader:false});
    //         }

    //     } catch (err) {
    //         console.error(err);
    //         if (this.ismounted) {
    //             // this.setState({ tableBodyData: [],showLoader:false });
    //         }
    //     }
    // }

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
    // getTransactionList = async () => {
    //     try {
    //         let param = {"limit":10000,"role":this.props.userInfoData.role}
    //         let resp = await paymentService.getTransactionDetailsOfBuyer(this.props.userInfoData.mobile, param);
    //         if (resp.userInfoData.status === 1 && resp.userInfoData.result) {
    //             var respData = resp.userInfoData.result;
    //             this.setState({

    //                 paymentList: respData["allTransactions"]
    //             });
    //         } else {
    //             this.setState({
    //                 paymentList: []
    //             });
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }


    onLimitChange(event) {
        // console.log(event);
        this.props.onLimitUpdate(event);
    }

    onFooterButtonClickedAction( data ){
        // console.log( data );
        if( data.type === "redirect" ){
            this.setState({ currentView  : data.btnName  })
        }else{
            this.setState({ 
                currentView  : data.btnName, 
                showAddTransactionModal : (data.btnName === "payment" ? true : false ),
                showAddOrderModal : (data.btnName === "orders"  ? true : false )
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
                                    variant="fullWidth"
                                    indicatorColor="secondary"
                                    textColor="secondary"
                                    aria-label="icon label tabs example"
                                >
                                    <Tab label="User Info" value="userInfo" />
                                    {/* <Tab label={this.state.orderLabel} value="orders" />
                        <Tab label={this.state.paymentLabel} value="payment" /> */}
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
                                        data={this.state.userInfoData}
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

                            <UserDetailsFooter
                                isPaymentInfoModal={ true }
                                onFooterButtonClicked={(data) => this.onFooterButtonClickedAction(data)} />


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