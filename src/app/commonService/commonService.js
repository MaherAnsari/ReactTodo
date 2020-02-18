import Api from '../../config/dev';
import Utils from '../common/utils';


let commonService = {

    getUserInfo : async function ( id ) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/user/detail/'+id 
        },1);
    },


    getbankDetail : async function ( param ) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/getbankDetail?mobile=9958220331
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/getbankDetail',
            params: param
        },3);
    },

    
    addbankDetail : async function ( payload ) {
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
        },3);
    },

    forceUpdateBankDetail : async function ( payload ) {
        // https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/bijak/forceUpdateBankDetail
        //ifsc  / accountnumber / mobile
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/bijak/forceUpdateBankDetail',
            data: payload
        },3);
    },

    
    getUserSpecificRole : async function ( mobile ) {
        mobile = mobile.replace("+","")
//    https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/role/getlistofrole?mobile=919205627721
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/role/getlistofrole',
            params : {"mobile" : mobile }
        },4);
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
}

export default commonService;