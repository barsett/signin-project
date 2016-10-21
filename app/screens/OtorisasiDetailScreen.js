/* @flow */
'use strict';

import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    ListView,
    StyleSheet,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import Picker from 'react-native-picker';
import Accordion from 'react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import { runFetchApproval, runApproveAuthorization } from '../actions/ApprovalAction';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, width, height} from '../api/Common';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import FloatLabelTextInput from '../components/FloatingLabel';
import { JENIS_KESIMPULAN } from '../config/Reference';
import KesimpulanPicker from '../components/KesimpulanPicker';
import TextAreaInputModal from '../components/TextAreaInputModal';
import Util from '../api/Util';
import ApprovalService from '../api/TaskServiceJR'; //used for testing (FIRST TRIAL NIH DOAKAN AKU SUKSES YA!)
import { connect } from 'react-redux';
import ReferenceService from '../api/ReferenceService';
import LookupReferenceModal from '../components/LookupReferenceModal';
import SurveyDetailAcordion from '../components/SurveyDetailAcordion';

const getKesimpulanDesc = (id) => {
  //console.log("KesimpulanID", id);
  const rekomendasi = JENIS_KESIMPULAN.find((opt) => {
    return (opt.id == id);
  })

  //console.log("KesimpulanDesc", rekomendasi);
  if (rekomendasi)  return rekomendasi.desc;
}

const formatKesimpulan = (kesimpulan) => {
  //console.log("Kesimpulan Text: ", kesimpulan);
  if (kesimpulan && kesimpulan.length > 28) return kesimpulan.substring(0, 25) + "...";
  return kesimpulan;
}

const rsDataSample = {
  lat: -6.196719,
  lon: 106.846763,
  rsId: 'RS1234',
  namaRs: 'Rumah Sakit DR. Cipto Mangunkusumo',
  alamatRs: 'Jl. Diponegoro No 71, Senen, Jakarta Pusat, DKI Jakarta',
}

class OtorisasiDetailScreen extends React.Component {
  constructor(props){
    super(props);
    const rekomendasi = getKesimpulanDesc(this.props.data.survey.kodeRekomendasi);
    const kesimpulan = getKesimpulanDesc(this.props.data.survey.kodeKesimpulan);
    var LOKET_CABANG_JR = (this.props.namaKantor !== '') ? ReferenceService.findByKeyword('LOKET_CABANG_JR', this.props.namaKantor) : [];
    var kantor = LOKET_CABANG_JR[0];
    var wilayah = (kantor !== undefined) ? (kantor.id).substr(0,2) : '000000';
    var rsData = {
      lat: this.props.data.survey.latitudeRs,
      lon: this.props.data.survey.longitudeRs,
      rsId: this.props.data.survey.kodeRs,
      namaRs: this.props.data.survey.namaRs,
      alamatRs: this.props.data.survey.alamatRs,
    }

    this.state = {
      hasilSurvey: this.props.data.survey.uraianSingkat,
      uraianSingkatOtorisator: this.props.data.survey.uraianSingkatOtorisator,
      kodeRekomendasi: this.props.data.survey.kodeRekomendasi,
      hasilRekomendasi: rekomendasi, // get text based on kode rekomendasi
      lakaKorbanId: null,
      hasilRekomendasiShort: formatKesimpulan(rekomendasi),
      kodeKesimpulan: this.props.data.survey.kodeKesimpulan,
      hasilKesimpulan: kesimpulan,
      hasilKesimpulanShort: formatKesimpulan(kesimpulan),
      lokasiRs: rsData,
      kodeKantor: this.props.data.survey.kodeKantor,
      //kodeKantor: '',
      wilayah: wilayah,
    };
  }

  _onKesimpulanFocus(){
    console.log("Kesimpulan focus");
    if(this.props.data.survey.statusJaminan === 'F1'){
    this.refs.picker.toggle();
    }
  }

  _onKesimpulanSelected(selected){
    console.log("Kesimpulan: ", selected);
    this.setState({
      kodeKesimpulan: selected.id,
      hasilKesimpulan: selected.desc,
      hasilKesimpulanShort: formatKesimpulan(selected.desc)
    });
    this.props.data.survey.kodeKesimpulan = selected.id;

    if(selected.id === 5){
      this.setState({kodeKantor: ''});
    } else {
      this.setState({kodeKantor: this.props.data.survey.kodeKantor});
    }
  }

  _save(){
    if (!this.state.uraianSingkatOtorisator || !this.state.kodeKesimpulan || !this.state.kodeKantor)  {
      if(this.state.kodeKesimpulan === 5){
          Util.showToast("Kesimpulan, Loket Cabang, dan Catatan tidak boleh kosong", Util.LONG);
      } else{
          Util.showToast("Kesimpulan dan Catatan tidak boleh kosong", Util.LONG);
      }
      return;
    } else {
      console.log("Saving otorisasi detail");
      var payload = {
        "namaKorban": this.props.data.survey.namaKorban,
        "kodeKejadian": this.props.data.survey.kodeKejadian,
        "kodeRs": this.props.data.survey.kodeRs,
        "kodeKesimpulan": this.props.data.survey.kodeKesimpulan,
        "kodeSurvey": this.props.data.survey.kodeSurvey,
        "uraianSingkatOtorisator": this.state.uraianSingkatOtorisator,
        "uraianSingkat": this.props.data.survey.uraianSingkat,
        "kodeKantor": this.state.kodeKantor,
      }
      /*
      ApprovalService.authorizeTask(this.props.authData.accessToken, payload)
      .catch((err) => {
        Util.showToast("GAGAL " + err.cause.error, Util.LONG);
      });
      */
      Alert.alert(
        "Otorisasi Survey",
        "Otorisasi data survey. Apakah anda yakin?",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log("OK PRESSED");
              this.props.runApproveAuthorization(payload);
            }
          },
          {
            text: 'Batal',
            onPress: () => {
              console.log("BATAL OTORISASI");
            }
          },
        ]
      );
    }
  }

  _onHasilSurveyFocus(){
    console.log("Kesimpulan focus");
    if(this.props.data.survey.statusJaminan === 'F1'){
      this.props.textInputModal().openFromRoot("Catatan", this.state.uraianSingkatOtorisator, this._setHasilSurvey.bind(this), this._cancelHasilSurvey.bind(this));
    }
  }

  _setHasilSurvey(hasilSurvey){
    /*
    var uraianSingkat;
    if (this.props.data.survey.uraianSingkat.length!==0){
      uraianSingkat = this.props.data.survey.uraianSingkat + "\n" + hasilSurvey;
    } else {
      uraianSingkat = hasilSurvey;
    }
    */
    this.setState({
      uraianSingkatOtorisator: hasilSurvey,
    });
    //console.log("uraianSingkatOtorisator: " + hasilSurvey);
    //this.props.data.survey.uraianSingkat = uraianSingkat;
  }

  _cancelHasilSurvey(hasilSurvey){
    //console.log("hasilSurvey: " + hasilSurvey);
  }

  _viewDocuments = () => {
    console.log("View documents");
    //this.props.runApproveAuthorization(this.props.task);
    Actions.documentList({kodeSurvey: this.props.data.survey.kodeSurvey});
  }

  _searchLaka(){
    console.log("Search Laka");
    // go to search laka page;
    if(this.props.data.survey.idKorbanLaka){
      Actions.lakaDetail({idLaka: this.props.data.survey.kodeLaka, survey : this.props.data.survey});
    }
  }

  _viewLaka(){
    console.log("View Laka");
    // go to search laka page;
    if(this.props.data.survey.idKorbanLaka){
      Actions.lakaDetail({idLaka: this.props.data.survey.kodeLaka, survey : this.props.data.survey});
    }

  }

  _setAsalBerkas = (kantor) => {
    this.setState({kodeKantor: kantor.id,});

  }

  _showAsalBerkas = () => {
    this.refs.asalBerkasModal.open();
  }

  _renderSaveButton(){
    var saveButton = (this.props.data.survey.statusJaminan === 'F1') ?
      <Button onPress={this._save.bind(this)}
        style={styles.saveText}
        containerStyle={styles.saveButton}>
        <Icon style={styles.saveIcon} name="save" />
        Simpan
      </Button> : null;
    return saveButton;
  }



  render() {
      var loketModal = (this.state.kodeKesimpulan === 5) ?
      <View>
      <Text style={styles.labelRekomendasi}>Loket Tujuan</Text>
      <TouchableOpacity onPress={this._showAsalBerkas} underlayColor={'transparent'}>
      <View style={styles.dropdownItemAktif}>
        <Text style={styles.uraianText}>{(this.state.kodeKantor) ? ReferenceService.findByDomainTypeAndId("LOKET_CABANG_JR", this.state.kodeKantor) : "Loket Tujuan"}</Text>
        <Icon style={styles.dropdownIconAktif} name="caret-down"/>
      </View>
      </TouchableOpacity></View> : null;

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
                  <TouchableOpacity onPress={() => {Actions.viewRSLocation({data: this.props.data.survey})}} style={{flex: 1, flexDirection: 'row'}}>
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
              <View style={styles.mainContainer}>
              <View style={styles.uraian}>
                <Text style={styles.labelRekomendasi}>Uraian Singkat</Text>
                  <View style={styles.uraianContainer}>
                      <Text style={styles.uraianText}>{(this.state.hasilSurvey) ? this.state.hasilSurvey : "Belum diisi"}</Text>
                  </View>
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
                  <Text style={styles.idLakaText}>{this.props.data.survey.idKorbanLaka}</Text>
                  </View>
                </Button>
              </View>
            </View>

            <View style={styles.rowButton}>
              <View style={[styles.buttonContainer, {flex: 1}]}>
                <Button onPress={this._viewDocuments.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Icon style={styles.buttonIcon} name="folder-open-o" />
                    <Text style={styles.buttonText}> Dokumen </Text>
                  </View>
                </Button>
              </View>
            </View>
            <View style={styles.uraian}>
              <Text style={styles.labelRekomendasi}>Rekomendasi Kesimpulan</Text>
              <View style={styles.uraianContainer}>
                <Text style={styles.uraianText}>{this.state.hasilRekomendasi}</Text>
              </View>
            </View>

              <Text style={styles.labelRekomendasi}>Kesimpulan</Text>
              <TouchableOpacity onPress={this._onKesimpulanFocus.bind(this)}>
              <View style={styles.dropdownItemAktif}>
                <Text style={styles.uraianText}>{(this.state.hasilKesimpulan) ? this.state.hasilKesimpulan : "Kesimpulan"}</Text>
                <Icon style={styles.dropdownIconAktif} name="caret-down"/>
              </View>
              </TouchableOpacity>

              {loketModal}

              <Text style={styles.labelRekomendasi}>Catatan</Text>
              <TouchableOpacity onPress={this._onHasilSurveyFocus.bind(this)}>
                <View style={styles.uraianContainerAktif}>
                  <Text style={styles.uraianText}>{(this.state.uraianSingkatOtorisator) ? this.state.uraianSingkatOtorisator : "Catatan"}</Text>
                </View>
              </TouchableOpacity>


          </View>
          <SurveyDetailAcordion data={this.props.data} role={this.props.roles} ></SurveyDetailAcordion>
          {this._renderSaveButton()}

          </ScrollView>

          <KesimpulanPicker ref='picker' selectedValue={this.state.hasilRekomendasi} onSelection={this._onKesimpulanSelected.bind(this)}/>
          <TextAreaInputModal ref="hasilSurvey"  textData="" onSubmit={this._setHasilSurvey.bind(this)} onCancel={this._cancelHasilSurvey.bind(this)}/>
          <LookupReferenceModal ref="asalBerkasModal" onSelection={this._setAsalBerkas.bind(this)} domain="LOKET_CABANG_JR" title="Loket"/>

      </View>

      );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: 'green',
    padding: getCorrectShapeSizeForScreen(8),
    //paddingRight: getCorrectShapeSizeForScreen(8),
  },
  itemContainer: {
    //flex: 2,
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
    //flex: 1,
    flexDirection: 'row',
    width: width - getCorrectShapeSizeForScreen(32),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: getCorrectShapeSizeForScreen(8),
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
    width: width - getCorrectShapeSizeForScreen(32),
    //alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(5),
    backgroundColor: '#fff'
  },
  uraianContainerAktif: {
    //flex: 1,
    //width: width - getCorrectShapeSizeForScreen(32),
    borderColor: '#24abe2',
    borderWidth: 2,
    //alignSelf: 'center',
    padding: getCorrectShapeSizeForScreen(5),
    marginBottom: getCorrectShapeSizeForScreen(13),
    backgroundColor: '#f9f9f9',
  },
  mainContainer:{
    width: width - getCorrectShapeSizeForScreen(38),
    alignSelf: 'center',
  },
  uraianText: {
    flex: 1,
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  uraian: {
    marginVertical: getCorrectShapeSizeForScreen(5),
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

  dropdownItemAktif: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: '#24abe2',
    borderWidth: 2,
    padding: getCorrectShapeSizeForScreen(5),
    marginBottom: getCorrectShapeSizeForScreen(13),
    backgroundColor: '#f9f9f9'
  },
  dropdownIconAktif: {
    color: '#24abe2',
    fontSize: getCorrectFontSizeForScreen(15),
    justifyContent: 'center',
    marginRight: getCorrectShapeSizeForScreen(5),
    backgroundColor: 'white',
  },

  labelRekomendasi: {
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(11),
    marginBottom: getCorrectShapeSizeForScreen(3),
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: getCorrectShapeSizeForScreen(5),
    marginBottom: getCorrectShapeSizeForScreen(15),
    justifyContent: 'center',
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
  return {
    namaKantor: state.getIn(['currentUser', 'namaKantor']),
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runApproveAuthorization,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OtorisasiDetailScreen);
