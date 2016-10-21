/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  Dimensions,
  Image,
  InteractionManager,
  RefreshControl,
  Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { runGetLakaDetail, runGetLakaListKorban, runGetLakaListKendaraan, } from '../actions/LakaAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import NoData from '../components/NoData';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import KendaraanCell  from '../components/KendaraanCell'

/*
const sampleData = [{
  idBerkas: '1212311',
  kodeKejadian: 'kode1',
  kodeRs: 'RS Siloam',
  kodeBerkas: 'SIM',
  deskripsiBerkas: 'desc',
  resourcePath: 'http://',
  uploadLink: 'http://,'
}, {
  idBerkas: '1212312',
  kodeKejadian: 'kode2',
  kodeRs: 'RS Siloam',
  kodeBerkas: 'SIM',
  deskripsiBerkas: 'desc',
  resourcePath: 'http://',
  uploadLink: 'http://,'
},{
  idBerkas: '1212313',
  kodeKejadian: 'kode3',
  kodeRs: 'RS Siloam',
  kodeBerkas: 'SIM',
  deskripsiBerkas: 'desc',
  resourcePath: 'http://',
  uploadLink: 'http://,'
}];
*/

//const sampleData = this.props.data.toJS();

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class KendaraanListScreen extends React.Component {
  constructor(props){
    super(props);
    //var dataSource = this._renderListViewData(this.props.listKendaraan.toJS());
    this.state = {
      kendaraanDataSource: ds.cloneWithRows([]),
      isKendaraanLoading: false,
    }

    this._renderRow = this._renderRow.bind(this);
    this._selectRow = this._selectRow.bind(this);
    this._addKendaraan = this._addKendaraan.bind(this);
    this._reloadKendaraan = this._reloadKendaraan.bind(this);
  }

  _renderListViewData(data_list){

    let data = [];
    data_list.map((data_rec) => {
      data.push(data_rec)
    });
    return data;

  }

  componentDidMount(){
    console.log("componentDidMount .. ");

    InteractionManager.runAfterInteractions(() => {
      // load data kendaraan
      if (this.state.kendaraanDataSource.getRowCount() === 0){
        // load data here
        this._reloadKendaraan();
      }
    });

  }

  componentWillReceiveProps(nextProps){


    // LIST KENDARAAN
    if (this.props.listKendaraan !== nextProps.listKendaraan){
      console.log("Receive new kendaraan data");
      var dataKendaraan = this._renderListViewData(nextProps.listKendaraan);
      this.setState({...this.state,
        kendaraanDataSource: ds.cloneWithRows(dataKendaraan),
        isKendaraanLoading: nextProps.isKendaraanLoading,
      });
    }
    else {
      console.log("Not receive new kendaraan data");
      this.setState({
        isKendaraanLoading: nextProps.isKendaraanLoading,
      });
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  _reloadKendaraan(){
    this.props.runGetLakaListKendaraan(this.props.idLaka, this.props.flagIrsms);
  }

  _renderRow(doc: Object){

    return (
      <KendaraanCell data={doc} onSelect={() => this._selectRow(doc)} isEditable={this.props.isEditable}/>
    )
  }

  _selectRow(doc){
    console.log("select row", doc.toJS().flag);
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      if( doc.toJS().flag === "Y"){
        Alert.alert(
          "Edit Kendaraan",
          "Data kendaraan tidak bisa diedit karena kendaraan telah disantuni!",
          [
            {
              text: 'OK',
              onPress: () => {
                console.log("OK PRESSED");
              }
            }
          ]
        );
      } else {
        Actions.kendaraanEdit({kendaraan: doc, idKecelakaan: this.props.idLaka, action:"EDIT"});
      }
    }
  }

  _addKendaraan(){
    console.log("add Kendaraan");
    // route to Kendaraan Edit Form
    Actions.kendaraanEdit({idKecelakaan: this.props.idLaka, action:"ADD"});

  }

  render() {
    //console.log("### RENDER KENDARAAN LIST SCREEN ###");
    //console.log(this.state);var addButton = null;
    var addButton = null;
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      addButton = <Button
        onPress={this._addKendaraan.bind(this)}
        sstyle={styles.button}
        containerStyle={styles.buttonRound}  >
        <Icon name="plus" style={styles.button}/>
      </Button>;
    }
    if (this.state.kendaraanDataSource.getRowCount()===0){
      return (
        <View style={{flex:1}}>
          <NoData
            isLoading={this.state.isKendaraanLoading} onRefresh={this._reloadKendaraan} noDataText={"Data tidak ditemukan"}
          />
          {addButton}
        </View>
      );
    } else {
      return (
        <View style={{flex:1}}>
          <ListView style={{flex: 1}}
            ref="listview"
            //renderHeader={this._renderHeader}
            //renderSeparator={this._renderSeparator}
            dataSource={this.state.kendaraanDataSource}
            enableEmptySections={true}
            //initialListSize={10}
            //renderSectionHeader={this._renderSectionHeader}
            //renderFooter={this._renderFooter}
            renderRow={this._renderRow}
            //onEndReached={this._onLoadMore}
            //onEndReachedThreshold={30}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            refreshControl = {
              <RefreshControl
                refreshing={this.state.isKendaraanLoading}
                onRefresh={this._reloadKendaraan}
                tintColor="#666699"
                title="Loading..."
                titleColor="#bf0000"
                colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
                progressBackgroundColor="#ffffcc" //Circle color
              />
            }
          />
          {addButton}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  button: {
    fontSize: getCorrectFontSizeForScreen(35),
    color: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  buttonRound: {
    backgroundColor: '#66cc66',
    alignItems: 'center',
    justifyContent: 'center',
    width: getCorrectShapeSizeForScreen(35),
    height: getCorrectShapeSizeForScreen(35),
    borderRadius: getCorrectShapeSizeForScreen(35)/2,
    alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(10),
    marginTop: getCorrectShapeSizeForScreen(5),
  },
});



const mapStateToProps = (state) => {
  return {
    listKendaraan: state.getIn(['lakaDetail', 'listKendaraan']),
    isKendaraanLoading: state.getIn(['lakaDetail', 'isLoadingListKendaraan']),
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runGetLakaListKendaraan
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KendaraanListScreen);
