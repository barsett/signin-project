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
  InteractionManager
} from 'react-native';
var Actions = require('react-native-router-flux').Actions;
var MapView = require('react-native-maps');
var styles = require('../styles/style');


import i18n from '../i18n.js';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.278592;
const LONGITUDE = 106.724252;
const LATITUDE_DELTA = 0.1222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 1;


var MapScreen = React.createClass({
  getInitialState: function () {
    return {
      renderPlaceholderOnly: true,
      region: {
       latitude: LATITUDE,
       longitude: LONGITUDE,
       latitudeDelta: LATITUDE_DELTA,
       longitudeDelta: LONGITUDE_DELTA,
      },
      currentLocation: {},
      markers: [],
    };
  },

  componentDidMount: function(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({renderPlaceholderOnly: false});
    });

    navigator.geolocation.getCurrentPosition(
      (currentLocation) => {
        //var currentLocation = JSON.stringify(position);
        console.log("LOCATION", currentLocation);

        this.setState({
          region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
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
              longitude: LATITUDE,
              latitude: LONGITUDE,
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


  },

  componentWillUnmount: function() {
    console.log("componentWillUnmount");
    navigator.geolocation.clearWatch(this.watchID);
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

	    return (
        <View style={localStyles.container}>
        <MapView
          style={localStyles.map}
          //initialRegion={this.state.region}
          region={this.state.region}
          onPress={this._onMapPress}
          onRegionChange={this._onRegionChange}
          showsUserLocation={true}
        >
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
            <Text>Tap to create a marker of random color</Text>
          </View>
        </View>
      </View>
	    );
  }
});

var localStyles = StyleSheet.create({
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});



module.exports = MapScreen;
