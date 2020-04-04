import Api from '../../config/dev';
import Utils from '../common/utils';


let commonService = {

    getUserInfo: async function (id) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/user/detail/' + id
        }, 1);
    },


    getbankDetail: async function (param) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/getbankDetail?mobile=9958220331
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/getbankDetail',
            params: param
        }, 3);
    },


    addbankDetail: async function (payload) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/addBankAccount
        // payload:{
        //     "id":232,
        //       "name": "Sanchit jain",
        //       "mobile": "9205627721",
        //       "type": "Loader",
        // "bank_account": {
        //           "account_number": "915010007091676",
        //           "bank_name": "Axis Bank",
        //           "ifsc": "UTIB0001663",
        //           "name": "Sanchit jain"
        //         }
        //     }
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/addBankAccount',
            data: payload
        }, 3);
    },

    forceUpdateBankDetail: async function (payload) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/forceUpdateBankDetail
        //ifsc  / accountnumber / mobile
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/forceUpdateBankDetail',
            data: payload
        }, 3);
    },

    deleteBankDetail : async function ( payload ) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/disableAccount
        //ifsc  / accountnumber / mobile
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/disableAccount',
            data: payload
        },3);
    },
    getUserSpecificRole: async function (mobile) {
        mobile = mobile.replace("+", "")
        //    https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/role/getlistofrole?mobile=919205627721
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/role/getlistofrole',
            params: { "mobile": mobile }
        }, 4);
    },

    // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/sendinvoicefromwhatsapp
    // https://9yuezfm6k2.execute-api.ap-south-1.amazonaws.com/prod/bijak/pdf
    sendinvoicefromwhatsapp: async function (payload) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/pdf',
            data: payload
        }, 3);
    },

        
    getNetDataForDownload : async function ( param ) {
        // https://mh53vat5i6.execute-api.ap-south-1.amazonaws.com/prod/payment/lacanet
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/payment/lacanet',
            params :param
        },2);
    },

    getPaymentBulkDataForDownload : async function ( param ) {
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/get/payment/bulk
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/get/payment/bulk',
            data :param
        },4);
    },
    
    getOrdersBulkDataForDownload : async function ( param ) {
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/get/order/bulk
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/get/order/bulk',
            data :param
        },4);
    },

    getCAnetAndLAnetDataForDownload : async function ( param ) {
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/get/order/bulk
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/get/payment/calanet',
            data :param
        },4);
    },
    
    getUserDataForDownload : async function ( param ) {
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/get/user/bulk
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/get/user/bulk',
            data :param
        },4);
    },
    getTagsData: async function ( type ) {
        // https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/metadata/orders
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/metadata/'+type
        },4);
    },
}

export default commonService;