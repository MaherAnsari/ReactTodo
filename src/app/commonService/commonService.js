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
}

export default commonService;