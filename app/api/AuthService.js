
import {
     SERVER_URL,
     API_KEY,
     API_KEY2,
     DEBUG,
     TIMEOUT_READ,
} from '../config/Config';
import { timeout, categorizeError } from '../api/Common';


 //var client = require('../api/HTTPClient')
 const base64 = require('base-64');

 //const LOGIN_URI = "/api-gateway/oauth/token";
 //const TOKEN_CHECK_URI = "/api-gateway/oauth/check_token";
 //const REGISTER_PUSH_TOKEN_URL = "/api-gateway/register-token"

 const LOGIN_URI = "/auth-server/oauth/token";
 const TOKEN_CHECK_URI = "/auth-server/me";
 const REGISTER_PUSH_TOKEN_URI = "/user/register-push-token"

 const _getURL = (action) => {
     let url = SERVER_URL;
     switch (action) {
         case "login":
             return url;
         case "tokenCheck":
             return url;
         case "pushToken":
             return url;
         default:
             return url;
     }
 }


 var AuthService = {

     login: function(username, password) {
         let url = _getURL("login");

         var headers = new Headers();
         headers.append("Authorization", "Basic " + base64.encode(API_KEY + ":" + API_KEY2));
         headers.append("Accept", "application/json");
         headers.append("Content-Type", "application/x-www-form-urlencoded");

         var data = "grant_type=password&username=" + username + "&password=" + password + "&scope=read";
         //var deferred = Promise.defer();

         //console.log("HEADERS: ", headers);
         return timeout(TIMEOUT_READ, fetch(url, {
                 method: "POST",
                 headers: headers,
                 body: data
             }))
             .then((resp) => {
                 //console.log(resp);
                 return resp.json()
             })
             .then((data) => {
                 //console.log("receive data", data);
                 if (data.error) {
                     console.log("ERROR", data);
                     throw data.error_description || '. Unable to login';
                 }
                 return data;

             })
             .catch((err) => {
                 const catError = categorizeError(err);
                 throw catError;
             });


         //return deferred.promise;
     },

     isLoggedIn: function(accessToken) {
         let url = _getURL("tokenCheck");

         var headers = new Headers();
         headers.append("Authorization", "Bearer " + accessToken);
         headers.append("Accept", "application/json");
         headers.append("Content-Type", "application/json");

         return timeout(TIMEOUT_READ, fetch(url, {
                 method: "GET",
                 headers: headers,
             }))
             .then((resp) => resp.json())
             .then((data) => {
                if (DEBUG){
                  console.log("receive data", data);
                }

                if (data.error) throw data;
                else return data;

               })
            .catch((err) => {
              const catError = categorizeError(err);
              throw catError;

            });

     },

     refreshToken: function(refreshToken) {
         let url = _getURL("login");

         var headers = new Headers();
         headers.append("Authorization", "Basic " + base64.encode(API_KEY + ":" + API_KEY2));
         headers.append("Accept", "application/json");
         headers.append("Content-Type", "application/x-www-form-urlencoded");

         var data = "grant_type=refresh_token&refresh_token=" + refreshToken;

         return timeout(TIMEOUT_READ, fetch(url, {
                 method: "POST",
                 headers: headers,
                 body: data
             }))
             .then((resp) => resp.json())
             .then((data) => {
                 console.log("receive data", data);
                 if (data.error) {
                     console.log("ERROR", data);
                     throw data.error_description || '. Unable to refresh access token';
                 }
                 return data;

             })
             .catch((err) => {
                 if (err.message) throw err.messages;
                 else throw err;
             });
     },

     registerPushToken(accessToken, pushToken, pushTokenOS, deviceUniqueId) {
         let url = _getURL("pushToken");

         console.log("registerPushToken() started", url)

         let data = {
             pushToken: pushToken,
             mobileOs: pushTokenOS,
             deviceUniqueId: deviceUniqueId,
         };

         //console.log("JSON", JSON.stringify(data));

         var headers = new Headers();
         headers.append("Authorization", "Bearer " + accessToken);
         headers.append("Accept", "application/json");
         headers.append("Content-Type", "application/json");

         return timeout(TIMEOUT_READ, fetch(url, {
                 method: "POST",
                 headers: headers,
                 timeout: 30,
                 compress: true,
                 body: JSON.stringify(data),
             }))
             .then((resp) => resp.json())
             .then((data) => {
                 if (DEBUG) {
                     console.log("receive data", data);
                     console.log("receive data.status", data.status);
                 }
                 if (data.status !== 'Success') throw data.error.message || 'Unable to register push token';
                 return data;
             })
             .catch((err) => {
                 if (err.message) throw err.message;
                 else throw err;
             });


     },

 };

 module.exports = AuthService;
