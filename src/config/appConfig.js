export function getAccessAccordingToRole(appRoute, option) {
    try {
        let role = sessionStorage.getItem("userRole") || "dev";
        let devAccess = {

            //    Supporting Data
            "mandi-data": {
                "showTab": true,
                "addLocation": true
            },
            "mandi-rates": {
                "showTab": true,
                "addMandiRates": true
            },
            "comodity-list": {
                "showTab": true,
                "updateACtiveStatus": true,
                "editCommodityData": true
            },

            //    Bussiness Data 
            "rate-list": {
                "showTab": true,
                "addPrice": true,
            },
            "orders-list": {
                "showTab": true,
                "payViaCredit": true,
                "editOrder": true,
                "addOrder": true,
                "uploadFile": true
            },
            "payment": {
                "showTab": true,
                "addTransaction": true,
                "uploadFile": true,
                "editTransaction": true,
                "updateStatus": true
            },
            "todays-payment": {
                "showTab": true,
                "updatePayout": true,
                "editPayment": false,
                "editUser": false,
                "updateCredit": false,
                "addNewAccount":false
            },
            "add-bank-account":{
                "showTab": true,
                "addNewAccount": false

            },
            // User Data
            "user-list": {
                "showTab": true,
                "uploadFile": true,
                "addUser": true,
                "addTransaction": true,
                "addOrder": true,
                "editUser": true,
                "updateCreditLimit": true
            },
            "broker-list": {
                "showTab": true,
                "addBroker": true,
                "uploadFile": true,
                "addOrder": true,
                "addTransaction": true,
                "editUser": true,
                "updateCreditLimit": true
            },
            "buyer-list": {
                "showTab": true,
                "addBuyer": true,
                "uploadFile": true,
                "addOrder": true,
                "addTransaction": true,
                "editUser": true,
                "updateCreditLimit": true
            },
            "supplier-list": {
                "showTab": true,
                "addSupplier": true,
                "uploadFile": true,
                "addTransaction": true,
                "addOrder": true,
                "editUser": true,
                "updateCreditLimit": true
            }
        }

        if (role === "dev") {
            return devAccess[appRoute][option];
        } else {
            return devAccess[appRoute][option];
        }
    } catch (err) {
        console.log(err)
    }
}