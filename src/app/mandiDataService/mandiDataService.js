import Api from '../../config/dev';
import Utils from '../common/utils';


let mandiDataService = {

    getMandiData: async function (param) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'search/' + param
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
    deleteMandi: async function ( id ) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'mandi/deleteAdditionalPlace/' + id
        },1);
    },
    getDistrictList: async function (id) {
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/list/state/district'
        },1);
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
            url: 'mandi/commoditypricetrend',
            params: params
        },1);
    },
    
    // added on 02-12-19  @binod
    getMandiSearchData : async function (param) {
        //eg - https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/search?query=a&state=punjab&district=patiala
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'dashboard/market/search',
            params: param
        },2);
    },

    updateMandiData : async function ( payload ) {
        //eg -https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/dashboard/market/update
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'dashboard/market/update',
            data: payload
        },2);
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
            url: 'mandi/deleteAdditionalPlace',
            params: param
        },1);
    },


    getMarketList: async function ( params ) {
       
        return Api({
            method: 'get',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: '/mandi/nearlist',
            params: params
        },1);
    },
    addCommodityRates: async function (props) {
        return Api({
            method: 'post',
            headers: {
                "Authorization": Utils.getToken()
            },
            url: 'commodity/market/price',
            data: props
        },2);
    }

};

export default mandiDataService;