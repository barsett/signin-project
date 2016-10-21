/* @flow */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Platform,
    PixelRatio,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';


import gstyles from '../styles/style';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import {MKSpinner} from 'react-native-material-kit';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const propTypes = {
  doc: PropTypes.object,
};


class DocumentScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      source: null,
      isLoading: false,
      count: 0,
    };

  }

  _getImageSource(){
    if (this.props.doc.localBerkas){
      return this.props.doc.localBerkas.source;
    } else {
      return {uri: this.props.doc.links[0].href + '/download?access_token=' + this.props.token};
    }
  }

  _onLoadStart = () =>{
    //console.log("XXXXXX");
    this.setState({isLoading: true, count: 1});
    if (this.state.count < 1){
    }
  }

  _onLoadEnd = () => {
    //console.log("YYYYY");
    this.setState({isLoading: false, count: 2});
    if (this.state.count === 1){

    }
  }


  _getSpinner(){
    if (this.state.isLoading){
      return (
        <View style={styles.spinner}>
          <MKSpinner strokeColor='#ff6600' spinnerAniDuration={500}/>
        </View>
      );
    }
  }

	render() {

	    return (
        <View style={styles.container}>
              <Image style={styles.preview} source={this._getImageSource()}
                onLoadStart={this._onLoadStart}
                onLoadEnd={this._onLoadEnd}>
              </Image>
              {this._getSpinner()}
        </View>
	    );
  }
}

DocumentScreen.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
  spinner: {
    position: 'absolute',
    top: height/2 - 50,
    left: width/2 - 20,

  }

});


const mapStateToProps = (state) => {
  return {
    token: state.getIn(['currentUser','accessToken']),
  };
};


export default connect(mapStateToProps, null)(DocumentScreen);
