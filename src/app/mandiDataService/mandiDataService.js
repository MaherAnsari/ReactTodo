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
    deleteMandi: async function ( id ) {
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
    
    // added on 02-12-19  @binod
    getMandiSearchData : async function (param) {
        //eg - https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/search?query=a&state=punjab&district=patiala
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/search',
            params: param
        });
    },

    updateMandiData : async function ( payload ) {
        //eg -https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/update
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/update',
            data: payload
        });
    },
    deleteSpecificMandi: async function ( market ) {
        let param ={
            "market" : market
        }
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/mandi/deleteAdditionalPlace',
            params: param
        });
    },


    getMarketList: async function ( params ) {
       
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/mandi/nearlist',
            params: params
        });
    },
    addCommodityRates: async function (props) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/commodity/market/price',
            data: props
        });
    }

};

export default mandiDataService;