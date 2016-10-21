{/* @flow */}
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
}  from 'react-native';

import { Actions } from 'react-native-router-flux';
import { MKSpinner } from 'react-native-material-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import i18n from '../i18n.js';
//import gstyles from '../styles/style'; // Ketika gstyles sudah tidak dipake jangan lupa untuk dicomment
import StatusSurveyorCell from '../components/StatusSurveyorCell';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import FilterAndSortingBar from '../components/FilterAndSortingBar';
import dismissKeyboard from 'dismissKeyboard';

import { runFetchStatusSurveyor } from '../actions/TaskAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, formatDate } from '../api/Common';

//const {height:h, width:w} = Dimensions.get('window');

// const compare = (a,b) => {
//   var status = ["0", "F0", "F1", "1", "2", "3", "4", "5", "6"];
//   if (status.indexOf(a.survey.statusJaminan) < status.indexOf(b.survey.statusJaminan)) return -1;
//   if (status.indexOf(a.survey.statusJaminan) > status.indexOf(b.survey.statusJaminan)) return 1;
//   return 0;
// }


var ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class StatusSurveyorScreen extends React.Component {
  constructor(props){
    super(props);

    //var {data, sectionIds} = this._renderListViewData(this.props.statusSurveyor.toJS());

    this.state = {
      dataSource: ds.cloneWithRows(this.props.statusSurveyor.toJS()),
      filter: {status: 'ALL'},
      sort: {tenggatResponse: 'asc'},
      isLoading: false,
    };

    this._hasMore = this._hasMore.bind(this);
    this._onLoadMore = this._onLoadMore.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._reloadStatusSurveyor = this._reloadStatusSurveyor.bind(this);
  }

  componentDidMount(){
    //console.log("componentDidMount .. not fetching from server");
    // only reload if datasource is empty otherwise only reload on pulldown action
    // if (this.state.dataSource.getRowCount() === 0) {
    //   this.state.isLoading=true;
    //   InteractionManager.runAfterInteractions(() => {
    //     this._reloadStatusSurveyor();
    //     this.state.isLoading=false;
    //   });
    // }
    this.state.isLoading=true;
    InteractionManager.runAfterInteractions(() => {
        this._reloadStatusSurveyor();
        this.state.isLoading=false;
    });
  }

  componentWillReceiveProps(nextProps){
    console.log("Receiving new Properties with Size: " + nextProps.statusSurveyor.size);

    if (this.props.statusSurveyor !== nextProps.statusSurveyor) {
      console.log("Updating List with new data")

      var {data, sectionIds} = this._renderListViewData(nextProps.statusSurveyor.toJS());

      this.setState({
        //isLoading: nextProps.isLoading,
        dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      });
    } else {
      console.log("New props = old props");

    }
  }

  _renderListViewData(statusSurveyor_list){
    let data = {};
    let sectionIds = ['0', 'F0', 'F1', 'Other'];

    data['0'] = [];
    data['F0'] = [];
    data['F1'] = [];
    data['Other'] = [];

    statusSurveyor_list.map((statusSurveyor_rec) => {
      const section = statusSurveyor_rec.survey.statusJaminan;
      //const section = formatDate(statusSurveyor_rec.survey.tanggalKejadian);
      if (sectionIds.indexOf(section) === -1){
        // sectionIds.push(section);
        data['Other'].push(statusSurveyor_rec);
      } else{
        data[section].push(statusSurveyor_rec);
      }
    });
    return {data, sectionIds};
  }

  _renderSectionHeader(
    task: Object,
    sectionID: number | string,
  ) {
    return (
      <View style={styles.sectionHeader}>
        {/*<Text style={styles.sectionText}></Text>*/}
      </View>
    );
  }

  _hasMore(){
    // check if there is more data on the server
    console.log("hasMore", this.props.moreData );
    //console.log("hasMore");
    return (this.props.moreData);
  }

  _onLoadMore() {
    console.log("_onLoadMore");

    // if !hasMore return
    if (!this._hasMore()){
      console.log("_onLoadMore - No more data");
      return;
    }

    if (this.props.isLoading || this.props.isLoadingTail){
      console.log('_onLoadMore - Still loading data');
      return;
    }

    console.log('_onLoadMore - Getting more Data');
    this.props.runFetchStatusSurveyor();
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
    statusSurveyors: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    //console.log("Render Row:"+ rowID);
    //return false;
    return (
      <StatusSurveyorCell
        key={statusSurveyors.surveyId}
        onSelect={() => this._selectTask(statusSurveyors)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        task={statusSurveyors}/>
    );
  }

  _selectTask(data: Object){
    if (Platform.OS === 'ios') {
    } else {
      dismissKeyboard();
    }
    Actions.detailOtorisasi({data: data});
  }

  _reloadStatusSurveyor() {
    console.log("Reloading StatusSurveyors...");
    this.props.runFetchStatusSurveyor(true, this.state.filter, this.state.sort);
  }

  _filterTask(status) {
    console.log("filter selected: " + status);
    this.refs.filterModal.close();
    let filter = {status: status};

    this.setState({filter: filter});
    this.props.runFetchStatusSurveyor(true, filter, this.state.sort);
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
    this.props.runFetchStatusSurveyor(true, this.state.filter, sort);
  }

  _showSortModal() {
    this.refs.sortModal.open();
  }

  render() {
    console.log("Props Row Count: "+ this.props.statusSurveyor.size );

      var content = this.state.dataSource.getRowCount() === 0 ?
        <NoTask
          isLoading={this.state.isLoading} onRefresh={this._reloadStatusSurveyor}
        /> :
        <ListView style={{flex: 1, top: getCorrectShapeSizeForScreen(8),}}
          ref="listview"
          dataSource={this.state.dataSource}
          enableEmptySections={true}
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
              onRefresh={this._reloadStatusSurveyor}
              tintColor="#666699"
              title="Loading..."
              titleColor="#bf0000"
              colors={['#bf0000', '#bf0000', '#bf0000']}
              progressBackgroundColor="#ffffcc"
            />
          }
        />;

        return (
          <View style={{flex: 1, backgroundColor: '#e5e5e5'}}>
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
      marginTop: getCorrectShapeSizeForScreen(8),
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
      var text = (this.props.isLoading) ? text = i18n.loading : i18n.noMatchFound;

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
  return{
    statusSurveyor: state.getIn(['statusSurveyor', 'dataSource']),
    isLoading: state.getIn(['statusSurveyor','isLoading']),
    isLoadingTail: state.getIn(['statusSurveyor','isLoadingTail']),
    moreData: state.getIn(['statusSurveyor','moreData']),
    role: state.getIn(['currentUser', 'roles'])
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runFetchStatusSurveyor,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusSurveyorScreen);
