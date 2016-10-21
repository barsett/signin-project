/* @flow */
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
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runFetchApproval, runApproveAuthorization } from '../actions/ApprovalAction';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { MKSpinner } from 'react-native-material-kit';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import OtorisasiCell from '../components/OtorisasiCell';
import TugasCell from '../components/TugasCell';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common'
import NoData from '../components/NoData';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const compare = (a,b) => {
  if (a.survey.tanggalKejadian < b.survey.tanggalKejadian) return -1;
  if (a.survey.tanggalKejadian > b.survey.tanggalKejadian) return 1;
  return 0;
}


var ds = new ListView.DataSource(
  {
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);

class OtorisasiScreen extends React.Component {
  constructor(props){
    super(props);
    var {data, sectionIds} = this._renderListViewData(this.props.approvals.toJS().sort(compare));
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      isLoading: false,
    };

    this._hasMore = this._hasMore.bind(this);
    this._onLoadMore = this._onLoadMore.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderSectionHeader = this._renderSectionHeader.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._reloadApproval = this._reloadApproval.bind(this);
    //this._render = this._render.bind(this);
  }

  _renderListViewData(otorisasi_list){
    let data = {};
    let sectionIds = [];

    otorisasi_list.map((otorisasi_rec) => {
      let section = new Date(otorisasi_rec.survey.tanggalKejadian);
      section = formatDate(section);
      if (sectionIds.indexOf(section) === -1){
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(otorisasi_rec);
    });
    return {data, sectionIds};
  }

  componentDidMount(){
    console.log("componentDidMount .. not fetching from server");
    // to avoid double fetching from notification event
    if (this.props.disableReload) return


    // only reload if datasource is empty otherwise only reload on pulldown action    
    if (this.state.dataSource.getRowCount() === 0) {
      this.state.isLoading=true;
      InteractionManager.runAfterInteractions(() => {
        this._reloadApproval();
        this.state.isLoading=false;
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.approvals !== nextProps.approvals) {
      var {data, sectionIds} = this._renderListViewData(nextProps.approvals.toJS().sort(compare));
      this.setState({...this.state,
        isLoading: nextProps.isLoading,
        dataSource: ds.cloneWithRowsAndSections(data, sectionIds),
      });
    } else {
      this.setState({...this.state,
        isLoading: nextProps.isLoading,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
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

    if (this.props.isLoading|| this.props.isLoadingTail){
      console.log('_onLoadMore - Still loading data');
      return;
    }

    console.log('_onLoadMore - Getting more Data');
    this.props.runFetchApproval();
    //console.log("###PROPS###");
    //console.log(this.props);
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
    otorisasi: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    //console.log("Render Row:"+ rowID);
    //return false;
    return (
      <OtorisasiCell
        key={otorisasi.survey.kodeSurvey}
        //onSelect={() => this._selectTask(task)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        task={otorisasi}/>
    );
  }

  _reloadApproval() {
    console.log("Reloading Approval...");
    this.props.runFetchApproval(true);
  }

  render() {
      console.log("Render Approval List: "+ this.state.dataSource.getRowCount() );
      if(this.state.dataSource.getRowCount()!==0){
        return (
          <ListView style={{flex: 1, backgroundColor: '#e5e5e5', paddingTop: getCorrectShapeSizeForScreen(8),}}
            dataSource = {this.state.dataSource}
            renderRow = {this._renderRow}
            enableEmptySections={true}
            onEndReachedThreshold={30}
            onEndReached={this._onLoadMore}
            renderFooter={this._renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this._reloadApproval}
                tintColor="#666699"
                title="Loading..."
                titleColor="#bf0000"
                colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
                progressBackgroundColor="#ffffcc" //Circle color
              />}
          />
        );
      }
      else{
        return (
          <NoData isLoading={this.state.isLoading} noDataText="Data otorisasi tidak ditemukan"/>
        );
      }
  }
}

class NoTask extends React.Component {
    render() {
      var text = (this.props.isLoading) ? text = i18n.loading : i18n.noTask;

      return (
        <ScrollView style={styles.bg}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              tintColor="#666699"
              title="Loading..."
              titleColor="#bf0000"
              colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
              progressBackgroundColor="#ffffcc" //Circle color
            />
          }
          >
          <View style={styles.centerText}>
            <Text style={styles.noTasksText}> Tidak ada otorisasi </Text>
          </View>
        </ScrollView>

      );
    }
}

const styles = StyleSheet.create({
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
    marginBottom: getCorrectShapeSizeForScreen(20),
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

const mapStateToProps = (state) => {
  return{
    approvals: state.getIn(['approvals', 'dataSource']),
    moreData: state.getIn(['approvals','moreData']),
    isLoading: state.getIn(['approvals','isLoading']),
    isLoadingTail: state.getIn(['approvals','isLoadingTail']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runFetchApproval,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OtorisasiScreen);
