import cookie from 'react-cookies';
// to vget the current date
let districtData= {};
function getCurrentDate(data) {
    // DD-MM-YYY
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return dd + "-" + mm + "-" + yyyy;
}





// to convert iso date to dd-mm-yyyy
function formateDate(date) {
    date = new Date(date);
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
}


function getCurrentTime() {
    var d = new Date();
    var n = d.getHours();
    // var m = d.getMinutes();
    return n + "" + d;
}






function getToken() {
    let token = cookie.load('token') ? cookie.load('token') : null;
    // console.log(token);
    return "Bearer " + token;
}

function getDistrictData(){
    return districtData;
}

function setDistrictData(data){
    districtData =data;
}



const Utils = {

    getToken,
    getCurrentDate,
    formateDate,
    getCurrentTime,
    getDistrictData,
    setDistrictData

}

export default Utils;


