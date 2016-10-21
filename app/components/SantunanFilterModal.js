'use strict';
import React, { Component , PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, DatePickerAndroid, Dimensions, Alert, Switch} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import FloatLabelTextInput from '../components/FloatingLabel';
import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, getMonth, getDate, width, height} from '../api/Common';
import {MKSwitch, MKColor} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

const propTypes = {
  onSelection: PropTypes.func,
};



export default class SantunanFilterModal extends React.Component {
    constructor(props){
        var curDate = new Date();
        super (props);
        this.state = {
          namaKorban: "",
          tanggalPengajuanFrom: curDate.getFullYear()+"-"+getMonth(curDate)+"-"+getDate(curDate),
          tanggalPengajuanTo: curDate.getFullYear()+"-"+getMonth(curDate)+"-"+getDate(curDate),
          tanggalKejadianFrom: curDate.getFullYear()+"-"+getMonth(curDate)+"-"+getDate(curDate),
          tanggalKejadianTo: curDate.getFullYear()+"-"+getMonth(curDate)+"-"+getDate(curDate),
          nomorBerkas: "",
          isTanggalPengajuanToggled: false,
          isTanggalKejadianToggled: false,
        }
        this._isValid = this._isValid.bind(this);
    }

    open(){
      this.refs.modal.open();
    }

    close(){
      this.refs.modal.close();
    }

    _onSelection(){
      console.log("Search Presss");
      var criteria_list = {
        namaKorban: this.state.namaKorban,
        tanggalKejadian: this.state.isTanggalKejadianToggled,
        tanggalPengajuan: this.state.isTanggalPengajuanToggled,
        nomorBerkas: this.state.nomorBerkas,
      };

      if (this._isValid(criteria_list)){

        if(this.state.isTanggalKejadianToggled){
          criteria_list = {
            ...criteria_list,
            tanggalKejadianFrom: this.state.tanggalKejadianFrom,
            tanggalKejadianTo: this.state.tanggalKejadianTo,
          };
        }
        if(this.state.isTanggalPengajuanToggled){
          criteria_list = {
            ...criteria_list,
            tanggalPengajuanFrom: this.state.tanggalPengajuanFrom,
            tanggalPengajuanTo: this.state.tanggalPengajuanTo,
          };
        }

        this.props.onSelection(criteria_list);
        //Actions.santunanSearch({criteria: criteria_list});
        this.refs.modal.close();
      } else {
        Alert.alert(
          'Pencarian Santunan',
          'Minimal dua field yang harus terisi',
          [
            {text: 'OK'},
          ]
        );
      }
    }

    _isValid(criteria_list){
      var filled = 0;
      console.log("Validating...");
      for (var criteria in criteria_list){
        if (criteria_list[criteria]){
          filled++;
        }
      }

      if (criteria_list.nomorBerkas){
        return true;
      } else if (filled >= 2){
        return true;
      } else {
        return false;
      }
    }

    _toggleTanggalPengajuan(){
      this.setState({isTanggalPengajuanToggled: !this.state.isTanggalPengajuanToggled});
    }

    _toggleTanggalKejadian(){
      this.setState({isTanggalKejadianToggled: !this.state.isTanggalKejadianToggled});
    }

    _formatNomerBerkas(value) {
      var v = value.replace(/\s+-/g, '').replace(/[^0-9]/gi, '')
      var matches = v.match(/\d{2,16}/g);
      //var matches = v.match(/\d{4,16}/g);
      var match = matches && matches[0] || ''
      var parts = [];
      var seperator = [1, 3, 2, 2, 2, 2, 4];

      for (var i=0; i < seperator.length; i++){
          if (match.length > 0 ) {
            parts.push(match.substr(0, seperator[i]));
            match = match.slice(seperator[i]);
          }
      }

      if (parts.length) {
        return parts.join('-');
      } else {
        return value;
      }
    }

    _setDate = (dateType, date) => {
      var valid = true;
      var invalidMsg;
      switch (dateType) {
        case "tanggalKejadianFrom":
          if(date<=this.state.tanggalKejadianTo){
            this.setState({tanggalKejadianFrom: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal kejadian awal tidak boleh melebihi tanggal kejadian akhir';
          }
          break;
        case "tanggalKejadianTo":
          if(date>=this.state.tanggalKejadianFrom){
            this.setState({tanggalKejadianTo: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal kejadian akhir tidak boleh mendahului tanggal kejadian awal';
          }
          break;
        case "tanggalPengajuanFrom":
          if(date<=this.state.tanggalPengajuanTo){
            this.setState({tanggalPengajuanFrom: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal pengajuan awal tidak boleh melebihi tanggal pengajuan akhir';
          }
          break;
        case "tanggalPengajuanTo":
          if(date>=this.state.tanggalPengajuanFrom){
            this.setState({tanggalPengajuanTo: date});
          } else {
            valid = false;
            invalidMsg = 'Tanggal pengajuan akhir tidak boleh mendahului tanggal pengajuan awal';
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

    render(){
        var tglPengajuanPicker;
        var tglKejadianPicker;
        var tglPengajuanArrowDir;
        var tglKejadianArrowDir;

        if(this.state.isTanggalPengajuanToggled){
          tglPengajuanArrowDir = "angle-up";
          tglPengajuanPicker =
          <View style={styles.datePickerRange}>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalPengajuanFrom}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalPengajuanFrom", date);
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
                date={this.state.tanggalPengajuanTo}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalPengajuanTo", date);
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
          tglPengajuanArrowDir = "angle-down";
          tglPengajuanPicker = null;
        }

        if(this.state.isTanggalKejadianToggled){
          tglKejadianArrowDir = "angle-up";
          tglKejadianPicker =
          <View style={styles.datePickerRange}>
            <View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.tanggalKejadianFrom}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalKejadianFrom", date);
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
                date={this.state.tanggalKejadianTo}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  this._setDate("tanggalKejadianTo", date);
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

        return (
          <Modal {...this.props} style={styles.modal}  position="center" ref="modal">
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
            <View style={{marginTop: getCorrectShapeSizeForScreen(15)}}>
              <Text style={styles.label}>Kode Berkas</Text>
              <View style={styles.textField}>
                <TextInput
                  style={styles.searchInputText}
                  keyboardType = 'numeric'
                  placeholder = 'X-XXX-XX-XX-XX-XX-XXXX'
                  placeholderTextColor='#919191'
                  //onChangeText={text => this.setState({'nomorBerkas':text})}
                  onChangeText={(data) => {
                    //console.log("Nomer:" + data);
                    //strip all X
                    //const cleanText = data.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
                    const formattedText = this._formatNomerBerkas(data);

                    // console.log(cleanText, formattedText);
                    // this.setState({nomorBerkas: cleanText, nomorBerkasFormatted: formattedText});
                    this.setState({nomorBerkas: formattedText});
                  }}
                  onSubmitEditing={() => dismissKeyboard()}
                  onBlur={() => dismissKeyboard()}
                  value={this.state.nomorBerkas}
                />
              </View>
            </View>
            <View style={styles.dateField}>
              <View style={styles.dateRow}>
                <Text style={styles.label}>Tanggal Pengajuan</Text>
                <Switch
                  value={this.state.isTanggalPengajuanToggled}
                  onValueChange={this._toggleTanggalPengajuan.bind(this)}
                  onTintColor="#24abe2"
                  thumbTintColor="#0000ff"
                  tintColor="#24abe2"
                />
              </View>
              {tglPengajuanPicker}
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

            <View style={styles.button}>
              <Button onPress={this._onSelection.bind(this)}
                style={styles.buttonText}
                containerStyle={styles.buttonCariRounded}>
                <Icon style={styles.searchIcon} name="search" /> Cari
              </Button>
            </View>
          </View>
          </Modal>
        );
    }
}

SantunanFilterModal.propTypes = propTypes;

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
    padding: 0,
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
    //marginTop: getCorrectShapeSizeForScreen(5),
    color:'#464646',
    fontSize: getCorrectFontSizeForScreen(14),
    paddingLeft: 0,
    flex: 1,
    height:getCorrectShapeSizeForScreen(40), // FOR IOS
    paddingBottom: getCorrectShapeSizeForScreen(4),
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
  datePickerRange: {
    flexDirection: 'row',
  },
  tanggalKejadian: {
    color: '#3B3738',
    paddingLeft: 10,
  },
  button: {
    flexDirection: 'row',
    marginTop: getCorrectShapeSizeForScreen(20),
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
  buttonBatalRounded: {
    backgroundColor: '#ed624f',
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
  containerForm: {
    marginTop: getCorrectShapeSizeForScreen(5),
  },
});
