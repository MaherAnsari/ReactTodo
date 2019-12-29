import Api from '../../config/dev';
import Utils from '../common/utils';


let priceService = {

    getPriceList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/rate/list',
            params:param
        },1);
    },
    getBuyerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ? '/rate/list/buyer/' +param : '/rate/list/buyer'
        },1);
    },
    getBroketList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ? '/rate/list/broker/' +param : '/rate/list/broker'
        },1);
    },
    getCommodityList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/distinctlist'
        },1);
    },
    addPrice: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: '/rate/add',
            data: props
        },1);
    },
    deleteMandi: async function (id) {
        return Api({
            method: 'get',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: 'mandi/deleteAdditionalPlace/'+id
        },1);
    },


};

export default priceService;