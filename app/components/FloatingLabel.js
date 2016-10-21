'use strict';
// https://github.com/eyaleizenberg/react-native-floating-label-text-input

var React = require('react');
var { StyleSheet, Text, View, TextInput, Animated } = require('react-native');
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common.js';

var FloatingLabel = React.createClass({
  getInitialState: function() {
    var initialPadding = getCorrectShapeSizeForScreen(12);
    var initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = getCorrectShapeSizeForScreen(4);
      initialOpacity = getCorrectShapeSizeForScreen(1);
    }

    return {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  },

  componentWillReceiveProps: function(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? getCorrectShapeSizeForScreen(4) : getCorrectShapeSizeForScreen(12),
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? getCorrectShapeSizeForScreen(1) : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var TextFieldHolder = React.createClass({
  getInitialState: function() {
    return {
      marginAnim: new Animated.Value(this.props.withValue ? getCorrectShapeSizeForScreen(12) : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? getCorrectShapeSizeForScreen(14) : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={{marginTop: this.state.marginAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var FloatLabelTextField = React.createClass({
  getInitialState: function() {
    return {
      focussed: false,
      text: this.props.value
    };
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
      this.setState({ text: newProps.value })
    }
  },

  withBorder: function() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    };
  },

  render: function() {
    return(
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.viewContainer}>
          <View style={styles.paddingView}></View>
          <View style={[styles.fieldContainer, this.withBorder()]}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, this.props.floatingStyle, this.labelStyle()]}>{this.placeholderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput ref='textInput'
                placeholder={this.props.placeholder}
                placeholderTextColor={this.props.placeholderTextColor}
                style={[styles.valueText, this.props.inputStyle]}
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                maxLength={this.props.maxLength}
                selectionColor={this.props.selectionColor}

                onSubmitEditing={this.props.onSubmitEditing}
                onChangeText={this.setText}
                secureTextEntry={this.props.secureTextEntry}
                keyboardType={this.props.keyboardType}
                autoCapitalize={this.props.autoCapitalize}
                autoCorrect={this.props.autoCorrect}
                underlineColorAndroid='rgba(0,0,0,0)'
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  },

  focus: function() {
    this.refs.textInput.focus();
    this.setFocus();
  },
  setFocus: function() {
    this.setState({
      focussed: true
    });
    try {
      return this.props.onFocus();
    } catch (_error) {}
  },

  unsetFocus: function() {
    this.setState({
      focussed: false
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  },

  labelStyle: function() {
    if (this.state.focussed) {
      return styles.focussed;
    }
  },

  placeholderValue: function() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  },

  setText: function(value) {
    this.setState({
      text: value
    });
    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  },

  withMargin: function() {
    if (this.state.text) {
      return styles.withMargin;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: getCorrectShapeSizeForScreen(40),
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: getCorrectShapeSizeForScreen(-5),
    marginBottom: 0
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  paddingView: {
    //width: getCorrectShapeSizeForScreen(10)
  },
  floatingLabel: {
    position: 'absolute',
    top: getCorrectShapeSizeForScreen(-8),
    left: 0
  },
  fieldLabel: {
    height: getCorrectShapeSizeForScreen(15),
    fontSize: getCorrectFontSizeForScreen(10),
    fontFamily: 'Roboto',
    //fontWeight: 'bold',
    //color: '#B1B1B1'
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  withBorder: {
    borderBottomWidth: 1,
    borderColor: '#464646',
  },
  valueText: {
    height: getCorrectShapeSizeForScreen(20),
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#111111',

  },
  withMargin: {
    marginTop: getCorrectShapeSizeForScreen(10)
  },
  focussed: {
    color: "#24abe2"
  }
});

module.exports = FloatLabelTextField
