import Api from '../../config/dev';
import Utils from '../common/utils';


let creditLimitService = {

    getHistory: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/user/creditLimitChangeHistory',
            params: param
        });
    },
    updateCreditLimit: async function (param) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/user/updateCreditLimit',
            data: param
        });
    },



};

export default creditLimitService;