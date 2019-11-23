import Api from '../../config/dev';
import Utils from '../common/utils';


let commodityService = {

    getCommodityTable: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/distinctlist/weight'
        });
    },
    updateCommodity: async function (param) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/commodity/update',
            data: param
        });
    }



};

export default commodityService;