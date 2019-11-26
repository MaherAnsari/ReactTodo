import Api from '../../config/dev';
import Utils from '../common/utils';


let mandiDataService = {

    getMandiData: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/search/' + param
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
    deleteMandi: async function (id) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/mandi/deleteAdditionalPlace/' + id
        });
    },
    getDistrictList: async function (id) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/list/state/district'
        });
    },
    commoditypricetrendGraphData: async function ( params ) {
        // var params = {
        //     market: "samana",
        //     commodity: "potato",
        //     lang: "hindi",
        //     days: "10"
        // }
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/mandi/commoditypricetrend',
            params: params
        });
    },



};

export default mandiDataService;