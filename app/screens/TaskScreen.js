'use strict';
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectMyTaskTab } from '../actions/TaskAction'


import i18n from '../i18n.js';
import gstyles from '../styles/style';
import TugasList from '../screens/TugasScreen';
import KunjunganList from '../screens/KunjunganScreen';
import PendingList from '../screens/PendingScreen';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width} from '../api/Common'
//import MyTask from '../components/MyTask';
import debug from '../debug';

class TaskScreen extends React.Component {


  _onChangeTab = (obj) => {
    //console.log("CHANGE TAB ", obj.i);
    if (obj.i === 1){
      this.props.selectMyTaskTab();
    }
  }

  render() {
      const pendingTitle = i18n.pendingList + ' ('+ this.props.pendingCount +')';
      const tugasTitle = i18n.taskList + ' (' + this.props.taskCount + ')';
      const kunjunganTitle = (this.props.kunjunganUpdated) ? i18n.visitList + " !!" : i18n.visitList;

      return (
      <View style={{flex: 1, backgroundColor: '#e5e5e5'}}>
        <ScrollableTabView
          style={styles.container}
          tabBarUnderlineColor={"#0087cd"}
          tabBarActiveTextColor={"#464646"}
          tabBarInactiveTextColor={"#cccccc"}
          tabBarTextStyle={styles.tabText}
          onChangeTab={this._onChangeTab}
          prerenderingSiblingsNumber={2}
          renderTabBar={() => <DefaultTabBar backgroundColor='#FFFFFF'/> }
        >
          <TugasList tabLabel={tugasTitle}/>
          <KunjunganList tabLabel={kunjunganTitle}/>
          <PendingList tabLabel={pendingTitle}/>
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
    const pendingCount = state.getIn(['availTasks','pendingTask']).size + state.getIn(['myTasks','pendingTask']).size;
    return {
      pendingCount : pendingCount,
      taskCount : state.getIn(['availTasks','rowCount']),
      kunjunganUpdated : state.getIn(['myTasks','updated']),
    };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectMyTaskTab,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen);
