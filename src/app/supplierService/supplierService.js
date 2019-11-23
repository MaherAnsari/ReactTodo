import Api from '../../config/dev';
import Utils from '../common/utils';


let supplierService = {

    getSupplierList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ?'/user/list/supplier' + param : '/user/list/supplier' 
        });
    },
    addMandiData: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/mandi/addAdditionalPlace',
            data: props
        });
    },
    serchUser: async function (searchval) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/user/list?searchVal=' + searchval+'&role=la'
        });
    },

};

export default supplierService;