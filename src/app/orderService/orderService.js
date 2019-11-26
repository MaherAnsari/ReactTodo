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
    }
}

export default orderService;