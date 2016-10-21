import Toast from 'react-native-root-toast';


class Util {

  static get SHORT(){
    return Toast.durations.SHORT;
  }
  static get LONG(){
    return Toast.durations.LONG;
  }

  static showToast(message, period){
    //console.log(message);
    Toast.show(message, {
       duration: period,
       position: Toast.positions.BOTTOM,
       shadow: true,
       animation: true,
       hideOnPress: true,
       delay: 0,
    });
  }


}

export default Util;
