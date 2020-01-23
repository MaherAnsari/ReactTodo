import React from 'react';
export function getAccessAccordingToRole( option) {
    try {
        let role = ["order-creatio1"];
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
            "payViaCreditOption":{
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
        // if (role === "dev") {
        //     return devAccess[appRoute][option];
        // } else {
        //     return devAccess[appRoute][option];
        // }
        let roleList = {};
        for( let key in roles ){
            if( role.indexOf( key ) > -1 ){
                for( let subkeys in roles[ key ] ){
                roleList[ subkeys ] = roles[ key ][ subkeys ];
                }
            }
        }
        console.log( roleList )
        if(roleList.hasOwnProperty( option )){
            return true;
        }else{
            return false;
        }
    } catch (err) {
        console.log(err)
    }
}