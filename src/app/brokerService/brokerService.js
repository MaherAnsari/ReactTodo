import Api from '../../config/dev';
import Utils from '../common/utils';


let brokerService = {

    getBrokerList: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: param ?'/user/list/broker' + param : '/user/list/broker' 
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
            url: '/user/list?searchVal=' + searchval+'&role=broker'
        });
    },


};

export default brokerService;