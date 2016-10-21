/* @flow */
'use strict';

import React , { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    PixelRatio,
    TouchableOpacity,
} from 'react-native';

import Button from 'react-native-button';
import Accordion from 'react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

import FloatLabelTextInput from '../components/FloatingLabel';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDate, formatDateTime, formatData } from '../api/Common'
import { JENIS_KESIMPULAN, STATUS_JAMINAN_DETAIL } from '../config/Reference';
import Util from '../api/Util';
import PhoneNumber from './PhoneNumber';

const getStatusJaminanDesc = (id) => {
  //console.log("KesimpulanID", id);
  const statusJaminan = STATUS_JAMINAN_DETAIL.find((opt) => {
    return (opt.id == id);
  })

  //console.log("KesimpulanDesc", rekomendasi);
  if (statusJaminan)  return statusJaminan.desc;
}

export default class KunjunganEditScreen extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Accordion
          style={{flex: 1,}}
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
                <Text style={styles.rowInput}>{formatData(this.props.data.survey.jenisKelamin)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Telpon</Text>
                <Text style={styles.rowBetween}>:</Text>
                <PhoneNumber style={styles.rowInput} containerStyle={{flex:0.6}} number={formatData(this.props.data.survey.noTelp)}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Kode Registrasi RS</Text>
                <Text style={styles.rowBetween}>:</Text>
                <Text style={styles.rowInput}>{formatData(this.props.data.survey.kodeKejadian)}</Text>
              </View>

              <View style={styles.rowHeader}>
                <Icon style={styles.categoryIcon} name="ambulance" color="#4F8EF7" />
                <Text style={styles.categoryLabel}>Kecelakaan</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Tanggal Kejadian</Text>
                <Text style={styles.rowBetween}>:</Text>
                <Text style={styles.rowInput}>{formatDate(this.props.data.survey.tanggalKejadian)}</Text>
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
                <Text style={styles.rowLabel}>Tanggal Masuk</Text>
                <Text style={styles.rowBetween}>:</Text>
                <Text style={styles.rowInput}>{formatDate(this.props.data.survey.tanggalMasukRs)}</Text>
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
                <Text style={styles.rowInput}>{getStatusJaminanDesc(this.props.data.survey.statusJaminan)}</Text>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'blue',
    //margin: 10,
    alignItems: 'stretch',
    alignSelf: 'stretch',
    padding: getCorrectShapeSizeForScreen(8),
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
