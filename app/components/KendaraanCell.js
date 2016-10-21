'use strict';

/*
This component is used to show survey information. This will be part of row component in a List
if the list row have action when press then this component must be wrapped in TouchableHighlight
if the list have actionable button then renderRow should contain this component and button component
*/
import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  View,
  Alert,
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, formatDate } from '../api/Common.js';
import i18n from '../i18n.js';
import {runDeleteKendaraan} from '../actions/LakaAction';
import ReferenceService from '../api/ReferenceService';

const STATUS_KENDARAAN = ReferenceService.findByDomainType('KODE_STATUS_KENDARAAN');
const JENIS_KENDARAAN = ReferenceService.findByDomainType('JENIS_KENDARAAN');
const JENIS_SIM = ReferenceService.findByDomainType('KODE_JENIS_SIM');

class KendaraanCell extends React.Component {



  _hapusKendaraan(idKendaraan){
    console.log("Cek Flag", idKendaraan);
    if(idKendaraan.flag === "N" || idKendaraan.flag === null){
      Alert.alert(
        "Hapus Kendaraan",
        "Data kendaraan akan dihapus. Apakah anda yakin?",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log("Hapus data kendaraan");
              this.props.runDeleteKendaraan(idKendaraan);
            }
          },
          {
            text: 'Cancel',
            onPress: () => {
              console.log("Hapus data kendaraan batal");
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Hapus Kendaraan",
        "Data kendaraan tidak bisa dihapus karena masih digunakan!",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log("OK PRESSED");
            }
          }
        ]
      );
    }

  }

  _findDescbyId(arrObj, id){
    var desc;
    for (var obj in arrObj){
      if (arrObj[obj].id === id){
        desc = arrObj[obj].desc;
      }
    }
    return desc;
  }

  render() {
    var kendaraanDetail = this.props.data.toJS();
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    var delButton = null;
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      delButton = <Button
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        onPress= {() => {this._hapusKendaraan(kendaraanDetail)}}>
        <Icon style={styles.buttonIcon} name="trash-o" /> Hapus
      </Button>;
    }

    return (
        <View style={styles.container}>
          <TouchableElement
            style={{flex:1}}
            onPress={this.props.onSelect}
            onShowUnderlay={this.props.onHighlight}
            onHideUnderlay={this.props.onUnhighlight}>
            <View style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.title}>
                  {kendaraanDetail.noPolisi} - {(kendaraanDetail.statusKendaraan) ? this._findDescbyId(STATUS_KENDARAAN, kendaraanDetail.statusKendaraan) : ''}
                </Text>
              </View>
              <View style={styles.columnContainer}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Jenis Kendaraan
                    </Text>
                    <Text style={styles.input}>
                      {(kendaraanDetail.kodeJenis) ? this._findDescbyId(JENIS_KENDARAAN, kendaraanDetail.kodeJenis) : ''}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Nama Pengemudi
                    </Text>
                    <Text style={styles.input}>
                      {kendaraanDetail.namaPengemudi}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Alamat Pengemudi
                    </Text>
                    <Text style={styles.input}>
                      {kendaraanDetail.alamatPengemudi}
                    </Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Golongan Kendaraan
                    </Text>
                    <Text style={styles.input}>
                        {kendaraanDetail.kodeGolongan}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Jenis SIM / No. SIM
                    </Text>
                    <Text style={styles.input}>
                        {kendaraanDetail.kodeJenisSim} / {kendaraanDetail.noSimPengemudi}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Masa Berlaku SIM
                    </Text>
                    <Text style={styles.input}>
                        {formatDate(kendaraanDetail.masaBerlakuSim)}
                    </Text>
                  </View>
                </View>
              </View>
              {delButton}
            </View>
          </TouchableElement>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: getCorrectShapeSizeForScreen(5),
    borderColor: '#e5e5e5',
    borderBottomWidth: 3,
  },
  item: {
    flex: 1,
    paddingLeft: getCorrectShapeSizeForScreen(5),
    paddingRight: getCorrectShapeSizeForScreen(5),
    paddingBottom: getCorrectShapeSizeForScreen(10),
  },
  columnContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 0.5,
  },
  row: {
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(5),
  },
  title: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(15),
    fontFamily: 'Roboto-Medium',

  },
  label: {
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(10),
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  buttonItem: {
    backgroundColor: '#bf0000',
    height: getCorrectShapeSizeForScreen(30),
    width: width - getCorrectShapeSizeForScreen(32),
    marginLeft: getCorrectShapeSizeForScreen(15),
    marginRight: getCorrectShapeSizeForScreen(15),
    marginTop: getCorrectShapeSizeForScreen(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonIcon: {
    color: '#fff',
    width: getCorrectShapeSizeForScreen(18),
    fontSize: getCorrectFontSizeForScreen(14),
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: getCorrectFontSizeForScreen(14),
    fontWeight: 'normal',
    fontFamily: 'Roboto-Medium'
  },
});

const mapStateToProps = (state) => {
  return {
    roles: state.getIn(['currentUser', 'roles']),
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runDeleteKendaraan,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KendaraanCell);
