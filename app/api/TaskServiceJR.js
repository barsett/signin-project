'use strict';
import { DEBUG, SERVER_URL, TIMEOUT_READ } from '../config/Config';
import { categorizeError, timeout } from '../api/Common';
import Util from '../api/Util';

const PAGE_SIZE = 30;
const AVAIL_TASK_URL     = SERVER_URL + '/survey/me';
const MY_TASK_URL        = SERVER_URL + '/survey';
const ACCEPT_TASK_URL    = SERVER_URL + '/survey/%kodeSurvey%/kunjungi';
const UPDATE_TASK_URL    = SERVER_URL + '/survey/%kodeSurvey%/uraian';
const AUTHORIZE_TASK_URL = SERVER_URL + '/survey/%kodeSurvey%/otorisasi';
const OTORISASI_URL      = SERVER_URL + '/survey?status=F1';
const MAP_TASK_URL       = SERVER_URL + '/survey/%kodeSurvey%/kecelakaan?idKorbanLaka=%idKorbanLaka%&kodeLaka=%kodeLaka%';
const CHECKIN_URL        = SERVER_URL + '/survey/%kodeSurvey%/checkin';


import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';

// for fetch documentation go to https://github.com/bitinn/node-fetch/releases

const UPDATE_TASK_FIELD = ['namaKorban', 'kodeKejadian', 'kodeRs', 'statusJaminan', 'kodeRekomendasi', 'latitudeSurveyor', 'longitudeSurveyor', 'uraianSingkat', 'kodePic', 'kodeKantor'];
const AUTHORIZE_TASK_FIELD = ['namaKorban', 'kodeKejadian', 'kodeRs', 'kodeKesimpulan', 'uraianSingkatOtorisator',];
const CHECKIN_FIELD = ['latitudeSurveyor', 'longitudeSurveyor'];

var TaskService = {


  fetchAvailableTasks: function(accessToken, nextPageUrl, limit = '') {

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    // gzip is not needed by default fetch will send gzip as accept encoding
    //headers.append("Accept-Encoding", "gzip");

    var apiUrl = AVAIL_TASK_URL + '?page=0&size='+ PAGE_SIZE + '&sort=tenggatResponse,asc&limitTanggal=' + limit;
    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }
    console.log("fetchAvailableTasks() started", apiUrl);

    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        // this flag has no effect
        //compress: true,

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

  // this function used for menu Kunjungan dan menu statusSurveyor
  fetchMyTasks: function(accessToken, nextPageUrl, filter, sort, limit = '') {
    console.log("fetchMyTasks() started");

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");


    let sortStr = this._getSortParameter(sort);
    let filterStr = this._getFilterParameter(filter);

    var apiUrl = MY_TASK_URL + '?page=0&size='+ PAGE_SIZE + filterStr + sortStr + '&limitTanggal=' + limit;
    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    console.log("fetchMyTasks() fetching...", apiUrl);
    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        compress: true,

    }))
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("fetchMyTasks() - receive data", data);
          }
          if (data.error) throw data;
          else return data;

    	})
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;
        // console.log("ERROR", err.message);
        // if (err.message) throw err.message;
        // else throw err;

        // if (err.message) callback(err.message, null);
        // else callback(err, null);
    	});

  },

  fetchOtorisasi: function(accessToken, nextPageUrl,limit = '') {
    console.log("fetchOtorisasi() started");

    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");

    var apiUrl = OTORISASI_URL + '&page=0&size='+ PAGE_SIZE + '&sort=tenggatResponse,asc&limitTanggal=' + limit;
    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    console.log("fetchOtorisasi() fetching...", apiUrl);
    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        //compress: true,

    }))
    	.then((resp) => {
        console.log(resp);
        return resp.json();
      }
      )
    	.then((data) => {
          if (DEBUG){
            console.log("fetchOtorisasi() - receive data", data);
          }
          if (data.error) throw data;
          else return data;
    	})
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;

    	});

  },

  acceptTask: function(accessToken, survey) {
    console.log("acceptTask() started", ACCEPT_TASK_URL)
    const headers = this._getHeader(accessToken);

    return timeout(TIMEOUT_READ, fetch(this._prepareUrl(ACCEPT_TASK_URL, survey), {
        method: "PATCH",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(survey),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;
        //
        // console.log("ERROR", err);
        // if (err.message) throw err;

      });

  },

  updateTask(accessToken, survey){
    const headers = this._getHeader(accessToken);

    return timeout(TIMEOUT_READ, fetch(this._prepareUrl(UPDATE_TASK_URL, survey), {
        method: "PATCH",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(survey, UPDATE_TASK_FIELD),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;

      });
  },


  authorizeTask(accessToken, survey){
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(this._prepareUrl(AUTHORIZE_TASK_URL, survey), {
        method: "PATCH",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(survey),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;

      });




  },

  mapLakaWithSurvey(accessToken, kodeSurvey, idKorbanLaka, kodeLaka){
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(this._prepareMapUrl(MAP_TASK_URL, kodeSurvey, idKorbanLaka, kodeLaka), {
        method: "PATCH",
        headers: headers,
        timeout: 30,
        compress: true,
        //body: JSON.stringify(survey, UPDATE_TASK_FIELD),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;

      });

  },

  unmapLakaWithSurvey(accessToken, kodeSurvey, idKorbanLaka, kodeLaka){
    const headers = this._getHeader(accessToken);

    const url = this._prepareMapUrl(MAP_TASK_URL, kodeSurvey, idKorbanLaka, kodeLaka);
    console.log(url);

    return timeout(TIMEOUT_READ, fetch( url, {
        method: "DELETE",
        headers: headers,
        timeout: 30,
        compress: true,
        //body: JSON.stringify(survey, UPDATE_TASK_FIELD),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;

      });

  },

  checkin(accessToken, survey){
    const headers = this._getHeader(accessToken);

    return timeout(TIMEOUT_READ, fetch(this._prepareUrl(CHECKIN_URL, survey), {
        method: "POST",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(survey, CHECKIN_FIELD),

    }))
      .then((resp) => resp.json())
      .then((data) => {
          if (DEBUG){
            console.log("receive data", data);
            console.log("receive data.status", data.status);
          }
          if (data.error) throw data;
          else return data;

      })
      .catch((err) => {
        const catError = categorizeError(err);
        throw catError;

      });
  },

  _prepareUrl(urlTemplate, survey){
    return urlTemplate.replace('%kodeSurvey%', survey.kodeSurvey);
  },

  _prepareMapUrl(urlTemplate, kodeSurvey, idKorbanLaka, kodeLaka){
    var url = urlTemplate.replace('%kodeSurvey%', kodeSurvey);
    url = url.replace('%idKorbanLaka%', idKorbanLaka);
    url = url.replace('%kodeLaka%', kodeLaka);
    return url;
  },


  _getHeader(accessToken){
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    headers.append("Content-Type",  "application/json");

    return headers;
  },

  _getSortParameter(sort){
    /* loop object = {
      tanggal: asc,
    }
    */
    if (sort){
      let str = "";
      for (let [key, value] of Object.entries(sort)) {
        //console.log(key); // This is the key;
        //console.log(value); // This is the value;
        if (value){
          str += "&sort=" + key + "," + value;
        }
      }
      //console.log("SORT : " + str);
      return str;
    } else {
      return "&sort=tenggatResponse,asc";
    }

  },

  _getFilterParameter(filter){
    /* loop object = {
      status: F0
    }
    */
    if (filter){
      let str = "";
      for (let [key, value] of Object.entries(filter)) {
        // if status=ALL then no need to send filter
        if(value === 'ALL'){
          return "";
        } else if (value ==='1') {
          return "&status=1&status=2&status=3&status=4&status=5&status=6"
        }
        str += "&" + key + "=" + value;
      }
      //console.log("FILTER : " + str);
      return str;

    } else {
      return "";
    }


  }

}


module.exports = TaskService;
