import Realm from 'realm';
import { DEBUG, SERVER_URL } from '../config/Config';
import { categorizeError } from '../api/Common';

const REF_URL           = SERVER_URL + '/reference-data';

const ReferenceSchema = {
  name: 'Reference',
  properties: {
    refCode: { type: 'string', indexed: true },
    refDescription: { type: 'string', indexed: true },
    domainType: { type: 'string', indexed: true }
  },
};



var ReferenceService = {
  fetchReference: function(accessToken) {
    const startTime = new Date().getTime();
    const headers = this._getHeader(accessToken);

    console.log("fetchReference() started", REF_URL);

    return fetch(REF_URL, {
      method: "GET",
      headers: headers,
      timeout: 30,

    })
    .then((resp) => resp.json())
    .then((data) => {
      if (DEBUG){
        console.log("receive data: ", data.length);
      }
      const endTime = new Date().getTime();
      console.log("Download Reference Elapsed: "+ (endTime - startTime));

      if (data.error) throw data;
      else return data;

    })
    .catch((err) => {
      const catError = categorizeError(err);
      throw catError;

    });
  },

  findByDomainTypeAndId(domain, refCode){
    const realm = new Realm({schema: [ReferenceSchema]});
    let references = realm.objects('Reference');
    let result = realm.objects('Reference').filtered('domainType="'+domain+'" AND refCode="'+refCode+'"').sorted("refCode");
    let response = [];
    result.map((row) => {
      let data = {
        id: row.refCode,
        desc: row.refDescription,
      }
      response.push(data);
    });
    realm.close();
    var ref;
    if (response.length > 0){
      ref = response[0].desc;
    } else {
      ref = response;
    }
    return ref;
  },

  findByKeyword(domain, keyword, max=20){
    // return and array of object
    const realm = new Realm({schema: [ReferenceSchema]});

    //const startTime = new Date().getTime();

    let references = realm.objects('Reference');

    let result = references.filtered('domainType="' + domain + '" AND (refCode  BEGINSWITH[c]  "' + keyword + '" OR refDescription CONTAINS[c] "' + keyword +'")').sorted("refCode");
    //console.log ("match: " + result.length);
    let topResult = result.slice(0,max);
    //const midTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (midTime - startTime));

    let response = [];
    topResult.map((row) => {
      let data = {
        id: row.refCode,
        desc: row.refDescription,
      }
      //console.log("row:", data);
      response.push(data);
    });
    realm.close();
    //const endTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (endTime - startTime));
    return response;
  },

  findAll(domain){
    const realm = new Realm({schema: [ReferenceSchema]});

    let references = realm.objects('Reference');
    let result = references.filtered('domainType="' + domain + '"');

    let response = [];
    result.map((row) => {
      let data = {
        id: row.refCode,
        desc: row.refDescription,
      }
      //console.log("row:", data);
      response.push(data);
    });
    realm.close();
    return response;
  },



  refreshLocalDB(data){
    console.log("Refreshing Local DB ...")
    const realm = new Realm({schema: [ReferenceSchema]});

    let startTime = new Date().getTime();

    realm.write(() => {
      console.log("Truncate...")
      realm.deleteAll();
      console.log("Truncate completed.")
      console.log("Write...")
      data.map((row) => {
        realm.create('Reference', row);
      });
      console.log("Write completed...")
    });
    const count = realm.objects('Reference').length;
    realm.close();

    console.log("Complete Write... " + count);
    console.log("Refreshing Local DB completed in " +  (new Date().getTime() - startTime) + 'ms');
  },


  isEmpty(){
    const realm = new Realm({schema: [ReferenceSchema]});
    const references = realm.objects('Reference');
    const count = references.length;
    realm.close();
    return (count < 1);
  },

  _getHeader(accessToken){
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    headers.append("Accept",  "application/json");
    headers.append("Content-Type",  "application/json");

    return headers;
  },

  findDescbyId(arrObj, id){
    var desc;
    for (var obj in arrObj){
      if (arrObj[obj].id === id){
        desc = arrObj[obj].desc;
      }
    }
    return desc;
  },

  findByKodeWilayah(domain, keyword, wilayah, max=20){
    // return and array of object
    const realm = new Realm({schema: [ReferenceSchema]});

    //const startTime = new Date().getTime();

    let references = realm.objects('Reference');

    let result = references.filtered('domainType="' + domain + '" AND refCode BEGINSWITH[c]  "' + wilayah + '" AND (refCode  CONTAINS[c]  "' + keyword + '" OR refDescription CONTAINS[c] "' + keyword +'")').sorted("refCode");
    //console.log ("match: " + result.length);
    let topResult = result.slice(0,max);
    //const midTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (midTime - startTime));

    let response = [];
    topResult.map((row) => {
      let data = {
        id: row.refCode,
        desc: row.refDescription,
      }
      //console.log("row:", data);
      response.push(data);
    });
    realm.close();
    //const endTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (endTime - startTime));
    return response;
  },

  findByDomainType(domain){
    // return and array of object
    const realm = new Realm({schema: [ReferenceSchema]});

    //const startTime = new Date().getTime();

    let references = realm.objects('Reference');

    let result = references.filtered('domainType="' + domain + '"').sorted("refCode");
    //console.log ("match: " + result.length);
    //let topResult = result.slice(0,max);
    //const midTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (midTime - startTime));

    let response = [];
    result.map((row) => {
      let data = {
        id: row.refCode,
        desc: row.refDescription,
      }
      //console.log("row:", data);
      response.push(data);
    });
    realm.close();
    //const endTime = new Date().getTime();
    //console.log("Search Elapsed: "+ (endTime - startTime));
    return response;
  },

}

module.exports = ReferenceService;
