'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, TextInput, Clipboard, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions} from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

var {height, width} = Dimensions.get('window');

const propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  textData: PropTypes.string,
};



export default class TextAreaInputModal extends React.Component {
    constructor(props){
        super (props);
        this.state = {
          title: props.title,
          textData: props.textData,
        }
    }

    open(){
      this.refs.modal.open();
    }

    openFromRoot(title, textData, onSubmit, onCancel){
      this.setState({
        title,
        textData,
        onSubmit,
        onCancel,
      });
      this.refs.modal.open();
    }


    close(){
      this.refs.modal.close();
    }

    _onSubmit(){
      console.log("Submit Presss");
      if (this.props.onSubmit){
        this.props.onSubmit(this.state.textData);
      }
      if (this.state.onSubmit){
        this.state.onSubmit(this.state.textData);
      }
      this.refs.modal.close();
    }

    async _onPaste(){
      console.log("Submit Presss");
      try {
        var content = await Clipboard.getString();
        this.setState ({textData: this.state.textData + content});
      } catch (e) {
        console.log(e);
      }
    }


    _onCancel(){
      if (this.props.onCancel){
        this.props.onCancel(this.state.textData);
      }
      if (this.state.onCancel){
        this.state.onCancel(this.state.textData);
      }
      this.refs.modal.close();
    }

    componentDidMount(){
      //this.refs.inputText.focus();
    }

    render(){
        return (
          <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
            <View style={styles.container}>
              <View style={{flexDirection: 'row', height: 50}}>
                <Button onPress={this._onCancel.bind(this)}
                  style={styles.buttonText}
                  containerStyle={styles.buttonCancel}>Batal</Button>
                <View style={styles.title}>
                  <Text style={styles.titleText}>{this.state.title}</Text>
                </View>
                <Button onPress={this._onPaste.bind(this)}
                      style={styles.buttonText}
                      containerStyle={styles.buttonPaste}>Paste</Button>
                <Button onPress={this._onSubmit.bind(this)}
                    style={styles.buttonText}
                    containerStyle={styles.buttonSubmit}>Simpan</Button>
              </View>
              <View style={styles.textArea}>
                <TextInput
                    ref="inputText"
                    style={styles.textInput}
                    onChangeText={(textData) => this.setState({textData})}
                    multiline={true}
                    placeholder={'Ketik disini...'}
                    placeholderTextColor={'#ccc'}
                    autoCorrect={false}
                    autoFocus={true}
                    numberOfLines={10}
                    value={this.state.textData}
                    underlineColorAndroid='rgba(0,0,0,0)'

                  />
              </View>
            </View>
          </Modal>
        );
    }
}

TextAreaInputModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex:1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,

  },
  container: {
    flex:1,
    flexDirection: 'column',

  },
  textArea: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
		padding: 5,
	},
  textInput: {
    textAlignVertical: 'top',
		color: '#3B3738',
		padding: 10,
    fontSize: 20,
    borderColor: '#fff',
    //borderWidth: 1,
    flex:1,
    fontFamily: 'Roboto',
	},
  title:{
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleText:{
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: getCorrectFontSizeForScreen(20),
  },
  buttonPaste: {
    margin: 5,
    borderRadius: 3,
    width: getCorrectShapeSizeForScreen(50),
    backgroundColor: '#ff7e00',
    alignItems: 'center',
    justifyContent: 'center',
//    flex:1,
  },
  buttonSubmit: {
    margin: 5,
    borderRadius: 3,
    width: getCorrectShapeSizeForScreen(50),
    backgroundColor: '#66ae1e',
    alignItems: 'center',
    justifyContent: 'center',
    //flex:1,
  },
  buttonCancel: {
    margin: 5,
    borderRadius: 3,
    width: getCorrectShapeSizeForScreen(50),
    backgroundColor: '#ed624f',
    alignItems: 'center',
    justifyContent: 'center',
    //flex:1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(12),

  }

});
