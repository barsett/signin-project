/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  PixelRatio,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { MKSpinner } from 'react-native-material-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { runSantunanDetail } from '../actions/SantunanAction';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, formatDate } from '../api/Common';

class SantunanPengajuan extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
      isLoading: false,
    }

    this._numberWithCommas = this._numberWithCommas.bind(this);
  }

  componentDidMount(){
    //console.log("componentDidMount .. ");
    //console.log(this.state)
    // load data laka detail
    if (Object.keys(this.state.dataSource).length === 0){
      // load data here
      this.state.isLoading=true;
      this._reloadSantunanDetail();
      this.state.isLoading=false;
    }
  }

  componentWillReceiveProps(nextProps){

    console.log(nextProps);

    // santunan Detail
    if (this.props.santunanDetail !== nextProps.santunanDetail){
      //console.log("Receive new santunan detail data", nextProps );
      var dataSantunanDetail = nextProps.santunanDetail;
      this.setState({...this.state,
        dataSource: dataSantunanDetail,
        isLoading: nextProps.isLoading,
      });
    }
    else {
      console.log("Not receive new santunan detail data");

      this.setState({...this.state,
        isLoading: nextProps.isLoading,
      });
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  _reloadSantunanDetail(){
    console.log("No Berkas Santunan 2:", this.props.noBerkas);
    this.props.runSantunanDetail(this.props.noBerkas);
  }

  _numberWithCommas(lbl) {
    if (lbl === ""){
      return lbl;
    }
    else{
      return ": Rp. " + lbl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  render() {
    var santunanArray = this.props.santunanDetail.toJS();
    var santunanDetail;
    console.log("isLoading State Render:", this.state.isLoading);

    if (santunanArray.length === 0){
      santunanDetail = {};
    }
    else {
      santunanDetail = santunanArray[0];
    }

    var content = santunanArray.length === 0 ?
      <NoTask
        isLoading={this.state.isLoading} onRefresh={this._reloadSantunanDetail}
      /> :
      <ScrollView pointerEvents="box-none"
        style={styles.scrollView}
        scrollEventThrottle={200}
        contentInset={{top: 0}}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nomor Berkas</Text>
            <Text style={styles.rowInput}>{santunanDetail.noBerkas}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Diajukan Di</Text>
            <Text style={styles.rowInput}>{santunanDetail.diajukan}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tanggal Pengajuan</Text>
            <Text style={styles.rowInput}>{formatDate(santunanDetail.tglPengajuan)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Jaminan Pembayaran</Text>
            <Text style={styles.rowInput}>{santunanDetail.jaminan}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>NIK</Text>
            <Text style={styles.rowInput}>{santunanDetail.nik}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nama Korban</Text>
            <Text style={styles.rowInput}>{santunanDetail.namaKorban}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Alamat</Text>
            <Text style={styles.rowInput}>{santunanDetail.alamatKorban}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sifat Cedera</Text>
            <Text style={styles.rowInput}>{santunanDetail.cideraDesc}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Jumlah Pengajuan</Text>
            <Text style={styles.rowInput}>{santunanDetail.lblAtas} {this._numberWithCommas(santunanDetail.lblPengajuanAtas)}</Text>
            <Text style={styles.rowInput}>{santunanDetail.lblBawah} {this._numberWithCommas(santunanDetail.lblPengajuanBawah)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Jumlah Pembayaran</Text>
            <Text style={styles.rowInput}>{santunanDetail.lblAtas} {this._numberWithCommas(santunanDetail.lblBayarAtas)}</Text>
            <Text style={styles.rowInput}>{santunanDetail.lblBawah} {this._numberWithCommas(santunanDetail.lblBayarBawah)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nama Pemohon</Text>
            <Text style={styles.rowInput}>{santunanDetail.namaPemohon}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Hubungan</Text>
            <Text style={styles.rowInput}>{santunanDetail.hubunganDesc}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Alamat</Text>
            <Text style={styles.rowInput}>{santunanDetail.alamatPemohon}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status & Posisi Berkas</Text>
            <Text style={styles.rowInput}>{santunanDetail.statusProsesDesc}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Penyelesaian</Text>
            <Text style={styles.rowInput}>{santunanDetail.penyelesaian}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tanggal Penyelesaian</Text>
            <Text style={styles.rowInput}>{formatDate(santunanDetail.tglPenyelesaian)}</Text>
          </View>
        </View>
      </ScrollView>;

      return content;
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
  row: {
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(5),
  },
  rowLabel: {
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(10),
  },
  rowInput: {
    flex: 1,
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  scrollSpinner: {
    alignSelf: 'center',
  },
  noTasksText: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(16),
    fontFamily: 'Roboto',
  },
  centerText: {
    marginTop: getCorrectShapeSizeForScreen(8),
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: getCorrectShapeSizeForScreen(60),
    //backgroundColor: '#ffffff',
    //height: height,
    //width: width - getCorrectShapeSizeForScreen(15),
  },
});

class NoTask extends React.Component {
    render() {
      var text = (this.props.isLoading) ? text = i18n.loading : i18n.noMatchFound;

      return (
        <ScrollView style={styles.bg}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.onRefresh}
              tintColor="#666699"
              title="Loading..."
              titleColor="#bf0000"
              colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
              progressBackgroundColor="#ffffcc" //Circle color
            />
          }
          >
          <View style={styles.centerText}>
            <Text style={styles.noTasksText}> {text} </Text>
          </View>
        </ScrollView>

      );
    }
}

const mapStateToProps = (state) => {
  return {
    santunanDetail: state.getIn(['santunanDetail','dataSource']),
    isLoading: state.getIn(['santunanDetail','isLoading']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runSantunanDetail,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SantunanPengajuan);
