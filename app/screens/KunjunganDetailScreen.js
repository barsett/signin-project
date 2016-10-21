/* @flow */
'use strict';

import React , { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    PixelRatio,
    TouchableOpacity,
} from 'react-native';

import Button from 'react-native-button';
import Picker from 'react-native-picker';
import Accordion from 'react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FloatLabelTextInput from '../components/FloatingLabel';
import KesimpulanPicker from '../components/KesimpulanPicker';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import TextAreaInputModal from '../components/TextAreaInputModal';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDate, formatDateTime, formatData } from '../api/Common'
import {updateTask } from '../actions/TaskUpdateAction'
import { JENIS_KESIMPULAN } from '../config/Reference';
import Util from '../api/Util';

var {height, width} = Dimensions.get('window');

class KunjunganDetailScreen extends React.Component {
  constructor(props){
    super(props);
    //console.log("PROPS:", props);
    this.state = {
    };
  }

  render() {
      return (
        <View style={{flex:1}}>
        <ScrollView pointerEvents="box-none"
          style={styles.scrollView}
          scrollEventThrottle={200}
          contentInset={{top: 0}}>
          <Text style={styles.name}>{this.props.data.survey.namaKorban}</Text>

          <View style={styles.itemContainer}>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="calendar" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatDate(new Date(this.props.data.survey.tanggalKejadian))}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="location-arrow" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatData(this.props.data.survey.lokasiKejadian)}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="plus-square" style={styles.icon} />
              </View>
              <TouchableOpacity onPress={this._viewMap.bind(this)} style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.textContainer}>
                  <Text style={styles.detail}>
                    {this.props.data.survey.namaRs}
                  </Text>
                </View>
                <View style={styles.taskDetail}>
                  <Icon name="map-marker" style={styles.marker} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="bed" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatData(this.props.data.survey.ruangan)}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="sign-in" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatDateTime(this.props.data.survey.tanggalMasukRs)}
                </Text>
              </View>
              <View style={styles.taskDetail}>
                <Icon name="clock-o" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatDateTime(this.props.data.survey.tenggatResponse)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={this._onHasilSurveyFocus.bind(this)} disabled={true}>
            <View style={styles.uraianContainer}>
                <Text style={styles.uraianText}>{(this.state.hasilSurvey) ? this.state.hasilSurvey : "Uraian Singkat..."}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.labelRekomendasi}>Rekomendasi Kesimpulan</Text>
            <TouchableOpacity onPress={this._onKesimpulanFocus.bind(this)} disabled={true}>
            <View style={styles.dropdownItem}>
              <Text style={styles.uraianText}>{this.state.hasilRekomendasi}</Text>
              <Icon style={styles.dropdownIcon} name="caret-down"/>
            </View>
            </TouchableOpacity>
          </View>
          <View style={styles.rowButton}>
            <View style={[styles.buttonContainer, {flex: 0.3}]}>
              <Button onPress={this._searchLaka.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Icon style={styles.buttonIcon} name="file-text-o" />
                  <Text style={styles.buttonText}>ID Korban</Text>
                </View>
              </Button>
            </View>
            <View style={[styles.korbanContainer, {flex: 0.7}]}>
              <Button onPress={this._viewLaka.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                <View style={{flexDirection: 'row'}}>
                <Text style={styles.idLakaText}>{this.state.idKorbanLaka}</Text>
                </View>
              </Button>
            </View>
          </View>
          <View style={styles.rowButton}>
            <View style={[styles.buttonContainer, {flex: 1}]}>
              <Button onPress={this._gotoDocument.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Icon style={styles.buttonIcon} name="folder-open-o" />
                  <Text style={styles.buttonText}> Dokumen </Text>
                </View>
              </Button>
            </View>
          </View>
          <View style={styles.container}>
            <Accordion
              style={{flex: 1, width: width - getCorrectShapeSizeForScreen(34), alignSelf: 'center',}}
              header={
                <View style={styles.expandHeader}>
                  <Text style={styles.detailExpand}>Detail</Text>
                  <Icon style={styles.detailIcon} name="angle-down"/>
                </View>
              }
              content={
                <View style={styles.expandContent}>
                  <View style={styles.rowHeader}>
                    <Icon style={styles.categoryIcon} name="male" color="#4F8EF7"/>
                    <Text style={styles.categoryLabel}>Korban</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Nama</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{this.props.data.survey.namaKorban}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Umur</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.umur)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Kelamin</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.jeniKelamin)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Telpon</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.noTelp)}</Text>
                  </View>
                  <View style={styles.rowHeader}>
                    <Icon style={styles.categoryIcon} name="ambulance" color="#4F8EF7" />
                    <Text style={styles.categoryLabel}>Kecelakaan</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Kode</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatDateTime(this.props.data.survey.kodeKejadian)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Waktu</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatDateTime(this.props.data.survey.tanggalKejadian)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Lokasi</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.lokasiKejadian)}</Text>
                  </View>
                  <View style={styles.rowHeader}>
                    <Icon style={styles.categoryIcon} name="hospital-o" color="#4F8EF7" />
                    <Text style={styles.categoryLabel}>Rumah Sakit</Text>
                  </View>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>Kode RS</Text>
                      <Text style={styles.rowBetween}>:</Text>
                      <Text style={styles.rowInput}>{formatData(this.props.data.survey.kodeRs)}</Text>
                    </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Nama</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.namaRs)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Kamar</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.ruangan)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Masuk</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatDateTime(this.props.data.survey.tanggalMasukRs)}</Text>
                  </View>
                  <View style={styles.rowHeader}>
                    <Icon style={styles.categoryIcon} name="gavel" color="#4F8EF7" />
                    <Text style={styles.categoryLabel}>Klaim/Jaminan</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Tanggal Proses</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatDate(this.props.data.survey.tanggalProses)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Status Jaminan</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.statusKlaim)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Status Klaim</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.statusKlaim)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Sifat Cedera</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.sifatCedera)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Jenis Tindakan</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.jenisTindakan)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Dokter</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.dokterBerwenang)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Biaya</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.biaya)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Jumlah Dibayarkan</Text>
                    <Text style={styles.rowBetween}>:</Text>
                    <Text style={styles.rowInput}>{formatData(this.props.data.survey.jumlahDibayarkan)}</Text>
                  </View>
                </View>
              }
              easing="easeOutCubic"
              underlayColor="#e5e5e5"
            />

          </View>
          <Button onPress={this._save.bind(this)}
            style={styles.saveText}
            containerStyle={styles.saveButton}>
            <Icon style={styles.saveIcon} name="save" />
            Simpan
          </Button>

          </ScrollView>

          <KesimpulanPicker ref='picker' selectedValue={this.state.hasilRekomendasi} onSelection={this._onKesimpulanSelected.bind(this)}/>
          <TextAreaInputModal ref="hasilSurvey"  textData={this.state.hasilSurvey} onSubmit={this._setHasilSurvey.bind(this)} onCancel={this._cancelHasilSurvey.bind(this)}/>
      </View>

      );
  }
}

  const styles = StyleSheet.create({
    itemContainer: {
      flex: 2,
      flexDirection: 'column',
      backgroundColor: 'white',
      alignSelf: 'stretch',
      padding: getCorrectShapeSizeForScreen(8),
    },
    itemLineContainer: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: getCorrectShapeSizeForScreen(4),
    },
    taskDetail: {
      backgroundColor: 'white',
      width: getCorrectFontSizeForScreen(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      justifyContent: 'center',
    },
    detail: {
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(12),
      fontFamily: 'Roboto',
    },
    icon: {
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(12),
      justifyContent: 'center',
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    marker: {
      marginLeft: getCorrectShapeSizeForScreen(-8),
      width: 20, color: '#24abe2',
      fontSize: getCorrectFontSizeForScreen(12)
    },
    rowButton: {
      flexDirection: 'row',
      width: width - getCorrectShapeSizeForScreen(32),
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: getCorrectShapeSizeForScreen(13),
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: getCorrectShapeSizeForScreen(3),
      backgroundColor: '#24abe2',
      borderColor: '#24abe2',
      borderWidth: 2,
    },
    buttonItemMain: {
      height: getCorrectShapeSizeForScreen(30),
      justifyContent: 'center',
      alignSelf: 'stretch',
      padding: getCorrectShapeSizeForScreen(5),
    },
    buttonIcon: {
      color: '#fff',
      width: getCorrectShapeSizeForScreen(15),
      fontSize: getCorrectFontSizeForScreen(12),
      alignSelf: 'center',
    },
    buttonText: {
      color: '#fff',
      fontFamily: 'Roboto',
      fontSize: getCorrectFontSizeForScreen(12),
    },
    korbanContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: '#f9f9f9',
      borderColor: '#24abe2',
      borderRightWidth: 2,
      borderTopWidth: 2,
      borderBottomWidth: 2,
    },
    uraianContainer: {
      flex: 1,
      width: width - getCorrectShapeSizeForScreen(34),
      alignSelf: 'center',
      borderColor: '#fff',
      borderWidth: 2,
      marginBottom: getCorrectShapeSizeForScreen(13),
      backgroundColor: '#fff'
    },
    uraianText: {
      flex: 1,
      color: '#464646',
      fontFamily: 'Roboto',
      fontSize: getCorrectFontSizeForScreen(12),
    },
    idLakaText: {
      fontFamily: 'Roboto',
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(12),
      alignSelf: 'flex-start',
    },
    dropdownItem: {
      flex: 1,
      flexDirection: 'row',
      width: width - getCorrectShapeSizeForScreen(34),
      alignSelf: 'center',
      borderColor: '#ccc',
      marginBottom: getCorrectShapeSizeForScreen(13),
      backgroundColor: '#fff'
    },
    dropdownIcon: {
      color: '#fff',
      fontSize: getCorrectFontSizeForScreen(20),
      justifyContent: 'center',
      marginRight: getCorrectShapeSizeForScreen(5),
    },
    labelRekomendasi: {
      color: '#464646',
      fontFamily: 'Roboto-Light',
      fontSize: getCorrectFontSizeForScreen(11),
      left: getCorrectShapeSizeForScreen(17),
      marginBottom: getCorrectShapeSizeForScreen(3),
    },
    scrollView: {
      backgroundColor: '#fff',
    },
    container: {
      flex: 1,
    },
    name: {
      fontSize: getCorrectFontSizeForScreen(18),
      alignSelf: 'flex-start',
      marginLeft: getCorrectShapeSizeForScreen(20),
      marginTop: getCorrectShapeSizeForScreen(15),
      fontFamily: 'Roboto-Medium',
      color: '#464646',
    },
    categoryLabel: {
      flex:1,
      fontSize: getCorrectFontSizeForScreen(14),
      padding: getCorrectShapeSizeForScreen(4),
      fontWeight:'bold',
      color: '#464646',
      textAlignVertical: 'center',
    },
    categoryIcon: {
      width: getCorrectShapeSizeForScreen(20),
      alignSelf: 'center',
      fontSize: getCorrectFontSizeForScreen(14),
      color: '#464646',
      textAlignVertical: 'center',
    },
    rowHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      left: getCorrectShapeSizeForScreen(10),
      paddingBottom: getCorrectShapeSizeForScreen(3),
      paddingTop: getCorrectShapeSizeForScreen(3),
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getCorrectShapeSizeForScreen(3),
    },
    rowLabel: {
      left:getCorrectShapeSizeForScreen(10),
      fontSize: getCorrectFontSizeForScreen(12),
      flex: 0.35,
      color: '#464646',
      fontFamily: 'Roboto',
    },
    rowBetween: {
      fontSize: getCorrectFontSizeForScreen(12),
      flex: 0.05,
      color: '#464646',
      fontFamily: 'Roboto',
    },
    rowInput: {
      fontSize: getCorrectFontSizeForScreen(12),
      flex: 0.6,
      color: '#464646',
      fontFamily: 'Roboto',
    },

    saveButton: {
      backgroundColor: '#66ae1e',
      width: width - getCorrectShapeSizeForScreen(32),
      height: getCorrectShapeSizeForScreen(33),
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      margin: getCorrectShapeSizeForScreen(15),
    },
    saveIcon: {
      width: getCorrectShapeSizeForScreen(18),
      alignSelf: 'center',
      fontSize: getCorrectFontSizeForScreen(14)
    },
    saveText: {
      textAlignVertical: 'center',
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
      color: '#fff',
      fontSize: getCorrectFontSizeForScreen(14),
    },
    expandHeader: {
      flex: 1,
      flexDirection: 'row',
      borderColor: '#24abe2',
      borderBottomWidth: 2,
      padding: getCorrectShapeSizeForScreen(5),
      backgroundColor: '#fff'
    },
    expandContent: {
      flex: 1,
      width: width - getCorrectShapeSizeForScreen(34),
      alignSelf: 'center',
      paddingBottom: getCorrectShapeSizeForScreen(5),
      marginBottom: getCorrectShapeSizeForScreen(13),
      backgroundColor: '#f9f9f9'
    },
    detailExpand: {
      flex: 1,
      fontFamily: 'Roboto-Medium',
      fontSize: getCorrectFontSizeForScreen(14),
      color: '#464646',
    },
    detailIcon: {
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(20),
      justifyContent: 'center',
      marginRight: getCorrectShapeSizeForScreen(5),
    },
  });

const mapStateToProps = (state) => {
  //console.log("MappingStateToProps");
  return {
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KunjunganDetailScreen);
