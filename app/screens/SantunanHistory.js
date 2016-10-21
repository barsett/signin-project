/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Platform,
  ListView,
  Image,
  ScrollView,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { MKSpinner } from 'react-native-material-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from 'react-native-button';

import { runSantunanHistory } from '../actions/SantunanAction';
import SantunanHistoryCell from '../components/SantunanHistoryCell';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width, formatDate } from '../api/Common';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SantunanHistory extends React.Component {

  constructor(props){
    super(props);

    var data = this._renderListViewData(this.props.santunanHistory.toJS());

    this.state = {
        dataSource: ds.cloneWithRows(data),
        isLoading: false,
    }

    this._renderRow = this._renderRow.bind(this);
    this._reloadSantunanHistory = this._reloadSantunanHistory.bind(this);
  }

  _renderListViewData(santunanHistory_list){
    let data = [];
    santunanHistory_list.map((santunan_historyRec) => {
      data.push(santunan_historyRec)
    });
    return data;
  }

  componentDidMount(){
    console.log("Size:" + this.state.dataSource.getRowCount());
    if (this.state.dataSource.getRowCount() === 0) {
      this.state.isLoading=true;
      this._reloadSantunanHistory();
      this.state.isLoading=false;
    }

  }

  componentWillReceiveProps(nextProps){
    if (this.props.santunanHistory !== nextProps.santunanHistory) {
      var data = this._renderListViewData(nextProps.santunanHistory.toJS());
      this.setState({...this.state,
        isLoading: nextProps.isLoading,
        dataSource: ds.cloneWithRows(data),
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

  _reloadSantunanHistory() {
    console.log("Reloading Santunan History...");
    this.props.runSantunanHistory(this.props.noBerkas);
  }

  _renderRow(data: Object){
    return (
      <SantunanHistoryCell data={data}/>
    )
  }

  render() {
    console.log("No Berkas Santunan 3:", this.props.noBerkas);

    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoTask
        isLoading={this.state.isLoading} onRefresh={this._reloadSantunanHistory}
      /> :
      <ListView style={{flex: 1}}
        ref="listview"
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={this._renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._reloadSantunanHistory}
            tintColor="#666699"
            title="Loading..."
            titleColor="#bf0000"
            colors={['#bf0000', '#bf0000', '#bf0000']}
            progressBackgroundColor="#ffffcc"
          />
        }
      />;

      return content;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  row: {
    backgroundColor: 'yellow',

  },
  header: {
    backgroundColor: 'green',
    height: 50,
  },
  text: {
    color: 'black',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  buttonRounded: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    borderRadius: 0,
  },
  scrollSpinner: {
    alignSelf: 'center',
  },
  noTasksText: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(16),
    fontFamily: 'Roboto',
  },
  centerText: {
    marginTop: getCorrectShapeSizeForScreen(8),
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: getCorrectShapeSizeForScreen(60),
    //backgroundColor: '#ffffff',
    //height: height,
    //width: width - getCorrectShapeSizeForScreen(15),
  }
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
  return {
    santunanHistory: state.getIn(['santunanHistory', 'dataSource']),
    isLoading: state.getIn(['santunanHistory','isLoading']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runSantunanHistory,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SantunanHistory);
