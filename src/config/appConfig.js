export function getAccessAccordingToRole(appRoute, option) {
    try {
        let role = sessionStorage.getItem("userRole") || "dev";
        let roles = {
            "user-creation": {
                "addUser": true,
                "editUser": true
            },
            "add-bank":{
                "addBankAccount" : true
            },
 
            "order-creation":{
                "addOrder": true,
                "editOrder": true,
            },
            "payviaCreditption":{
                "payViaCredit": true
            },
 
            "payment-request":{
                "addBank": true,
                "payViaCredit": true,
            },
            "manage-credit":{
                "updateCreditLimit": true
            },
            "manange-supporting-data":{
                "addCommodity": true,
                "addMandi": true,
                "addSupportingImages": true
            },
            "payment-tab-entry-rule":{
             "addPayment":true,
             "editPayment":true
             },
             "super-admin":{
                 "allowAll": true
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