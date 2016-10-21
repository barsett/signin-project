'use strict';

import React, { Component } from 'react';
import { Platform } from 'react-native';

import Drawer from 'react-native-drawer';
import ControlPanel from './ControlPanel.js';
// var ToolbarAndroid = require('ToolbarAndroid');
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

// full screen modal declaration
import TextAreaInputModal from '../components/TextAreaInputModal';
import LookupReferenceModal from '../components/LookupReferenceModal';
import LegendModal from '../components/LegendModal';




const enablePan = Platform.OS === 'ios';
console.log("EnablePan: " + enablePan);

class SideDrawer extends Component {
  constructor(props){
    super(props);
    this._getIcon = this._getIcon.bind(this);
    this._getMenuIcons = this._getMenuIcons.bind(this);
    this._closeControlPanel = this._closeControlPanel.bind(this);
    this._openControlPanel = this._openControlPanel.bind(this);
  }
  // not used anymore. it is used by controlpanel before to close drawer on select menu
  _closeControlPanel(){
      this.refs.drawer.close();
  }

  _openControlPanel(){
      this.refs.drawer.open();
  }

  _getIcon(){
    console.log("renderBackIcon() stack", this.props.stackSize);
    if (this.props.stackSize > 1){
      //console.log("render back button");
      return "chevron-left";
    } else {
      return "bars";
    }
  }

  _getIconAction(){
    if (this.props.stackSize > 1){
      console.log("Pop");
      Actions.pop();
    } else {
      console.log("Open Menu");
      this._openControlPanel();
    }
  }

  _getMenuIcons(){
    return [
        {title: 'Menu', iconName: "th-list", iconSize: getCorrectFontSizeForScreen(24), show: 'always'}
    ];
  }

  _getMenuActions(){
    // to be implemented based on screen/route
    this.refs.legendModal.openFromRoot("Legenda");
  }

  _openModal(name){
    this.refs[name].open();
  }

  _getModal(name){
    return this.refs[name];
  }

  render() {

    //console.log("SideDrawer" , this.props);
    var toolbar = Platform.OS === 'android' ?
      <Icon.ToolbarAndroid
       actions={this._getMenuIcons()}
       onActionSelected={this._getMenuActions.bind(this)}
       navIconName={this._getIcon()}
       onIconClicked={this._getIconAction.bind(this)}
       iconSize={getCorrectFontSizeForScreen(24)}
       style={drawerStyles.toolbar}
       //subtitle={this.state.actionText}
       title={this.props.pageTitle}
       titleColor="white"/> : undefined;

    return (
      <Drawer
        ref="drawer"
        type="overlay"
        captureGestures={'open'}
        negotiatePan={true}  // for better handler with scroll view and horizontal swap
        acceptPan={enablePan} // disable swipe to open drawer since tablet not efficient.. use menu button instead
        content={ <ControlPanel/> }
        tapToClose={true}
        openDrawerOffset={0.3} // 20% gap on the right side of drawer
        closedDrawerOffset={0} // left margin when drawer is closed
        panCloseMask={0.5}
        panOpenMask={0.1} // only applied to IOS since android disable pan
        //useInteractionManager={true}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          mainOverlay: { opacity: ratio/2, }, //(2-ratio)/2
         //main: { opacity: (2-ratio)/2, },
        })}
        >
        {toolbar}
        {React.Children.map(this.props.children, c => React.cloneElement(c, {
          route: this.props.route,
          textInputModal: () => this._getModal('textInputModal'),
          referenceModal: () => this._getModal('referenceModal'),
          legendModal: () => this._getModal('legendModal'),
        }))}
        <TextAreaInputModal ref="textInputModal" />
        <LookupReferenceModal ref="referenceModal" />
        <LegendModal ref="legendModal" />


      </Drawer>

    );
  }
}


const drawerStyles = {
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 0,
    backgroundColor: '#FFFFFF',
    opacity: 1,
  },
  main: {
    paddingLeft: 0
  },
  mainOverlay: {
    backgroundColor: '#FFFFFF',
    opacity: 0,
  },

  toolbar: {
    height: 59,
    backgroundColor: '#0087cd'
  },

}


const mapStateToProps = (state) => {
  //console.log("Mapping Page Title", state.get('currentRoute').pageTitle);

  return {
    // ROUTE IS NOT IMMUTABLE
    pageTitle: state.get('currentRoute').pageTitle,
    pageId: state.get('currentRoute').pageId,
    stackSize: state.get('currentRoute').stackSize,
  };

};

const mapDispatchToProps = (dispatch) => {
  return {
  };

};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
