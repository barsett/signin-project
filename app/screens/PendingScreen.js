'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    Platform,
    RefreshControl,
    Alert,
    InteractionManager,
    ScrollView,
} from 'react-native';

import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import { MKSpinner } from 'react-native-material-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import i18n from '../i18n.js';
import gstyles from '../styles/style';
import KunjunganCell from '../components/KunjunganCell';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import FilterAndSortingBar from '../components/FilterAndSortingBar';
import { formatDate } from '../api/Common';


import { runFetchMyTask, runMoreMyTask } from '../actions/TaskAction'
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';


const consolidatePendingTask = (pendingAcceptTasks, pendingUpdateTasks) => {
  let pendingTasks = [];

  pendingAcceptTasks.map((task) => {
    task = task.set('type','Pending Accept');
    pendingTasks.push(task.toJS());
  });
  pendingUpdateTasks.map((task) => {
    task = task.set('type','Pending Update');
    pendingTasks.push(task.toJS());
  });
  return pendingTasks;
}

const ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class PendingScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

    this._selectTask = this._selectTask.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderRow = this._renderRow.bind(this);

  }

  componentDidMount(){
    this.state.isLoading=true;
    InteractionManager.runAfterInteractions(() => {
      this.state.isLoading=false;
    });

  }

  componentWillReceiveProps(nextProps) {
    const pendingTasks = consolidatePendingTask(nextProps.pendingAcceptTasks, nextProps.pendingUpdateTasks);
    //console.log("Pending Tasks ", pendingTasks);
    let {data, sectionIds} = this._renderListViewData(pendingTasks);
    this.setState({
        dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
    });

  }

  _renderListViewData(tasks){
    let data = {};
    let sectionIds = [];

    tasks.map((task) =>{
      const section = task.type;

      if (sectionIds.indexOf(section) === -1){
        sectionIds.push(section);
        data[section] = [];
      }

      data[section].push(task);
    });
    //console.log(data,sectionIds);
    return {data, sectionIds};

  }

  _selectTask(task: Object) {
    console.log("Selecting Task");
    // will dispatch action to navigate with param taskid
    if (Platform.OS === 'ios') {
    } else {
      dismissKeyboard();
    }
    //Actions.taskEdit({data: task});
  }

  _renderSectionHeader(
    task: Object,
    sectionID: number | string,
  ) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionText}>{sectionID}</Text>
      </View>
    );
  }


  _renderFooter() {
  }

  _renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  _renderRow(
    task: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    //console.log("_renderRow", task);
    return (
      <KunjunganCell
        key={task.surveyId}
        onSelect={() => this._selectTask(task)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        task={task}/>
    );
  }

  render() {
      console.log("State Row Count: "+ this.state.dataSource.getRowCount() );
      //console.log("Props Row Count: "+ this.props.tasks.size );

      const content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask/> :
        <ListView style={{flex: 1}}
            ref="listview"
            renderSeparator={this._renderSeparator}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderFooter={this._renderFooter}
            renderSectionHeader={this._renderSectionHeader}
            renderRow={this._renderRow}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />;


    return (
      <View style={{flex: 1}}>
        {content}
      </View>
    );

  }
}

const styles = StyleSheet.create({
    // DO NOT ENABLE THIS. IT WILL CAUSE BUG IN ANDROID
    // bg: {
    //   backgroundColor: '#e5e5e5',
    // },
    centerText: {
      flex: 1,
      marginTop: getCorrectShapeSizeForScreen(0),
      alignItems: 'center',
      width: width - getCorrectShapeSizeForScreen(16),
      alignSelf: 'center',
      paddingTop: getCorrectShapeSizeForScreen(60),
      backgroundColor: '#fff',
      height: height - getCorrectShapeSizeForScreen(100),
    },
    noTasksText: {
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(16),
      fontFamily: 'Roboto',
    },
    separator: {
      height: 1,
      backgroundColor: '#e5e5e5',
    },
    scrollSpinner: {
      alignSelf: 'center',
    },
    rowSeparator: {
      backgroundColor: '#e5e5e5',
      height: 2,
    },
    rowSeparatorHide: {
      opacity: 0.0,
    },
    tabView: {
      flex: 1,
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    sectionHeader: {
      backgroundColor: '#e5e5e5',
      alignItems: 'center',
      height: getCorrectFontSizeForScreen(20),
    },
    sectionText: {
      fontSize: getCorrectFontSizeForScreen(12),
      textAlignVertical: 'center',
      fontFamily: 'Roboto-Medium',
      color: '#464646',
      padding: getCorrectShapeSizeForScreen(2),
    },
});


class NoTask extends React.Component {
    render() {
      return (
          <ScrollView style={styles.bg}>
              <View style={styles.centerText}>
                <Text style={styles.noTasksText}> {i18n.noPending} </Text>
              </View>
          </ScrollView>
      );

    }
}

const mapStateToProps = (state) => {
    //console.log("MyTask - MappingStateToProps");

    return {
      pendingAcceptTasks: state.getIn(['availTasks','pendingTask']),
      pendingUpdateTasks: state.getIn(['myTasks','pendingTask']),
    };

  };

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
  	  runFetchMyTask,
  	}, dispatch);

  };

export default connect(mapStateToProps, mapDispatchToProps)(PendingScreen);
