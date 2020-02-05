import cookie from 'react-cookies';
// to vget the current date
let districtData = {};
let stateList = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "National Capital Territory of Delhi",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

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

function getDistrictData() {
    return districtData;
}

function setDistrictData(data) {
    districtData = data;
}


function getStateData() {
    return stateList;
}

function formatDateData(apiDate) {
    try {
        var formatedDate = new Date(apiDate);
        formatedDate = formatedDate.getDate() + "-" + months[formatedDate.getMonth()] + "-" + formatedDate.getFullYear();
        return formatedDate;
    } catch (err) {
        console.log(err);
        return apiDate;
    }
}

function downloadDataInCSV(json, filename) {
    try {
        var csv = "";
        var keys = (json[0] && Object.keys(json[0])) || [];
        csv += keys.join(',') + '\n';
        for (var line of json) {
            csv += keys.map(key => line[key]).join(',') + '\n';
        }
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = (filename + ".csv");
        hiddenElement.click();
        //   }

    } catch (err) {
        console.log(err);
    }
}

function formatNumberWithComma(x) {
    try {
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    } catch (err) {
        // console.log(err);
        return x;
    }
}

function getImageName(fileName) {
    try {
        let fileExt = fileName.split('.').pop();
        let filenameWithoutSpace = fileName.split(' ').join('').replace(`.${fileExt}`, "");
        let epocTime = (new Date()).getTime();
        return filenameWithoutSpace.toLowerCase() + "_" + epocTime + "." + fileExt;

    } catch (err) {
        return fileName;
    }
}

function maskMobileNumber(mobNum) {
    if (mobNum) {
        var lastFive = mobNum.substr(mobNum.length - 4);
        var lastChar = mobNum.slice(0, mobNum.length - 4);
        var fstr = lastChar.replace(/\d/g, "X");
        console.log("----->" + fstr + lastFive);
        return fstr + lastFive;
    } else {
        return mobNum;
    }
}

const Utils = {

    getToken,
    getCurrentDate,
    formateDate,
    getCurrentTime,
    getDistrictData,
    setDistrictData,
    getStateData,
    formatDateData,
    downloadDataInCSV,
    formatNumberWithComma,
    getImageName,
    maskMobileNumber

}

export default Utils;


