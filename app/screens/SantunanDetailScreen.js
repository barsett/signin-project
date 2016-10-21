/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, height, width} from '../api/Common';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import SantunanKecelakaan from './SantunanKecelakaan';
import SantunanPengajuan from './SantunanPengajuan';
import SantunanHistory from './SantunanHistory';


class SantunanDetailScreen extends React.Component {

  componentDidMount(){
  }



  render() {
    console.log("No Berkas Santunan...", this.props.noBerkas);
    return (
    <View style={{flex: 1, backgroundColor: '#e5e5e5'}}>
      <ScrollableTabView
        style={styles.container}
        tabBarUnderlineColor={"#0087cd"}
        tabBarActiveTextColor={"#464646"}
        tabBarInactiveTextColor={"#cccccc"}
        tabBarTextStyle={styles.tabText}
        renderTabBar={() => <DefaultTabBar backgroundColor='#FFFFFF'/>}
      >
        <SantunanKecelakaan tabLabel={i18n.santunanKecelakaan} noBerkas={this.props.noBerkas}/>
        <SantunanPengajuan tabLabel={i18n.santunanPengajuan} noBerkas={this.props.noBerkas}/>
        <SantunanHistory tabLabel={i18n.santunanHistory} noBerkas={this.props.noBerkas}/>
      </ScrollableTabView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    width: width - getCorrectShapeSizeForScreen(16),
    alignSelf: 'center',
    marginTop:getCorrectShapeSizeForScreen(8),
  },
  tabText: {
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
    textAlignVertical: 'center',
    top: getCorrectShapeSizeForScreen(2)
  },

});



const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
	}, dispatch);

};

export default connect(null, mapDispatchToProps)(SantunanDetailScreen);
