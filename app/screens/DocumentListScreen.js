/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  InteractionManager,
  NativeModules,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import Picker from 'react-native-picker';
import dismissKeyboard from 'dismissKeyboard';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

const ImagePickerManager = NativeModules.ImagePickerManager;

import { runFetchDocuments, runAddDocument, markDocument, runDeleteDocumentBulk } from '../actions/DocumentAction';
import gstyles from '../styles/style';
import i18n from '../i18n.js';
import DocumentCell from '../components/DocumentCell.js';


const docTypes= ['SIM', 'KTP', 'LAKA', 'OTHER'];
import { JENIS_DOKUMEN } from '../config/Reference.js';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const options = {
  title: '---Pilih Photo---', // specify null or empty string to remove the title
  cancelButtonTitle: 'Batal',
  takePhotoButtonTitle: 'Ambil Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Pilih Dari Galeri...', // specify null or empty string to remove this button
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

const getJenisDocumentId = (desc) => {
  //console.log("KesimpulanID", id);
  const jenis = JENIS_DOKUMEN.find((opt) => {
    return opt.desc === desc;
  })

  if (jenis)  return jenis.id;
}

const documentOptions = JENIS_DOKUMEN.map((opt) => {
  return opt.desc;
});


class DocumentListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: false,
      newBerkas: {},
      editMode: false,
      bgColor: 'white',
    }

    this._onSelect = this._onSelect.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._enableEditMode = this._enableEditMode.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log('getting new document props')
    const newDs = nextProps.docs.get(this.props.kodeSurvey);
    const isLoading = nextProps.isLoading.get(this.props.kodeSurvey);

    if (newDs){
      this.setState( {
        dataSource: ds.cloneWithRows(newDs.toJS()),
        isLoading: isLoading,
      });
    } else {
      this.setState( {
        isLoading: isLoading,
      });

    }


  }

  componentDidMount(){
    //console.log(this.props);
    InteractionManager.runAfterInteractions(() => {
      this.props.runFetchDocuments(this.props.kodeSurvey);
    });
  }

  _renderRow(
      doc: Object,
      sectionID: number | string,
      rowID: number | string,
      highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    //console.log("ID", doc);
    return (
      <DocumentCell
        key={doc.idBerkas}
        doc={doc}
        mode={this.state.editMode}
        onSelect={() => this._onSelect(doc)}
        onLongPress={this._enableEditMode}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        style={{ width:width/2 - 30, height:width/2 - 30}}
        />
    );
  }

  _onSelect(doc: Object) {
    if (Platform.OS === 'ios') {
    } else {
      dismissKeyboard();
    }

    if (this.state.editMode){
        this.props.markDocument(doc);
    } else {
      Actions.viewDocument({doc: doc})
    }
  }

  _enableEditMode(){
    console.log("EDIT MODE ENABLED");
    this.setState({
      editMode: true,
      bgColor: 'grey',
    })
  }

  _deletePhoto(){
    console.log("Delete Photo");
    //delete all marked photo
    this.props.runDeleteDocumentBulk(this.props.kodeSurvey);
    this.setState({
      editMode: false,
      bgColor: 'white',
    });


  }

  _addPhoto(){
    console.log("Add new berkas");

    ImagePickerManager.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

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

        //console.log("response", response);
        var source;
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        //console.log("source", source);
        this.setState({
          newBerkas: {...this.state.newBerkas, source: source}

        });

        //show modal to choose doc types
        this.refs.picker.toggle();

      }
    });

  }

  _addBerkas(tipeBerkas){
    //generate temp unique id
    let id = new Date().getTime();
    var typeId = getJenisDocumentId(tipeBerkas[0]);

    let localBerkas = { ...this.state.newBerkas,
      tipeBerkas: typeId,
      status:'new',
      progress: 0,
      kodeSurvey: this.props.kodeSurvey,
      idBerkas: id,
    }

    //console.log("New Berkas", this.state.newBerkas);

    this.props.runAddDocument({localBerkas});

    //reset form data
    this.setState({
      newBerkas: {},
    });
  }

  _reloadDoc = () => {
    console.log("reloading docs");
    this.props.runFetchDocuments(this.props.kodeSurvey);
  }


  render() {
    var addButton = (this.props.roles === 'SURVEYOR') ?
    <Button
      onPress={this._addPhoto.bind(this)}
      style={styles.button}
      containerStyle={styles.buttonRound}  >
      <Icon name="plus" style={styles.button}/>
    </Button> : null;
    var delButton = (this.props.roles === 'SURVEYOR') ?
    <Button
      onPress={this._deletePhoto.bind(this)}
      style={styles.button}
      containerStyle={styles.buttonRound}  >
      <Icon name="trash" style={styles.button}/>
    </Button> : null;
    let button = (this.state.editMode) ?
      delButton : addButton;




    return (
        <View style={{flex:1, backgroundColor: this.state.bgColor}}>
          <ListView style={{flex: 1}}
            ref="listview"
            contentContainerStyle={styles.listContainer}
            //renderHeader={this._renderHeader}
            //renderSeparator={this._renderSeparator}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            //initialListSize={10}
            //renderSectionHeader={this._renderSectionHeader}
            //renderFooter={this._renderFooter}
            renderRow={this._renderRow}
            //onEndReached={this._onLoadMore}
            //onEndReachedThreshold={30}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this._reloadDoc}
                tintColor="#666699"
                title="Loading..."
                titleColor="#bf0000"
                colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
                progressBackgroundColor="#ffffcc" //Circle color
              />}
            />
            {button}
            <Picker
                ref="picker"
                style={styles.picker}
                showDuration={300}
                showMask={true}
                pickerData={documentOptions}
                selectedValue={[JENIS_DOKUMEN[1].desc]}
                onPickerDone={this._addBerkas.bind(this)}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    listContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      marginLeft:10,
      marginRight:10,
      backgroundColor: 'transparent',
    },
  button: {
    fontSize: getCorrectFontSizeForScreen(40),
    color: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  buttonRound: {
    backgroundColor: '#66cc66',
    alignItems: 'center',
    justifyContent: 'center',
    width: getCorrectShapeSizeForScreen(40),
    height: getCorrectShapeSizeForScreen(40),
    borderRadius: getCorrectShapeSizeForScreen(40)/2,
    alignSelf: 'center',
    marginBottom: getCorrectShapeSizeForScreen(10),
    marginTop: getCorrectShapeSizeForScreen(10),
  },
  picker: {
    flex: 1,
    flexDirection: 'column',
    height: 300,
  }
});


const mapStateToProps = (state) => {
  return {
    docs: state.getIn(['documents','dataSources']),
    isLoading: state.getIn(['documents','isLoading']),
    roles: state.getIn(['currentUser', 'roles']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runFetchDocuments,
    runAddDocument,
    markDocument,
    runDeleteDocumentBulk,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListScreen);
