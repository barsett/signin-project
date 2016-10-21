'use strict';

/*
This component is used to show survey information. This will be part of row component in a List
if the list row have action when press then this component must be wrapped in TouchableHighlight
if the list have actionable button then renderRow should contain this component and button component
*/
import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  Dimensions,
  View
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runClaimMyTask } from '../actions/TaskUpdateAction';

import i18n from '../i18n.js';

const width = Dimensions.get('window').width; //full width

class TaskInfo extends React.Component {

  _acceptTask = () => {
    console.log("Accepting Task", this.props.task.survey.surveyId);
    this.props.runClaimMyTask(this.props.task);
  }

  render() {
    //console.log(this.props.task.mark);
    //
    return (
      <View style={styles.row}>
             <View style={styles.nameContiner}>
                <Text style={styles.taskTitle}>
                    Joko Setiabudi{this.props.task.survey.victimName}
                </Text>
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                <View style={{flexDirection: 'column', width: 30, alignItems: 'center'}}>
                  <Icon name="mobile" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        085799996666 {this.props.task.survey.surveyId}
                    </Text>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                <View style={{flexDirection: 'column', width: 30, alignItems: 'center'}}>
                    <Icon name="hospital-o" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        RSUPN DR. Cipto Mangunkusumo
                    </Text>
                </View>
                <View style={{flexDirection: 'column', width: 25, alignItems: 'center',marginLeft: 5}}>
                    <Icon name="home" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        Kamar Melati
                    </Text>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                <View style={{flexDirection: 'column', width: 30, alignItems: 'center'}}>
                    <Icon name="calendar" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        28 April 2016
                    </Text>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                <View style={{flexDirection: 'column', width: 30, alignItems: 'center'}}>
                    <Icon name="clock-o" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        9 Mei 2016
                    </Text>
                </View>
                <View style={{flexDirection: 'column', width: 25, alignItems: 'center', marginLeft: 5}}>
                    <Icon name="hourglass-2" style={styles.icon}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.taskItem}>
                        08:00
                    </Text>
                </View>
            </View>

            </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._acceptTask.bind(this)}
            containerStyle={styles.buttonSquare}
            disabled={this.props.task.mark}
            styleDisabled={styles.disabled} >
            <View  style={{justifyContent: 'center'}}>
                <Icon name="angle-double-right" style={styles.iconButton}/>
                <Text style={styles.buttonText}>{i18n.visitAction}</Text>
            </View>
          </Button>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    width: width - 30,
    alignSelf: 'center',
  },
  nameContainer:{
    flex: 2,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  icon: {
    color: '#3B3738',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 3,
    justifyContent: 'center',
  },
   iconButton: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 35,
      alignItems: 'center',
      paddingTop: -5,
      marginTop: -10,
    },
  textContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  taskTitle: {
    color: '#3B3738',
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    fontWeight: 'normal',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },

  taskItem: {
    color: '#3B3738',
    //flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Light',
    fontWeight: 'normal',
    justifyContent: 'center',
  },

  taskId: {
    color: '#3B3738',
    fontSize: 12,
  },
  hospital: {
    color: '#F2EC3A',
    fontSize: 12,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
  },

  disabled: {
    color: '#a1a1a1',
    alignSelf: 'center',
    fontSize: 18
  },


  buttonSquare: {
    backgroundColor: '#24abe2',
    padding: 10,
    marginRight: 10,
    borderColor: '#24abe2',
    borderWidth:0,
    borderBottomColor: '#24abe2',
    alignSelf: 'flex-end',
    width: 75,
    height: 75,
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column'
  },

});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runClaimMyTask,
  }, dispatch);

};


export default connect(null, mapDispatchToProps)(TaskInfo);
