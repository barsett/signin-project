'use strict';

import { DEBUG } from '../config/Config';

var PAGE_SIZE = 15;
var AVAIL_TASK_URL = 'https://dev.expecc.com:9002/api-gateway/api/survey/findAvailableSurvey';
var MY_TASK_URL = 'https://dev.expecc.com:9002/api-gateway/api/survey/findMine';
var ACCEPT_TASK_URL = 'https://dev.expecc.com:9002/api-gateway/api/survey/';

// var AVAIL_TASK_URL = 'http://192.168.59.1:8080/api-gateway/api/survey/findAvailableSurvey';
// var MY_TASK_URL = 'http://192.168.59.1:8080/api-gateway/api/survey/findMine';
// var ACCEPT_TASK_URL = 'http://192.168.59.1:8080/api-gateway/api/survey/';


import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';

// for fetch documentation go to https://github.com/bitinn/node-fetch/releases


var TaskService = {


  fetchAvailableTasks: function(accessToken, nextPageUrl, callback) {
    console.log("fetchAvailableTasks() started", AVAIL_TASK_URL);

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    // gzip is not needed by default fetch will send gzip as accept encoding
    //headers.append("Accept-Encoding", "gzip");

    var apiUrl = AVAIL_TASK_URL + '?page=0&size='+ PAGE_SIZE + '&sort=creationDate,asc'
    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        // this flag has no effect
        //compress: true,

    })
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("receive data", data);
          }

    		  if (data.error) throw data.error.message || 'Unable to search';
          callback(null,data);
    	   })
    	.catch((err) => {
        if (err.message) callback(err.message, null);
        else callback(err, null);
    	});

  },

  fetchMyTasks: function(accessToken, nextPageUrl, callback) {
    console.log("fetchMyTasks() started");

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");

    var apiUrl = MY_TASK_URL + '?page=0&size='+ PAGE_SIZE + '&sort=creationDate,asc'
    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    console.log("fetchMyTasks() fetching...", apiUrl);
    fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        compress: true,

    })
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("fetchMyTasks() - receive data", data);
          }
    		  if (data.error) throw data.error.message || 'Unable to search';
          callback(null,data);
    	   })
    	.catch((err) => {
        if (err.message) callback(err.message, null);
        else callback(err, null);
    	});

  },

  acceptTask: function(accessToken, surveyId, callback) {
    console.log("acceptTask() started", ACCEPT_TASK_URL)

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");

    fetch(this._urlForClaimTask(surveyId), {
        method: "POST",
        headers: headers,
        timeout: 30,
        compress: true,

    })
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error || data.status != 0) throw data.error.message || 'Unable to Claim Task';
          callback(null,data);
         })
      .catch((err) => {
        if (err.message) callback(err.message, null);
        else callback(err, null);
      });

  },

  _urlForClaimTask: function(surveyId): string {
    return(
      ACCEPT_TASK_URL + surveyId + '/claim'
    );
  },

}

module.exports = TaskService;
