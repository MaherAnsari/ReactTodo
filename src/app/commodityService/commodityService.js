import Api from '../../config/dev';
import Utils from '../common/utils';


let commodityService = {

    getCommodityTable: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/distinctlist?lang=hindi'
        },1);
    },
    updateCommodity: async function (param) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/update',
            data: param
        },1);
    },
    getCommodityData: async function (param) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/mandi/rate',
            data: param
        },1);
    },
    addCommodity: async function ( payload ){
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/add/Commodity
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/add/Commodity',
            data: payload
        },4); 
    }



};

export default commodityService;