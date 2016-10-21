/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ListView,
  InteractionManager,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { runGetLakaDetail, runGetLakaListKorban, runGetLakaListKendaraan, } from '../actions/LakaAction';
import { getCorrectShapeSizeForScreen, getCorrectFontSizeForScreen, height, width } from '../api/Common.js';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import LakaDetailScreen from './LakaDetailScreen';
import KendaraanListScreen from './KendaraanListScreen';
import KorbanListScreen from './KorbanListScreen';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class LakaScreen extends React.Component {


  render() {
    return (
    <View style={{flex: 1, backgroundColor: '#e5e5e5'}}>
      <ScrollableTabView
        style={styles.container}
        tabBarUnderlineColor={"#0087cd"}
        tabBarActiveTextColor={"#464646"}
        tabBarInactiveTextColor={"#cccccc"}
        tabBarTextStyle={styles.tabText}
        prerenderingSiblingsNumber={2}
        renderTabBar={() => <DefaultTabBar backgroundColor='#FFFFFF'/>}
      >
        <LakaDetailScreen tabLabel={i18n.dataLaka} idLaka={this.props.idLaka} survey={this.props.survey} isEditable={this.props.isEditable} flagIrsms={this.props.flagIrsms} />
        <KendaraanListScreen tabLabel={i18n.dataKendaraan} idLaka={this.props.idLaka} survey={this.props.survey} isEditable={this.props.isEditable} flagIrsms={this.props.flagIrsms} />
        <KorbanListScreen tabLabel={i18n.dataKorban} idLaka={this.props.idLaka} survey={this.props.survey} isEditable={this.props.isEditable} flagIrsms={this.props.flagIrsms} />
      </ScrollableTabView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  tabText: {
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    textAlignVertical: 'center',
    top: getCorrectShapeSizeForScreen(2)
  },
  container: {
    backgroundColor: '#e5e5e5',
    width: width - getCorrectShapeSizeForScreen(16),
    alignSelf: 'center',
    marginTop:getCorrectShapeSizeForScreen(8),
  }
});

const mapStateToProps = (state) => {
  return {
    lakaDetail: state.getIn(['lakaDetail', 'lakaDetail']),
    listKendaraan: state.getIn(['lakaDetail', 'listKendaraan']),
    listKorban: state.getIn(['lakaDetail', 'listKorban']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runGetLakaDetail,
    runGetLakaListKendaraan,
    runGetLakaListKorban,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(LakaScreen);
