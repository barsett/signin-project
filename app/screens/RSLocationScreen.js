/* @flow */
'use strict';

import React, { Component } from 'react';
import { DeviceEventEmitter,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
var Actions = require('react-native-router-flux').Actions;
var MapView = require('react-native-maps');
var styles = require('../styles/style');
import Icon from 'react-native-vector-icons/FontAwesome';

import i18n from '../i18n.js';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.17639563;
const LONGITUDE = 106.82624817;
const LATITUDE_DELTA = 0.0082;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 1;


var RSLocationScreen = React.createClass({

  getInitialState: function () {
    var DELTA;
    var lat;
    var lon;
    if(this.props.roles === 'OTORISATOR'){
      lat = (this.props.data.latitudeRs + this.props.data.latitudeSurveyor)/2;
      lon = (this.props.data.longitudeRs + this.props.data.longitudeSurveyor)/2;
      if(this._getDistance() < 1){
        DELTA = 0.0082;
      } else if(this._getDistance() > 1 && this._getDistance() < 3){
        DELTA = 0.0282;
      } else if(this._getDistance() > 3 && this._getDistance() < 5){
        DELTA = 0.0882;
      } else {
        lat = this.props.data.latitudeRs;
        lon = this.props.data.longitudeRs;
        DELTA = 0.0082;
      }
    }
    return {
      renderPlaceholderOnly: true,
      region: {
       latitude: (this.props.roles === 'OTORISATOR') ? lat : this.props.data.latitudeRs,
       longitude: (this.props.roles === 'OTORISATOR') ? lon : this.props.data.longitudeRs,
       latitudeDelta: (this.props.roles === 'OTORISATOR') ? DELTA : LATITUDE_DELTA,
       longitudeDelta: (this.props.roles === 'OTORISATOR') ? (DELTA*ASPECT_RATIO) : LONGITUDE_DELTA,
      },
      currentLocation: {},
      rsMarker: {
        coordinate: {
          latitude: this.props.data.latitudeRs,
          longitude: this.props.data.longitudeRs,
          title: "RS",
        },
        key: 'RS',
        color: 'red',
        icon: <Icon name="plus-square" style={styles.icon} />
      },
      surveyorMarker: {
        coordinate: {
          latitude: this.props.data.latitudeSurveyor,
          longitude: this.props.data.longitudeSurveyor,
          title: "Surveyor",
        },
        key: 'Surveyor',
        color: 'blue',
        icon: <Icon name="user" style={styles.icon} />
      },
    };
  },

  _getDistance(){
    const radius = 6372.8;
    let dlon = (this.props.data.longitudeSurveyor - this.props.data.longitudeRs) * (3.14/180);
    let dlat = (this.props.data.latitudeSurveyor - this.props.data.latitudeRs) * (3.14/180);
    let a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(this.props.data.latitudeSurveyor * (3.14/180)) * Math.cos(this.props.data.latitudeRs * (3.14/180)) * Math.sin(dlon/2) * Math.sin(dlon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = radius * c;
    return distance;
  },

  _formatDistance(distance){
    if(distance < 1){
      distance = (distance * 1000).toFixed(2) + " meter";
    } else {
      distance = (distance).toFixed(2) + " kilometer"
    }
    return distance;
  },

  componentDidMount: function(){
    //console.log("### COMPONENT DID MOUNT RS LOCATION ###");
    //console.log(this.props);
    InteractionManager.runAfterInteractions(() => {
      this.setState({renderPlaceholderOnly: false});
    });

    /*
    navigator.geolocation.getCurrentPosition(
      (currentLocation) => {
        //var currentLocation = JSON.stringify(position);
        console.log("LOCATION", currentLocation);

        this.setState({
          region: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          currentLocation
        });

        //console.log("STATE",this.state);

      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((currentLocation) => {
      //var lastPosition = JSON.stringify(position);
      console.log("NEW LOCATION", currentLocation);
      //      this.setState({currentLocation});
      var location = currentLocation.coords;
      this.setState({
             region: {
              longitude: location.longitude,
              latitude: location.latitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,

              },
              // markers: [
              //   ...this.state.markers, {
              //     coordinate: {
              //       longitude: location.longitude,
              //       latitude: location.latitude,
              //     },
              //     key: id++,
              //     color: 'red',
              //   }
              //
              // ],
              currentLocation
            });



    });
    */

  },

  componentWillUnmount: function() {
    console.log("componentWillUnmount");
    //navigator.geolocation.clearWatch(this.watchID);
  },

  _randomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  },

  _onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: this._randomColor(),
        },
      ],
    });
  },

  _onRegionChange: function (region) {
    this.setState({ region });
  },

  _renderPlaceholderView: function() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  },

	render: function() {
      if (this.state.renderPlaceholderOnly){
        return this._renderPlaceholderView();
      }

      var rsMarker = <MapView.Marker
        //key={this.state.rsMarker.key}
        coordinate={this.state.rsMarker.coordinate}
        //pinColor={this.state.rsMarker.color}
        //title={this.state.rsMarker.title}
        //description={this.state.rsMarker.title}
        //image={this.state.rsMarker.icon}
      >
        <View style={localStyles.markerContainer}>
          <View style={localStyles.markerContent}>
            <Icon style={localStyles.rsIcon} name="map-marker"/>
            <Text style={localStyles.categoryLabel}>{this.props.data.namaRs}</Text>
          </View>
        </View>
      </MapView.Marker>;

      var surveyorMarker = (this.props.roles === 'OTORISATOR') ?
      <MapView.Marker
        coordinate={this.state.surveyorMarker.coordinate}
      >
        <View style={localStyles.markerContainer}>
          <View style={localStyles.markerContent}>
            <Icon style={localStyles.surveyorIcon} name="map-marker"/>
            <Text style={localStyles.categoryLabel}>{this.props.data.namaSurveyor}</Text>
          </View>
        </View>
      </MapView.Marker> : null;

      var distanceText = (this.props.roles === 'OTORISATOR') ?
        <Text style={localStyles.distanceText}>Surveyor berjarak sekitar {this._formatDistance(this._getDistance())} dari rumah sakit</Text>
        : null;

      var distanceText;
      if(this.props.roles === 'OTORISATOR'){
        if(this.props.data.latitudeSurveyor && this.props.data.longitudeSurveyor){
          distanceText = <Text style={localStyles.distanceText}>Surveyor berjarak sekitar {this._formatDistance(this._getDistance())} dari rumah sakit</Text>;
        } else {
          distanceText = <Text style={localStyles.distanceText}>Lokasi surveyor tidak ditemukan</Text>;
        }
      } else {
        distanceText = null;
      }

	    return (
        <View style={localStyles.container}>

        <MapView
          style={localStyles.map}
          //initialRegion={this.state.region}
          region={this.state.region}
          //onPress={this._onMapPress}
          onRegionChange={this._onRegionChange}
          //showsUserLocation={true}
        >
          {rsMarker}
          {surveyorMarker}
          {/*{this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
            />
          ))}*/}
        </MapView>

        <View style={localStyles.buttonContainer}>
          <View style={localStyles.bubble}>
            <Text style={localStyles.text}>{this.props.data.kodeRs}</Text>
            <Text style={localStyles.text}>{this.props.data.namaRs}</Text>
            <View style={localStyles.address}>
              <Icon name="map-marker" style={localStyles.icon}/>
              <Text style={localStyles.textAddress}>{this.props.data.alamatRs}</Text>
            </View>
            {distanceText}
          </View>
        </View>

      </View>
	    );
  }
});

var localStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    width: width,
    height: 50,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,1)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: width,
    height: 130,
    justifyContent: 'center',
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 20,
    right: 20,
    left: 20,
  },
  text: {
    color: 'black',
    fontSize: getCorrectFontSizeForScreen(12),
    marginBottom: 3,
  },
  distanceText: {
    color: 'black',
    fontSize: getCorrectFontSizeForScreen(8),
    marginBottom: 3,
  },
  textAddress: {
    color: 'grey',
    fontSize: getCorrectFontSizeForScreen(8),
  },
  icon: {
    color: '#3B3738',
    //textAlign: 'center',
    fontSize: getCorrectShapeSizeForScreen(10),
    //marginBottom: 5,
    //marginTop: 3,
    justifyContent: 'center',
    marginRight: 10,
  },
  /*
  icon: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(12),
    justifyContent: 'center',
  },
  */
  address: {
    flex: 1,
    flexDirection: 'row',
  },
  markerContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  markerContent: {
    //flex: 0,
    flexDirection: 'column',
    //alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.5)',
    //padding: 2,
    //opacity: 0.2
    //borderRadius: 3,
    //borderColor: '#D23F44',
    //borderWidth: 0.5,
  },
  categoryLabel: {
    flex:1,
    fontSize: getCorrectFontSizeForScreen(8),
    padding: getCorrectShapeSizeForScreen(4),
    fontWeight:'bold',
    color: 'black',
    textAlignVertical: 'center',
  },
  rsIcon: {
    //width: getCorrectShapeSizeForScreen(40),
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(20),
    textAlignVertical: 'center',
    color: 'red'
  },
  surveyorIcon: {
    //width: getCorrectShapeSizeForScreen(40),
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(20),
    textAlignVertical: 'center',
    color: 'blue'
  },
});

const mapStateToProps = (state) => {
  return {
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(RSLocationScreen);
