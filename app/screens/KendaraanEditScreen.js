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
    Alert,
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';
import ModalPicker from 'react-native-modal-picker';
import DatePicker from 'react-native-datepicker';
import {runAddKendaraan, runUpdateKendaraan} from '../actions/LakaAction';

import FloatLabelTextInput from '../components/FloatingLabel';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, getEmptyField } from '../api/Common.js';
import dismissKeyboard from 'dismissKeyboard';
import ResponsiveButton from '../components/ResponsiveButton';
import ReferenceService from '../api/ReferenceService';

const STATUS_KENDARAAN = ReferenceService.findByDomainType('KODE_STATUS_KENDARAAN');
const JENIS_KENDARAAN = ReferenceService.findByDomainType('JENIS_KENDARAAN');
const JENIS_SIM = ReferenceService.findByDomainType('KODE_JENIS_SIM');

class KendaraanEditScreen extends React.Component {
  constructor(props){
    super(props);
    var curDate = new Date();
    var kendaraan;
    if ("kendaraan" in this.props){
      kendaraan = this.props.kendaraan.toJS();
    } else {
      kendaraan = {
        masaBerlakuSim: curDate,
      };
    }
    //console.log("### KENDARAAN DATA ###", kendaraan);

    this.state = {
      noPolisi: kendaraan.noPolisi,
      namaPengemudi: kendaraan.namaPengemudi,
      alamatPengemudi: kendaraan.alamatPengemudi,
      noSimPengemudi: kendaraan.noSimPengemudi,
      kodeJenisSim: kendaraan.kodeJenisSim,
      masaBerlakuSim: kendaraan.masaBerlakuSim,
      statusKendaraan: kendaraan.statusKendaraan,
      kodeJenis: kendaraan.kodeJenis,
      kodeGolongan: kendaraan.kodeGolongan,
      idKecelakaan: this.props.idKecelakaan,
      idAngkutanKecelakaan: kendaraan.idAngkutanKecelakaan,
      isKendaraanLoading: false,
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props !== nextProps){
      this.setState({...this.state,
        isKendaraanLoading: nextProps.isKendaraanLoading,
      });
    }
  }

  _surveyFocus(){
    console.log("Kendaraan Focus");
  }

  _surveyBlur(){
    console.log("Kendaraan Blur");
  }

  _onSelectStatusKendaraan(statusKendaraan){
    console.log("Status Kendaraan: " , statusKendaraan);
    this.setState({statusKendaraan: statusKendaraan.id});
  }

  _onSelectJenisKendaraan(jenisKendaraan){
    console.log("Jenis Kendaraan: " ,jenisKendaraan);
    this.setState({kodeJenis: jenisKendaraan.id});
    this.setState({kodeGolongan: jenisKendaraan.id.substring(0,1)});
  }
  _onSelectJenisSim(jenisSim){
    console.log("Jenis Sim: " ,jenisSim);
    this.setState({kodeJenisSim: jenisSim.id});
  }

  _save(){
    var payload = {
      noPolisi: this.state.noPolisi,
      namaPengemudi: this.state.namaPengemudi,
      alamatPengemudi: this.state.alamatPengemudi,
      statusKendaraan: this.state.statusKendaraan,
      kodeJenis: this.state.kodeJenis,
      kodeGolongan: this.state.kodeGolongan,
      idKecelakaan: this.state.idKecelakaan,
      idAngkutanKecelakaan: this.state.idAngkutanKecelakaan,
    }

    if(getEmptyField(payload) === 0){
      console.log("SUBMITTED");

      if(this.state.kodeJenisSim){
        payload = {
          ...payload,
          noSimPengemudi: this.state.noSimPengemudi,
          kodeJenisSim: this.state.kodeJenisSim,
          masaBerlakuSim: this.state.masaBerlakuSim,
        };
      }

      if(this.props.action === "ADD"){
        this.props.runAddKendaraan(payload);
      } else if(this.props.action === "EDIT"){
        this.props.runUpdateKendaraan(payload);
      }
      if(!this.props.isKendaraanLoading){
        //Actions.pop();
      }
    } else {
      console.log("NOT SUBMITTED - TIDAK LOLOS VALIDASI");
      Alert.alert(
        'Kendaraan Input Screen',
        'Selain Data SIM, semua field harus diisi !',
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
    // save data ... if successful then pop();
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

  _renderSaveButton(){
    return (
      <ResponsiveButton onPress={this._save.bind(this)}
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        iconName="save"
        iconStyle={styles.buttonIcon}
        text="Simpan"
        isLoading={this.state.isKendaraanLoading}>
      </ResponsiveButton>
    );
  }

	render() {
      var dataSim = null;
      if (this.state.kodeJenisSim){
        dataSim =
        <View>
          <View style={styles.row}>
            <FloatLabelTextInput
              ref='noSim'
              containerStyle={{margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
              inputStyle={{padding: 1, color: '#464646'}}
              floatingStyle={{color:'#464646',}}
              placeholder={"Nomor SIM"}
              placeholderTextColor='#919191'
              value={(this.state.noSimPengemudi) ? this.state.noSimPengemudi.toUpperCase() : ''}
              onChangeTextValue={text => this.setState({'noSimPengemudi':text})}
              autoCapitalize='characters'
              autoCorrect={false}
              noBorder={false}
              onSubmitEditing={() => dismissKeyboard()}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Masa Berlaku SIM</Text>
            <View style={styles.modalDatePickerRow}>
              <DatePicker
                style={{flex: 1}}
                date={(this.state.masaBerlakuSim) ? this.state.masaBerlakuSim : (new Date)}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this.setState({
                    masaBerlakuSim: date
                  });
                }}
                customStyles={styles}
              />
              </View>
          </View>
        </View>;
      }

	    return (
        <ScrollView keyboardShouldPersistTaps={true}
          style={styles.scrollView}
          scrollEventThrottle={200}
          contentInset={{top: 0}}>

          <View style={styles.container}>
            <View style={styles.category}>
              <Text style={styles.categoryLabel}>Data Kendaraan</Text>
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{ padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646'}}
                placeholder={"No Transportasi"}
                placeholderTextColor='#919191'
                value={this.state.noPolisi}
                onChangeTextValue={text => this.setState({ 'noPolisi': text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                ref='namaPengemudi'
                containerStyle={{margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Nama Pengemudi"}
                placeholderTextColor='#919191'
                value={this.state.namaPengemudi}
                onChangeTextValue={text => this.setState({ 'namaPengemudi': text.toUpperCase()} )}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                ref='alamatPengemudi'
                containerStyle={{margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 1, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Alamat Pengemudi"}
                placeholderTextColor='#919191'
                value={this.state.alamatPengemudi}
                onChangeTextValue={text => this.setState({ 'alamatPengemudi': text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>

            <View style={styles.row}>
            <Text style={styles.rowLabel}>Jenis SIM</Text>
            <ModalPicker
                data={JENIS_SIM}
                initValue="Jenis SIM"
                extractText={ (option) => option.desc }
                extractKey={ (option) => option.id }
                onChange={this._onSelectJenisSim.bind(this)} >
                <View style={styles.modalRow}>
                  <Text style={styles.rowInput}>{(this.state.kodeJenisSim) ? this._findDescbyId(JENIS_SIM, this.state.kodeJenisSim) : ''}</Text>
                  <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                </View>
            </ModalPicker>
            </View>

            {dataSim}

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status Kendaraan</Text>
              <ModalPicker
                  data={STATUS_KENDARAAN}
                  initValue="Status Kendaraan"
                  extractText={ (option) => option.desc }
                  extractKey={ (option) => option.id }
                  onChange={this._onSelectStatusKendaraan.bind(this)} >
                  <View style={styles.modalRow}>
                    <Text style={styles.rowInput}>{(this.state.statusKendaraan) ? this._findDescbyId(STATUS_KENDARAAN, this.state.statusKendaraan) : ''}</Text>
                    <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                  </View>
              </ModalPicker>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Jenis Kendaraan</Text>
                <ModalPicker
                  data={JENIS_KENDARAAN}
                  initValue="Jenis Kendaraan"
                  extractText={ (option) => option.desc }
                  extractKey={ (option) => option.id }
                  onChange={this._onSelectJenisKendaraan.bind(this)} >
                  <View style={styles.modalRow}>
                    <Text style={styles.rowInput}>{(this.state.kodeJenis) ? this._findDescbyId(JENIS_KENDARAAN, this.state.kodeJenis) : ''}</Text>
                    <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                  </View>
                </ModalPicker>
            </View>


            {this._renderSaveButton()}



          </View>
        </ScrollView>

      );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#e5e5e5',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: getCorrectShapeSizeForScreen(8),
    width: width - getCorrectShapeSizeForScreen(16),
    alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(16),
  },
  category: {
    borderBottomWidth: 2,
    borderColor: '#0087cd',
    margin: getCorrectShapeSizeForScreen(10),
    paddingBottom: getCorrectShapeSizeForScreen(3),
  },
  categoryLabel: {
    fontSize: getCorrectFontSizeForScreen(16),
    fontFamily: 'Roboto',
    color: '#464646',
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'column',
    //backgroundColor:'red',
    padding: getCorrectShapeSizeForScreen(5),
    //alignItems: 'center'
  },
  rowLabel: {
    left: getCorrectShapeSizeForScreen(10),
    fontSize: getCorrectFontSizeForScreen(11),
    fontFamily: 'Roboto-Light',
    color: '#464646',
  },
  rowInput: {
    flex: 1,
    left: getCorrectShapeSizeForScreen(5),
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#464646',
    fontFamily: 'Roboto',
    justifyContent: 'center'
  },
  rowModalPicker: {
    flexDirection: 'column',
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(3),
    marginTop: getCorrectShapeSizeForScreen(7),
  },
  buttonItem: {
    backgroundColor: '#66ae1e',
    height: getCorrectShapeSizeForScreen(30),
    width: width - getCorrectShapeSizeForScreen(32),
    marginLeft: getCorrectShapeSizeForScreen(15),
    marginRight: getCorrectShapeSizeForScreen(15),
    marginTop: getCorrectShapeSizeForScreen(15),
    marginBottom: getCorrectShapeSizeForScreen(5),
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
  modalRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#0087cd',
    padding: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(5),
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    justifyContent: 'center',
  },
  modalDatePickerRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#fff',
    padding: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(5),
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    justifyContent: 'center',
  },
  modalIcon: {
    color: '#0087cd',
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    marginRight: getCorrectShapeSizeForScreen(5),
  },
});

const mapStateToProps = (state) => {
  //console.log("MappingStateToProps");
  return {
    isKendaraanLoading: state.getIn(['lakaDetail', 'isLoadingListKendaraan']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runAddKendaraan,
    runUpdateKendaraan,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KendaraanEditScreen);
