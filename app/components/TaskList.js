'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Platform,
    InteractionManager,
}  from 'react-native';

import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import i18n from '../i18n.js';
import gstyles from '../styles/style';
//import TaskInfo from '../components/TaskInfo';
import TugasCell from '../components/TugasCell';
import Spinner from '../components/Spinner';
import { formatDate } from '../api/Common';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runFetchAvailTask, runMoreAvailTask } from '../actions/TaskAction'

const compare = (a,b) => {
  if (a.survey.creationDate < b.survey.creationDate) return -1;
  if (a.survey.creationDate > b.survey.creationDate) return 1;
  return 0;
}


var ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class TaskList extends React.Component {

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
    this._renderHeader = this._renderHeader.bind(this);
    this._renderSectionHeader = this._renderSectionHeader.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._reloadTask = this._reloadTask.bind(this);
  }

  _renderListViewData(tasks){
    let data = {};
    let sectionIds = [];

    //console.log("DATA TASK:", tasks);

    tasks.map((task) =>{
      section = formatDate(task.survey.creationDate);

      if (sectionIds.indexOf(section) === -1){
        sectionIds.push(section);
        data[section] = [];
      }

      data[section].push(task);
    });
    //console.log(data,sectionIds);
    return {data, sectionIds};

  }

  componentDidMount(){
    console.log("componentDidMount .. not fetching from server");
    // only reload if datasource is empty otherwise only reload on pulldown action
    if (this.state.dataSource.getRowCount() === 0) {
      this.state.isLoading=true;
      InteractionManager.runAfterInteractions(() => {
        this._reloadTask();
        this.state.isLoading=false;
      });
    }
  }

  componentWillReceiveProps(nextProps) {
      console.log("Receiving new Properties with Size: " + nextProps.tasks.size);

      if (this.props.tasks !== nextProps.tasks) {
        console.log("Updating List with new data");

        var {data, sectionIds} = this._renderListViewData(nextProps.tasks.toJS().sort(compare));

        this.setState({ ...this.state,
          isLoading: nextProps.isLoading,
          //dataSource: ds.cloneWithRows(nextProps.tasks.toJS()),
          dataSource: ds.cloneWithRowsAndSections(data, sectionIds),

        });

      } else {
        console.log("New Props = Old Props");

        this.setState({...this.state,
          isLoading: nextProps.isLoading,
        });
      }
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log("should rerender: ", this.props !== nextProps);
    return this.props !== nextProps;
  }

  _selectTask(task: Object) {
    console.log("Selecting Task");
    // will dispatch action to navigate with param taskid
    if (Platform.OS === 'ios') {
    } else {
      dismissKeyboard();
    }

    // no action since it wont show detail page
    //Actions.taskDetail({data: task});
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

    if (this.props.isLoading|| this.props.isLoadingTail){
      console.log('_onLoadMore - Still loading data');
      return;
    }

    console.log('_onLoadMore - Getting more Data');
    this.props.runFetchAvailTask();
  }

  _renderHeader() {
    return <FilterAndSortingBar/>
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

  _renderRow(
    task: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <TugasCell
        key={task.kodeSurvey}
        onSelect={() => this._selectTask(task)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        task={task}/>
    );
  }

  _reloadTask() {
    // returns a Promise of reload completion
    // for a Promise-free version see ControlledRefreshableListView below
    console.log("Reloading Task...");
    this.props.runFetchAvailTask(true);
  }


  render() {
      console.log("Render Task List: "+ this.state.dataSource.getRowCount() );

      var content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask
          isLoading={this.state.isLoading} onRefresh={this._reloadTask}
        /> :
        <View style={{flex: 1}}>
          <ListView style={{flex: 1}}
            ref="listview"
            //renderHeader={this._renderHeader}
            renderSeparator={this._renderSeparator}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            //initialListSize={10}
            renderSectionHeader={this._renderSectionHeader}
            renderFooter={this._renderFooter}
            renderRow={this._renderRow}
            onEndReached={this._onLoadMore}
            onEndReachedThreshold={30}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this._reloadTask}
                tintColor="#ff0000"
                title="Loading..."
                titleColor="#00ff00"
                colors={['#00ff00', '#00ff00', '#00ff00']} // spinning arrow color
                progressBackgroundColor="#ffff00" //Circle color
              />}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}/>

        </View>;

      return content;

  }
}

const styles = StyleSheet.create({
    centerText: {
      alignItems: 'center',
    },
    noTasksText: {
      marginTop: 5,
      color: '#727182',
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
      backgroundColor: '#f5f6f8',
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
    //console.log("TaskList - MappingStateToProps");

    return {
      tasks: state.getIn(['availTasks','dataSource']),
      isLoading: state.getIn(['availTasks','isLoading']),
      isLoadingTail: state.getIn(['availTasks','isLoadingTail']),
      moreData: state.getIn(['availTasks','moreData']),
    };

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      runFetchAvailTask,
  	}, dispatch);

  };

  export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
