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
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, formatDate, formatDateTime } from '../api/Common';

class SantunanKecelakaan extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
      isLoading: false,
    }
  }

  componentDidMount(){
    //console.log("componentDidMount .. ");
    //console.log(this.state)
    // load data laka detail
    if (Object.keys(this.state.dataSource).length === 0){
      // load data her
      this.state.isLoading=true;
      this._reloadSantunanDetail();
      this.state.isLoading=false;
    }
  }

  componentWillReceiveProps(nextProps){

    //console.log(nextProps);

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
    console.log("No Berkas Santunan 1:", this.props.noBerkas);
    this.props.runSantunanDetail(this.props.noBerkas);
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
            <Text style={styles.rowLabel}>Nomor Laporan</Text>
            <Text style={styles.rowInput}>{santunanDetail.noLaporanPolisi}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tanggal Laporan</Text>
            <Text style={styles.rowInput}>{formatDate(santunanDetail.tglLaporanPolisi)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Petugas</Text>
            <Text style={styles.rowInput}>{santunanDetail.namaPetugas}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tanggal Kejadian</Text>
            <Text style={styles.rowInput}>{formatDate(santunanDetail.tglKejadian)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Waktu Kejadian</Text>
            <Text style={styles.rowInput}>{santunanDetail.tglKejadian.substring(11,16)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Kasus Kecelakaan</Text>
            <Text style={styles.rowInput}>{santunanDetail.kasusKecelakaan}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sifat Kecelakaan</Text>
            <Text style={styles.rowInput}>{santunanDetail.sifatKecelakaan}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Lokasi</Text>
            <Text style={styles.rowInput}>{santunanDetail.deskripsiLokasi}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Deskripsi Kejadian</Text>
            <Text style={styles.rowInput}>{santunanDetail.deskripsiKecelakaan}</Text>
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
  scrollView: {
    backgroundColor: '#e5e5e5',
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

export default connect(mapStateToProps, mapDispatchToProps)(SantunanKecelakaan);
