'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import SortSelection from './SortSelection';
import { MKButton, MKSpinner } from 'react-native-material-kit';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';

const propTypes = {
  onSelection: PropTypes.func,
};



export default class SortModal extends React.Component {
    constructor(props){
        super (props)
    }

    _closeButton = () => {
      this.refs.modal.close();
    }

    open(){
      this.refs.modal.open();
    }

    close(){
      this.refs.modal.close();
    }

    render(){
        return (
          <Modal {...this.props} style={styles.modal}  position={"bottom"} ref={"modal"}>
              <SortSelection onSelected={this.props.onSelected} selectedOption={this.props.selectedOption}/>
              <MKButton
                onPress={this._closeButton.bind(this)}
                style={styles.buttonSquare}
                >
                <Text style={styles.textButton}>TUTUP</Text>
              </MKButton>
          </Modal>
        );
    }
}

SortModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'stretch',
    height: getCorrectShapeSizeForScreen(165),
    flexDirection: 'column',
  },
  textButton: {
    fontSize: getCorrectFontSizeForScreen(12),
    fontFamily: 'Roboto',
    color: '#ffffff',
  },
  buttonSquare: {
    margin: getCorrectShapeSizeForScreen(10),
    backgroundColor: '#24abe2',
    padding: getCorrectShapeSizeForScreen(5),
    borderRadius: 5,
    alignSelf: 'center',
    width: getCorrectShapeSizeForScreen(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
