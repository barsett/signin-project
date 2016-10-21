import { ToastAndroid } from 'react-native';


export default class Util {

  static get SHORT(){
    return ToastAndroid.SHORT;
  }
  static get LONG(){
    return ToastAndroid.LONG;
  }

  static showToast(message, period){
    ToastAndroid.show(message, period);
  }


}
