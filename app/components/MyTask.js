'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    Platform,
    RefreshControl,
    InteractionManager,
    ScrollView,
} from 'react-native';

import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import i18n from '../i18n.js';
import gstyles from '../styles/style';
import KunjunganCell from '../components/KunjunganCell';
import debug from '../debug';
import FilterModal from './FilterModal';
import SortModal from './SortModal';
import FilterAndSortingBar from '../components/FilterAndSortingBar';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runFetchMyTask, runMoreMyTask } from '../actions/TaskAction'


const compare = (a,b) => {
  if (a.survey.hospital.hospitalName < b.survey.hospital.hospitalName) return -1;
  if (a.survey.hospital.hospitalName > b.survey.hospital.hospitalName) return 1;
  return 0;
}


var ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class MyTask extends React.Component {
  constructor(props){
    super(props);

    var {data, sectionIds} = this._renderListViewData(this.props.tasks.toJS().sort(compare));

    this.state = {
      //dataSource: ds.cloneWithRows(this.props.tasks.toJS()),
      dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
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
    console.log("componentDidMount .. not fetching from server");
    this.state.isLoading=true;
    InteractionManager.runAfterInteractions(() => {
      this.state.isLoading=false;
    });
    // only trigger server fetch on pulldown
    // this.props.runSearchTasks();

  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving new Properties with Size: " + nextProps.tasks.size);

    if (this.props.tasks !== nextProps.tasks) {
      console.log("Updating List with new data");
      this.setState({ ...this.state,
        isLoading : nextProps.isLoading,
        dataSource: ds.cloneWithRows(nextProps.tasks.toJS()),
      });

    } else {
      console.log("New Props = Old Props");
      this.setState({ ...this.state,
        isLoading : nextProps.isLoading,
      });
    }

  }

  _renderListViewData(tasks){
    let data = {};
    let sectionIds = [];

    //console.log("DATA TASK:", tasks);

    tasks.map((task) =>{
      let section = task.survey.kodeRs

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
    Actions.taskEdit({data: task});
  }

  _renderSectionHeader(
    task: Object,
    sectionID: number | string,
  ) {
    return (
      <View style={styles.sectionHeader}>
        <Text>{sectionID}</Text>
      </View>
    );
  }


  _hasMore(){
    // check if there is more data on the server
    console.log("hasMore", this.props.moreData );
    return (this.props.moreData);
  }

  _onLoadMore() {

    console.log("_onLoadMore");

    // if !hasMore return
    if (!this._hasMore()){
      console.log("_onLoadMore - No more data");
      return;
    }

    if (this.props.isLoading){
      console.log('_onLoadMore - Still loading data');
      return;
    }

    console.log('_onLoadMore - Getting more Data');
    this.props.runFetchMyTask();
  }

  _renderFooter() {
    if (!this._hasMore() || !this.props.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <Spinner/>
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
    this.props.runFetchMyTask(true);
  }

  _filterTask(status) {
    console.log("filter selected: " + status);
    this.refs.filterModal.close();
  }

  _showFilterModal() {
    this.refs.filterModal.open();
  }

  _sortTask(status) {
    console.log("sort selected: " + status);
    this.refs.sortModal.close();
  }

  _showSortModal() {
    this.refs.sortModal.open();
  }


  render() {
      console.log("State Row Count: "+ this.state.dataSource.getRowCount() );
      console.log("Props Row Count: "+ this.props.tasks.size );

      const content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask
          isLoading={this.state.isLoading} onRefresh={this._reloadTask}
        /> :
        <View style={{flex: 1}}>
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
                refreshing={this.state.isLoading}
                onRefresh={this._reloadTask}
                tintColor="#ff0000"
                title="Loading..."
                titleColor="#00ff00"
                colors={['#ff0000', '#ff0000', '#ff0000']} // spinning arrow color
                progressBackgroundColor="#ffff00" //Circle color
              />
            }
          />
        <FilterAndSortingBar onSortPress={this._showSortModal.bind(this)} onFilterPress={this._showFilterModal.bind(this)}/>
          <FilterModal ref={"filterModal"} onSelected={this._filterTask.bind(this)}/>
          <SortModal ref={"sortModal"} onSelected={this._sortTask.bind(this)}/>
        </View>;

    return content;

  }
}

const styles = StyleSheet.create({

    centerText: {
      alignItems: 'center',
    },
    noTasksText: {
      marginTop: 80,
      color: '#888888',
    },
    separator: {
      height: 1,
      backgroundColor: '#eeeeee',
    },
    scrollSpinner: {
      marginVertical: 20,
    },
    rowSeparator: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      height: 1,
      marginLeft: 4,
    },
    rowSeparatorHide: {
      opacity: 0.0,
    },
    container: {
      flex: 1,
      marginTop: 30,
    },
    tabView: {
      flex: 1,
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.01)',
    },
    sectionHeader: {
      backgroundColor: 'grey',
      alignItems: 'center',
    },


});


class NoTask extends React.Component {
    render() {
      var text = (this.props.isLoading) ? text = i18n.loading : i18n.noTask;

      return (
        <ScrollView style={styles.bg}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#ff0000', '#ff0000']} // spinning arrow color
              progressBackgroundColor="#ffff00" //Circle color
            />
          }
          >
          <Text style={styles.noTasksText}> {text} </Text>
        </ScrollView>

      );

    }
}

const mapStateToProps = (state) => {
    //console.log("MyTask - MappingStateToProps");

    return {
      tasks: state.getIn(['myTasks','dataSource']),
      isLoading: state.getIn(['myTasks','isLoading']),
      isLoadingTail: state.getIn(['myTasks','isLoadingTail']),
      moreData: state.getIn(['myTasks','moreData']),
    };

  };

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
  	  runFetchMyTask,
  	}, dispatch);

  };

export default connect(mapStateToProps, mapDispatchToProps)(MyTask);
