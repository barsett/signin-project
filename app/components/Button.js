import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

var Button = React.createClass({

    render: function(){
        return(
            <TouchableHighlight
            style={styles.button}
            underlayColor="#B5B5B5"
            onPress={this.props.onPress}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        )
    }
})


const styles = StyleSheet.create({
	button: {
		backgroundColor: '#24abe2',
    padding: 10,
    alignSelf: 'center',
		borderRadius: 10,
		width: 200,
		marginTop: 8,
	},
	buttonText: {
		color: '#fff',
		alignSelf: 'center',
		fontSize: 17
	}
});

module.exports = Button;
