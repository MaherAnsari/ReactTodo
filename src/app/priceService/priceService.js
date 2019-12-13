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
        });
    },
    getBuyerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ? '/rate/list/buyer/' +param : '/rate/list/buyer'
        });
    },
    getBroketList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/rate/list/broker'
        });
    },
    getCommodityList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/distinctlist'
        });
    },
    addPrice: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: '/rate/add',
            data: props
        });
    },
    deleteMandi: async function (id) {
        return Api({
            method: 'get',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/mandi/deleteAdditionalPlace/'+id
        });
    },


};

export default priceService;