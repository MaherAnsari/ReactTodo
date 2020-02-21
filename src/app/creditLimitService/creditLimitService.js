import Api from '../../config/dev';
import Utils from '../common/utils';


let creditLimitService = {

    getHistory: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'user/creditLimitChangeHistory',
            params: param
        },2);
    },
    updateCreditLimit: async function (param) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'user/updateCreditLimit',
            data: param
        },2);
    },
    getCreditLimit: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'payment/availablecreditForApp/'+param,
            // params: param
        },2);
    },



};

export default creditLimitService;