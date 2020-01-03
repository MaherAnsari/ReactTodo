import Api from '../../config/dev';
import Utils from '../common/utils';


let paymentService = {

    // default api on landing in payment Page
    getPaymentDetails : async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'payment/detail',
            params: param
        },2);
    },
    getTransactionDetailsOfBuyer : async function (pathparam, param) {
    // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail/9871468842
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'payment/detail/'+pathparam,
            params:param 
        },2);
    },
    
    getPaymentSearchedUser : async function (param) {
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail/search?searchVal=demo
        // let params ={
        //     searchVal  : param
        // }
            return Api({
                method: 'get',
                headers: {
                    "Authorization": Utils.getToken()
                },
                url: 'payment/detail/search',
                params: param
            },2);
        },

    addPayemtData : async function ( payload ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'payment/detail',
            data : payload
        },2);
    },

    updatePayementInfo : async function ( pathparam, payload ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail
        return Api({
            method: 'post',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: 'payment/detail/'+pathparam,
            data : payload
        },2);
    },
    // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/download?startDate=2019-12-01&endDate=2019-12-11
    getDownlaodAbleData : async function ( param){
        return Api({
            method: 'get',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: 'payment/download',
            params : param
        },2);
    },
    uplaodPayment : async function ( payload ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail
        return Api({
            method: 'post',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: 'payment/bulkadd',
            data : payload
        },2);
    },
    updateStatusOfPayment  : async function ( payload ){
        return Api({
            method: 'post',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: 'payment/updatePaymentStatus',
            data : payload
        },2);
    },
    getBankAcctDetails  : async function ( id ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/getBankDetails/{id}
        return Api({
            method: 'get',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: 'payment/getBankDetails/'+id,
        },2);
    },
    confirmPayout  : async function ( payload ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/getBankDetails/{id}
        return Api({
            method: 'post',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: "/user/payout",
            data: payload
        },3);
    },
    // Get Todays Payment Table Data 
    getTodaysPaymentDataApi  : async function ( ){
        // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/today
        return Api({
            method: 'get',
            headers: {  
                "Authorization": Utils.getToken()
            },
            url: "/payment/today"
        },2);
    }
}

export default paymentService;