import React, { PropTypes, Component } from 'react';
import {
    View,
    Text,
    ListView,
    TouchableHighlight,
    TouchableNativeFeedback,
    StyleSheet,
    Platform,
} from 'react-native';

import SearchBar from './SearchBar';
import ReferenceService from '../api/ReferenceService';
import Icon from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width } from '../api/Common.js';

const propTypes = {
  onSelect: PropTypes.func,
  keyword: PropTypes.string,
  domain: PropTypes.string,
};

var ds = new ListView.DataSource(
  {
    rowHasChanged: (r1, r2) => r1 !== r2,
  }
);


class LookupReference extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: false,
      filter: null,
    };
  }

  renderFooter = () => {
  }

  renderSeparator = (
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) => {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    )
  }

  renderRow = (
    data: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) => {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    return (
      <TouchableElement
        style={{flex:1, flexDirection: 'column',}}
        onPress={() => this.props.onSelect(data)}
        onShowUnderlay={() => highlightRowFunc(sectionID, rowID)}
        onHideUnderlay={() => highlightRowFunc(null, null)}>
        <View style={styles.row}>
          <Text style={styles.listinput}>{data.id} {data.desc}</Text>
        </View>
      </TouchableElement>
    );
  }

  onSearchChange = (event: Object) => {
    var filter = event.nativeEvent.text.toLowerCase();
    //console.log("Keyword: ",filter);
    const result = ReferenceService.findByKodeWilayah(this.props.domain, filter, this.props.filter);
    this.setState({
      dataSource: ds.cloneWithRows(result),
      filter: filter,
    });

  }

  render() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoResult
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;


    const placeholder = i18n.search + " " + this.props.domain.toLowerCase() + " ...";

    return (
      <View style={styles.container}>
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          placeholder={placeholder}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        />
        <View style={styles.separator} />
        {content}
      </View>
    );
  }
}


LookupReference.propTypes = propTypes;


class NoResult extends React.Component {
  render() {
    var text = '';
    if (this.props.filter) {
      text = `${i18n.noResultFor} "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = i18n.noMatchFound;
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noResultText}>{text}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width - getCorrectShapeSizeForScreen(22),
    alignSelf: 'center',
  },
  centerText: {
    alignItems: 'center',
  },
  noResultText: {
    marginTop: getCorrectShapeSizeForScreen(50),
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(14),
    fontFamily: 'Roboto',
  },
  separator: {
    height: 2,
    backgroundColor: '#ccc',
    marginLeft: getCorrectShapeSizeForScreen(5),
    marginRight: getCorrectShapeSizeForScreen(5)
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: '#e5e5e5',
    height: 2,
    marginLeft: getCorrectShapeSizeForScreen(5),
    marginRight: getCorrectShapeSizeForScreen(5)
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  listinput: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(12),
    margin: getCorrectShapeSizeForScreen(5),
  },
});


export default LookupReference;
