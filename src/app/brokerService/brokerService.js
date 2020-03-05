import Api from '../../config/dev';
import Utils from '../common/utils';


let brokerService = {

    getDefaultBrokerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/user/list/broker',
            params : param
        },1);
    },
    getBrokerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ?'/user/list/broker' + param : '/user/list/broker' 
        },1);
    },
    addMandiData: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: 'mandi/addAdditionalPlace',
            data: props
        },1);
    },
    serchUser: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/user/list',
            params:param
        },1);
    },


};

export default brokerService;