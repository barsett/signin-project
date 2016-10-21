/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Dimensions,
  Image,
  RefreshControl,
  Alert,
  InteractionManager,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { runGetLakaDetail, runGetLakaListKorban, runGetLakaListKendaraan, } from '../actions/LakaAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import KorbanCell from '../components/KorbanCell'
import NoData from '../components/NoData';

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

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class KorbanListScreen extends React.Component {
  constructor(props){
    super(props);
    //console.log("### CONSTRUCTOR ###");
    //console.log(this.props);
    //var dataKorban = this.props.listKorban;
    this.state = {
      korbanDataSource: ds.cloneWithRows([]),
      isKorbanLoading: false,
      kendaraanDataSource: ds.cloneWithRows(this.props.listKendaraan),
      isKendaraanLoading: false,
    }

    this._renderRow = this._renderRow.bind(this);
    this._selectRow = this._selectRow.bind(this);
    this._addKorban = this._addKorban.bind(this);
    this._reloadKorban = this._reloadKorban.bind(this);
  }

  _renderListViewData(data_list){

    let data = [];
    data_list.map((data_rec) => {
      data.push(data_rec)
    });
    return data;

  }

  componentDidMount(){
    //console.log("### COMPONENT DID MOUNT ###");
    //console.log(this.state)
    // load data korban
    InteractionManager.runAfterInteractions(() => {

      if (this.state.korbanDataSource.getRowCount() === 0){
        // load data here
        this._reloadKorban();
      }
    });

  }

  componentWillReceiveProps(nextProps){

    //console.log("### COMPONENT WILL RECEIVE NEW PROPS ###");
    //console.log("### NEXT PROPS ###");
    //console.log(nextProps);
    // LIST KORBAN
    if (this.props.listKorban !== nextProps.listKorban){
      console.log("Receive new korban data");
      var dataKorban = this._renderListViewData(nextProps.listKorban);
      this.setState({...this.state,
        korbanDataSource: ds.cloneWithRows(dataKorban),
        isKorbanLoading: nextProps.isKorbanLoading,
      });
    }
    else {
      console.log("Not receive new korban data");
      this.setState({
        isKorbanLoading: nextProps.isKorbanLoading,
      });
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  _reloadKorban(){
    this.props.runGetLakaListKorban(this.props.idLaka, this.props.flagIrsms);
  }

  _renderRow(doc: Object){

    return (
      <KorbanCell survey={this.props.survey} data={doc} onSelect={() => this._selectRow(doc)} isEditable={this.props.isEditable}/>
    )
  }

  _selectRow(doc){
    console.log("select row");
    //Actions.lakaDetail();
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      if( doc.toJS().flag === "Y"){
        Alert.alert(
          "Edit Korban",
          "Data korban tidak bisa diedit karena korban telah disantuni!",
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
        Actions.korbanEdit({korban: doc, kendaraan: this.props.listKendaraan, idKecelakaan: this.props.idLaka, action:"EDIT"});
      }
    }
  }

  _addKorban(doc){
    console.log("Add Korban");
    Actions.korbanEdit({kendaraan: this.props.listKendaraan, idKecelakaan: this.props.idLaka, action:"ADD"});

  }


  render() {
    var addButton = null;
    if (this.props.roles !== 'OTORISATOR' && this.props.isEditable){
      addButton = <Button
        onPress={this._addKorban.bind(this)}
        sstyle={styles.button}
        containerStyle={styles.buttonRound}  >
        <Icon name="plus" style={styles.button}/>
      </Button>;
    }
    if (this.state.korbanDataSource.getRowCount()===0 || this.state.kendaraanDataSource.getRowCount()===0){
      return(
        <View style={{flex: 1}}>
          <NoData
            isLoading={this.state.isKorbanLoading || this.state.isKendaraanLoading} onRefresh={this._reloadKorban} noDataText={"Data tidak ditemukan"}
          />
          {addButton}
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <ListView style={{flex: 1}}
            ref="listview"
            //renderHeader={this._renderHeader}
            //renderSeparator={this._renderSeparator}
            dataSource={this.state.korbanDataSource}
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
                  refreshing={this.state.isKorbanLoading}
                  onRefresh={this._reloadKorban}
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
    listKorban: state.getIn(['lakaDetail', 'listKorban']),
    isKorbanLoading: state.getIn(['lakaDetail', 'isLoadingListKorban']),
    listKendaraan: state.getIn(['lakaDetail', 'listKendaraan']),
    isKendaraanLoading: state.getIn(['lakaDetail', 'isLoadingListKendaraan']),
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runGetLakaListKorban
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(KorbanListScreen);
