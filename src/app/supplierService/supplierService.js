import Api from '../../config/dev';
import Utils from '../common/utils';


let supplierService = {

    getDefaultSupplierList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url:'/user/list/supplier',
            params: param
        },1);
    },
    getSupplierList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ?'/user/list/supplier' + param : '/user/list/supplier' 
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

export default supplierService;