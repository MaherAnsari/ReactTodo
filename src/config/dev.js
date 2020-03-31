import axios from 'axios';
import cookie from 'react-cookies';
import { Auth } from "aws-amplify";
import Utils from '../app/common/utils';

// let currentUrl = window.location.href;

// let baseUrl =  'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/';

var hostName = window.location.hostname;
const baseUrl = (hostName.indexOf('localhost') > -1 || hostName.indexOf('staging') > -1 || hostName.indexOf('d3p3xvthu08yeb') > -1) ?
  `https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/` :
  `https://lwjh5tmr5k.execute-api.ap-south-1.amazonaws.com/prod/`;




const baseUrl1 = (hostName.indexOf('localhost') > -1 || hostName.indexOf('staging') > -1 || hostName.indexOf('d3p3xvthu08yeb') > -1) ?
  `https://f51qgytp3d.execute-api.ap-south-1.amazonaws.com/dev/` :
  `https://mh53vat5i6.execute-api.ap-south-1.amazonaws.com/prod/`;

const client = axios.create({
  baseURL: baseUrl
});

const client1 = axios.create({
  baseURL: baseUrl1
});

const baseUrl3 = (hostName.indexOf('localhost') > -1 || hostName.indexOf('staging') > -1 || hostName.indexOf('d3p3xvthu08yeb') > -1) ?
  `https://yh0y6bihj9.execute-api.ap-south-1.amazonaws.com/dev/` :
  `https://9yuezfm6k2.execute-api.ap-south-1.amazonaws.com/prod/`;

const client3 = axios.create({
  baseURL: baseUrl3
});

const baseUrl4 = (hostName.indexOf('localhost') > -1 || hostName.indexOf('staging') > -1 || hostName.indexOf('d3p3xvthu08yeb') > -1) ?
  `https://f9ol52l7gl.execute-api.ap-south-1.amazonaws.com/dev/` :
  `https://z8ez4q59j2.execute-api.ap-south-1.amazonaws.com/prod/`;

const client4 = axios.create({
  baseURL: baseUrl4
});





client.defaults.headers.common['Accept'] = 'application/json';


/**
 * Request Wrapper with default success/error actions
 */
const request = function (options, type) {


  const errorHandlingForApiResponse = function (response) {
    var status = "";
    if (response.data.hasOwnProperty('status')) {
      status = response.data.status;
    }

    if (response.data.hasOwnProperty('statusCode')) {
      status = response.data.statusCode;
    }

    // console.log(response);
    // console.log(status);
    if (status === 401) {
      //  Auth.signOut();
      try {

        Auth.signOut()
          .then(data => {

            window.location.href = window.location.origin
            cookie.remove('bijak_token', { path: '/' })
            cookie.remove('username', { path: '/' });

          })
          .catch(err => console.log(err));
      } catch (err) {
        console.log(err)
      }
      return;


    } else if (status === 404) {
      window.location.href = window.location.origin;
      return response;
    }
    else {
      if (response["data"].hasOwnProperty("iscomp") && response["data"]["iscomp"]) {
        let resp = response;
        resp["data"]["result"] = Utils.decryptResponse(response["data"]["result"]);
        return resp;
      } else {
        return response;
      }
    }

  }

  const onErrorOfAuthentication = function (error) {
    try {
      var errorStatus = error.message === "Network Error" ? 401 : error.response.data.statusCode;
      var errorMsg = error.message || error.data.message || "Oops there is an error.";
      if (parseInt(errorStatus, 10) === 401) {
        Auth.signOut()
          .then(data => {
            // userAuth.resetAppOnLogout();
            cookie.remove('bijak_token', { path: '/' })
            cookie.remove('username', { path: '/' });
            window.location.href = window.location.origin;
            return;
          })
          .catch(err => console.log(err));
        // localStorage.setItem('pepToken', null);
        alert("Session expired. Please Login agian");

      }
      return { data: { status: 0, result: undefined, message: errorMsg } };
    } catch (er) {
      console.log(er)
      return { data: { status: 0, result: undefined, message: "Oops an error occured" } };
    }
  }
  if (type === 1) {
    return client(options)
      .then(errorHandlingForApiResponse)
      .catch(onErrorOfAuthentication);
  }
  if (type === 2) {
    return client1(options)
      .then(errorHandlingForApiResponse)
      .catch(onErrorOfAuthentication);
  }
  if (type === 3) {
    return client3(options)
      .then(errorHandlingForApiResponse)
      .catch(onErrorOfAuthentication);
  }
  if (type === 4) {
    return client4(options)
      .then(errorHandlingForApiResponse)
      .catch(onErrorOfAuthentication);
  }

  if (type === 4) {
    return client4(options)
      .then(errorHandlingForApiResponse)
      .catch(onErrorOfAuthentication);
  }
}


export default request;