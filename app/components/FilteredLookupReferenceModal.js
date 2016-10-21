'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions} from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilteredLookupReference from '../components/FilteredLookupReference';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width } from '../api/Common.js';

var {
  height: deviceHeight
} = Dimensions.get('window');

const propTypes = {
  onSelection: PropTypes.func,
  domain: PropTypes.string,
  title: PropTypes.string,
};



export default class LookupReferenceModal extends React.Component {
    constructor(props){
        super (props);
        this.state = {
          query: null,
        }
    }

    open(){
      this.refs.modal.open();
    }

    close(){
      this.refs.modal.close();
    }

    _onSelection(data){
      //console.log("Selected",data);
      this.props.onSelection(data);
      this.refs.modal.close();
    }

    render(){
        return (
          <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
            <View style={{flexDirection: 'row', justifyContent:'center',  borderColor: '#464646', borderBottomWidth: 2}}>
              <View style={{alignItems: 'flex-start', flex: 1, justifyContent: 'center', backgroundColor: '#fff',}}>
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <Button onPress={this.close.bind(this)}
                style={styles.buttonText}
                containerStyle={styles.buttonCancel}><Icon name="close" style={styles.icon}/></Button>
            </View>
            <FilteredLookupReference domain={this.props.domain} onSelect={this._onSelection.bind(this)} filter={this.props.filter}/>

          </Modal>
        );
    }
}

LookupReferenceModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    width: width - getCorrectShapeSizeForScreen(16),
    marginTop: getCorrectShapeSizeForScreen(16),
    bottom: getCorrectShapeSizeForScreen(16),
  },
  title:{
    //backgroundColor: 'blue',
    textAlignVertical: 'center',
    color: '#464646',
    fontWeight: 'bold',
    marginLeft: getCorrectShapeSizeForScreen(10),
    fontSize: getCorrectFontSizeForScreen(14),
  },
  buttonCancel: {
    height: getCorrectShapeSizeForScreen(30),
    width: getCorrectShapeSizeForScreen(35),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    //flex:1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  icon: {
    fontSize: getCorrectFontSizeForScreen(18),
    justifyContent: 'center',
    color: '#ed624f',
  },

});
