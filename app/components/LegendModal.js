'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions} from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height } from '../api/Common.js';

const propTypes = {
  title: PropTypes.string,
};

export default class LegendModal extends React.Component {
    constructor(props){
        super (props);
        this.state = {
          title: props.title,
        }
    }

    open(){
      this.refs.modal.open();
    }

    openFromRoot(title){
      this.setState({
        title,
      });
      this.refs.modal.open();
    }


    close(){
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
            <View style={styles.containerList}>
              <View style={styles.column}>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="phone" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Nomor Telepon</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="calendar" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Tanggal Kejadian</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="plus-square" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Nama Rumah Sakit</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="bed" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Kelas Kamar</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="clock-o" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Tenggat Waktu</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="sign-in" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Tanggal Masuk RS</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="user-md" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Dokter yang Menangani</Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="location-arrow" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Lokasi Kejadian</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="map-marker" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Peta Lokasi</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="calendar-check-o" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Tanggal Laporan</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="calendar-plus-o" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Tanggal Pengajuan</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="institution" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Instansi</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="file-text" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Nomor Laporan Polisi</Text>
                </View>
                <View style={styles.item}>
                  <View style={styles.iconContainer}><Icon name="pencil-square-o" style={styles.iconList}/></View>
                  <Text style={styles.iconText}>Surveyor</Text>
                </View>
              </View>
            </View>
          </Modal>
        );
    }
}

LegendModal.propTypes = propTypes;

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
  column: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: getCorrectShapeSizeForScreen(5),
  },
  item: {
    flexDirection: 'row',
    paddingTop: getCorrectShapeSizeForScreen(10),
  },
  iconList: {
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    color: '#464646',
  },
  iconContainer: {
    width: getCorrectShapeSizeForScreen(24),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerList: {
    paddingHorizontal: getCorrectShapeSizeForScreen(15),
    paddingTop: getCorrectShapeSizeForScreen(5),
    flex: 1,
    flexDirection: 'row',
  },
  iconText: {
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#464646',
    textAlignVertical: 'center',
  },
});
