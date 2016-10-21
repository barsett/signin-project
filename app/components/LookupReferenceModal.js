'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions} from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import LookupReference from '../components/LookupReference';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height } from '../api/Common.js';

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
          title: props.title,
          domain: props.domain,
        }
    }

    open(){
      this.refs.modal.open();
    }

    openFromRoot(title, domain, onSelection){
      this.setState({
        title,
        domain,
        onSelection,
      });
      this.refs.modal.open();
    }


    close(){
      this.refs.modal.close();
    }

    _onSelection(data){
      console.log("Selected",data);
      if (this.props.onSelection) {
        this.props.onSelection(data);
      }
      if (this.state.onSelection) {
        this.state.onSelection(data);
      }
      this.refs.modal.close();
    }

    render(){
        return (
          <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
            <View style={{flexDirection: 'row', justifyContent:'center',  borderColor: '#464646', borderBottomWidth: 2}}>
              <View style={{alignItems: 'flex-start', flex: 1, justifyContent: 'center', backgroundColor: '#fff',}}>
                <Text style={styles.title}>{this.state.title}</Text>
              </View>
              <Button onPress={this.close.bind(this)}
                style={styles.buttonText}
                containerStyle={styles.buttonCancel}><Icon name="close" style={styles.icon}/></Button>
            </View>
            <LookupReference domain={this.state.domain} onSelect={this._onSelection.bind(this)}/>

          </Modal>
        );
    }
}

LookupReferenceModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    //flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    width: width - getCorrectShapeSizeForScreen(16),
    height: height - getCorrectShapeSizeForScreen(32),
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
