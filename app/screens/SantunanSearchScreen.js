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
  TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { runSearchLaka } from '../actions/LakaAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, width, height} from '../api/Common';
import { MKSpinner } from 'react-native-material-kit';
import gstyles from '../styles/style';
import i18n from '../i18n';
import SantunanFilterModal from '../components/SantunanFilterModal';
import SantunanCell from '../components/SantunanCell';
import NoData from '../components/NoData';
import { runSantunanSearch } from '../actions/SantunanAction';
import dismissKeyboard from 'dismissKeyboard';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SantunanSearchScreen extends React.Component {
  constructor(props){
    super(props);

    var data = this._renderListViewData(this.props.santunanSearch.toJS());

    this.state = {
        name: null,
        tanggalPengajuan: null,
        tanggalKejadian: null,
        noBerkas: null,
        dataSource: ds.cloneWithRows(data),
        isLoading: false,
    }

    this._renderRow = this._renderRow.bind(this);
    this._selectSantunan = this._selectSantunan.bind(this);
  }

  _renderListViewData(santunan_list){
    let data = [];
    santunan_list.map((santunan_rec) => {
      data.push(santunan_rec)
    });
    return data;
  }

  componentDidMount(){
    console.log("Size:" + this.state.dataSource.getRowCount());
    if ("criteria" in this.props) {
      this._reloadSantunan(this.props.criteria);
    } else {
      this._showFilter();
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.santunanSearch !== nextProps.santunanSearch) {
      var data = this._renderListViewData(nextProps.santunanSearch.toJS());
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

  _reloadSantunan(criteria) {
    console.log("Reloading Santunan...");
    this.props.runSantunanSearch(criteria);
  }

  _renderRow(data: Object){
    return (
      <SantunanCell data={data} onSelect={() => this._selectSantunan(data)}/>
    )
  }

  _selectSantunan(data: Object){
    if (Platform.OS === 'ios') {
    } else {
      dismissKeyboard();
    }
    Actions.santunanDetail({noBerkas: data.santunan.noBerkas});
  }

  _showFilter(){
    this.refs.filterModal.open();
  }

  _setFilter(criteria){
    this.props.runSantunanSearch(criteria);
  }

  render() {
    let result = null;
    if (this.state.dataSource.getRowCount() === 0){
      result =
        <NoData isLoading={this.state.isLoading} noDataText="Data Santunan tidak ditemukan"/>
      ;
    } else {
      result =
        <View style={{flex:1, backgroundColor: '#ffffff'}}>
          <ListView style={{flex: 1}}
            ref="listview"
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={this._renderRow}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            refreshControl = {
              <RefreshControl
                refreshing={this.state.isLoading}
                tintColor="#666699"
                title="Loading..."
                titleColor="#bf0000"
                colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
                progressBackgroundColor="#ffffcc" //Circle color
              />
            }
          />
        </View>
      ;
    }
        return (
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>HASIL PENCARIAN</Text>
            </View>
            {result}
            <TouchableOpacity onPress={this._showFilter.bind(this)}>
              <View style={styles.searchButtonContainer}>
                <Icon style={styles.categoryIcon} name="search" ></Icon>
                <Text style={styles.buttonText}>Perbarui Pencarian</Text>
              </View>
            </TouchableOpacity>
            <SantunanFilterModal ref="filterModal"  onSelection={this._setFilter.bind(this)}/>
          </View>
        );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    //alignSelf: 'center',
    flex:1,
    backgroundColor: '#e5e5e5',
    //paddingTop: getCorrectShapeSizeForScreen(8),
    paddingLeft: getCorrectShapeSizeForScreen(8),
    paddingRight: getCorrectShapeSizeForScreen(8),
  },
  searchButtonContainer: {
    height: getCorrectFontSizeForScreen(40),
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24abe2',
    marginTop: getCorrectShapeSizeForScreen(2),
    marginBottom: getCorrectShapeSizeForScreen(8),
  },
  loadingText: {
    color:'black',
    fontSize:getCorrectFontSizeForScreen(24),
    alignSelf: 'center',
  },
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
    backgroundColor: '#ffffff',
    height: getCorrectShapeSizeForScreen(35),
    marginTop: getCorrectShapeSizeForScreen(8),
    marginBottom: getCorrectShapeSizeForScreen(2),
    paddingLeft: getCorrectShapeSizeForScreen(10),
    justifyContent: 'center',
  },
  title: {
    fontSize: getCorrectFontSizeForScreen(12),
    fontFamily: 'Roboto',
    color: '#464646',
  },
  text: {
    color: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: getCorrectFontSizeForScreen(14),
    textAlignVertical: 'center',
    fontFamily: 'Roboto',
  },
  buttonRounded: {
    backgroundColor: '#24abe2',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 0,
  },
  categoryIcon: {
    //backgroundColor: 'black',
    fontSize: getCorrectFontSizeForScreen(16),
    color: 'white',
    textAlignVertical: 'center',
    marginRight: 10,
  },
  spinner: {
    alignSelf: 'center',
    margin: 30,
  }
});


const mapStateToProps = (state) => {
  return {
    santunanSearch: state.getIn(['santunanSearch', 'dataSource']),
    isLoading: state.getIn(['santunanSearch','isLoading']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runSantunanSearch,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SantunanSearchScreen);
