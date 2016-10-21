/* @flow */
'use strict';
import React, { Component } from 'react';
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
    NativeModules
} from 'react-native';

const ImagePickerManager = NativeModules.ImagePickerManager;

import styles from '../styles/style';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

var capturedBase64='';

var options = {
  title: 'Select Photo', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  //maxWidth: 1024, // photos only
  //maxHeight: 1024, // photos only
  //quality: 0.8, // photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image
  noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    //path: 'images' // will save image at /Documents/images rather than the root
  }
};




export default class CameraScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      avatarSource: null
    };

    this._selectPhoto = this._selectPhoto.bind(this);
  }


  _selectPhoto() {
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        var source;
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        console.log("source", source);
        this.setState({
          avatarSource: source
        });
      }
    });


  }

	render() {

	    return (
        <View style={localStyles.container}>
          <TouchableOpacity onPress={this._selectPhoto}>
            <View style={[localStyles.avatar, localStyles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={localStyles.preview} source={this.state.avatarSource} />
            //<Text>Photo</Text>
            }
            </View>
          </TouchableOpacity>

          {/*<View style={localStyles.preview}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
          </View>*/}
          {/*<Button onPress={this.selectPhoto}
            style={styles.buttonText}
            containerStyle={styles.buttonRounded}>
            Capture
          </Button>*/}
        </View>
	    );
  }
}

const localStyles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    //width: 150,
    //height: 150
  }
});
