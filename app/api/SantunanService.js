'use strict';
import { DEBUG, SERVER_URL, TIMEOUT_READ } from '../config/Config';
import { categorizeError, timeout } from '../api/Common';


const PAGE_SIZE = 50;
const SANTUNAN_SEARCH_URL = SERVER_URL + '/pencarian/santunan?namaKorban=%namaKorban%&tglKejadianAwal=%tglKejadianAwal%&tglKejadianAkhir=%tglKejadianAkhir%&tglPengajuanAwal=%tglPengajuanAwal%&tglPengajuanAkhir=%tglPengajuanAkhir%&noBerkas=%noBerkas%&kodeKantor=%kodeKantor%';
const SANTUNAN_DETAIL_URL = SERVER_URL + '/pencarian/santunan/%noBerkas%/detail';
const SANTUNAN_HISTORY_URL = SERVER_URL + '/pencarian/santunan/%noBerkas%/history';

import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';

var _prepareSearchUrl = function(urlTemplate, namaKorban, tglKejadianAwal, tglKejadianAkhir, tglPengajuanAwal, tglPengajuanAkhir, noBerkas, kodeKantor){
  let url = urlTemplate.replace('%namaKorban%', namaKorban);
  url = url.replace('%tglKejadianAwal%', tglKejadianAwal || '');
  url = url.replace('%tglKejadianAkhir%', tglKejadianAkhir || '');
  url = url.replace('%tglPengajuanAwal%', tglPengajuanAwal || '');
  url = url.replace('%tglPengajuanAkhir%', tglPengajuanAkhir || '');
  url = url.replace('%noBerkas%', noBerkas);
  url = url.replace('%kodeKantor%', kodeKantor);

  return url;
};

var _prepareDataSantunanUrl = function(urlTemplate, noBerkas){
  let url = urlTemplate.replace('%noBerkas%', noBerkas);

  return url;
};

var _getHeader = function(accessToken){
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + accessToken);
  headers.append("Accept",  "application/json");
  headers.append("Content-Type",  "application/json");

  return headers;
}

var SantunanService = {

  searchSantunan: function(accessToken, criteria, kodeKantor, nextPageUrl) {
    //console.log("searchSantunan() started", SANTUNAN_SEARCH_URL);

    let apiUrl = _prepareSearchUrl(SANTUNAN_SEARCH_URL, criteria.namaKorban, criteria.tanggalKejadianFrom, criteria.tanggalKejadianTo, criteria.tanggalPengajuanFrom, criteria.tanggalPengajuanTo, criteria.nomorBerkas, kodeKantor);
    console.log("searchSantunan() started", apiUrl);
    //apiUrl = url + '?page=0&size='+ PAGE_SIZE;

    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    var headers = _getHeader(accessToken);

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
            console.log("searchSantunan() - receive data", data);
          }

          if (data.error) throw data;
          else return data;

    	   })
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;

    	});

  },

  fetchSantunanDetail: function(accessToken, noBerkas, nextPageUrl) {
    //console.log("searchSantunan() started", SANTUNAN_SEARCH_URL);

    let apiUrl = _prepareDataSantunanUrl(SANTUNAN_DETAIL_URL, noBerkas);
    console.log("fetchSantunanDetail() started", apiUrl);
    //apiUrl = url + '?page=0&size='+ PAGE_SIZE;

    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    var headers = _getHeader(accessToken);

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
            console.log("fetchSantunanDetail() - receive data", data);
          }

          if (data.error) throw data;
          else return data;

    	   })
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;

    	});

  },

  fetchSantunanHistory: function(accessToken, noBerkas, nextPageUrl) {
    //console.log("searchSantunan() started", SANTUNAN_SEARCH_URL);

    let apiUrl = _prepareDataSantunanUrl(SANTUNAN_HISTORY_URL, noBerkas);
    console.log("fetchSantunanHistory() started", apiUrl);
    //apiUrl = url + '?page=0&size='+ PAGE_SIZE;

    if (nextPageUrl) {
      apiUrl = nextPageUrl;
    }

    var headers = _getHeader(accessToken);

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
            console.log("fetchSantunanHistory() - receive data", data);
          }

          if (data.error) throw data;
          else return data;

    	   })
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;

    	});

  },

}

module.exports = SantunanService;
