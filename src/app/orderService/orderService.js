import Api from '../../config/dev';
import Utils from '../common/utils';


let orderService = {

    getOrderListData: async function ( params ) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/order/detail/user',
            params: params
        });
    },
// /https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/order/detail
    addNewOrder : async function ( payload ) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/order/detail',
            data : payload
        });
    },
}

export default orderService;