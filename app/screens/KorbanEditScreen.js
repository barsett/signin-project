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
import ModalPicker from 'react-native-modal-picker'
import {runAddKorban, runEditKorban} from '../actions/LakaAction';

import FloatLabelTextInput from '../components/FloatingLabel';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import {
  JENIS_IDENTITAS,
  JENIS_KELAMIN,
  JENIS_STATUS_NIKAH
} from '../config/Reference.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, getEmptyField } from '../api/Common.js';
import ReferenceService from '../api/ReferenceService';
import dismissKeyboard from 'dismissKeyboard';
import ResponsiveButton from '../components/ResponsiveButton';

const JENIS_SIFAT_CEDERA = ReferenceService.findByDomainType('CIDERA_KORBAN');
const JENIS_STATUS_KORBAN = ReferenceService.findByDomainType('STATUS_KORBAN');
const JENIS_STATUS_PERTANGGUNGAN = ReferenceService.findByDomainType('JENIS_JAMINAN');
const JENIS_PEKERJAAN = ReferenceService.findByDomainType('JENIS_PEKERJAAN');

class KorbanEditScreen extends React.Component {
  constructor(props){
    super(props);
    var korban;
    if ("korban" in this.props){
      korban = this.props.korban.toJS();
    } else {
      korban = {
          jenisKelamin: 'L',
          jenisKelaminDesc: 'Pria',
      };
    }

    var kendaraanList = this._prepareKendaraanList();
    this.state = {
      nama: korban.nama,
      noIdentitas: korban.noIdentitas,
      jenisIdentitas: korban.jenisIdentitas,
      jenisKelamin: korban.jenisKelamin,
      jenisKelaminDesc: (korban.jenisKelamin === 'L' ? 'Pria' : 'Wanita'),
      umur: korban.umur,
      alamat: korban.alamat,
      noTelp: korban.noTelp,
      kodePekerjaan: korban.kodePekerjaan,
      pekerjaan: korban.pekerjaan,
      kodeSifatCidera: korban.kodeSifatCidera,
      cidera: korban.cidera,
      kodeStatusKorban: korban.kodeStatusKorban,
      statusKorban: korban.statusKorban,
      kodeJaminan: korban.kodeJaminan,
      jaminan: korban.jaminan,
      jenisPertanggungan: korban.jenisPertanggungan,
      idKecelakaan: this.props.idKecelakaan,
      statusNikah: korban.statusNikah,
      idKorbanKecelakaan: korban.idKorbanKecelakaan,
      idAngkutanKecelakaan: korban.idAngkutanKecelakaan,
      idAngkutanPenanggung: korban.idAngkutanPenanggung,
      kendaraan: korban.kendaraan,
      kendaraanPenanggung: korban.kendaraanPenanggung,
      flag: korban.flag,
      LIST_KENDARAAN: kendaraanList,
    };

  }

  componentWillReceiveProps(nextProps){
    if (this.props !== nextProps){
      this.setState({...this.state,
        isKorbanLoading: nextProps.isKorbanLoading,
      });
    }
  }

  _prepareKendaraanList(){
    var kendaraanList = this.props.kendaraan.toJS();
    var dataKendaraanList = [];
    for (var kendaraan in kendaraanList){
      var idKendaraan = kendaraanList[kendaraan].idAngkutanKecelakaan;
      var noPolisi = kendaraanList[kendaraan].noPolisi;
      var namaPengemudi = kendaraanList[kendaraan].namaPengemudi;
      var descKendaraan = noPolisi + " - " + namaPengemudi;
      var dataKendaraan = {
        id: idKendaraan,
        desc: descKendaraan,
      };
      dataKendaraanList.push(dataKendaraan);
    }
    return dataKendaraanList;
  }


  _surveyFocus(){
    console.log("Kendaraan Focus");
  }

  _surveyBlur(){
    console.log("Kendaraan Blur");
  }

  _onSelectPekerjaan(pekerjaan){
    console.log("Status Pekerjaan: " , pekerjaan);
    this.setState({
      kodePekerjaan: pekerjaan.id,
      pekerjaan: pekerjaan.desc,
    });
  }

  _onSelectStatusNikah(statusNikah){
    console.log("Jenis StatusNikah: " ,statusNikah);
    this.setState({
      statusNikah: statusNikah.id
    });
  }

  _onSelectJenisKelamin(jenisKelamin){
    console.log("Jenis Kelamin: " ,jenisKelamin);
    this.setState({
      jenisKelamin: jenisKelamin.id,
      jenisKelaminDesc: jenisKelamin.desc,
    });
  }

  _onSelectJenisIdentitas(jenisIdentitas){
    console.log("Jenis Identitas: " ,jenisIdentitas);
    this.setState({jenisIdentitas: jenisIdentitas.id});
  }

  _onSelectJenisSifatCedera(sifatCedera){
    console.log("Jenis sifatCedera: " ,sifatCedera);
    this.setState({
      kodeSifatCidera: sifatCedera.id,
      cidera: sifatCedera.desc,
    });
  }

  _onSelectJenisStatusKorban(statusKorban){
    console.log("Jenis statusKorban: " ,statusKorban);
    this.setState({
      kodeStatusKorban: statusKorban.id,
      statusKorban: statusKorban.id + " - " + statusKorban.desc,
    });
  }

  _onSelectJenisPertanggungan(pertanggungan){
    console.log("Jenis pertanggungan: " ,pertanggungan);
    this.setState({
      kodeJaminan: pertanggungan.id,
      jaminan: pertanggungan.desc,
      jenisPertanggungan: pertanggungan.id + " - " + pertanggungan.desc,
    });
  }

  _onSelectKendaraanBerada(kendaraan){
    console.log("Kendaraan korban berada: ", kendaraan);
    this.setState({
      idAngkutanKecelakaan: kendaraan.id,
      kendaraan: kendaraan.desc,
    })
  }

  _onSelectKendaraanPenjamin(kendaraan){
    console.log("Kendaraan penjamin: ", kendaraan);
    this.setState({
      idAngkutanPenanggung: kendaraan.id,
      kendaraanPenanggung: kendaraan.desc,
    })
  }

  _save(){
    var payload = {
      nama: this.state.nama,
      noIdentitas: this.state.noIdentitas,
      jenisIdentitas: this.state.jenisIdentitas,
      jenisKelamin: this.state.jenisKelamin,
      umur: this.state.umur,
      alamat: this.state.alamat,
      noTelp: this.state.noTelp,
      kodePekerjaan: this.state.kodePekerjaan,
      pekerjaan: this.state.pekerjaan,
      kodeSifatCidera: this.state.kodeSifatCidera,
      cidera: this.state.cidera,
      kodeStatusKorban: this.state.kodeStatusKorban,
      statusKorban: this.state.statusKorban,
      kodeJaminan: this.state.kodeJaminan,
      jaminan: this.state.jaminan,
      jenisPertanggungan: this.state.jenisPertanggungan,
      idKecelakaan: this.state.idKecelakaan,
      statusNikah: this.state.statusNikah,
      idKorbanKecelakaan: this.state.idKorbanKecelakaan,
      idAngkutanKecelakaan: this.state.idAngkutanKecelakaan,
      idAngkutanPenanggung: this.state.idAngkutanPenanggung,
      kendaraan: this.state.kendaraan,
      kendaraanPenanggung: this.state.kendaraanPenanggung,
    }

    if(getEmptyField(payload) === 0){
      console.log("SUBMITTED");
      if (this.props.action === "ADD"){
        payload.flag = 'N';
        this.props.runAddKorban(payload);
      } else if (this.props.action === "EDIT"){
        payload.flag = this.state.flag;
        this.props.runEditKorban(payload);
      }
    } else {
      console.log("NOT SUBMITTED - TIDAK LOLOS VALIDASI");
      Alert.alert(
        '',
        i18n.emptyField,
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

  _renderSaveButton(){
    return (
      <ResponsiveButton onPress={this._save.bind(this)}
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        iconName="save"
        iconStyle={styles.buttonIcon}
        text="Simpan"
        isLoading={this.state.isKorbanLoading}>
      </ResponsiveButton>
    );
  }

  render() {
      return (
        <ScrollView keyboardShouldPersistTaps={true}
          style={styles.scrollView}
          scrollEventThrottle={200}
          contentInset={{top: 0}}>

          <View style={styles.container}>
          <View style={styles.category}>
            <Text style={styles.categoryLabel}>Data Korban</Text>
          </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Nama Korban"}
                placeholderTextColor='#919191'
                value={this.state.nama}
                onChangeTextValue={text => this.setState({ 'nama':text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Jenis ID</Text>
              <ModalPicker
                        data={JENIS_IDENTITAS}
                        initValue="Jenis Identitas"
                        extractText={ (option) => option.desc }
                        extractKey={ (option) => option.id }
                        onChange={this._onSelectJenisIdentitas.bind(this)} >
                        <View style={styles.modalRow}>
                          <Text style={styles.rowInput}>{(this.state.jenisIdentitas) ? this.state.jenisIdentitas : ''}</Text>
                          <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                        </View>
              </ModalPicker>
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                ref='noIdentitas'
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"No Identitas"}
                placeholderTextColor='#919191'
                value={this.state.noIdentitas}
                onChangeTextValue={text => this.setState({ 'noIdentitas':text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                ref='umur'
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Umur"}
                placeholderTextColor='#919191'
                value={this.state.umur}
                keyboardType="numeric"
                onChangeTextValue={text => this.setState({'umur':text})}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Kelamin</Text>

              {/*
              <SegmentedControls
                options={ JENIS_KELAMIN }
                onSelection={ this._onSelectJenisKelamin.bind(this) }
                selectedOption={ this.state.jenisKelamin }
                separatorWidth={3}
                separatorTint={'#0087cd'}
                optionStyle= {{
                  fontSize: getCorrectFontSizeForScreen(12),
                  fontFamily: 'Roboto',
                  margin: getCorrectShapeSizeForScreen(2),
                  textAlignVertical: 'center',
                }}
                tint= {'#0087cd'}
                selectedTint= {'#000'}
                backTint= {'#fff'}
                containerStyle= {{
                  marginTop: getCorrectShapeSizeForScreen(5),
                  marginLeft: getCorrectShapeSizeForScreen(10),
                  marginRight: getCorrectShapeSizeForScreen(10),
                  borderWidth: 2,
                  borderColor: '#0087cd'
                }}
                extractText={ (option) => option.desc }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.id === b.id
                }}
              />
              */}

              <SegmentedControls
                tint= {'#0087cd'}
                selectedTint= {'white'}
                backTint= {'white'}
                optionStyle= {{
                  fontSize: getCorrectFontSizeForScreen(12),
                  fontWeight: 'normal',
                }}
                containerStyle= {{
                  borderWidth: 2,
                }}
                options={ JENIS_KELAMIN }
                allowFontScaling={ true } // default: true
                extractText={ (option) => option.desc }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.id === b.id;
                }}
                onSelection={ this._onSelectJenisKelamin.bind(this) }
                selectedOption={ {id: this.state.jenisKelamin, desc: this.state.jenisKelaminDesc} }
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status</Text>
              <ModalPicker
                        data={JENIS_STATUS_NIKAH}
                        initValue="Status"
                        extractText={ (option) => option.desc }
                        extractKey={ (option) => option.id }
                        onChange={this._onSelectStatusNikah.bind(this)} >
                        <View style={styles.modalRow}>
                          <Text style={styles.rowInput}>{(this.state.statusNikah) ? ReferenceService.findDescbyId(JENIS_STATUS_NIKAH, this.state.statusNikah) : ''}</Text>
                          <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                        </View>
              </ModalPicker>
            </View>

            <View style={styles.row}>
              <FloatLabelTextInput
                ref='alamat'
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Alamat"}
                placeholderTextColor='#919191'
                value={this.state.alamat}
                onChangeTextValue={text => this.setState({ 'alamat': text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                ref='noTelp'
                containerStyle={{ margin: getCorrectShapeSizeForScreen(5), padding: getCorrectShapeSizeForScreen(5)}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"No Telp"}
                placeholderTextColor='#919191'
                value={this.state.noTelp}
                onChangeTextValue={text => this.setState({'noTelp':text})}
                noBorder={false}
                keyboardType="numeric"
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Pekerjaan</Text>
                <ModalPicker
                          data={JENIS_PEKERJAAN}
                          initValue="Jenis Pekerjaan"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectPekerjaan.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kodePekerjaan) ? ReferenceService.findDescbyId(JENIS_PEKERJAAN, this.state.kodePekerjaan) : ''}</Text>
                            <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                          </View>
                </ModalPicker>
            </View>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryLabel}>Keterangan Kecelakaan</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Sifat Cedera</Text>
                <ModalPicker
                          data={JENIS_SIFAT_CEDERA}
                          initValue="Sifat Cedera"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectJenisSifatCedera.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kodeSifatCidera) ? ReferenceService.findDescbyId(JENIS_SIFAT_CEDERA, this.state.kodeSifatCidera) : ''}</Text>
                            <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                          </View>
                </ModalPicker>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Status Korban</Text>
                <ModalPicker
                          data={JENIS_STATUS_KORBAN}
                          initValue="Status Korban"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectJenisStatusKorban.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kodeStatusKorban) ? ReferenceService.findDescbyId(JENIS_STATUS_KORBAN, this.state.kodeStatusKorban) : ''}</Text>
                            <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                          </View>
                </ModalPicker>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Kendaraan Korban Berada</Text>
                <ModalPicker
                          data={this.state.LIST_KENDARAAN}
                          initValue="Kendaraan Korban Berada"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectKendaraanBerada.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kendaraan) ? this.state.kendaraan : ''}</Text>
                            <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                          </View>
                </ModalPicker>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Kendaran Penjamin</Text>
                <ModalPicker
                          data={this.state.LIST_KENDARAAN}
                          initValue="Kendaraan Penjamin"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectKendaraanPenjamin.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kendaraanPenanggung) ? this.state.kendaraanPenanggung : ''}</Text>
                            <Icon name="chevron-down" color="#0087cd" style={styles.modalIcon}/>
                          </View>
                </ModalPicker>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowLabel}>Jenis Pertanggungan</Text>
                <ModalPicker
                          data={JENIS_STATUS_PERTANGGUNGAN}
                          initValue="Jenis Pertanggungan"
                          extractText={ (option) => option.desc }
                          extractKey={ (option) => option.id }
                          onChange={this._onSelectJenisPertanggungan.bind(this)} >
                          <View style={styles.modalRow}>
                            <Text style={styles.rowInput}>{(this.state.kodeJaminan) ? ReferenceService.findDescbyId(JENIS_STATUS_PERTANGGUNGAN, this.state.kodeJaminan) : ''}</Text>
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
  subCategory: {
    marginTop: getCorrectShapeSizeForScreen(10),
    marginLeft: getCorrectShapeSizeForScreen(14),
  },
  subCategoryLabel: {
    fontSize: getCorrectFontSizeForScreen(13),
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
  rowModalPicker: {
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(5),
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(3),
  },
  rowLabel: {
    left: getCorrectShapeSizeForScreen(10),
    fontSize: getCorrectFontSizeForScreen(11),
    fontFamily: 'Roboto-Light',
    color: '#464646',
  },
  label: {
    fontSize: getCorrectFontSizeForScreen(11),
    marginBottom: getCorrectShapeSizeForScreen(5),
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
    isKorbanLoading: state.getIn(['lakaDetail', 'isLoadingListKorban']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runAddKorban,
    runEditKorban,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KorbanEditScreen);
