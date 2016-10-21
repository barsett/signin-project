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

import { JENIS_KESIMPULAN } from '../config/Reference';
import Modal from 'react-native-modalbox';
import { RadioButtons } from 'react-native-radio-buttons'
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height} from '../api/Common'


const propTypes = {
  selectedValue: PropTypes.string,
  onSelection: PropTypes.func,
  toggle: PropTypes.func,
};

const options = JENIS_KESIMPULAN.map((opt) => {
  return opt.desc;
});


const extractText = (option) => option;

class KesimpulanPicker extends React.Component {

  constructor(props){
    super(props);
  }

  toggle() {
    if (this.refs.modal.isOpen){
      this.refs.modal.close();
    } else {
      this.refs.modal.open();
    }
  }

  _selectValue = (pickedValue) => {
    console.log("PICKED", pickedValue);
    //find id, create object return the object containing id an description
    const resp = JENIS_KESIMPULAN.find((opt) => {
      return opt.desc === pickedValue;
    })

    this.props.onSelection(resp);
    this.refs.modal.close();
  }

  _renderOptions(option, selected, onSelect, index){
    const style = selected ? styles.selectedStyle : styles.normalStyle;
    const optStyle = selected ? styles.selectedOption : styles.normalOption;
    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <View style={optStyle}>
          <Text style={style}>{option}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _renderContainer(optionNodes){
    return <View style={styles.container}>{optionNodes}</View>;
  }

  render() {
    return (
      <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
          <RadioButtons
                options={ options }
                onSelection={ this._selectValue }
                selectedOption={this.props.selectedValue}
                renderOption={this._renderOptions.bind(this)}
                renderContainer={this._renderContainer.bind(this)}
              />
      </Modal>
    );
  }
}

KesimpulanPicker.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: getCorrectShapeSizeForScreen(250),
    width: width - getCorrectShapeSizeForScreen(40),
    backgroundColor: 'white',
    // /borderRadius: 5
  },
  container: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    padding: 5,
  },
  normalOption: {
    flex:1,
    margin: getCorrectShapeSizeForScreen(3),
    padding: getCorrectShapeSizeForScreen(5),
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#24abe2',
  },
  selectedOption: {
    flex:1,
    margin: getCorrectShapeSizeForScreen(3),
    padding: getCorrectShapeSizeForScreen(5),
    justifyContent:'center',
    borderWidth: 2,
    backgroundColor: '#24abe2',
    borderColor: '#24abe2',
  },
  normalStyle: {
    color: '#24abe2',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  selectedStyle: {
   fontSize: getCorrectFontSizeForScreen(12),
   color: '#fff',
 }
});



export default KesimpulanPicker;
