import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

var ButtonRounded = React.createClass({

    render: function(){
        return(
            <TouchableHighlight
            style={styles.button}
            underlayColor="rgba(5, 165, 209, 0.5)"
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
	    borderColor: '#24abe2',
	    borderWidth:0,
	    borderBottomColor: '#24abe2',
	    alignSelf: 'center',
		borderRadius: 10,
		width: 150,
		marginTop: 8,
	},
	buttonText: {
		color: '#fff',
		alignSelf: 'center',
		fontSize: 17
	}
});

module.exports = ButtonRounded;
