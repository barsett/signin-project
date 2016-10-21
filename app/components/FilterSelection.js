import React, { PropTypes, Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

import CheckBox from './Checkbox';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common'
import { JENIS_STATUS_JAMINAN_FOR_OTORISATOR, JENIS_STATUS_JAMINAN_FOR_SURVEYOR } from '../config/Reference';

const propTypes = {
  onSelection: PropTypes.func,
  selectedOption: PropTypes.string,
  role: PropTypes.string,
};


class FilterSelection extends React.Component {

  constructor(props){
    super(props);
    //console.log(props);

  }

  _setSelectedOption(selectedOption){
        console.log("select", selectedOption);
        this.props.onSelected(selectedOption.id);
  }

  _renderOption(option, selected, onSelect, index){
      let checkMark;
      let status;

      if (selected) {
        status = styles.statusActive;
        checkMark = <Icon name="check" style={styles.icon} />;
      } else {
        status = styles.statusText;
      }


      return (
        <TouchableWithoutFeedback onPress={onSelect} key={index}>
          <View style={styles.baseStyle}>
            <Text style={status}>{option.desc}</Text>
            {checkMark}
          </View>
        </TouchableWithoutFeedback>
      );
  }

  _renderContainer(optionNodes){
       return <View style={styles.radioContainer}>{optionNodes}</View>;
  }

  _getStatusJaminanList(){
    return ((this.props.role === 'SURVEYOR') ? JENIS_STATUS_JAMINAN_FOR_SURVEYOR : JENIS_STATUS_JAMINAN_FOR_OTORISATOR);
  }

  render() {
    return (
        <RadioButtons
          options={ this._getStatusJaminanList() }
          onSelection={ this._setSelectedOption.bind(this) }
          selectedOption={this.props.selectedOption }
          renderOption={ this._renderOption }
          renderContainer={this._renderContainer}
          testOptionEqual={(selectedOption, option) => (option.id === selectedOption)}
        />
    );
  }
}

FilterSelection.propTypes = propTypes;

const styles = StyleSheet.create({
  radioContainer: {
    flex:1,
    alignItems: 'stretch',
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(2),
  },
  baseStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  statusActive: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(13),
    textAlignVertical: 'center',
    color:'#0087cd',
    marginLeft: getCorrectShapeSizeForScreen(15),
  },
  statusText: {
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(13),
    textAlignVertical: 'center',
    color:'#464646',
    marginLeft: getCorrectShapeSizeForScreen(15),
  },
  icon: {
    color: '#0087cd',
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    marginRight: getCorrectShapeSizeForScreen(15),
  },
});


export default FilterSelection;
