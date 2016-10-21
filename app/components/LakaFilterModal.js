'use strict';
import React, { Component , PropTypes} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions, TouchableOpacity, Alert, TouchableHighlight, Switch} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import FloatLabelTextInput from '../components/FloatingLabel';
import {MKSwitch, MKColor} from 'react-native-material-kit';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, getMonth, getDate, width, height} from '../api/Common'
import dismissKeyboard from 'dismissKeyboard';
import ReferenceService from '../api/ReferenceService';
import FilteredLookupReferenceModal from '../components/FilteredLookupReferenceModal';
import ModalPicker from 'react-native-modal-picker';
import { SegmentedControls } from 'react-native-radio-buttons';

import {
  SUMBER_DATA_LAKA,
} from '../config/Reference.js';

const propTypes = {
  onSelection: PropTypes.func,
};


export default class LakaFilterModal extends React.Component {
    constructor(props){
        super (props);
        var curDate = new Date();


        this.state = {
          namaKorban: '',
          tanggalKejadianAwal: curDate.getFullYear()+"-"+(getMonth(curDate))+"-"+getDate(curDate),
          tanggalKejadianAkhir: curDate.getFullYear()+"-"+(getMonth(curDate))+"-"+getDate(curDate),
          tanggalLaporanAwal: curDate.getFullYear()+"-"+(getMonth(curDate))+"-"+getDate(curDate),
          tanggalLaporanAkhir: curDate.getFullYear()+"-"+(getMonth(curDate))+"-"+getDate(curDate),
          instansi: '',
          instansiDesc: '',
          isTanggalKejadianToggled: false,
          isTanggalLaporanToggled: false,
          sumberDataLaka: 'DASI',
          flagIrsms: 'n',
        }
        //console.log("### LAKA FILTER MODAL CONSTRUCTOR ###");
        //console.log(this.state);
        this._isValid = this._isValid.bind(this);

    }

    open(){
      this.refs.modal.open();
    }

    close(){
      this.refs.modal.close();
    }


    shouldComponentUpdate(nextProps, nextState){
      //console.log("### NEXT STATE ###", nextState);
      //console.log("should rerender: ", this.state !== nextState);

      return this.state !== nextState;
    }

    _onSelection(){
      var empty = 0;
      var criteria_list = {
        namaKorban: this.state.namaKorban,
        tanggalKejadian: this.state.isTanggalKejadianToggled,
        tanggalLaporan: this.state.isTanggalLaporanToggled,
        instansi: this.state.instansi,
        flagIrsms: this.state.flagIrsms,
      };

      if (this._isValid(criteria_list)){
        if(criteria_list.instansi === ''){
          criteria_list.instansi = this.props.wilayah;
        }

        if(this.state.isTanggalKejadianToggled){
          criteria_list = {
            ...criteria_list,
            tanggalKejadianAwal: this.state.tanggalKejadianAwal,
            tanggalKejadianAkhir: this.state.tanggalKejadianAkhir,
          };
        }
        if(this.state.isTanggalLaporanToggled){
          criteria_list = {
            ...criteria_list,
            tanggalLaporanAwal: this.state.tanggalLaporanAwal,
            tanggalLaporanAkhir: this.state.tanggalLaporanAkhir,
          };
        }

        this.props.onSelection(criteria_list);
        this.refs.modal.close();
      } else {
        Alert.alert(
          'Pencarian Laka',
          'Minimal dua field yang harus terisi',
          [
            {text: 'OK'},
          ]
        );
      }
    }

    _isValid(criteria_list){
      var filled = 0;
      //console.log("Validating...");
      for (var criteria in criteria_list){
        //console.log(criteria, criteria_list[criteria]);
        if (criteria_list[criteria]){
          //console.log(criteria, "kosong");
          filled++;
        }
      }

      //console.log("Filled: ", filled);
      if(filled >= 3){
        return true;
      } else {
        return false;
      }
    }

    _toggleTanggalKejadian(){
      //console.log("Tanggal Kejadian toggled to ", !this.state.isTanggalKejadianToggled);
      this.setState({isTanggalKejadianToggled: !this.state.isTanggalKejadianToggled});
    }

    _toggleTanggalLaporan(){
      //console.log("Tanggal Laporan toggled to ", !this.state.isTanggalLaporanToggled);
      this.setState({isTanggalLaporanToggled: !this.state.isTanggalLaporanToggled});
    }

    _showInstansi = () => {
      this.refs.instansiModal.open();
    }

    _setInstansi = (instansi) => {
      //console.log("Instansi: ", instansi);
      this.setState({
        instansi: instansi.id,
        instansiDesc: instansi.desc,
      })
    }

    _clearInstansi = () => {
      this.setState({instansi: ''});
    }

    _onSelectDataSources = (selected) => {
      this.setState({
        sumberDataLaka: selected.desc,
        flagIrsms: selected.id,
      });
    }

    _setDate = (dateType, date) => {
      var valid = true;
      var invalidMsg;
      switch (dateType) {
        case "tanggalKejadianAwal":
          if(date<=this.state.tanggalKejadianAkhir){
            this.setState({tanggalKejadianAwal: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal awal tidak boleh melebihi tanggal akhir';
          }
          break;
        case "tanggalKejadianAkhir":
          if(date>=this.state.tanggalKejadianAwal){
            this.setState({tanggalKejadianAkhir: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal akhir tidak boleh mendahului tanggal awal';
          }
          break;
        case "tanggalLaporanAwal":
          if(date<=this.state.tanggalLaporanAkhir){
            this.setState({tanggalLaporanAwal: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal awal tidak boleh melebihi tanggal akhir';
          }
          break;
        case "tanggalLaporanAkhir":
          if(date>=this.state.tanggalLaporanAwal){
            this.setState({tanggalLaporanAkhir: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal akhir tidak boleh mendahului tanggal awal';
          }
          break;
        default:
          break;
      }
      if(!valid){
        Alert.alert(
          'Pemilihan Tanggal',
          invalidMsg,
          [
            {text: 'OK'},
          ]
        );
      }
    }

    _renderDataSourceOption(){
      if(this.props.stackSize === 1){
        return (
          <View style={styles.dateField}>
            <View style={styles.dateRow}>
              <Text style={styles.label}>Sumber Data</Text>
              <View style={styles.dataSourceOption}>
              <SegmentedControls
                tint= {'#24abe2'}
                selectedTint= {'white'}
                backTint= {'white'}
                optionStyle= {{
                  fontSize: getCorrectFontSizeForScreen(12),
                  fontWeight: 'bold',
                }}
                containerStyle= {{
                  marginLeft: 10,
                  marginRight: 10,
                  width: getCorrectShapeSizeForScreen(100),
                }}
                options={ SUMBER_DATA_LAKA }
                allowFontScaling={ true } // default: true
                extractText={ (option) => option.desc }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.id === b.id;
                }}
                onSelection={ this._onSelectDataSources.bind(this) }
                selectedOption={ {id: this.state.flagIrsms, desc: this.state.sumberDataLaka} }
              />
              </View>
            </View>
          </View>
        )
      }
    }

    render(){
        var tglKejadianPicker;
        var tglLaporanPicker;
        var tglKejadianArrowDir;
        var tglLaporanArrowDir;
        var removeInstansi;

        if(this.state.instansi === ''){
          removeInstansi = null;
        } else {
          removeInstansi =
          <View style={styles.instansiRemover}>
            <TouchableOpacity onPress={this._clearInstansi}>
              <View style={styles.resetBubble}>
                <Text style={styles.resetText}>hapus</Text>
              </View>
            </TouchableOpacity>
          </View>;
        }

        if(this.state.isTanggalKejadianToggled){
          tglKejadianArrowDir = "angle-up";
          tglKejadianPicker = <View style={{flexDirection:'row'}}>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalKejadianAwal}
                mode="date"
                showIcon={true}
                placeholder="Awal"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalKejadianAwal", date);
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                }}
              />
            </View>
            <View style={{justifyContent: 'center'}}><Icon color="black" name="minus" /></View>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalKejadianAkhir}
                mode="date"
                placeholder="Akhir"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalKejadianAkhir", date);
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                }}
              />
            </View>
          </View>;
        } else {
          tglKejadianArrowDir = "angle-down";
          tglKejadianPicker = null;
        }

        if(this.state.isTanggalLaporanToggled){
          tglLaporanArrowDir = "angle-up";
          tglLaporanPicker = <View style={{flexDirection:'row'}}>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalLaporanAwal}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalLaporanAwal", date);
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                }}
              />
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}><Icon color="black" name="minus" /></View>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalLaporanAkhir}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalLaporanAkhir", date);
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                }}
              />
            </View>
          </View>;
        } else {
          tglLaporanArrowDir = "angle-down";
          tglLaporanPicker = null;
        }

        return (
          <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
          <TouchableWithoutFeedback onPress={ () => dismissKeyboard() }>
            <View style={styles.searchFieldContainer}>
              <Text style={styles.label}>Nama Korban</Text>
              <View style={styles.textField}>
                  <TextInput
                    style={styles.searchInputText}
                    onChangeText={text => this.setState({'namaKorban':text})}
                    onSubmitEditing={() => dismissKeyboard()}
                    onBlur={() => dismissKeyboard()}
                    value={this.state.namaKorban}
                  />
              </View>
              <View style={styles.modalField}>
                <View style={styles.instansiRow}>
                  <Text style={styles.label}>Kode Instansi</Text>
                </View>
                <View style={styles.uraianContainer}>
                  <View style={{flex: 1}}>
                    <TouchableHighlight onPress={this._showInstansi} underlayColor={'transparent'}>
                      <Text style={styles.modalText}>{(this.state.instansi) ? this.state.instansiDesc : ""}</Text>
                    </TouchableHighlight>
                  </View>
                  {removeInstansi}
                </View>
              </View>

              <View style={styles.dateField}>
                <View style={styles.dateRow}>
                  <Text style={styles.label}>Tanggal Kejadian</Text>
                  <Switch
                    value={this.state.isTanggalKejadianToggled}
                    onValueChange={this._toggleTanggalKejadian.bind(this)}
                    onTintColor="#24abe2"
                    thumbTintColor="#0000ff"
                    tintColor="#24abe2"
                  />
                </View>
                {tglKejadianPicker}
              </View>
              <View style={styles.dateField}>
                <View style={styles.dateRow}>
                  <Text style={styles.label}>Tanggal Laporan</Text>
                  <Switch
                    value={this.state.isTanggalLaporanToggled}
                    onValueChange={this._toggleTanggalLaporan.bind(this)}
                    onTintColor="#24abe2"
                    thumbTintColor="#0000ff"
                    tintColor="#24abe2"
                  />
                </View>
                {tglLaporanPicker}
              </View>
              {this._renderDataSourceOption()}
              <View style={styles.button}>
                <Button onPress={this._onSelection.bind(this)}
                  style={styles.buttonText}
                  containerStyle={styles.buttonCariRounded}>
                  <Icon style={styles.searchIcon} name="search" /> Cari
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <FilteredLookupReferenceModal ref="instansiModal" onSelection={this._setInstansi.bind(this)} domain="INSTANSI" filter={this.props.wilayah} title="Instansi"/>
          </Modal>

        );
    }
}

LakaFilterModal.propTypes = propTypes;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: getCorrectShapeSizeForScreen(40),
    width: width - getCorrectShapeSizeForScreen(16),
    marginTop: getCorrectShapeSizeForScreen(8),
    height: height,
  },
  label: {
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#464646',
    flex: 1,
  },
  searchFieldContainer: {
    width: getCorrectShapeSizeForScreen(280),
    padding: getCorrectShapeSizeForScreen(5),
    flexDirection:'column',
  },
  searchButtonContainer: {
    //padding: 0,
    justifyContent:'center',
    alignItems:'center',
  },
  dateText: {
      fontSize: getCorrectFontSizeForScreen(12),
  },
  textField: {
    //height: getCorrectShapeSizeForScreen(30),
    borderColor: '#464646',
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
  modalField: {
    marginTop: getCorrectShapeSizeForScreen(20),
    justifyContent: 'center',
  },
  searchInputText: {
    marginTop: getCorrectShapeSizeForScreen(5),
    color:'#464646',
    fontSize: getCorrectFontSizeForScreen(16),
    paddingLeft: 0,
    paddingBottom: getCorrectShapeSizeForScreen(10),
    flex: 1,
    height: getCorrectShapeSizeForScreen(40),
    //backgroundColor: 'red',
  },
  modalText: {
    height: getCorrectFontSizeForScreen(45),
    color:'#464646',
    fontSize: getCorrectFontSizeForScreen(14),
    textAlign: 'left',
  },
  dateField:{
    marginTop: getCorrectShapeSizeForScreen(15),
    borderColor: '#464646',
    borderBottomWidth: 2,
  },
  datePicker: {
    //alignSelf: 'center',
    width: getCorrectShapeSizeForScreen(125),
    //height: getCorrectShapeSizeForScreen(40),
    margin: 5,
    padding: 2,
    //marginTop: getCorrectShapeSizeForScreen(10),
  },
  tanggalKejadian: {
		color: '#3B3738',
		paddingLeft: 10,
	},
  button: {
    flexDirection: 'row',
    marginTop: getCorrectShapeSizeForScreen(10),
  },
  buttonSeparator: {
    flexDirection: 'row',
    marginTop: getCorrectShapeSizeForScreen(10),
  },
  buttonCariRounded: {
    backgroundColor: '#24abe2',
    alignItems: 'center',
    justifyContent: 'center',
    height: getCorrectShapeSizeForScreen(35),
    flex:1,
    borderRadius: 0,
  },

  buttonText: {
    color: 'white',
    fontSize: getCorrectFontSizeForScreen(14),
    fontFamily: 'Roboto',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: getCorrectShapeSizeForScreen(3),

  },
  instansiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: getCorrectShapeSizeForScreen(3),
  },
  iconTogle: {
    fontSize: getCorrectFontSizeForScreen(30),
    color: '#24abe2',
  },
  searchIcon: {
    width: getCorrectShapeSizeForScreen(14),
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#fff',
  },
  timesIcon: {
    width: getCorrectShapeSizeForScreen(14),
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(16),
    color: '#fff',
  },
  uraianContainer: {
    flexDirection: 'row',
    borderColor: '#464646',
    borderBottomWidth: 2,
    marginTop: getCorrectShapeSizeForScreen(5),
    height: getCorrectFontSizeForScreen(30),
  },
  deleteIcon: {
    fontSize: getCorrectFontSizeForScreen(7),
    color: 'black',
    opacity: 0.2,
    margin: 2,
  },
  searchBar: {
    flexDirection: 'row',
    //alignItems: 'center',
    backgroundColor: '#fff',
    width: width - getCorrectShapeSizeForScreen(30),
    alignSelf: 'center',
    margin: getCorrectShapeSizeForScreen(10),
    height: getCorrectShapeSizeForScreen(30),
    borderColor: '#24abe2',
    borderWidth: 2,
    //justifyContent: 'center',
  },
  resetText: {
    color:'#bf0000',
    //opacity:0.2,
    fontSize: getCorrectFontSizeForScreen(10),
  },
  resetBubble: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    borderColor:'#bf0000',
    borderWidth: getCorrectShapeSizeForScreen(1),
    paddingHorizontal: getCorrectShapeSizeForScreen(12),
    paddingBottom: getCorrectShapeSizeForScreen(2),
  },
  instansiRemover: {
    flex: 0.2,
    alignItems: 'flex-end',
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
  uraianText: {
    flex: 1,
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    textAlignVertical: 'center',

    //backgroundColor: 'red',
  },
  modalRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#0087cd',
    padding: getCorrectShapeSizeForScreen(5),
    marginTop: getCorrectShapeSizeForScreen(5),
    //marginLeft: getCorrectShapeSizeForScreen(10),
    marginRight: getCorrectShapeSizeForScreen(10),
    justifyContent: 'center',
    width: getCorrectShapeSizeForScreen(70),
  },
  modalIcon: {
    color: '#0087cd',
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    marginRight: getCorrectShapeSizeForScreen(5),
  },
  rowInput: {
    flex: 1,
    left: getCorrectShapeSizeForScreen(5),
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#464646',
    fontFamily: 'Roboto',
    justifyContent: 'center'
  },
});
