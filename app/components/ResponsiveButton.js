import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { MKButton, MKSpinner, MKTextField, MKColor } from 'react-native-material-kit';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';


const propTypes = {
  isLoading: PropTypes.bool,
  iconName: PropTypes.string,
  iconStyle: PropTypes.number,
  style: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  containerStyle: PropTypes.number,
};


class ResponsiveButton extends React.Component {

    render(){
      let content = (this.props.isLoading) ? <MKSpinner strokeColor='#ffffff' spinnerAniDuration={400}/>
    : <View style={{flexDirection: 'row'}}>
        <Icon style={this.props.iconStyle} name={this.props.iconName} />
        <Text style={this.props.style}>{this.props.text}</Text>
      </View>;


      return (
        <Button {...this.props}>
            {content}
        </Button>
      );
    }
}


ResponsiveButton.propTypes = propTypes;


export default ResponsiveButton;
