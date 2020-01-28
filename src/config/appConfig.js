import React from 'react';
export function getAccessAccordingToRole(option) {
    try {
        // if( window.location.href.indexOf("localhost/")){
        //     sessionStorage.setItem("userRole", "SuperAdmin"); // special check for developer
        // }
console.log( sessionStorage.getItem("userRole") )
        let role = "";
        if (sessionStorage.getItem("userRole")) {
            role = sessionStorage.getItem("userRole").split(",");
        } else {
            role = "restricted";
        }

        let roles = {
            "BasicUser": {

            },
            "UserManagement": {
                "addUser": true,
                "editUser": true
            },
            "OrderManagement": {
                "addOrder": true,
                "editOrder": true,
            },
            "PayoutMaker": {
                "makePayout": true
            },
            "PayoutChecker": {
                "payViaCredit": true,
            },
            "PaymentManagment": {
                "addPayment": true,
                "editPayment": true
            },
            "SupportingDataManagement": {
                "addLocation": true,
                "editMandi": true,
                "addMandiRates": true,
                "editCommodity": true
            },
            "SuperAdmin": {
                "allowAll": true
            }
        }

        let roles2 = {
            "user-creation": {
                "addUser": true,
                "editUser": true
            },
            "add-bank": {
                "addBankAccount": true
            },
            "order-creation": {
                "addOrder": true,
                "editOrder": true,
            },
            "payout-role": { //yyy
                "makePayout": true
            },
            "request-payout": {
                "payViaCredit": true,
            },
            "manage-credit": {
                "updateCreditLimit": true
            },
            "manage-images-data": {
                "addCommodity": true,
                "addMandi": true,
                "addSupportingImages": true
            },
            "payment-update": {
                "addPayment": true,
                "editPayment": true
            },
            "super-admin": {
                "allowAll": true
            },
            "supporting-data-role": {
                "addLocation": true,
                "editMandi": true,
                "addMandiRates": true,
                "editCommodity": true
            },

            // "mandi-data-update":{
            //     "addLocation": true,
            //     "editMandi": true
            // },
            // "mandi-rates-update":{
            //     "addMandiRates" : true
            // },
            // "commodityList-update":{
            //     "editCommodity" :true
            // }
        }
        // if (role === "dev") {
        //     return devAccess[appRoute][option];
        // } else {
        //     return devAccess[appRoute][option];
        // }
        if (role === "restricted") {
            return false;
        } else if (role.indexOf("super-admin") > -1 || role.indexOf("SuperAdmin") > -1) {
            return true;
        } else {
            let roleList = {};
            for (let key in roles) {
                if (role.indexOf(key) > -1) {
                    for (let subkeys in roles[key]) {
                        roleList[subkeys] = roles[key][subkeys];
                    }
                }
            }
            // console.log(roleList)
            if (roleList.hasOwnProperty(option)) {
                return true;
            } else {
                return false;
            }
        }
    } catch (err) {
        console.log(err)
    }
}


export function getStatusOfRole(role) {
    // return true;
    if (sessionStorage.getItem("userRole")) {
        if (sessionStorage.getItem("userRole").indexOf("super-admin") > -1 || sessionStorage.getItem("userRole").indexOf("SuperAdmin") > -1) {
            return true;
        } else {
            if (role === "SupportingDataManagement") {
                if (sessionStorage.getItem("userRole").indexOf(role) > -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (role === "permissions") { // not avalaiable for any user except superAdmin
                return false;
            }else if( role === "BasicUser" && sessionStorage.getItem("userRole").indexOf(role) === -1){
                return false;
            }
            return true;
        }
    } else {
        return false;
    }
}