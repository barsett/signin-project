import React from 'react';
import {
    StyleSheet,
    Navigator
} from 'react-native';

const styles = StyleSheet.create({

    container: {
      flex: 1,
      //backgroundColor: '#475577',
       backgroundColor: '#475577',
    },

    transparent: {
        marginTop: 70,
        padding: 15,
        backgroundColor: 'transparent',
        flex: 1
    },

    // General Background Color
    bg : {
      //backgroundColor: '#3B3738',
      backgroundColor: 'white',
      flex: 1,
    },
    verticalCenter: {
      justifyContent: 'center'
    },
    name: {
        color: 'rgba(255, 255, 255, 1)',
        flex: 1,
        fontSize: 15
    },
    subject: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12
    },
    time: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 11,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 2,
    },
    message: {
        color: 'rgba(255, 255, 255, 1)',
        marginTop: 12,
        flexWrap: 'wrap',
        fontSize: 12
    },
    background: {
        flex: 1,
    },
     sidebar: {
        padding: 10,
        paddingTop: 30,
     },
     link: {
        backgroundColor: 'transparent',
        padding: 5,
        borderColor: '#eeeeee',
        borderWidth:1,
        //borderColor: 'transparent',
     },
    controlPanel: {
      flex: 1,
      backgroundColor:'#326945',
    },
    controlPanelText: {
      color:'white',
    },
    linkText: {
      fontSize: 20,
      color: '#fff'
    },

    // used in login screen title
    logo: {
      color: '#fff',
      fontSize: 25,
      textAlign: 'center',
      marginTop: -50
    },
    // used in login screen title
     desc: {
      color: '#fff',
      fontSize: 20,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10
    },

    controlPanelWelcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 25,
      color:'white',
      fontWeight:'bold',
    },

    sliderMetric: {
      right:10,
      width:30,
    },
    slider: {
      width: 150,
      height: 10,
      margin: 10,
    },

    // Global Rounded Button
    buttonRounded: {
      backgroundColor: '#24abe2',
  	  padding: 10,
  	  borderColor: '#24abe2',
  	  borderWidth:0,
  	  borderBottomColor: '#24abe2',
  	  alignSelf: 'center',
  		borderRadius: 10,
  		width: 200,
  		marginTop: 8,
    },

    // Global Button Text
    buttonText: {
      color: '#ffffff',
  		alignSelf: 'center',
  		justifyContent: 'center',
  		fontSize: 20,
  		fontWeight: 'normal',
  		fontFamily: 'Roboto-Medium',
    },


});



module.exports= styles;
