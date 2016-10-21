'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';


import Chart from 'react-native-chart';
//import Chart from '../../node_modules/react-native-chart/src/Chart';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MKSpinner } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common';
import { getSurveyStatistic } from '../actions/StatisticAction';


const colorMap = {
  belumDibaca: '#cccccc',
  belumDisurvey: '#bf0000',
  sudahDisurvey: '#ff7e00',
  otorisasi: '#66ae1e',
};

//test data
// const data2 = [
//   ['belumDibaca', 1],
//   ['belumDisurvey', 1],
//   ['sudahDisurvey', 1],
//   ['otorisasi', 1],
// ]



class SurveyStatisticCard extends Component{

  componentDidMount(){
    // JR ask to enable this realtime 2/8/2016
    // check if last update is more than 1 hour
    // if (this.props.lastUpdateTime+(3600*1000) < new Date().getTime()) {
    //   console.log("Updating Statistic Data");
    //   this.props.getSurveyStatistic();
    // } else {
    //   this._updateState(this.props);
    // }

    this.props.getSurveyStatistic();

  }

  constructor(props){
    super(props);
    this.state = {
      surveyStat : [],
      rawSurveyStat : {},
      colors : [],
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.surveyStat){
      this._updateState(nextProps);
    }
  }

  _updateState(props){
    var input = props.surveyStat.toJS();

    //delete daftarTugas
    var input2 = props.surveyStat.delete('totalTugas').toJS();
    var colors = [];
    var output = Object.keys(input2).filter((key) => {
        // remove with value 0
        return (input[key] > 0);
    }).map(function(key) {
      colors.push(colorMap[key]);
      return [key, input[key]];
    });

    //console.log('STAT:', output);
    //console.log('COLORS:', colors);
    this.setState({
      surveyStat: output,
      rawSurveyStat: input,
      colors: colors,
    })
  }


  render() {
    var body = (this.props.isLoading) ?
    //var body = (false) ?
              <View style={styles.cardLoading}>
                <MKSpinner style={styles.loading} spinnerAniDuration={500}/>
              </View>:
              <View style={styles.card}>
                <Chart
                    style={styles.chart}
                    data={this.state.surveyStat}
                    //data={data2}
                    type="pie"
                    axisLineWidth={30}
                    sliceColors={this.state.colors}
                    showAxis={false}
                    pieCenterRatio={0.7}
                 >
                  <View style={{backgroundColor: 'black'}}>
                    <Text>{this.state.rawSurveyStat.totalTugas}</Text>
                  </View>

                 </Chart>

               <View style={styles.legendContainer}>
                 <Text style={styles.legendTitle}>Total Korban : {this.state.rawSurveyStat.totalTugas}</Text>
                 <LegendItem name="Belum dibaca" value={this.state.rawSurveyStat.belumDibaca} color={colorMap.belumDibaca}/>
                 <LegendItem name="Belum disurvei" value={this.state.rawSurveyStat.belumDisurvey} color={colorMap.belumDisurvey}/>
                 <LegendItem name="Sudah disurvei" value={this.state.rawSurveyStat.sudahDisurvey} color={colorMap.sudahDisurvey}/>
                 <LegendItem name="Otorisasi" value={this.state.rawSurveyStat.otorisasi} color={colorMap.otorisasi}/>

               </View>
             </View>;

    return body;
            //  <Chart
            //      style={localStyles.chart}
            //      data={this.state.surveyStat}
            //      type="bar"
            //      cornerRadius={4}
            //      showGrid={false}
            //      showAxis={true}
            //      showYAxisLabels={false}
            //      showDataPoint={true}
            //      //yAxisWidth={30}
            //   />


  }
}

const styles = StyleSheet.create({
  cardLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    //margin: getCorrectShapeSizeForScreen(8),
    height: getCorrectShapeSizeForScreen(110),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    //margin: getCorrectShapeSizeForScreen(8),
  },
  chart: {
    width: getCorrectShapeSizeForScreen(110),
    height: getCorrectShapeSizeForScreen(110),
    margin: getCorrectShapeSizeForScreen(10),
  },
  legendContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  legendTitle: {
    fontSize: getCorrectFontSizeForScreen(14),
    padding: getCorrectShapeSizeForScreen(2),
    color: '#464646',
    fontFamily: 'Roboto-Medium',
  },
  legendItem: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: getCorrectShapeSizeForScreen(2),
  },
  legendDot: {
    width: getCorrectShapeSizeForScreen(12),
    height: getCorrectShapeSizeForScreen(12),
    backgroundColor: 'blue',
    margin: getCorrectShapeSizeForScreen(2),
  },
  legendKey: {
    flex:1,
    fontSize: getCorrectFontSizeForScreen(13),
    margin: getCorrectShapeSizeForScreen(2),
    marginLeft: getCorrectShapeSizeForScreen(5),
    color: '#464646',
    fontFamily: 'Roboto',
  },
  legendValue: {
    fontSize: getCorrectFontSizeForScreen(15),
    margin: getCorrectShapeSizeForScreen(2),
    alignSelf: 'flex-end',
    color: '#464646',
    fontFamily: 'Roboto',
  },


});

const mapStateToProps = (state) => {
  return {
    roles: state.getIn(['currentUser', 'roles']),
    surveyStat: state.getIn(['statistic', 'surveyStat']),
    isLoading: state.getIn(['statistic', 'isLoading']),
    lastUpdateTime: state.getIn(['statistic', 'lastUpdateTime']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getSurveyStatistic,
	}, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(SurveyStatisticCard);


class LegendItem extends React.Component {
    render() {

      return (
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: this.props.color}]}/>
          <Text style={styles.legendKey}>{this.props.name}</Text>
          <Text style={styles.legendValue}>{this.props.value}</Text>
        </View>
      );
    }
}
