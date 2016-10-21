import { DEBUG, SERVER_URL, TIMEOUT_READ } from '../config/Config';
import { categorizeError, timeout } from '../api/Common';

const PAGE_SIZE = 40;
const DOC_URL           = SERVER_URL + '/berkas?kodeSurvey=%kodeSurvey%';
const DOC_ADD_URL       = SERVER_URL + '/berkas';
const DOC_UPDATE_URL    = SERVER_URL + '/berkas/%kodeSurvey%/%docId%';
const DOC_DELETE_URL    = SERVER_URL + '/berkas/%idBerkas%';

import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';


var DocumentService = {
  fetchSurveyDocuments: function(accessToken, kodeSurvey) {
    const headers = this._getHeader(accessToken);
    const url = this._prepareUrl(DOC_URL, kodeSurvey);

    console.log("fetchSurveyDocuments() started", url);

    return timeout(TIMEOUT_READ, fetch(url, {
      method: "GET",
      headers: headers,
      timeout: 30,

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

  uploadDocument: function(accessToken, doc, onLoad, onFail, onProgress) {
    const headers = this._getHeader(accessToken);
    const url = this._prepareUrl(DOC_ADD_URL, doc.kodeSurvey);

    console.log("uploadDocument() started", url);

    var photo = { ...doc.source,
    };


    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.setRequestHeader("Accept",  "application/json");

    xhr.onload = () => {
      //console.log("xhr onload()", xhr);
      let resp = {};
      let jsonResp = {};
      resp.status = xhr.status;

      try {
        if (xhr.status === 200){
          // status code is 200 and response is json
          jsonResp = JSON.parse(xhr.responseText);
          resp.data = jsonResp;
        } else if (xhr.status === 413) {
          // status is 413 and response is html for file upload to big
          resp.error = 'File size is too big (> 1M)';
          throw resp;
        } else {
          // status code != 200 and respone is expected json
          jsonResp = JSON.parse(xhr.responseText);
          throw jsonResp;
        }

        onLoad(resp);

      } catch (err) {
        console.log("ERROR", err);
        const catError = categorizeError(err);
        onFail(catError);
      }

    };



    let formdata = new FormData();
    // image from CameraRoll.getPhotos(
    console.log("DOC:"+doc.idBerkas);

    formdata.append('file', {...doc.source, name: 'i'+doc.tipeBerkas+'-'+doc.idBerkas, type: 'image/jpeg'});
    formdata.append('kodeSurvey', doc.kodeSurvey);
    formdata.append('tipeBerkas', doc.tipeBerkas);

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        //console.log('upload onprogress', event);
        if (event.lengthComputable) {
          //console.log('uploadProgress :' + event.loaded / event.total);
          onProgress (event.loaded/event.total);
        }
      };
    }

    xhr.send(formdata);


  },


  deleteDocument: function(accessToken, idBerkas) {
    const headers = this._getHeader(accessToken);
    const url = this._prepareBerkasUrl(DOC_DELETE_URL, idBerkas);

    console.log("deleteDocument() started", url);

    return timeout(TIMEOUT_READ, fetch(url, {
      method: "DELETE",
      headers: headers,
      timeout: 30,

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

  _prepareUrl(urlTemplate, kodeSurvey){
    return urlTemplate.replace('%kodeSurvey%', kodeSurvey);
  },

  _prepareBerkasUrl(urlTemplate, idBerkas){
    return urlTemplate.replace('%idBerkas%', idBerkas);
  },


  _getHeader(accessToken){
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    headers.append("Content-Type",  "application/json");

    return headers;
  },
}


module.exports = DocumentService;
