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
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail',
            params: param
        });
    },
    getTransactionDetailsOfBuyer : async function (param) {
    // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail/9871468842
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail/'+param 
        });
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
                url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/detail/search',
                params: param
            });
        },

}

export default paymentService;