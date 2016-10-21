/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  Image,
  RefreshControl,
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
import LakaFilterModal from '../components/LakaFilterModal';
import LakaCell from '../components/LakaCell';
import NoData from '../components/NoData';
import ReferenceService from '../api/ReferenceService';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class LakaSearchScreen extends React.Component {
  constructor(props){
    super(props);
    var kantor = this.props.kodeKantor;
    var wilayah = (kantor !== undefined) ? (kantor).substr(0,2) : '000000';
    this.state = {
        dataSource: ds.cloneWithRows([]),
        isLoading: false,
        wilayah: wilayah,
        flagIrsms: '',
    }

    this._renderRow = this._renderRow.bind(this);
    this._selectLaka = this._selectLaka.bind(this);

  }


  componentDidMount(){
    console.log("Size:" + this.state.dataSource.getRowCount());
    if (this.state.dataSource.getRowCount() === 0) {
      this._showFilter();
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.searchResult !== nextProps.searchResult) {

      // start development of data laka filter
      var received = nextProps.searchResult.toJS()
      // end development of data laka filter

      this.setState({
        isLoading: nextProps.isLoading,
        dataSource: ds.cloneWithRows(received),
      });
    } else {
      this.setState({
        isLoading: nextProps.isLoading,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  _reloadLaka(criteria) {
    console.log("Reloading Laka...");
    this.props.runSearchLaka(criteria);
  }

  _renderRow(doc: Object){
    return (
      <LakaCell survey={this.props.survey} data={doc} onSelect={() => this._selectLaka(doc)}/>
    )
  }

  _selectLaka(doc){
    console.log("select row");
    Actions.lakaDetail({
      links: doc.links,
      idLaka: doc.kecelakaan.idLaka,
      survey: this.props.survey,
      isEditable: (this.state.flagIrsms === 'n'),
      flagIrsms: this.state.flagIrsms,
    });
  }

  _showFilter(){
    //console.log("### BUTTON PRESSED! ###");
    //console.log("Criteria", this.state.criteria);
    this.refs.filterModal.open();
  }

  _setFilter(criteria){
    //console.log("Criteria", criteria);
    this.setState({flagIrsms: criteria.flagIrsms});
    this.props.runSearchLaka(criteria);

  }

  render() {
      let result = null;
      if (this.state.dataSource.getRowCount() === 0){
        result =
          <NoData isLoading={this.state.isLoading} noDataText="Data kecelakaan tidak ditemukan"/>
        ;
      } else {
        result =
          <View style={{flex:1}}>
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
          <LakaFilterModal ref="filterModal"  onSelection={this._setFilter.bind(this)} criteria={this.state.criteria} wilayah={this.state.wilayah} stackSize={this.props.stackSize} />
        </View>

      );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
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
    searchResult: state.getIn(['lakaSearch', 'dataSources']),
    isLoading: state.getIn(['lakaSearch', 'isLoading']),
    namaKantor: state.getIn(['currentUser', 'namaKantor']),
    kodeKantor: state.getIn(['currentUser', 'kodeKantor']),
    stackSize: state.get('currentRoute').stackSize,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runSearchLaka
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(LakaSearchScreen);
