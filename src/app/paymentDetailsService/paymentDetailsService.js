import Api from '../../config/dev';
import Utils from '../common/utils';


let paymentDetailsService = {

    // https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/daterange
    getPaymentDetails : async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/payment/daterange',
            params: param
        },2);
    },
}

export default paymentDetailsService;