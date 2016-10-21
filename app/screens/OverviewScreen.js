/* @flow */
'use strict';
import React, { Component } from 'react';
import Intro from '../components/Intro';

class OverviewScreen extends React.Component {

	render() {
    return (
      <Intro onSkip={this.props.onSkip} onDone={this.props.onDone} />
    );
  }
}

export default OverviewScreen;
