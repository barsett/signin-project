'use strict';

var React = require('react-native');
var {
  StyleSheet,
  PixelRatio,
  Dimensions,
} = React;

import { removeToken } from '../actions/AuthAction';
import { Actions } from 'react-native-router-flux';


export var height = Dimensions.get('window').height;
export var width = Dimensions.get('window').width;

export function executeWithRetry(taskName, func, maxRetry, getState){
  console.log("Retrying "+ taskName + " with retry count left " + maxRetry);

  if (getState().getIn(['status','networkStatus'])){
    console.log("Online ...");
    func();
  } else {
  	setTimeout(() => {
  		if (maxRetry === 0){
  			console.log("Retry Count exceeded... defer request");

  			return;
  		} else {
  			console.log("Offline ...");
  			executeWithRetry(taskName, func, maxRetry-1, getState);
  		}
  	}, 5000);
  }
}

export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("network timeout"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

export function getCorrectFontSizeForScreen(currentFont){
  //let devRatio = PixelRatio.getFontScale();
  //let factor = (((screenWidth)/320)+((screenHeight)/640))/2.0;
  let factor = ((width/320)+(height/640))/2.0;
  let maxFontDifferFactor = 10; //the maximum pixels of font size we can go up or down
  //console.log("Width x Height: "+w + " x " + h);
  //console.log("The factor is: "+factor);
  let fontSize = currentFont;

  fontSize = float2int(currentFont * factor);

  if ((currentFont + maxFontDifferFactor) < fontSize) fontSize = currentFont + maxFontDifferFactor;


  // //
  // if(factor<=1){
  //   fontSize = currentFont-float2int(maxFontDifferFactor*0.3);
  // }else if((factor>=1) && (factor<=1.6)){
  //   fontSize = currentFont-float2int(maxFontDifferFactor*0.1);
  // }else if((factor>=1.6) && (factor<=1.9)){
  //   fontSize = currentFont;
  // }else if((factor>=1.9) && (factor<=3)){
  //   fontSize = currentFont+float2int(maxFontDifferFactor*0.65);
  // }else if (factor>=3){
  //   fontSize = currentFont+float2int(maxFontDifferFactor);
  // }

  //if (devRatio >= 2) fontSize = currentFont * 2/devRatio;
  //else fontSize = currentFont * devRatio/2;

  //console.log("Font " + currentFont + " to " + fontSize);
  return fontSize;
}

export function getCorrectShapeSizeForScreen(currentWidth){
  let devRatio = PixelRatio.get();
  let factor = ((width/320)+(height/640))/2.0;
  //let factor = (((screenWidth*devRatio)/375)+((screenHeight*devRatio)/667))/2.0;
  let maxButtonDifferFactor = 1.5; //the maximum pixels of font size we can go up or down
  //console.log("Width x Height: "+w + " x " + h);
  //console.log("The factor is: "+factor);

  let buttonSize = float2int(currentWidth * factor);


  if ((buttonSize * maxButtonDifferFactor) < buttonSize) buttonSize = buttonSize + maxButtonDifferFactor;

  //
  // if(factor<=1){
  //   buttonSize = currentWidth-float2int(maxButtonDifferFactor*0.3);
  // }else if((factor>=1) && (factor<=1.6)){
  //   buttonSize = currentWidth-float2int(maxButtonDifferFactor*0.1);
  // }else if((factor>=1.6) && (factor<=2)){
  //   buttonSize = currentWidth;
  // }else if((factor>=2) && (factor<=3)){
  //   buttonSize = currentWidth*factor/2;
  // }else if (factor>=3){
  //   buttonSize = currentWidth*factor/3;
  // }


  //buttonSize = currentWidth * 2/devRatio;

  //console.log("Button " + currentWidth + " to " + buttonSize);
  return buttonSize;
}

function float2int (value) {
  return value | 0;
}

const monthNames = [
"Januari", "Februari", "Maret",
"April", "Mei", "Juni", "Juli",
"Agustus", "September", "Oktober",
"November", "Desember"
];

export function formatDate(data){
  if (data) {
    const date = new Date(data);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  } else {
    return 'n/a'
  }
}

export function formatDateTime(data){
  // app will crash when year go to 10000, there for need to check date value.
  if (data < 253402211500000) {
    let newDate = new Date(data);
    return formatDate(newDate) + ", " + newDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, "");
  } else {
    return "n/a"
  }
}

export function formatData(data){
  if (data) return data;
  return "n/a"
}

var styles = StyleSheet.create({
  noScore: {
    color: '#999999',
  },
});


export const ERROR_TOKEN = 1;
export const ERROR_NETWORK = 2;
export const ERROR_SERVER = 3;


export function categorizeError(err){
  let exception = {};

  if (err.name === 'TypeError'){
    // this is react native error, for example Network Request Failed
    exception.type = ERROR_NETWORK;
    err.error = err.message;

  } else if (err.name) {
    // unexpected error that response non json
    exception.type = ERROR_SERVER;
    err.error = err.message;
  } else if (err.error) {
    // this is Application Error response from server backend
    if (err.error === 'access_denied' || err.error ==='invalid_token') exception.type = ERROR_TOKEN;
    else exception.type = ERROR_SERVER;

  }
  exception.cause = err;

  console.log("ERROR: ", exception);
  return exception;
}


export function processError(err, dispatch, networkAction, serverAction, tokenAction = removeToken){
  console.log('Process Error');
  switch (err.type) {
    case ERROR_SERVER:
      console.log('Process Error Server');
      dispatch(serverAction());
      break;

    case ERROR_NETWORK:
      console.log('Process Error Network');
      dispatch(networkAction());
      break;

    case ERROR_TOKEN:
      console.log('Process Error Token');
      dispatch(serverAction());
      dispatch(tokenAction());
      Actions.splash({logout: true});
      break;

    default:
      console.log('Process Unhandled Error Server', err);
      break;
  }


}

export function increaseRetryCount(taskData){
  let count = taskData.get('retry');
  if (count){
    count++;
    return taskData.set('retry', count);
  } else {
    return taskData.set('retry', 1);
  }
}

export function getMonth(obj){
  var mon = obj.getMonth()+1;
  if(mon < 10){
    return "0" + mon;
  } else {
    return mon.toString();
  }
}

export function getDate(obj){
  var date = obj.getDate();
  if(date < 10){
    return "0" + date;
  } else {
    return date.toString();
  }
}

export function getEmptyField(payload){
  var empty = 0;
  console.log("Validating...");
  for (var field in payload){
    if(field.substr(0, 2) !== 'id' || field.substr(2, 1) === field.substr(2, 1).toLowerCase()){
      if (payload[field] === undefined || payload[field] === ''){
        console.log(field, "kosong");
        empty++;
      }
    } else {
      console.log("Field " + field + " not checked");
    }
  }
  return empty;
}
