'use strict';

/*
This component is used to show survey information. This will be part of row component in a List
if the list row have action when press then this component must be wrapped in TouchableHighlight
if the list have actionable button then renderRow should contain this component and button component
*/
import React, { Component, PropTypes } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

//import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MKButton, MKSpinner } from 'react-native-material-kit';

import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData} from '../api/Common'
import i18n from '../i18n.js';
import {
  MKProgress,
} from 'react-native-material-kit';
import { JENIS_DOKUMEN } from '../config/Reference.js';


const propTypes = {
  onSelect: PropTypes.func,
  doc: PropTypes.object,
  onLongPress: PropTypes.func,
  mode: PropTypes.bool,
  style: PropTypes.any,
  onHighlight: PropTypes.func,
  onUnhighlight: PropTypes.func,
  key: PropTypes.string,

};


const getJenisDocumentDesc = (id) => {
  //console.log("KesimpulanID", id);
  const jenis = JENIS_DOKUMEN.find((opt) => {
    return opt.id === id;
  })

  if (jenis)  return jenis.desc;
}
/* doc
{
      "berkas": {
        "idBerkas": "c056075130b5598caa76c85f021084fe",
        "kodeSurvey": "coba",
        "tipeBerkas": "ktp",
        "deskripsiBerkas": null,
        "namaFile": "jerry.jpg",
        "tipeFile": "image/jpeg",
        "creator": null,
        "lastModifiedBy": null,
        "lastModification": null,
        "creationDate": null
      },
      localBerkas: {
        source:
        tipeBerkas: "KTP",
        kodeSurvey: "test",
        status: 'new'. //new new, uploading, completed, failed
        progress: .4,

      },
      "links": [
        {
          "rel": "self",
          "href": "http://202.158.55.29:18080/berkas/c056075130b5598caa76c85f021084fe"
        }
      ]

*/

// TODO: render sync status

class DocumentCell extends React.Component {


  _getImageSource = () => {
    if (this.props.doc.localBerkas){
      return this.props.doc.localBerkas.source;
    } else {
      return {uri: this.props.doc.links[0].href + '/thumbnail?access_token=' + this.props.token};
    }
  }

  _getImageType = () => {
    if (this.props.doc.localBerkas){
      return getJenisDocumentDesc(this.props.doc.localBerkas.tipeBerkas);
    } else {
      return getJenisDocumentDesc(this.props.doc.berkas.tipeBerkas);
    }
  }

  _getStatus = () => {
    if (this.props.doc.localBerkas){
      return this.props.doc.localBerkas.status;
    }
  }

  _getId = () => {
    if (this.props.doc.localBerkas){
      return this.props.doc.localBerkas.idBerkas;
    } else {
      return this.props.doc.berkas.idBerkas;

    }
  }


  _getProgress = () => {
    if (this.props.doc.localBerkas){
      if (this.props.doc.localBerkas.status === 'failed'){
        // show completed icon
        return (
        <Icon name='times' style={styles.failed}/>
        );

      } else if (this.props.doc.localBerkas.status === 'completed') {
        return (
          <Icon name='check' style={styles.check}/>
          );
      } else {
          // show completed icon
          return (
            <MKProgress
                ref="progBarWithBuffer"
                style={styles.progress}
                progress={this.props.doc.localBerkas.progress}
                buffer={0.3}
                />
          );
      }

    }
  }

  render() {
    //console.log(this.props.doc);
    //To Do:
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    // let bgColor='white'
    // if (this.props.mode){
    //     bgColor='green';
    // }

    let selected="";
    if (this.props.doc.mark){
      selected=<Icon name='check' style={styles.check}/>;
    }

    return (
      <View style={[styles.square, {backgroundColor: 'white'}]}>
        <TouchableElement
          style={{flex:1, flexDirection: 'column',}}
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
          onLongPress={this.props.onLongPress}>
          <View>
            <Image key={this._getId()}
              style={[styles.icon,this.props.style]}
              source={this._getImageSource()}
            >
            {this._getProgress()}
            </Image>
          </View>
        </TouchableElement>
        <Text style={styles.name}>{this._getImageType()} {selected}</Text>
      </View>
    );
  }
}

DocumentCell.propTypes = propTypes;


const styles = StyleSheet.create({
  square: {
  	margin: 10,
    alignItems: 'center'
  },

  s: {
    backgroundColor: '#ededed',
    flex:1,
    alignSelf: 'center'
  },
  name: {
    color: 'black',
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progress: {
    height: 10,
    alignSelf: 'stretch',
    backgroundColor: '#E5E5E5',
  },
  check: {
    fontSize: 20,
    color: 'green',
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  failed: {
    fontSize: 20,
    color: 'red',
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.getIn(['currentUser','accessToken']),
  };
};


export default connect(mapStateToProps, null)(DocumentCell);
