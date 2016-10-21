import { DEBUG, SERVER_URL, TIMEOUT_READ } from '../config/Config';
import { categorizeError, timeout } from '../api/Common';

const PAGE_SIZE = 40;
const SURVEY_URL           = SERVER_URL + '/survey/statistik?limitTanggal=%limitTanggal%';

var StatisticService = {
  getSurveyStatistic: function(accessToken, limit) {
    const headers = this._getHeader(accessToken);
    console.log("getSurveyStatistic() started", SURVEY_URL);

    return timeout(TIMEOUT_READ, fetch(SURVEY_URL.replace('%limitTanggal%', limit), {
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


  // _prepareUrl(urlTemplate, kodeSurvey){
  //   return urlTemplate.replace('%kodeSurvey%', kodeSurvey);
  // },
  //
  // _prepareBerkasUrl(urlTemplate, idBerkas){
  //   return urlTemplate.replace('%idBerkas%', idBerkas);
  // },


  _getHeader(accessToken){
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    headers.append("Content-Type",  "application/json");

    return headers;
  },
}


module.exports = StatisticService;
