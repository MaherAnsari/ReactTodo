import Api from '../../config/dev';
import Utils from '../common/utils';


let userListService = {

    getUserList: async function () {
        return Api({
            method: 'get',
            headers: {
                // "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/user/list'
        });
    },
    addUserData: async function (isUpdate,id,props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
                },
            url: isUpdate ? '/user/detail/'+id : '/user/detail',
            data: props
        });
    },

    serchUser: async function (searchval) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/user/list?searchVal=' + searchval
        });
    },


};

export default userListService;