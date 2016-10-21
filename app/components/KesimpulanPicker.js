import React, { PropTypes, Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import Picker from 'react-native-picker';
import { JENIS_KESIMPULAN } from '../config/Reference';


const propTypes = {
  selectedValue: PropTypes.string,
  onSelection: PropTypes.func,
  toggle: PropTypes.func,
};

const options = JENIS_KESIMPULAN.map((opt) => {
  return opt.desc;
});


// const options = [
//     "i.   Korban terjamin",
//     "ii.  Korban tidak terjamin",
//     "iii. Korban belum ditangani kepolisian",
//     "iv.  Korban tidak bersedia melapor polisi",
// ];

class KesimpulanPicker extends React.Component {

  constructor(props){
    super(props);
  }

  toggle() {
    this.picker.toggle();
  }

  _selectValue = (pickedValue) => {
    //find id, create object return the object containing id an description
    const resp = JENIS_KESIMPULAN.find((opt) => {
      return opt.desc === pickedValue[0];
    })

    this.props.onSelection(resp);
  }

  render() {
    return (
              <Picker
                  ref={picker => this.picker = picker}
                  style={{height: 260}}
                  showDuration={300}
                  showMask={true}
                  pickerData={options}
                  selectedValue={(this.props.selectedValue) ? [this.props.selectedValue] : [JENIS_KESIMPULAN[0].desc]}
                  onPickerDone={this._selectValue}
              />
    );
  }
}

KesimpulanPicker.propTypes = propTypes;

const styles = StyleSheet.create({
  button: {
    borderColor: "red",
    borderWidth: 1,
    width: 200,
  },
  statusText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    borderColor: "red",
    borderWidth: 1,
    color:'black',

  },
});


export default KesimpulanPicker;
