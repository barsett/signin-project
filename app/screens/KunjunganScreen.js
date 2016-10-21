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

const compare = (a,b) => {
  if (a.survey.statusJaminan < b.survey.statusJaminan) return -1;
  if (a.survey.statusJaminan > b.survey.statusJaminan) return 1;
  return 0;
}


var ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class KunjunganScreen extends React.Component {
  constructor(props){
    super(props);

    // disable grouping by status
    // var {data, sectionIds} = this._renderListViewData(this.props.tasks.toJS());

    this.state = {
      dataSource: ds.cloneWithRows(this.props.tasks.toJS()),
      //dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      filter: {status: 'F0'},
      sort: {tenggatResponse: 'asc'},
      isLoading: false,
    };

    this._selectTask = this._selectTask.bind(this);
    this._hasMore = this._hasMore.bind(this);
    this._onLoadMore = this._onLoadMore.bind(this);
    this._reloadTask = this._reloadTask.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._reloadTask = this._reloadTask.bind(this);

  }

  componentDidMount(){
    //console.log("componentDidMount .. not fetching from server");
    this.state.isLoading=true;
    InteractionManager.runAfterInteractions(() => {
      this.state.isLoading=false;
      // only trigger server fetch when its empty
      if (this.state.dataSource.getRowCount() < 1){
        this._reloadTask();
      }
    });

  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving new Properties with Size: " + nextProps.tasks.size);

    if (this.props.tasks !== nextProps.tasks) {
      console.log("Updating List with new data");

      // var {data, sectionIds} = this._renderListViewData(nextProps.tasks.toJS());

      this.setState({
        dataSource: ds.cloneWithRows(nextProps.tasks.toJS()),
        // dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      });

    } else {
      console.log("New Props = Old Props");

    }

  }

  _renderListViewData(tasks){
    let data = {};
    let sectionIds = ['0', 'F0', 'F1', 'Other'];

    data['0'] = [];
    data['F0'] = [];
    data['F1'] = [];
    data['Other'] = [];

    tasks.map((task) =>{
      const section = task.survey.statusJaminan;
      //console.log(section);
      if (sectionIds.indexOf(section) === -1){
        // sectionIds.push(section);
        data['Other'].push(task);
      } else{
        data[section].push(task);
      }

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
    Actions.taskEdit({data: task});
  }

  _renderSectionHeader(
    task: Object,
    sectionID: number | string,
  ) {
    return (
      <View style={styles.sectionHeader}>
        {/*<Text style={styles.sectionText}>{sectionID}</Text>*/}
      </View>
    );
  }


  _hasMore(){
    // check if there is more data on the server
    //console.log("hasMore", this.props.moreData );
    return (this.props.moreData);
  }

  _onLoadMore() {

    //console.log("_onLoadMore");

    // if !hasMore return
    if (!this._hasMore()){
      //console.log("_onLoadMore - No more data");
      return;
    }

    if (this.props.isLoading || this.props.isLoadingTail){
      //console.log('_onLoadMore - Still loading data');
      return;
    }

    //console.log('_onLoadMore - Getting more Data');
    this.props.runFetchMyTask();
  }

  _renderFooter() {
    if (!this._hasMore() || !this.props.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <MKSpinner style={styles.scrollSpinner} spinnerAniDuration={500}/>
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

  _reloadTask() {
    console.log("Reloading Task...");
    // show alert
    if (this.state.dataSource.getRowCount()  > 0){
      Alert.alert(
        i18n.kunjunganOverwriteAlertTitle,
        i18n.kunjunganOverwriteAlertMessage,
        [
          {text: i18n.cancel, onPress: () => console.log('Cancel Pressed')},
          {text: i18n.yes, onPress: () => this.props.runFetchMyTask(true,this.state.filter, this.state.sort)},
        ]
      );

    } else {
      this.props.runFetchMyTask(true, this.state.filter, this.state.sort);
    }


  }

  _filterTask(status) {
    console.log("filter selected: " + status);
    this.refs.filterModal.close();
    let filter = {status: status};

    this.setState({filter: filter});
    this.props.runFetchMyTask(true, filter, this.state.sort);

  }

  _showFilterModal() {
    this.refs.filterModal.open();
  }

  _sortTask(sortField) {
    console.log("sort selected: " + sortField);
    this.refs.sortModal.close();

    let sort= {};

    if(this.state.sort[sortField] === 'asc'){
      sort[sortField] = 'desc';
    } else {
      sort[sortField] = 'asc';
    }

    this.setState({sort: sort});
    this.props.runFetchMyTask(true, this.state.filter, sort);
  }

  _showSortModal() {
    this.refs.sortModal.open();
  }


  render() {
      console.log("Total Kunjungan: "+ this.state.dataSource.getRowCount() );
      //console.log("Props Row Count: "+ this.props.tasks.size );

      const content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask
          isLoading={this.props.isLoading} onRefresh={this._reloadTask}
        /> :
        <ListView style={{flex: 1}}
            ref="listview"
            renderSeparator={this._renderSeparator}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderFooter={this._renderFooter}
            renderSectionHeader={this._renderSectionHeader}
            renderRow={this._renderRow}
            onEndReached={this._onLoadMore}
            onEndReachedThreshold={30}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.props.isLoading}
                onRefresh={this._reloadTask}
                tintColor="#666699"
                title="Loading..."
                titleColor="#bf0000"
                colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
                progressBackgroundColor="#ffffcc" //Circle color
              />
            }
          />;


    return (
      <View style={{flex: 1}}>
        {content}
        <FilterAndSortingBar onSortPress={this._showSortModal.bind(this)} onFilterPress={this._showFilterModal.bind(this)}/>
        <FilterModal ref={"filterModal"} role={this.props.role} onSelected={this._filterTask.bind(this)} selectedOption={this.state.filter.status}/>
        <SortModal ref={"sortModal"} onSelected={this._sortTask.bind(this)} selectedOption={this.state.sort}/>
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
      //height: getCorrectFontSizeForScreen(8),
    },
    sectionText: {
      fontSize: getCorrectFontSizeForScreen(14),
      textAlignVertical: 'center',
      fontFamily: 'Roboto-Medium',
      color: '#464646',
      padding: getCorrectShapeSizeForScreen(4),
    },
});


class NoTask extends React.Component {
    render() {
      var text = (this.props.isLoading) ? i18n.loading : i18n.noTask;

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
    //console.log("MyTask - MappingStateToProps", state.getIn(['currentUser', 'roles']));

    return {
      tasks: state.getIn(['myTasks','dataSource']),
      isLoading: state.getIn(['myTasks','isLoading']),
      isLoadingTail: state.getIn(['myTasks','isLoadingTail']),
      moreData: state.getIn(['myTasks','moreData']),
      role: state.getIn(['currentUser', 'roles']),
    };

  };

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
  	  runFetchMyTask,
  	}, dispatch);

  };

export default connect(mapStateToProps, mapDispatchToProps)(KunjunganScreen);
