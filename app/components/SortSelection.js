import React, { PropTypes, Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from './Checkbox';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';

import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common'

const propTypes = {
  onSelection: PropTypes.func,
};

const options = [
  { id: 'tanggalMasukRs', desc: 'Tanggal Masuk RS'},
  { id: 'tenggatResponse', desc: 'Tenggat Response'},
  { id: 'namaKorban', desc: 'Nama Korban'},
  { id: 'namaRs', desc: 'Rumah Sakit'},
];

class SortSelection extends React.Component {

  constructor(props){
    super(props);

  }

  _setSelectedOption(selectedOption){
        // this.setState({
        //   selectedOption
        // });
        //console.log("select", selectedOption);
        this.props.onSelected(selectedOption.id);
  }

  _renderOption = (option, selected, onSelect, index) => {
      let style;
      let checkMark;

      if (selected) {
        if (this.props.selectedOption[option.id] === 'asc'){
          checkMark = <Icon name="long-arrow-up" style={styles.icon}/>;
        } else {
          checkMark = <Icon name="long-arrow-down" style={styles.icon}/>;
        }
        style = styles.statusActive;
      } else {
        style = styles.statusText;
      }

      return (
        <TouchableWithoutFeedback onPress={onSelect} key={index} >
          <View style={styles.baseStyle}>
            <Text style={style}>{option.desc}</Text>
              {checkMark}
          </View>
        </TouchableWithoutFeedback>
      );
  }

  _renderContainer(optionNodes){
       return <View style={styles.radioContainer}>{optionNodes}</View>;
  }

  render() {
    return (
        <RadioButtons
          options={ options }
          onSelection={ this._setSelectedOption.bind(this) }
          selectedOption={this.props.selectedOption }
          renderOption={ this._renderOption }
          renderContainer={ this._renderContainer }
          testOptionEqual={(selectedOption, option) => {
            if (selectedOption){
              return (option.id === Object.keys(selectedOption)[0]);
            } else {
              return false;
            }
          }}
        />
    );
  }
}

SortSelection.propTypes = propTypes;

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


export default SortSelection;
