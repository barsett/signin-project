'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import FilterSelection from './FilterSelection';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import { MKButton, MKSpinner } from 'react-native-material-kit';

const propTypes = {
  onSelection: PropTypes.func,
  selectedOption: PropTypes.string,
  role: PropTypes.string,
};



export default class FilterModal extends React.Component {
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
              <FilterSelection role={this.props.role} onSelected={this.props.onSelected} selectedOption={this.props.selectedOption}/>
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

FilterModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'stretch',
    height: getCorrectShapeSizeForScreen(200),
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
