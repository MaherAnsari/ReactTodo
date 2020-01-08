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
        },1);
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
        },1);
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
        },1);
    },
    uploadOrder : async function ( payload ) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'order/bulkadd',
            data : payload
        },2);
    },
    getOrderAcount : async function ( mobile ) {
//  https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/getBankDetails/{mobile}
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/getBankDetails/'+mobile
        },2);
    },
    
    getAvailableCredit : async function ( payload ) {
        //https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/payment/getAvailableCredit
                return Api({
                    method: 'post',
                    headers: {
                        "Authorization": Utils.getToken()
                    },
                    url: "/payment/getAvailableCredit",
                    data: payload
                },2);
            },
}

export default orderService;