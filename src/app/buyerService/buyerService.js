import Api from '../../config/dev';
import Utils from '../common/utils';


let buyerService = {

    getDefaultBuyerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url:'/user/list/buyer',
            params: param
        },1);
    },
    getBuyerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ?'/user/list/buyer/' + param : '/user/list/buyer' 
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
    }



};

export default buyerService;