/*
* (The MIT License)
* Copyright (c) 2015-2016 YunJiang.Fang <42550564@qq.com>
*/
'use strict';
import React, { Component, PropTypes } from 'react';
import {
    Image,
    Animated,
} from 'react-native';


var TimerMixin = require('react-timer-mixin');

// const propTypes = {
//   animationImages : PropTypes.array.isRequired,
//   animationRepeatCount : PropTypes.number,
//   animationDuration : PropTypes.number,
// };
//
// export default class ImageAnimation extends Component {
//
//   constructor(props) {
//    super(props);
//    this.state = {
//      fadeAnim: new Animated.Value(1), // init opacity 0
//      imageIndex:  0,
//      total: props.animationImages.length,
//      start: false,
//    };
//  }
//
//  componentDidMount() {
//    this.setState({start: true});
//    this.startAnimation();
//  }
//
//  componentWillUnmount(){
//    this.setState({start:false});
//  }
//
//  startAnimation() {
//    Animated.sequence([
//     //  Animated.timing(this.state.fadeAnim, {
//     //    toValue: 1,
//     //    duration: 500,
//     //  }),
//      Animated.delay(this.props.animationDuration),
//    ]).start((event) => {
//      console.log("X", this.state.start)
//      if (this.state.start){
//        const nextIndex = (this.state.imageIndex + 1) % this.state.total;
//        this.setState({imageIndex:  nextIndex});
//        this.startAnimation();
//      }
//      //console.log(nextIndex);
//    });
//  }
//
//
//
//  render() {
//    return (
//         <Animated.Image
//            {...this.props}
//            source={this.props.animationImages[this.state.imageIndex]}/>
//    );
//  }
//
//
// }
//
// ImageAnimation.propTypes = propTypes;

module.exports = React.createClass({
    propTypes: {
        animationImages : PropTypes.array.isRequired,
        animationRepeatCount : PropTypes.number,
        animationDuration : PropTypes.number,
    },
    mixins: [TimerMixin],
    getInitialState: function() {
        return {
            imageIndex: 0,
        };
    },
    componentDidMount: function() {
        this.animationRepeatCount = this.props.animationRepeatCount||0;
        this.intervalId = this.setInterval(
            ()=>{
                var imageIndex = this.state.imageIndex+1;
                if (imageIndex >= this.props.animationImages.length) {
                    imageIndex = 0;
                    if (this.animationRepeatCount === 1) {
                        this.clearInterval(this.intervalId);
                        return;
                    }
                    this.animationRepeatCount--;
                }
                //console.log("Show Image " + imageIndex);
                this.setState({imageIndex:imageIndex})
            }, this.props.animationDuration||1000);
        },
        render: function() {
            return (
                <Image
                    {...this.props}
                    source={this.props.animationImages[this.state.imageIndex]}/>
            );
        }
    });
