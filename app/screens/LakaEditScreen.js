/* @flow */
'use strict'
import React, { Component } from 'react';
import Realm from 'realm';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  PixelRatio,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { runGetLakaDetail, runGetLakaListKorban, runGetLakaListKendaraan, runUpdateLaka} from '../actions/LakaAction';
import ReferenceService from '../api/ReferenceService';
import autoCorrect from 'react-native-autocomplete-input';
import LookupReferenceModal from '../components/LookupReferenceModal';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, } from '../api/Common.js';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import FloatLabelTextInput from '../components/FloatingLabel';
import ModalPicker from 'react-native-modal-picker';
import DatePicker from 'react-native-datepicker';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';
import TextAreaInputModal from '../components/TextAreaInputModal';
/*butuh import instansi pembuat laporan */
import { JENIS_STATUS_NIKAH, STATUS_LAKA, SIFAT_KECELAKAAN } from '../config/Reference.js';
import dismissKeyboard from 'dismissKeyboard';
import ResponsiveButton from '../components/ResponsiveButton';

const ReferenceSchema = {
  name: 'Reference',
  properties: {
    refCode: { type: 'string', indexed: true },
    refDescription: { type: 'string', indexed: true },
    domainType: { type: 'string', indexed: true }
  },
};

const realm = new Realm({schema: [ReferenceSchema]});

class DataLaka extends React.Component {

  constructor(props){
    super(props);
    //console.log("### CONSTRUCTOR ###");
    //console.log(this.props);
    /*
    this.state = {
      lakaDataSource: {},
      isLakaLoading: false,
      statusLaporanPolisi: null,
      hasilSurvey: null,
    }
    */
    var detailLaka = this.props.laka;
    this.state = {
      asalBerkas: detailLaka.asalBerkas,
      kodeInstansi: detailLaka.kodeInstansi,
      kodeLokasi: detailLaka.kodeLokasi,
      kodeWilayah: detailLaka.kodeWilayah,
      noLaporanPolisi: detailLaka.noLaporanPolisi,
      namaPetugas: detailLaka.namaPetugas,
      tglLaporanPolisi: detailLaka.tglLaporanPolisi,
      tglKejadian: detailLaka.tglKejadian,
      deskripsiLokasi: detailLaka.deskripsiLokasi,
      kodeKasusKecelakaan: detailLaka.kodeKasusKecelakaan,
      sifatKecelakaan: detailLaka.sifatKecelakaan,
      sifatKecelakaanDesc: (detailLaka.sifatKecelakaan === 'NR' ? 'Normal' : 'Tabrak Lari'),
      deskripsiKecelakaan: detailLaka.deskripsiKecelakaan,
      statusLaporanPolisi: detailLaka.statusLaporanPolisi,
      statusLaporanPolisiDesc: (detailLaka.statusLaporanPolisi === 'Y' ? 'Laporan Kepolisian' : 'Data Mutasi'),
      idKecelakaan: detailLaka.idKecelakaan,
      statusTransisi: detailLaka.statusTransisi,
      isLoading: false,
    }
    //this._getRefDescription();
    var curDate = new Date();
    var criteria;
    if ('criteria' in this.props){
      criteria = this.props.criteria;
    } else {
      criteria = {
        tanggalKejadianText: curDate.getFullYear()+"-"+(curDate.getMonth()+1)+"-"+curDate.getDate(),
        tanggalKejadianDate: curDate,
        tanggalLaporanText: curDate.getFullYear()+"-"+(curDate.getMonth()+1)+"-"+curDate.getDate(),
        tanggalLaporanDate: curDate,
      };
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props !== nextProps){
      this.setState({...this.state,
        isLoading: nextProps.isLoading,
      });
    }
  }

  /* 28 Juni 2016 - dikomen karena ga dibutuhkan
  _renderListViewData(data_list){

    let data = [];
    data_list.map((data_rec) => {
      data.push(data_rec)
    });
    return data;

  }
  */

  /*
  componentDidMount(){
    console.log("componentDidMount .. ");
    console.log("### COMPONENT DID MOUNT ###");
    console.log(this.state)

    // load data laka detail
    if (Object.keys(this.state.lakaDataSource).length === 0){
      // load data here
      this._reloadLakaDetail();
    }
  }
  */

  /*
  componentWillReceiveProps(nextProps){

    console.log("### COMPONENT WILL RECEIVE NEW PROPS ###");
    console.log("### NEXT PROPS ###");
    console.log(nextProps);

    // LAKA DETAIL
    if (this.props.lakaDetail !== nextProps.lakaDetail){
      console.log("### COMPONENT WILL RECEIVE NEW PROPS ###");
      console.log("Receive new laka detail data");
      var dataLakaDetail = nextProps.lakaDetail;
      this.setState({...this.state,
        lakaDataSource: dataLakaDetail,
        isLakaLoading: true,
      });
    }
    else {
      console.log("Not receive new laka detail data");
    }


  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }
  */

  /*
  _reloadLakaDetail(){
    this.props.runGetLakaDetail(this.props.idLaka);
  }
  */

  _showInstansi = () => {
    //this.refs.instansiModal.open();
    this.props.referenceModal().openFromRoot("Instansi", "INSTANSI", this._setInstansi.bind(this));
  }

  _showLokasi = () => {
    //this.refs.lokasiModal.open();
    this.props.referenceModal().openFromRoot("Lokasi Kejadian", "LOKASI", this._setLokasi.bind(this));
  }

  _showSamsat = () => {
    //this.refs.samsatModal.open();
    this.props.referenceModal().openFromRoot("Wilayah Samsat", "SAMSAT", this._setSamsat.bind(this));
  }

  _showAsalBerkas = () => {
    //this.refs.asalBerkasModal.open();
    this.props.referenceModal().openFromRoot("Asal Berkas", "LOKET_CABANG_JR", this._setAsalBerkas.bind(this));

  }

  _setInstansi = (instansi) => {
    console.log("Instansi: ", instansi);
    this.setState({kodeInstansi: instansi.id,})
  }

  _setLokasi = (lokasi) => {
    console.log("Lokasi: ", lokasi);
    this.setState({kodeLokasi: lokasi.id,})
  }

  _setSamsat = (samsat) => {
    console.log("Samsat: ", samsat);
    this.setState({kodeWilayah: samsat.id,})
  }

  _setAsalBerkas = (kantor) => {
    console.log("Asal Berkas[BEFORE]: ", kantor);
    this.setState({asalBerkas: kantor.id,});
    console.log("Asal Berkas[AFTER]: ", this.state.asalBerkas);
  }

  _onSelectKasusKecelakaan = (kasusKecelakaan) => {
    console.log("Kasus Kecelakaan: " ,kasusKecelakaan);
    this.setState({kodeKasusKecelakaan: kasusKecelakaan.id});
  }

  _onSelectStatusLaka = (statusLaporanPolisi) => {
    console.log("Status Data Laka: " ,statusLaporanPolisi);
    this.setState({
      statusLaporanPolisi: statusLaporanPolisi.id,
      statusLaporanPolisiDesc: statusLaporanPolisi.desc,
    });
  }

  _onSelectSifatKecelakaan = (sifatKecelakaan) => {
    console.log("Sifat Kecelakaan: ", sifatKecelakaan);
    this.setState({
      sifatKecelakaan: sifatKecelakaan.id,
      sifatKecelakaanDesc: sifatKecelakaan.desc,
    });
  }

  _onSelectInstansiPembuatLk = (instansiPembuatLk) => {
    console.log("Instansi Pembuat Laporan Kecelakaan: ", instansiPembuatLk);
    this.setState({statusTransisi: instansiPembuatLk.id});
  }

  _onKeteranganTKPFocus(){
    console.log("Keterangan TKP focus");
    //this.refs.keteranganTKP.open();
    this.props.textInputModal().openFromRoot("Keterangan TKP", this.state.deskripsiLokasi, this._setDeskripsiLokasi.bind(this), this._cancelDeskripsiLokasi.bind(this));

  }

  _onUraianSingkatFocus(){
    console.log("Uraian focus");
    //this.refs.uraianSingkat.open();
    this.props.textInputModal().openFromRoot("Uraian Singkat Kejadian", this.state.deskripsiKecelakaan, this._setDeskripsiKecelakaan.bind(this), this._cancelDeskripsiKecelakaan.bind(this));
  }

  _setDeskripsiLokasi(deskripsi){
    console.log("deskripsiLokasi: " + deskripsi);
    this.setState({deskripsiLokasi: deskripsi.toUpperCase()});
  }

  _setDeskripsiKecelakaan(deskripsi){
    console.log("deskripsiKecelakaan: " + deskripsi);
    this.setState({deskripsiKecelakaan: deskripsi.toUpperCase()});
  }

  _cancelDeskripsiLokasi(deskripsi){
    console.log("deskripsiLokasi: " + deskripsi);
  }

  _cancelDeskripsiKecelakaan(deskripsi){
    console.log("deskripsiKecelakaan: " + deskripsi);
  }

  _save(){
    console.log("Saving... ", this.state);
    this.props.runUpdateLaka(this.state);
  }

  _renderSaveButton(){
    return (
      <ResponsiveButton onPress={this._save.bind(this)}
        style={styles.buttonText}
        containerStyle={styles.buttonItem}
        iconName="save"
        iconStyle={styles.buttonIcon}
        text="Simpan"
        isLoading={this.state.isLoading}>
      </ResponsiveButton>
    );
  }

  render() {
    //console.log("### LAKA EDIT SCREEN ###");
    //console.log(this.props.lakaDetail.toJS());
    // tinggal pake atribut2 dari objek detail laka buat nampilin datanya
    var detailLaka = this.props.lakaDetail.toJS();
    //const data = ReferenceService.findByKeyword('INSTANSI', this.state.asalBerkas);
    const INSTANSI_PEMBUAT_LK = ReferenceService.findByKeyword('INSTANSI_PEMBUAT_LK', '');
    const KASUS_KECELAKAAN = ReferenceService.findByKeyword('KASUS_KECELAKAAN', '');
    const {asalBerkas} = this.state;

    return (
      <View style={{flex:1}}>
        <ScrollView keyboardShouldPersistTaps={true}
          style={styles.scrollView}
          scrollEventThrottle={200}
          contentInset={{top: 0}}>
          <View style={styles.container}>
            <View style={styles.rowModalPicker}>
            <Text style={styles.label}>Asal Berkas</Text>
              <TouchableHighlight onPress={this._showAsalBerkas} underlayColor={'transparent'}>
              <View style={styles.uraianContainer}>
                <Text style={styles.uraianText}>{(this.state.asalBerkas) ? ReferenceService.findByDomainTypeAndId("LOKET_CABANG_JR", this.state.asalBerkas) : "Cari..."}</Text>
              </View>
              </TouchableHighlight>
            </View>
            <View style={styles.rowModalPicker}>
            <Text style={styles.label}>Instansi yang Menangani</Text>
              <TouchableHighlight onPress={this._showInstansi} underlayColor={'transparent'}>
              <View style={styles.uraianContainer}>
                <Text style={styles.uraianText}>{(this.state.kodeInstansi) ? ReferenceService.findByDomainTypeAndId("INSTANSI", this.state.kodeInstansi) : "Cari..."}</Text>
              </View>
              </TouchableHighlight>
            </View>
            <View style={styles.rowModalPicker}>
            <Text style={styles.label}>Lokasi Kejadian</Text>
              <TouchableHighlight onPress={this._showLokasi} underlayColor={'transparent'}>
                <View style={styles.uraianContainer}>
                  <Text style={styles.uraianText}>{(this.state.kodeLokasi) ? ReferenceService.findByDomainTypeAndId("LOKASI", this.state.kodeLokasi) : "Cari..."}</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.rowModalPicker}>
            <Text style={styles.label}>Wilayah dari Samsat/Kantor</Text>
              <TouchableHighlight onPress={this._showSamsat} underlayColor={'transparent'}>
                <View style={styles.uraianContainer}>
                <Text style={styles.uraianText}>{(this.state.kodeWilayah) ? ReferenceService.findByDomainTypeAndId("SAMSAT", this.state.kodeWilayah) : "Cari..."}</Text>
              </View>
              </TouchableHighlight>
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Instansi Pembuat Laporan</Text>
              <ModalPicker
                  data={INSTANSI_PEMBUAT_LK}
                  initValue="Status"
                  extractText={ (option) => option.desc }
                  extractKey={ (option) => option.id }
                  onChange={this._onSelectInstansiPembuatLk.bind(this)} >
                  <View style={styles.modalRow}>
                    <Text style={styles.input}>{(this.state.statusTransisi) ? ReferenceService.findDescbyId(INSTANSI_PEMBUAT_LK, this.state.statusTransisi) : ''}</Text>
                    <Icon name="chevron-down" color="#24abe2" style={styles.modalIcon}/>
                  </View>
              </ModalPicker>
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                containerStyle={{ margin: getCorrectShapeSizeForScreen(6), paddingTop: getCorrectShapeSizeForScreen(8),}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Nomor Laporan"}
                placeholderTextColor='#919191'
                value={this.state.noLaporanPolisi}
                onChangeTextValue={text => this.setState({ 'noLaporanPolisi': text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.row}>
              <FloatLabelTextInput
                containerStyle={{ margin: getCorrectShapeSizeForScreen(6), paddingTop: getCorrectShapeSizeForScreen(8),}}
                inputStyle={{padding: 0, color: '#464646'}}
                floatingStyle={{color:'#464646',}}
                placeholder={"Petugas Pembuat Laporan"}
                placeholderTextColor='#919191'
                value={this.state.namaPetugas}
                onChangeTextValue={text => this.setState({ 'namaPetugas': text.toUpperCase() })}
                autoCapitalize='characters'
                autoCorrect={false}
                noBorder={false}
                onSubmitEditing={() => dismissKeyboard()}
              />
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Tanggal Laporan</Text>
              <DatePicker
                style={{marginTop: getCorrectShapeSizeForScreen(3), width: width - getCorrectShapeSizeForScreen(50), height: getCorrectShapeSizeForScreen(25)}}
                date={this.state.tglLaporanPolisi}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  var dateArr = date.split('-');
                  this.setState({
                    //tglLaporanPolisi: new Date(dateArr[0], dateArr[1]-1, dateArr[2])
                    tglLaporanPolisi: date
                  });
                }}
                customStyles={styles}
              />
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Tanggal & Waktu Kejadian</Text>
              <DatePicker
                style={{marginTop: getCorrectShapeSizeForScreen(3), width: width - getCorrectShapeSizeForScreen(50), height: getCorrectShapeSizeForScreen(25)}}
                date={this.state.tglKejadian}
                mode="datetime"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  var dateArr = date.split('-');
                  this.setState({
                    //tglKejadian: new Date(dateArr[0], dateArr[1]-1, dateArr[2])
                    tglKejadian: date
                  });
                }}
                customStyles={styles}
              />
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Keterangan TKP</Text>
              <TouchableOpacity onPress={this._onKeteranganTKPFocus.bind(this)}>
                <View style={styles.uraianContainer}>
                    <Text style={styles.uraianText}>{(this.state.deskripsiLokasi) ? this.state.deskripsiLokasi.toUpperCase() : "Ketik..."}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Kasus Kecelakaan</Text>
              <ModalPicker
                  data={KASUS_KECELAKAAN}
                  initValue="Status"
                  extractText={ (option) => option.desc }
                  extractKey={ (option) => option.id }
                  onChange={this._onSelectKasusKecelakaan.bind(this)} >
                  <View style={styles.modalRow}>
                    <Text style={styles.input}>{(this.state.kodeKasusKecelakaan) ? ReferenceService.findDescbyId(KASUS_KECELAKAAN, this.state.kodeKasusKecelakaan) : ''}</Text>
                    <Icon name="chevron-down" color="#24abe2" style={styles.modalIcon}/>
                  </View>
              </ModalPicker>
            </View>
            <View style={styles.rowModalPicker}>
            <Text style={styles.label}>Sifat Kecelakaan</Text>
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
                options={ SIFAT_KECELAKAAN }
                allowFontScaling={ true } // default: true
                extractText={ (option) => option.desc }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.id === b.id;
                }}
                onSelection={ this._onSelectSifatKecelakaan.bind(this) }
                selectedOption={ {id: this.state.sifatKecelakaan, desc: this.state.sifatKecelakaanDesc} }
              />
            </View>
            {/*<ModalPicker
                data={SIFAT_KECELAKAAN}
                initValue="Status"
                extractText={ (option) => option.desc }
                extractKey={ (option) => option.id }
                onChange={this._onSelectSifatKecelakaan.bind(this)} >
                <View style={styles.modalRow}>
                  <Text style={styles.input}>{(this.state.sifatKecelakaan) ? ReferenceService.findDescbyId(SIFAT_KECELAKAAN, this.state.sifatKecelakaan) : ''}</Text>
                  <Icon name="chevron-down" color="#24abe2" style={styles.modalIcon}/>
                </View>
            </ModalPicker>*/}
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Uraian Singkat Kejadian</Text>
              <TouchableOpacity onPress={this._onUraianSingkatFocus.bind(this)}>
                <View style={styles.uraianContainer}>
                    <Text style={styles.uraianText}>{(this.state.deskripsiKecelakaan) ? this.state.deskripsiKecelakaan.toUpperCase() : "Ketik..."}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.rowModalPicker}>
              <Text style={styles.label}>Status Data Laka</Text>

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
                  options={ STATUS_LAKA }
                  allowFontScaling={ true } // default: true
                  extractText={ (option) => option.desc }
                  testOptionEqual={ (a, b) => {
                    if (!a || !b) {
                      return false;
                    }
                    return a.id === b.id;
                  }}
                  onSelection={ this._onSelectStatusLaka.bind(this) }
                  selectedOption={ {id: this.state.statusLaporanPolisi, desc: this.state.statusLaporanPolisiDesc} }
                />
              </View>
              {/*<SegmentedControls
                options={ STATUS_LAKA }
                onSelection={ this._onSelectStatusLaka.bind(this) }
                selectedOption={ this.state.statusLaporanPolisi }
                separatorWidth={getCorrectShapeSizeForScreen(2)}
                separatorTint={'#0087cd'}
                optionStyle= {{
                  fontSize: getCorrectFontSizeForScreen(12),
                  fontFamily: 'Roboto',
                  margin: getCorrectShapeSizeForScreen(2),
                  textAlignVertical: 'center',
                  flexDirection: 'column',
                  flex: 1,
                }}
                tint= {'#0087cd'}
                selectedTint= {'#ffffff'}
                backTint= {'#ffffff'}
                containerStyle= {{
                  marginTop: getCorrectShapeSizeForScreen(5),
                  borderWidth: 2,
                  borderColor: '#0087cd',
                }}
                extractText={ (option) => option.desc }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.id === b.id;
                }}
              />*/}

            {this._renderSaveButton()}
          </View>
        </ScrollView>
        {/*<TextAreaInputModal ref="keteranganTKP" title="Keterangan TKP" textData={this.state.deskripsiLokasi} onSubmit={this._setDeskripsiLokasi.bind(this)} onCancel={this._cancelDeskripsiLokasi.bind(this)}/>
        <TextAreaInputModal ref="uraianSingkat" title="Uraian Singkat Kejadian" textData={this.state.deskripsiKecelakaan} onSubmit={this._setDeskripsiKecelakaan.bind(this)} onCancel={this._cancelDeskripsiKecelakaan.bind(this)}/>
        <LookupReferenceModal ref="instansiModal" onSelection={this._setInstansi.bind(this)} domain="INSTANSI" title="Instansi"/>
        <LookupReferenceModal ref="lokasiModal" onSelection={this._setLokasi.bind(this)} domain="LOKASI" title="Lokasi Kejadian"/>
        <LookupReferenceModal ref="samsatModal" onSelection={this._setSamsat.bind(this)} domain="SAMSAT" title="Wilayah Samsat"/>
        <LookupReferenceModal ref="asalBerkasModal" onSelection={this._setAsalBerkas.bind(this)} domain="LOKET_CABANG_JR" title="Asal Berkas"/>*/}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCorrectShapeSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(8),
    marginTop: getCorrectShapeSizeForScreen(8),
    width: width - getCorrectShapeSizeForScreen(16),
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  scrollView: {
    backgroundColor: '#e5e5e5',
  },
  rowModal: {
    flexDirection: 'column',
    borderColor: '#000',
    borderBottomWidth: 1,
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(7),
  },
  rowModalPicker: {
    flexDirection: 'column',
    marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(3),
    marginTop: getCorrectShapeSizeForScreen(7),
  },
  row: {
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(5),
  },
  label: {
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(10),
    marginBottom: getCorrectShapeSizeForScreen(3),
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    marginBottom: getCorrectShapeSizeForScreen(2),

  },
  buttonItem: {
    backgroundColor: '#66ae1e',
    height: getCorrectShapeSizeForScreen(30),
    width: width - getCorrectShapeSizeForScreen(32),
    marginLeft: getCorrectShapeSizeForScreen(15),
    marginRight: getCorrectShapeSizeForScreen(15),
    marginTop: getCorrectShapeSizeForScreen(15),
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
  autoInput: {
   color: '#464646',
   fontSize: getCorrectFontSizeForScreen(12),
   fontFamily: 'Roboto',
   textAlignVertical: 'center',
   marginTop: getCorrectShapeSizeForScreen(6),
  },
  autoInputContainer: {
    backgroundColor: '#fff',
    borderColor: '#464646',
    borderWidth: 1,
    paddingLeft: getCorrectShapeSizeForScreen(5),
    margin: 0,
    flexDirection: 'column',
  },
  autoContainer: {
    backgroundColor: '#fff',
  },
  modalRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#0087cd',
    padding: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(3),
    justifyContent: 'center',
  },
  modalIcon: {
    color: '#0087cd',
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    marginRight: getCorrectShapeSizeForScreen(5),
  },
  dateText: {
      fontSize: getCorrectFontSizeForScreen(12),
  },
  dateField:{
    //backgroundColor: 'red',
    //margin: 5,
    padding: getCorrectShapeSizeForScreen(5),
  },
  tanggalKejadian: {
    color: '#464646',
    paddingLeft: getCorrectShapeSizeForScreen(5),
  },
  uraianContainer: {
    borderColor: '#0087cd',
    borderWidth: 2,
    padding: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(3),
    marginBottom: getCorrectShapeSizeForScreen(5),
    backgroundColor: '#ffffff',
  },
  uraianText: {
    flex: 1,
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
});



const mapStateToProps = (state) => {
  return {
    lakaDetail: state.getIn(['lakaDetail', 'lakaDetail']),
    isLoading: state.getIn(['lakaDetail', 'isLoadingLakaDetail']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runGetLakaDetail,
    runUpdateLaka,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(DataLaka);
