/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  PixelRatio,
  Dimensions,
  Image,
  TouchableOpacity,
  RefreshControl,
  InteractionManager,
  TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { runGetLakaDetail, runGetLakaListKorban, runGetLakaListKendaraan, } from '../actions/LakaAction';
import ReferenceService from '../api/ReferenceService';
import Autocomplete from 'react-native-autocomplete-input';
import LookupReferenceModal from '../components/LookupReferenceModal';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width,formatData, formatDate, formatDateTime } from '../api/Common.js';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { STATUS_LAKA, SIFAT_KECELAKAAN } from '../config/Reference.js';

class LakaDetailScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      lakaDataSource: {},
      isLoading: false,
    }
  }

  componentDidMount(){
    // load data laka detail
    InteractionManager.runAfterInteractions(() => {
      if (Object.keys(this.state.lakaDataSource).length === 0){
        // load data here
        this._reloadLakaDetail();
      }
    });
  }

  componentWillReceiveProps(nextProps){

    // LAKA DETAIL
    if (this.props.lakaDetail !== nextProps.lakaDetail){
      var dataLakaDetail = nextProps.lakaDetail.toJS();
      dataLakaDetail = dataLakaDetail.content[0];
      this.setState({
        lakaDataSource: dataLakaDetail,
        isLoading: nextProps.isLoading,
      });
    }
    else {
      this.setState({
        isLoading: nextProps.isLoading,
      });
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  _reloadLakaDetail = () =>{
    this.props.runGetLakaDetail(this.props.idLaka, this.props.flagIrsms);
  }


  render() {
    const INSTANSI_PEMBUAT_LK = ReferenceService.findByKeyword('INSTANSI_PEMBUAT_LK', '');
    const KASUS_KECELAKAAN = ReferenceService.findByKeyword('KASUS_KECELAKAAN', '');
    var button = null;
    if (this.props.roles === 'SURVEYOR' && this.props.isEditable && this.state.lakaDataSource.flag === 'N') {
      button = <View style={styles.row}>
        <Button
          style={styles.buttonText}
          containerStyle={styles.buttonItem}
          onPress= {() => {Actions.lakaEdit({laka: this.state.lakaDataSource})}}>
          <Icon style={styles.buttonIcon} name="pencil" /> Ubah
        </Button>
      </View>
    }

    return (
      <View style={{flex:1}}>
        <ScrollView pointerEvents="box-none"
          style={styles.scrollView}
          scrollEventThrottle={200}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._reloadLakaDetail}
              tintColor="#666699"
              title="Loading..."
              titleColor="#bf0000"
              colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
              progressBackgroundColor="#ffffcc" //Circle color
            />}
          contentInset={{top: 0}}>
          <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Kecelakaan ID</Text>
                <Text style={styles.input}>{this.state.lakaDataSource.idKecelakaan}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Asal Berkas</Text>
                <Text style={styles.input}>{ReferenceService.findByDomainTypeAndId("LOKET_CABANG_JR", this.state.lakaDataSource.asalBerkas)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Instansi yang Menangani</Text>
              <Text style={styles.input}>{ReferenceService.findByDomainTypeAndId("INSTANSI", this.state.lakaDataSource.kodeInstansi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lokasi Kejadian</Text>
              <Text style={styles.input}>{ReferenceService.findByDomainTypeAndId("LOKASI", this.state.lakaDataSource.kodeLokasi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Wilayah dari Samsat/Kantor</Text>
              <Text style={styles.input}>{ReferenceService.findByDomainTypeAndId("SAMSAT", this.state.lakaDataSource.kodeWilayah)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Instansi Pembuat Laporan</Text>
              <Text style={styles.input}>{ReferenceService.findDescbyId(INSTANSI_PEMBUAT_LK, this.state.lakaDataSource.statusTransisi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Nomor Laporan</Text>
              <Text style={styles.input}>{formatData(this.state.lakaDataSource.noLaporanPolisi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tanggal Laporan</Text>
              <Text style={styles.input}>{formatDate(this.state.lakaDataSource.tglLaporanPolisi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Petugas Pembuat Laporan</Text>
              <Text style={styles.input}>{formatData(this.state.lakaDataSource.namaPetugas)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tanggal & Waktu Kejadian</Text>
              <Text style={styles.input}>{formatDateTime((new Date(this.state.lakaDataSource.tglKejadian)))}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Keterangan TKP</Text>
              <Text style={styles.input}>{formatData(this.state.lakaDataSource.deskripsiLokasi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Kasus Kecelakaan</Text>
              <Text style={styles.input}>{ReferenceService.findDescbyId(KASUS_KECELAKAAN, this.state.lakaDataSource.kodeKasusKecelakaan)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sifat Kecelakaan</Text>
              <Text style={styles.input}>{ReferenceService.findDescbyId(SIFAT_KECELAKAAN, this.state.lakaDataSource.sifatKecelakaan)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Uraian Singkat Kejadian</Text>
              <Text style={styles.input}>{formatData(this.state.lakaDataSource.deskripsiKecelakaan)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status Data Laka</Text>
              <Text style={styles.input}>{ReferenceService.findDescbyId(STATUS_LAKA, this.state.lakaDataSource.statusLaporanPolisi)}</Text>
            </View>
            {button}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCorrectShapeSizeForScreen(10),
    bottom: getCorrectShapeSizeForScreen(8),
    width: width - getCorrectShapeSizeForScreen(16),
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  scrollView: {
    backgroundColor: '#e5e5e5',
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
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  buttonItem: {
    backgroundColor: '#24abe2',
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


});



const mapStateToProps = (state) => {
  return {
    lakaDetail: state.getIn(['lakaDetail', 'lakaDetail']),
    isLoading: state.getIn(['lakaDetail', 'isLoadingLakaDetail']),
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runGetLakaDetail
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(LakaDetailScreen);
