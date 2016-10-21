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

import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import { runDeleteKorban } from '../actions/LakaAction';
import { setKorbanLaka } from '../actions/TaskUpdateAction';

import i18n from '../i18n.js';

class KorbanCell extends React.Component {

  _hapusKorban(idKecelakaan, idKorban, mappedFlag){
    if(mappedFlag === "N"){
      Alert.alert(
        "Hapus Korban",
        "Data korban akan dihapus. Apakah anda yakin?",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log("Hapus data korban");
              this.props.runDeleteKorban(idKecelakaan, idKorban);
            }
          },
          {
            text: 'Cancel',
            onPress: () => {
              console.log("Hapus data korban batal");
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Hapus Korban",
        "Data korban tidak bisa dihapus karena masih digunakan!",
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

  _mapKorban(idKecelakaan, idKorban){
    console.log("Map Korban: ", idKorban);
    this.props.setKorbanLaka(idKecelakaan, idKorban);
    Actions.pop();
    Actions.pop();
  }

  render() {
    var korbanDetail = this.props.data.toJS();
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    /*
    let mapButton = (this.props.survey) ?
      <Button
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        onPress= {() => {this._mapKorban(korbanDetail.idKecelakaan, korbanDetail.idKorbanKecelakaan)}}
      >
        <Icon style={styles.buttonIcon} name="check" /> Pilih
      </Button> :
      null;
      */

    let mapButton = null;
    var delButton = null;
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      delButton = <Button
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        onPress= {() => {this._hapusKorban(korbanDetail.idKecelakaan, korbanDetail.idKorbanKecelakaan, korbanDetail.flag)}}>
        <Icon style={styles.buttonIcon} name="trash-o" /> Hapus
      </Button>;

      mapButton = (this.props.survey) ?
        <Button
          style={styles.buttonText}
          containerStyle={styles.buttonItemPilih}
          onPress= {() => {this._mapKorban(korbanDetail.idKecelakaan, korbanDetail.idKorbanKecelakaan)}}
        >
          <Icon style={styles.buttonIcon} name="check" /> Pilih
        </Button> :
        null;
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
                  {korbanDetail.nama}
                </Text>
              </View>
              <View style={styles.columnContainer}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Sifat Cedera
                    </Text>
                    <Text style={styles.input}>
                      Luka-luka
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Umur
                    </Text>
                    <Text style={styles.input}>
                      {korbanDetail.umur} Tahun
                    </Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Jenis Pertanggungan
                    </Text>
                    <Text style={styles.input}>
                      {korbanDetail.jenisPertanggungan}
                    </Text>
                  </View>
                </View>
              </View>
              {delButton}
              {mapButton}

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
  buttonItemPilih: {
    backgroundColor: '#24abe2',
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
    runDeleteKorban,
    setKorbanLaka,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KorbanCell);
