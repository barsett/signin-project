/* @flow */
'use strict';

import React , { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    PixelRatio,
    Clipboard,
    TouchableOpacity,
    Alert,
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
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDate, formatDateTime, formatData } from '../api/Common'
import { updateTask, saveLocation, clearKorbanLaka } from '../actions/TaskUpdateAction';
import { updateLocation } from '../actions/StatusAction';
import { JENIS_KESIMPULAN } from '../config/Reference';
import Util from '../api/Util';
import SurveyDetailAcordion from '../components/SurveyDetailAcordion';
import ResponsiveButton from '../components/ResponsiveButton';

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

var {height, width} = Dimensions.get('window');

class KunjunganEditScreen extends React.Component {
  constructor(props){
    super(props);
    const rekomendasi = getKesimpulanDesc(props.data.survey.kodeRekomendasi);

    this.state = {
      hasilSurvey: props.data.survey.uraianSingkat,
      kodeRekomendasi: props.data.survey.kodeRekomendasi,
      hasilRekomendasi: rekomendasi, // get text based on kode rekomendasi
      lakaKorbanId: props.data.survey.idKorbanLaka,
      kodeLaka: props.data.survey.kodeLaka,
      hasilRekomendasiShort: formatKesimpulan(rekomendasi),
      longitudeSurveyor: props.data.survey.longitudeSurveyor,
      latitudeSurveyor: props.data.survey.latitudeSurveyor,
      isSaving: false,
      isCheckingIn: false,
    };
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.selectedKorbanId && (this.props.selectedKorbanId !== nextProps.selectedKorbanId)){
      this.setState({
        lakaKorbanId: nextProps.selectedKorbanId,
        kodeLaka: nextProps.selectedLakaId,
      });
      // clear state
      this.props.clearKorbanLaka();

    }
  }

  _onHasilSurveyFocus(){
    console.log("Kesimpulan focus");
    //this.refs.hasilSurvey.open();
    // use this to enable full screen modal
    if(this.props.data.survey.statusJaminan === 'F0' || this.props.data.survey.statusJaminan === 'F1'){
      this.props.textInputModal().openFromRoot("Uraian", this.state.hasilSurvey, this._setHasilSurvey.bind(this), this._cancelHasilSurvey.bind(this));
    }

  }

  _setHasilSurvey(hasilSurvey){
    //console.log("hasilSurvey: " + hasilSurvey);
    this.setState({hasilSurvey});
  }

  _cancelHasilSurvey(hasilSurvey){
    //console.log("hasilSurvey: " + hasilSurvey);
  }

  _onKesimpulanFocus(){
    console.log("Kesimpulan focus");
    if(this.props.data.survey.statusJaminan === 'F0' || this.props.data.survey.statusJaminan === 'F1'){
      this.refs.picker.toggle();
    }
  }

  _onKesimpulanSelected(selected){
    console.log("Kesimpulan: ", selected);
    this.setState({
      kodeRekomendasi: selected.id,
      hasilRekomendasi: selected.desc,
      hasilRekomendasiShort: formatKesimpulan(selected.desc)
    });
  }

  _searchLaka(){
    console.log("Search Laka");
    // go to search laka page;
    Actions.lakaSubSearch({survey : this.props.data.survey});
  }

  _viewLaka(){
    console.log("View Laka");
    // go to search laka page;
    if(this.state.lakaKorbanId){
      Actions.lakaDetail({idLaka: this.state.kodeLaka, survey : this.props.data.survey});
    } else {
      Actions.lakaSubSearch({survey : this.props.data.survey});
    }

  }

  _unmapLaka(){
    console.log("Unmap Laka");
    this.setState({
      lakaKorbanId: null,
      kodeLaka: null,
    })

  }


  _viewMap(){
    console.log("View RS in Map");
    Actions.viewRSLocation({data : this.props.data.survey});
  }

  _gotoDocument(){
    console.log("go to document");
    Actions.documentList({kodeSurvey : this.props.data.survey.kodeSurvey});
  }

  _pasteData(){
    console.log("Paste Hasil Survey");
  }

  _save(submitToOtorisator){
    // save data ... if successful then pop();

    Clipboard.setString(this.state.hasilSurvey);

    const oto = (submitToOtorisator) ? 'F1' : 'F0';

    const payload = {
      ...this.props.data.survey,
      uraianSingkat: this.state.hasilSurvey,
      kodeRekomendasi: this.state.kodeRekomendasi,
      idKorbanLaka: this.state.lakaKorbanId,
      kodeLaka: this.state.kodeLaka,
      statusJaminan: oto, //this to flag backend not to sync to DASI
      longitudeSurveyor: this.state.longitudeSurveyor, // bug fix JRM-416
      latitudeSurveyor: this.state.latitudeSurveyor, // bug fix JRM-416

    };

    let task = {...this.props.data};
    task.survey = payload;

    this.setState({isSaving: true});

    return this.props.updateTask(task)
      .then(() => {
        this.setState({isSaving: false});
      });


  }

  _saveTaskLocation(){
    const payload = {
      ...this.props.data.survey,
      uraianSingkat: this.state.hasilSurvey,
      kodeRekomendasi: this.state.kodeRekomendasi,
    };

    let task = {...this.props.data};
    task.survey = payload;


    return this.props.saveLocation(task);


  }

  _confirmSave(){
    if (this.state.longitudeSurveyor === 0){
      Alert.alert(
        "Belum check in",
        "Anda belum melakukan cek in, apakah akan tetap lanjut kirim data ke Otorisator?",
        [
          {
            text: 'Kirim',
            onPress: () => {
              console.log("Data dikirim ke Otorisator");
              this._save(true);
              Actions.pop();
            }
          },
          {
            text: 'Batal',
            onPress: () => {
              console.log("Batal kirim");
            }
          }
        ]
      );
    } else {
      this._save(true);
      Actions.pop();
    }
  }

  _submit(){
    if (!this.state.hasilSurvey)  {
      //Util.showToast("Hasil Survey dan Rekomendasi tidak boleh kosong", Util.LONG);
      Util.showToast("Hasil Survey tidak boleh kosong", Util.LONG);
      return;
    }

    if (!this.state.hasilSurvey || !this.state.kodeRekomendasi)  {
      // send to server as is
      this._save(false);
      //Util.showToast("Hasil Survey dan Rekomendasi tidak boleh kosong", Util.LONG);
      return;
    }

    Alert.alert(
       "Kunjungan Screen",
       "Data akan dikirimkan ke Otorisator",
       [
         {
           text: 'Simpan Saja',
           onPress: () => {
             console.log("Data batal dikirimkan ke Otorisator");
             this._save(false);
           }

         },
         {
           text: 'Kirim',
           onPress: () => {
             console.log("Data dikirimkan ke Otorisator");
             this._confirmSave();
           }
         }
       ]
     );
  }

  _saveLocation(){
    //trigger location get
    let location = null;
    this.setState({isCheckingIn: true});
    //this.props.dispatch(updateLocation())
    this.props.updateLocation()
    .then((loc) => {
      //console.log("LOC:", loc );
      location = loc;
      return this._saveTaskLocation();
    })
    .then(() => {
      //console.log("LOC:", location );
      this.setState({
        longitudeSurveyor: location.coords.longitude,
        latitudeSurveyor: location.coords.latitude,
      });
      this.setState({isCheckingIn: false});

    })
    .catch((err) => {
      //console.log("Error Saving Location", err);
      Util.showToast("GAGAL " + err, Util.LONG);
      this.setState({isCheckingIn: false});

    });
  }


  _renderInformasiOtorisator(){
    var infoOtorisator = (this.props.data.survey.statusJaminan === 'F0' || this.props.data.survey.statusJaminan === 'F1') ?
      null :
      <View>
        <View style={styles.uraian}>
          <Text style={styles.labelRekomendasiOtorisasi}>Uraian Singkat Otorisator</Text>
            <View style={styles.uraianContainerOtorisasi}>
                <Text style={styles.uraianText}>{(this.props.data.survey.uraianSingkatOtorisator) ? this.props.data.survey.uraianSingkatOtorisator : "Belum diisi"}</Text>
            </View>
        </View>
        <View style={styles.uraian}>
          <Text style={styles.labelRekomendasiOtorisasi}>Kesimpulan Otorisator</Text>
          <View style={styles.uraianContainerOtorisasi}>
            <Text style={styles.uraianText}>{getKesimpulanDesc(this.props.data.survey.kodeKesimpulan)}</Text>
          </View>
        </View>
      </View>;
      return infoOtorisator;
  }

  _renderSaveButton(){
    const checkInButtonStyle = (this.state.longitudeSurveyor !== 0) ? styles.saveButtonOff : styles.saveButton;

    var saveButton = (this.props.data.survey.statusJaminan === 'F0' || this.props.data.survey.statusJaminan === 'F1') ?
      <View style={{flex:1, flexDirection: 'row'}}>
        <ResponsiveButton onPress={this._saveLocation.bind(this)}
          style={styles.saveText}
          disabled={(this.state.longitudeSurveyor !== 0 || this.state.isCheckingIn)}
          containerStyle={checkInButtonStyle}
          iconName="map-marker"
          iconStyle={styles.saveIcon}
          text="Check In"
          isLoading={this.state.isCheckingIn}>
        </ResponsiveButton>
        <ResponsiveButton onPress={this._submit.bind(this)}
          style={styles.saveText}
          containerStyle={styles.saveButton}
          iconName="send"
          iconStyle={styles.saveIcon}
          text="Simpan"
          isLoading={this.state.isSaving}>
        </ResponsiveButton>
      </View> : null;
    return saveButton;
  }

	render() {
      const bpjsFlag = (this.props.data.survey.tipeId === "BPJSK") ? "(BPJS)" : "(RS)";

	    return (
        <View style={{flex:1}}>
        <ScrollView pointerEvents="box-none"
          style={styles.scrollView}
          scrollEventThrottle={200}
          contentContainerStyle={styles.scrollViewContent}
          //contentInset={{top: 0}}
          >
          <View style={styles.container}>
            <Text style={styles.name}>{this.props.data.survey.namaKorban} {bpjsFlag}</Text>
          </View>
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
                  <View style={styles.taskDetail}>
                    <Icon name="map-marker" style={styles.marker} />
                  </View>
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
          <View style={styles.container}>

            <Text style={styles.labelRekomendasi}>Uraian Singkat</Text>
            <TouchableOpacity onPress={this._onHasilSurveyFocus.bind(this)}>
              <View style={styles.uraianContainer}>
                  <Text style={styles.uraianText}>{(this.state.hasilSurvey) ? this.state.hasilSurvey : "Uraian Singkat..."}</Text>
              </View>
            </TouchableOpacity>


            <Text style={styles.labelRekomendasi}>Rekomendasi Kesimpulan</Text>
            <TouchableOpacity onPress={this._onKesimpulanFocus.bind(this)}>
              <View style={styles.dropdownItem}>
                <Text style={styles.uraianText}>{(this.state.hasilRekomendasi) ? this.state.hasilRekomendasi : "Rekomendasi Kesimpulan"}</Text>
                <Icon style={styles.dropdownIcon} name="caret-down"/>
              </View>
            </TouchableOpacity>

            <View style={styles.rowButton}>
              <View style={[styles.buttonContainer, {flex: 0.3}]}>
                <Button onPress={this._searchLaka.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Icon style={styles.buttonIcon} name="search" />
                    <Text style={styles.buttonText}>ID Korban</Text>
                  </View>
                </Button>
              </View>
              <View style={[styles.korbanContainer, {flex: 0.7}]}>
                <Button onPress={this._viewLaka.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                  <View style={{flexDirection: 'row'}}>
                  <Text style={styles.idLakaText}>{this.state.lakaKorbanId}</Text>
                  </View>
                </Button>
              </View>
              <View style={[styles.buttonContainer]}>
                <Button onPress={this._unmapLaka.bind(this)} style={styles.buttonText} containerStyle={styles.buttonItemMain}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon style={styles.buttonIcon} name="times" />
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
          </View>

          {this._renderInformasiOtorisator()}

          <SurveyDetailAcordion data={this.props.data}></SurveyDetailAcordion>
          {this._renderSaveButton()}

          </ScrollView>

          <KesimpulanPicker ref='picker' selectedValue={this.state.hasilRekomendasi} onSelection={this._onKesimpulanSelected.bind(this)}/>
          {/*<TextAreaInputModal ref="hasilSurvey" title="Uraian" textData={this.state.hasilSurvey} onSubmit={this._setHasilSurvey.bind(this)} onCancel={this._cancelHasilSurvey.bind(this)}/>*/}
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
  container: {
    //backgroundColor: 'blue',
    //margin: 10,
    alignItems: 'stretch',
    alignSelf: 'stretch',
    padding: getCorrectShapeSizeForScreen(8),
  },
  itemContainer: {
    //backgroundColor: 'yellow',
    //margin: 10,
    alignItems: 'stretch',
    alignSelf: 'stretch',
    padding: getCorrectShapeSizeForScreen(4),
  },
  itemLineContainer: {
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: getCorrectShapeSizeForScreen(4),
  },
  taskDetail: {
    //backgroundColor: 'red',
    width: getCorrectFontSizeForScreen(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex:1,
    //backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    //backgroundColor: 'white',
    color: '#24abe2',
    fontSize: getCorrectFontSizeForScreen(12)
  },
  rowButton: {
    flexDirection: 'row',
    //width: width - getCorrectShapeSizeForScreen(32),
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(13),
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
    fontSize: getCorrectFontSizeForScreen(10),
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
    //width: width - getCorrectShapeSizeForScreen(34),
    borderColor: '#24abe2',
    borderWidth: 2,
    padding: getCorrectShapeSizeForScreen(5),
    marginBottom: getCorrectShapeSizeForScreen(13),
    backgroundColor: '#f9f9f9',
  },
  uraianContainerOtorisasi: {
    width: width - getCorrectShapeSizeForScreen(32),
    //alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(5),
    backgroundColor: '#fff'
  },
  uraianText: {
    flex: 1,
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    textAlignVertical: 'center',
    //backgroundColor: 'red',
  },
  uraian: {
    marginVertical: getCorrectShapeSizeForScreen(5),
  },
  idLakaText: {
    fontFamily: 'Roboto',
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(11),
    alignSelf: 'flex-start',
  },
  dropdownItem: {
    flex: 1,
    flexDirection: 'row',
    //width: width - getCorrectShapeSizeForScreen(34),
    alignSelf: 'center',
    borderColor: '#24abe2',
    borderWidth: 2,
    padding: getCorrectShapeSizeForScreen(5),
    marginBottom: getCorrectShapeSizeForScreen(13),
    //backgroundColor: 'green',
    backgroundColor: '#f9f9f9'
  },
  dropdownIcon: {
    color: '#24abe2',
    fontSize: getCorrectFontSizeForScreen(15),
    justifyContent: 'center',
    //marginRight: getCorrectShapeSizeForScreen(5),
    backgroundColor: 'white',
  },
  labelRekomendasi: {
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(11),
    left: getCorrectShapeSizeForScreen(17),
    marginBottom: getCorrectShapeSizeForScreen(3),
  },
  labelRekomendasiOtorisasi: {
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(11),
    marginBottom: getCorrectShapeSizeForScreen(3),
  },
  name: {
    fontSize: getCorrectFontSizeForScreen(18),
    alignSelf: 'flex-start',
    //marginLeft: getCorrectShapeSizeForScreen(20),
    //marginTop: getCorrectShapeSizeForScreen(15),
    fontFamily: 'Roboto-Medium',
    color: '#464646',
    textAlignVertical: 'center',
    //backgroundColor: 'blue',
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
  saveButtonOff: {
    flex:1,
    backgroundColor: 'grey',
    //width: width - getCorrectShapeSizeForScreen(32),
    height: getCorrectShapeSizeForScreen(33),
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: getCorrectShapeSizeForScreen(5),
  },

  saveButton: {
    flex:1,
    backgroundColor: '#66ae1e',
    //width: width - getCorrectShapeSizeForScreen(32),
    height: getCorrectShapeSizeForScreen(33),
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: getCorrectShapeSizeForScreen(5),
  },
  saveIcon: {
    width: getCorrectShapeSizeForScreen(18),
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(14),
    color: 'white',
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
    //width: width - getCorrectShapeSizeForScreen(34),
    //alignSelf: 'center',
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
    selectedKorbanId: state.getIn(['myTasks', 'selectedKorbanId']),
    selectedLakaId: state.getIn(['myTasks', 'selectedLakaId']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateTask,
    clearKorbanLaka,
    updateLocation,
    saveLocation,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KunjunganEditScreen);
