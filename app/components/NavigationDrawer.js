import React, { PropTypes, Component } from 'react';
import Drawer from 'react-native-drawer';
import { DefaultRenderer } from 'react-native-router-flux';

var ControlPanel = require('./ControlPanel.js');

const propTypes = {
  navigationState: PropTypes.object,
};

class NavigationDrawer extends React.Component {
  render() {
    const children = this.props.navigationState.children;
    return (
      <Drawer
        ref="navigation"
        type="displace"
        content={<ControlPanel/>}
        tapToClose
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        styles={drawerStyles}
        negotiatePan
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
        })}
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate}/>
      </Drawer>
    );
  }
}

var drawerStyles = {
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 0,
    backgroundColor: '#FFFFFF'
  },
  main: {
    paddingLeft: 0
  },
  toolbar: {
    height: 55,
    backgroundColor: '#2880BE'
  },

}

NavigationDrawer.propTypes = propTypes;

export default NavigationDrawer;
