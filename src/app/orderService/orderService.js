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

    // https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/order/detail/7
    updateExistingOrder : async function ( id, payload ) {
        console.log( payload )
        if(payload.id){
            delete payload.id;
        }
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'order/detail/'+id,
            data : payload
        });
    },
}

export default orderService;