'use strict';
import { DEBUG, SERVER_URL, TIMEOUT_READ } from '../config/Config';
import { categorizeError, timeout } from '../api/Common';

const PAGE_SIZE = 50;
const LAKA_SEARCH_URL           = SERVER_URL + '/kecelakaan?namaKorban=%namaKorban%&tglKejadianAwal=%tglKejadianAwal%&tglKejadianAkhir=%tglKejadianAkhir%&tglLaporanAwal=%tglLaporanAwal%&tglLaporanAkhir=%tglLaporanAkhir%&kodeInstansi=%kodeInstansi%&flagIrsms=%flagIrsms%';
const LAKA_DETAIL_URL           = SERVER_URL + '/kecelakaan/%lakaId%/detail?flagIrsms=%flagIrsms%';
const LAKA_KORBAN_LIST_URL      = SERVER_URL + '/kecelakaan/%lakaId%/korban?flagIrsms=%flagIrsms%';
const LAKA_KORBAN_ADD_URL      = SERVER_URL + '/kecelakaan/%lakaId%/korban';
const LAKA_KORBAN_EDIT_URL      = SERVER_URL + '/kecelakaan/%lakaId%/korban/%korbanId%';
const LAKA_KENDARAAN_LIST_URL   = SERVER_URL + '/kecelakaan/%lakaId%/kendaraan?flagIrsms=%flagIrsms%';
const LAKA_KENDARAAN_ADD_URL   = SERVER_URL + '/kecelakaan/%lakaId%/kendaraan';
const LAKA_DETAIL_UPDATE_URL      = SERVER_URL + '/kecelakaan/%lakaId%';
const LAKA_KENDARAAN_EDIT_URL   = SERVER_URL + '/kecelakaan/%lakaId%/kendaraan/%kendaraanId%';


import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';

var _prepareSearchUrl = function(urlTemplate, namaKorban, tglKejadianAwal, tglKejadianAkhir, tglLaporanAwal, tglLaporanAkhir, kodeInstansi, flagIrsms){
  let url = urlTemplate.replace('%namaKorban%', namaKorban);
  url = url.replace('%tglKejadianAwal%', tglKejadianAwal || '');
  url = url.replace('%tglKejadianAkhir%', tglKejadianAkhir || '');
  url = url.replace('%tglLaporanAwal%', tglLaporanAwal || '');
  url = url.replace('%tglLaporanAkhir%', tglLaporanAkhir || '');
  url = url.replace('%kodeInstansi%', kodeInstansi);
  url = url.replace('%flagIrsms%', flagIrsms);
  return url;
};

var _getHeader = function(accessToken){
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + accessToken);
  headers.append("Accept",  "application/json");
  headers.append("Content-Type",  "application/json");

  return headers;
}

var _prepareLakaUrl = function(urlTemplate,lakaId,flagIrsms){
  let url = urlTemplate.replace('%lakaId%', lakaId);
  url = url.replace('%flagIrsms%', flagIrsms);
  return url;
}

var LakaService = {

  //searchLaka: function(accessToken, namaKorban, tglKejadian, tglLaporan, kodeInstansi, nextPageUrl) {
  searchLaka: function(accessToken, criteria, nextPageUrl) {
    let apiUrl = _prepareSearchUrl(LAKA_SEARCH_URL, criteria.namaKorban, criteria.tanggalKejadianAwal, criteria.tanggalKejadianAkhir, criteria.tanggalLaporanAwal, criteria.tanggalLaporanAkhir, criteria.instansi, criteria.flagIrsms);
    console.log("searchLaka() started", apiUrl);
    console.log(apiUrl);
    //apiUrl = apiUrl + '?page=0&size='+ PAGE_SIZE;
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
            console.log("searchLaka() - receive data", data);
          }

          if (data.error) throw data;
          else return data;

    	   })
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;

    	});

  },

  getLakaDetail: function(accessToken, lakaId, flagIrsms){
    const headers = _getHeader(accessToken);
    const apiUrl = _prepareLakaUrl(LAKA_DETAIL_URL, lakaId, flagIrsms);
    console.log("getLakaDetail() fetching...", apiUrl);
    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        compress: true,

    }))
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("getLakaDetail() - receive data", data);
          }
          if (data.error) throw data;
          else return data;

    	})
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;
    	});

  },

  getKendaraanByLakaId: function(accessToken, lakaId, flagIrsms) {
    let headers = _getHeader(accessToken);
    let apiUrl = _prepareLakaUrl(LAKA_KENDARAAN_LIST_URL, lakaId, flagIrsms);

    console.log("getListKendaraanByLakaId() fetching...", apiUrl);
    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        compress: true,

    }))
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("getListKendaraanByLakaId() - receive data", data);
          }
          if (data.error) throw data;
          else return data;

    	})
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;
    	});

  },

  getKorbanByLakaId: function(accessToken, lakaId, flagIrsms) {
    let headers = _getHeader(accessToken);
    let apiUrl  = _prepareLakaUrl(LAKA_KORBAN_LIST_URL, lakaId, flagIrsms);

    console.log("getKorbanByLakaId() fetching...", apiUrl);
    return timeout(TIMEOUT_READ, fetch(apiUrl, {
        method: "GET",
        headers: headers,
        timeout: 30,
        compress: true,

    }))
    	.then((resp) => resp.json())
    	.then((data) => {
          if (DEBUG){
            console.log("getKorbanByLakaId() - receive data", data);
          }
          if (data.error) throw data;
          else return data;

    	})
    	.catch((err) => {
        const catError = categorizeError(err);
        throw catError;
    	});

  },

  updateLakaDetail: function(accessToken, laka) {
    console.log("updateLakaDetail() started", this._prepareLakaUrl(LAKA_DETAIL_UPDATE_URL, laka.idKecelakaan));
    //console.log("updateLakaDetail() payload", laka);
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(this._prepareLakaUrl(LAKA_DETAIL_UPDATE_URL, laka.idKecelakaan), {
        method: "PUT",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(laka),

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

  addKendaraan: function(accessToken, kendaraan) {
    console.log("addKendaraan() started", this._prepareLakaUrl(LAKA_KENDARAAN_ADD_URL, kendaraan.idKecelakaan));
    //console.log("### ADD KENDARAAN PAYLOAD ###", kendaraan);
    const headers = this._getHeader(accessToken);

    return timeout(TIMEOUT_READ, fetch(this._prepareLakaUrl(LAKA_KENDARAAN_ADD_URL, kendaraan.idKecelakaan), {
      method: "POST",
      headers: headers,
      timeout: 30,
      compress: true,
      body: JSON.stringify(kendaraan),
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

  addKorban: function(accessToken, korban) {
    console.log("addKorban() started", this._prepareLakaUrl(LAKA_KORBAN_ADD_URL, korban.idKecelakaan));
    const headers = this._getHeader(accessToken);

    return timeout(TIMEOUT_READ, fetch(this._prepareLakaUrl(LAKA_KORBAN_ADD_URL, korban.idKecelakaan), {
        method: "POST",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(korban),
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

  updateKendaraan: function(accessToken, kendaraan) {
    var updateKendaraanUrl = this._prepareLakaUrl(LAKA_KENDARAAN_EDIT_URL, kendaraan.idKecelakaan)
                                 .replace('%kendaraanId%', kendaraan.idAngkutanKecelakaan);

    console.log("updateKendaraan() started", updateKendaraanUrl);
    //console.log("### UPDATE KENDARAAN PAYLOAD ###", kendaraan);
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(updateKendaraanUrl, {
              method: "PUT",
              headers: headers,
              timeout: 30,
              compress: true,
              body: JSON.stringify(kendaraan),
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

  editKorban: function(accessToken, korban) {
    var editKorbanUrl = this._prepareLakaUrl(LAKA_KORBAN_EDIT_URL, korban.idKecelakaan)
                            .replace('%korbanId%', korban.idKorbanKecelakaan);

    console.log("editKorban() started", editKorbanUrl);
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(editKorbanUrl, {
        method: "PUT",
        headers: headers,
        timeout: 30,
        compress: true,
        body: JSON.stringify(korban),
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

  deleteKendaraan: function(accessToken, idKendaraan) {
    var deleteKendaraanUrl = this._prepareLakaUrl(LAKA_KENDARAAN_EDIT_URL, idKendaraan.idKecelakaan)
                                  .replace('%kendaraanId%', idKendaraan.idAngkutanKecelakaan);

    console.log("deleteKendaraan() started", deleteKendaraanUrl);
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(deleteKendaraanUrl, {
        method: "DELETE",
        headers: headers,
        timeout: 30,
        compress: true,
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

  deleteKorban: function(accessToken, idKecelakaan, idKorban) {
    var deleteKorbanUrl = this._prepareLakaUrl(LAKA_KORBAN_EDIT_URL, idKecelakaan)
                          .replace('%korbanId%', idKorban);

    console.log("deleteKorban() started", deleteKorbanUrl);
    const headers = this._getHeader(accessToken);
    return timeout(TIMEOUT_READ, fetch(deleteKorbanUrl, {
        method: "DELETE",
        headers: headers,
        timeout: 30,
        compress: true,
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

  _prepareSearchUrl: function(urlTemplate, namaKorban, tglKejadian, tglLaporan, kodeInstansi){
    let url = urlTemplate.replace('%namaKorban%', namaKorban);
    url.replace('%tglKejadian%', tglKejadian);
    url.replace('%tglLaporan%', tglLaporan);
    url.replace('%kodeInstansi%', kodeInstansi);

    return url;
  },

  _prepareLakaUrl: function(urlTemplate,lakaId){
    return urlTemplate.replace('%lakaId%', lakaId);
  },

  _getHeader: function(accessToken){
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    headers.append("Content-Type",  "application/json");

    return headers;
  },

};

module.exports = LakaService;
