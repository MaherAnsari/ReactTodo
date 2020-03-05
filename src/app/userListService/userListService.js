import Api from '../../config/dev';
import Utils from '../common/utils';


let userListService = {

    getUserList: async function ( param ) {
        return Api({
            method: 'get',
            headers: {
                // "Authorization": Utils.getToken()
            },
            url: 'user/list',
            params: param
        },1);
    },
    addUserData: async function (isUpdate,id,props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
                },
            url: isUpdate ? '/user/detail/'+id : '/user/detail',
            data: props
        },1);
    },

    serchUser: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'user/list' ,
            params: param
        },1);
    },

    uploadData: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
                },
            url: 'user/bulkadd',
            data: props
        },2);
    },


};

export default userListService;