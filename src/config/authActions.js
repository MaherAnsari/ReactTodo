import axios from "axios";
import Auth from '@aws-amplify/auth';
import cookie from 'react-cookies';

function resetAppOnLogout() {
    cookie.remove('bijak_token', { path: '/' });// reset auth bijak_token & user info
}

/**
 * Set Authorization bijak_token to header by default
 */


export function startTokenGenaerationAfter45Min() {
    // setInterval(() => {
    //     Auth.currentSession().then(function (session) {
    //         if (!session || !session.refreshToken || !session.refreshToken.bijak_token) {
    //             // console.log("No session ")
    //         } else {
    //             console.log(session)
    //             // console.log( session.refreshToken)
    //             // console.log( JSON.stringify(session.idToken.jwtToken))
    //             // console.log( session.refreshToken.bijak_token)
    //             // alert("bijak_token refreshed stG")

    //             localStorage.setItem('pepToken', session.idToken.jwtToken);
    //             // localStorage.setItem('pepToken', session.refreshToken.bijak_token );
    //         }
    //     });

    // }, 1800000); //2700000

    //  for first time it checks if session exists then replace the id 
    Auth.currentSession().then(function (session) {
        if (!session || !session.idToken.jwtToken || !session.idToken.jwtToken) {
            if (window.location.pathname.indexOf("access-denied") !== -1 && window.location.pathname.indexOf("login") !== -1) {
                window.location = "/login";
            }
        } else {
            // localStorage.setItem('pepToken', session.idToken.jwtToken); // actual code 
            cookie.save('bijak_token', session.idToken.jwtToken, { path: window.location.pathname });
        }
    }, function (err) {
        console.log(err);
        console.error("===============================--000--00---00--0--0=000" + err);
        if (window.location.pathname.indexOf("access-denied") !== -1 && window.location.pathname.indexOf("login") !== -1) {
            window.location = "/";
        }
    })
}


export function getToken() {
    const AUTH_TOKEN = cookie.load('bijak_token');
    const s_time = localStorage.getItem('bijak_token_ExpTime');
    const c_time = (new Date()).getTime();


    if (((c_time - Number(s_time)) / (1000 * 60 * 60)) < 10) { // actual code
        // if (((c_time - Number(s_time)) / (1000 * 60 )) < 5) { //testing code for five minutes
        if (AUTH_TOKEN === null || AUTH_TOKEN === "null" || AUTH_TOKEN === undefined || AUTH_TOKEN === "undefined") {

            if (window.location.href.indexOf("login") === -1) {
                window.location = "/";
            }

            Auth.signOut()
                .then(data => {
                    // cookie.remove('bijak_token', { path: '/' });
                    userAuth.resetAppOnLogout();

                    // window.location.reload();
                    return null;
                })
                .catch(err => {
                    console.log(err);
                    // window.localStorage.setItem('pepToken', null);
                    userAuth.resetAppOnLogout();
                });

            return "null";
        } else {
            return AUTH_TOKEN;
        }

    } else {

        if (window.location.pathname.indexOf("access-denied") === -1 && window.location.pathname.indexOf("login") === -1) {
            Auth.currentAuthenticatedUser({

            }).then(user => {

                // console.log(user);
                // user.preferredMFA = "SMS_MFA";
                user.deviceKey = user.getCachedDeviceKeyAndPassword();
                // console.log(user.getCachedDeviceKeyAndPassword());
                user.forgetDevice({
                    onSuccess: function (result) {
                        // console.log('call result: ' + result);
                    },

                    onFailure: function (err) {
                        console.log(err);
                    }
                });

            });

            Auth.signOut()
                .then(data => {
                    userAuth.resetAppOnLogout();
                    // CommonUtil.switchPathTo("login");

                    return;
                })
                .catch(err => {
                    console.log(err);
                    userAuth.resetAppOnLogout();
                });

            // CommonUtil.switchPathTo("login");
            window.location = "/";

        }
        return "null";
    }

}

var timeoutID;
// var wasbijakUserInactive = false;

function setup() {
    window.localStorage.setItem("wasbijakUserInactive", "false")
    window.addEventListener("mousemove", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
}


function startTimer() {
    timeoutID = window.setTimeout(goInactive, 50000); // wait 2 seconds before calling goInactive
}

function resetTimer(e) {
    window.clearTimeout(timeoutID);
    goActive();
}

function goInactive() {
    window.localStorage.setItem("wasbijakUserInactive", "true");
}

function goActive() {
    // console.log("going Active");
    if (window.localStorage.getItem("wasbijakUserInactive") === "true") {
        window.localStorage.setItem("wasbijakUserInactive", "false")

        if (window.location.href.indexOf("login") === -1) {

            Auth.currentSession().then(function (session) {
                if (!session || !session.idToken || !session.idToken.jwtToken) {
                    // console.log("No session ")
                    console.error("================================session expired");
                    if (window.location.pathname.indexOf("access-denied") === -1 && window.location.pathname.indexOf("login") === -1) {
                        window.location = "/login";
                    }
                } else {
                    console.error("================================bijak_token refreshed")
                    // localStorage.setItem('pepToken', session.idToken.jwtToken);
                    cookie.save('bijak_token', session.idToken.jwtToken, { path: window.location.pathname });
                }
            }, function (err) {
                console.error("================================000" + err);
                if (window.location.pathname.indexOf("access-denied") === -1 && window.location.pathname.indexOf("login") === -1) {
                    window.location = "/login";
                }
            })
        }
    }
    startTimer();
}


const userAuth = {
    resetAppOnLogout,
    getToken,
    startTokenGenaerationAfter45Min,
    setup
}

export default userAuth;