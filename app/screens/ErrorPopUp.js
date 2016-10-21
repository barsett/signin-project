'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

var {
  height: deviceHeight
} = Dimensions.get('window');


class ErrorPopUp extends React.Component {
    constructor(props){
        super (props)

        this.state = {
            offset: new Animated.Value(-deviceHeight)
        }
    }

    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }

    closeModal() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: -deviceHeight
        }).start(Actions.dismiss);
    }

    render(){
        return (
            <Animated.View style={[styles.container,{
                backgroundColor: 'rgba(52,52,52,0.5)',
                transform: [{
                    translateY: this.state.offset
                }]
            }]}>
                <View style={styles.box}>
                    <Text style={styles.data}>{this.props.data.message || this.props.data}</Text>
                    <Button onPress={this.closeModal.bind(this)}>Close</Button>
                </View>
            </Animated.View>
        );
    }
}


module.exports = ErrorPopUp;

var styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },

    box: {
        width: 250,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    data: {
        flex: 1,
        color: 'black',
        alignSelf: 'center',
    },
});
