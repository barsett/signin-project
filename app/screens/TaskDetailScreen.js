/* @flow */
'use strict';
import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';

import t from 'tcomb-form-native';
let Form = t.form.Form;

import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { runClaimMyTask, editTask } from '../actions/TaskAction'
import gstyles from '../styles/style';
import i18n from '../i18n.js';



class TaskDetailScreen extends React.Component {

  componentDidMount() {
    console.log("Viewing Detail Page", this.props.data.survey.victimId);
  }

  _editTask = () => {
    var desc =this.refs.form.getValue();
    console.log("Editing Task...", desc);
    this.props.editTask(this.props.data, desc);
    Actions.home;
  }

  _acceptTask = () => {
    console.log("Accepting Task", this.props.data.survey.surveyId);
    this.props.runClaimMyTask(this.props.data);
    Actions.pop();
  }

	render() {
    let options = {
      fields: {
        synopsis: {
          label: 'Penjelasan',
          multiline: true,
          numberOfLines: 20,
          // textAlignVertical: true,
          editable: true
        }
      }
    };

    var defValue = {
      description: this.props.data.synopsis
    };
    let taskForm = t.struct({
      synopsis: t.String
    });

	    return (
        <ScrollView contentContainerStyle={localStyles.contentContainer}>
          <View style={localStyles.mainSection}>
            <Text style={localStyles.taskTitle}>{this.props.data.survey.victimName}</Text>
            <View style={localStyles.separator} />
            <View style={localStyles.actionButton}>
              <Button
                onPress={this._acceptTask}
                style={styles.buttonText}
                containerStyle={styles.buttonRounded,localStyles.buttonRounded}>
                {i18n.accept}
              </Button>
            </View>
          </View>

        </ScrollView>

	    );
  }
}

class Casualties extends React.Component {
  render() {
    if (!this.props.casualties) {
      return null;
    }

    return (
      <View>
        <Text style={localStyles.casualtyTitle}>Casualties</Text>
        {this.props.casualties.map(casualty =>
          <Text key={casualty.name} style={localStyles.casualtyName}>
            &bull; {casualty.name}
          </Text>
        )}
      </View>
    );
  }
}


const localStyles = StyleSheet.create({
    contentContainer: {
      padding: 10,
    },
    rightPane: {
      justifyContent: 'space-between',
      flex: 1,
    },
    taskTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
    },
    rating: {
      marginTop: 10,
    },
    ratingTitle: {
      fontSize: 14,
    },
    ratingValue: {
      fontSize: 28,
      fontWeight: '500',
    },
    mpaaWrapper: {
      alignSelf: 'flex-start',
      borderColor: 'black',
      borderWidth: 1,
      paddingHorizontal: 3,
      marginVertical: 5,
    },
    mpaaText: {
      fontFamily: 'Palatino',
      fontSize: 13,
      fontWeight: '500',
    },
    mainSection: {
      flexDirection: 'row',
    },
    detailsImage: {
      width: 134,
      height: 200,
      backgroundColor: '#eaeaea',
      marginRight: 10,
    },
    separator: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      height: StyleSheet.hairlineWidth,
      marginVertical: 10,
    },
    casualtyTitle: {
      fontWeight: '500',
      marginBottom: 3,
    },
    casualtyName: {
      marginLeft: 2,
    },
    actionButton: {
      flexDirection : 'row',
      justifyContent: 'space-around',
      flex: 1,
    },
    buttonRounded: {
      backgroundColor: '#24abe2',
  	  padding: 10,
  	  borderColor: '#24abe2',
  	  borderWidth:0,
  	  borderBottomColor: '#24abe2',
  	  alignSelf: 'center',
  		borderRadius: 10,
  		width: 150,
  		marginTop: 8,
    }
  });

  const mapStateToProps = (state) => {
    //console.log("MappingStateToProps");
    return {
    };

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
  	  runClaimMyTask,
      editTask,
  	}, dispatch);

  };

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailScreen);
