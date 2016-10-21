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
    Dimensions,
    InteractionManager,
    LayoutAnimation,
    UIManager,
}  from 'react-native';

import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import { MKSpinner } from 'react-native-material-kit';

import i18n from '../i18n.js';
import gstyles from '../styles/style';
//import TaskInfo from '../components/TaskInfo';
import TugasCell from '../components/TugasCell';
//import Spinner from '../components/Spinner';
import { formatDate } from '../api/Common';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runFetchAvailTask, runMoreAvailTask } from '../actions/TaskAction'
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height } from '../api/Common'

const {height:h, width:w} = Dimensions.get('window');

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

class TugasScreen extends React.Component {

  constructor(props){
    super(props);

    var {data, sectionIds} = this._renderListViewData(this.props.tasks.toJS());

    this.state = {
      //dataSource: ds.cloneWithRows([]),
      dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      //isLoading: false,
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

    // Disable Layout Animation
    // if (Platform.OS === 'android') {
    //   UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
  }

  _renderListViewData(tasks){
    let data = {};
    let sectionIds = [];

    //console.log("DATA TASK:", tasks);

    tasks.map((task) =>{
      const section = formatDate(task.survey.creationDate);

      if (sectionIds.indexOf(section) === -1){
        sectionIds.push(section);
        data[section] = [];
      }

      data[section].push(task);
    });
    return {data, sectionIds};
  }

  componentDidMount(){
    console.log("componentDidMount .. not fetching from server");
    // only reload if datasource is empty otherwise only reload on pulldown action
    InteractionManager.runAfterInteractions(() => {
      if (this.state.dataSource.getRowCount() === 0) {
        this._reloadTask();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
      console.log("Receiving new Properties with Size: " + nextProps.tasks.size);


      if (this.props.tasks !== nextProps.tasks) {
        console.log("Updating List with new data");
        var {data, sectionIds} = this._renderListViewData(nextProps.tasks.toJS());
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        this.setState({
          //isLoading: nextProps.isLoading,
          //dataSource: ds.cloneWithRows(nextProps.tasks.toJS()),
          dataSource: ds.cloneWithRowsAndSections(data, sectionIds),

        });
      } else {
        console.log("New Props = Old Props");

        // this.setState({
        //   isLoading: nextProps.isLoading,
        // });
      }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   //console.log("should rerender: ", this.props !== nextProps);
  //   //return this.props !== nextProps;
  // }

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
    // console.log("hasMore", this.props.moreData );
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

  _renderRow(
    task: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    //console.log("Render Row:"+ rowID);
    //return false;
    return (
      <TugasCell
        key={task.survey.kodeSurvey}
        onSelect={() => this._selectTask(task)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        task={task}/>
    );
  }

  _reloadTask() {
    // returns a Promise of reload completion
    // for a Promise-free version see ControlledRefreshableListView below
    console.log("Reloading Task2...");
    this.props.runFetchAvailTask(true);
  }


  render() {
      console.log("Total Tugas: "+ this.state.dataSource.getRowCount() );

      var content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask
          isLoading={this.props.isLoading} onRefresh={this._reloadTask}
        /> :
        <View style={{flex: 1}}>
          <ListView style={{flex: 1}}
            ref="listview"
            renderSeparator={this._renderSeparator}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderSectionHeader={this._renderSectionHeader}
            renderFooter={this._renderFooter}
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
              />}
          />

        </View>;

      return content;

  }
}

const styles = StyleSheet.create({
    centerText: {
      //marginTop: getCorrectShapeSizeForScreen(8),
      alignItems: 'center',
      width: width - getCorrectShapeSizeForScreen(16),
      alignSelf: 'center',
      paddingTop: getCorrectShapeSizeForScreen(60),
      backgroundColor: '#fff',
      height: height - getCorrectShapeSizeForScreen(100),
    },
    notaskBg: {
         alignSelf: 'center',
         backgroundColor: 'transparent',
     },
    noTasksText: {
      color: '#464646',
      fontSize: getCorrectFontSizeForScreen(16),
      fontFamily: 'Roboto',
    },
    separator: {
      height: 2,
      backgroundColor: '#e5e5e5',
    },
    scrollSpinner: {
      alignSelf: 'center',
    },
    rowSeparator: {
      backgroundColor: '#e5e5e5',
      height: 2,
      width: width,
      alignSelf: 'center',
    },
    rowSeparatorHide: {
      opacity: 0.0,
    },
    tabView: {
      flex: 1,
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.01)',
    },
    sectionHeader: {
      backgroundColor: '#e5e5e5',
      alignItems: 'center',
      flexDirection: 'column',
    },
    sectionText: {
      textAlignVertical: 'center',
      fontSize: getCorrectFontSizeForScreen(14),
      fontFamily: 'Roboto-Medium',
      color: '#464646',
      padding: getCorrectShapeSizeForScreen(4),
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

  export default connect(mapStateToProps, mapDispatchToProps)(TugasScreen);
