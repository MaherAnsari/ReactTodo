import Api from '../../config/dev';
import Utils from '../common/utils';


let roleService = {

    getListOfUser: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/role/getalluser',
            params:param
        },4);
    },

    addUser: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: '/role/adduser',
            data: props
        },4);
    },

    updateUser: async function (props) {
        return Api({
            method: 'post',
            headers: {
    			"Authorization": Utils.getToken()
    			},
            url: '/role/updateuser',
            data: props
        },4);
    }


};

export default roleService;