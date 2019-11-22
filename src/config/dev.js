import axios from 'axios';
import cookie from 'react-cookies';
import { Auth } from "aws-amplify";
import Utils from '../app/common/utils';
let currentUrl = window.location.href;
let baseUrl =  'https://1ueogcah0b.execute-api.ap-south-1.amazonaws.com/dev/';


const client = axios.create({
  baseURL: baseUrl
});


client.defaults.headers.common['Accept'] = 'application/json';


/**
 * Request Wrapper with default success/error actions
 */
const request = function (options) {
     

  const errorHandlingForApiResponse = function (response) {
    var status ="";
    if(response.data.hasOwnProperty('status')){
       status = response.data.status;
    }

    if(response.data.hasOwnProperty('statusCode')){
       status = response.data.statusCode;
    }
 
    // console.log(response);
    // console.log(status);
    if(status === 401){
    //  Auth.signOut();
      try {
    
        Auth.signOut()
          .then(data => {

            window.location.href = window.location.origin 
            cookie.remove('token', { path: '/' })
            cookie.remove('username', { path: '/' });
           
          })
          .catch(err => console.log(err));
      } catch (err) {
        console.log(err)
      }
      return ;
     
      
    }else if(status === 404 ){
     window.location.href = window.location.origin;
      return response;
    }
    else{
    
        return response;
      
     
    }   

  }
  return client(options)
    .then(errorHandlingForApiResponse)
  // .catch(onError);
}


export default request;