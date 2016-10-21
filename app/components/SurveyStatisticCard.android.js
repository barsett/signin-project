'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Dimensions,
} from 'react-native';


import Chart from 'react-native-chart';
//import Chart from '../../node_modules/react-native-chart/src/Chart';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MKSpinner } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width} from '../api/Common';
import { getSurveyStatistic } from '../actions/StatisticAction';


const colorMap = {
  belumDibaca: '#cccccc',
  belumDisurvey: '#bf0000',
  sudahDisurvey: '#ff7e00',
  otorisasi: '#66ae1e',
};

// const data2 = [
//   ['belumDisurvey', 1],
//   ['sudahDisurvey', 1],
//   ['otorisasi', 1],
//   ['belumOtorisasi', 1]
// ]


class SurveyStatisticCard extends Component{

  componentDidMount(){
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

  // use to produce data set used by react native chart
  _updateState(props){
    var input = props.surveyStat.toJS();

    //delete daftarTugas
    var input2 = props.surveyStat.delete('totalTugas').toJS();
    var colors = [];
    var output = Object.keys(input2).map(function(key) {
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

  _getWidth (data) {
      const totalWidth = Dimensions.get('window').width - getCorrectShapeSizeForScreen(36);
      const totalTugas = data.totalTugas;

      let width = {};
      Object.keys(data).forEach((key) => {
        //console.log('key:' + key);
        width[key] = Math.floor(data[key]/totalTugas * totalWidth);
      });

      //console.log("Widths", width);

      return width;
    }



  render() {
    const width = this._getWidth(this.state.rawSurveyStat);

    var body = (this.props.isLoading) ?
    //var body = (false) ?
              <View style={styles.cardLoading}>
                <MKSpinner style={styles.loading} spinnerAniDuration={500}/>
              </View>:
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <Text style={styles.legendTitle}>Total Korban : </Text><Text style={styles.legendTitleItem}>{this.state.rawSurveyStat.totalTugas}</Text>
                </View>
                <View style={styles.chartContainer}>
                  {this.state.surveyStat.map((data) => {
                    const len = width[data[0]];
                    const colo = colorMap[data[0]];
                    //console.log("data", da ta, len, colo);
                    if (len > 0 ){
                      return (
                          <View key={data[0]}style={{backgroundColor: colo, width: len, height: getCorrectShapeSizeForScreen(25)}}/>
                      );
                    }
                  })}
                </View>


               <View style={styles.legendContainer}>
                 <LegendItem name="Belum dibaca:" value={this.state.rawSurveyStat.belumDibaca} color={colorMap.belumDibaca}/>
                 <LegendItem name="Belum disurvei:" value={this.state.rawSurveyStat.belumDisurvey} color={colorMap.belumDisurvey}/>
                 <LegendItem name="Sudah disurvei:" value={this.state.rawSurveyStat.sudahDisurvey} color={colorMap.sudahDisurvey}/>
                 <LegendItem name="Otorisasi:" value={this.state.rawSurveyStat.otorisasi} color={colorMap.otorisasi}/>
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
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'stretch',
    //margin: getCorrectShapeSizeForScreen(8),
    padding: getCorrectShapeSizeForScreen(4),
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //height: getCorrectShapeSizeForScreen(40),
    //backgroundColor: 'black',
    paddingTop: getCorrectShapeSizeForScreen(10),
    paddingBottom: getCorrectShapeSizeForScreen(5),
  },
  legendContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingBottom: getCorrectShapeSizeForScreen(5),
  },
  titleContainer: {
    flexDirection: 'row',
    marginHorizontal: getCorrectShapeSizeForScreen(7),
    marginTop: getCorrectShapeSizeForScreen(5),
  },
  legendTitle: {
    flexDirection: 'column',
    fontSize: getCorrectFontSizeForScreen(14),
    color: '#464646',
    fontFamily: 'Roboto-Light',
  },
  legendTitleItem: {
    flexDirection: 'column',
    fontSize: getCorrectFontSizeForScreen(14),
    marginLeft: getCorrectShapeSizeForScreen(5),
    color: '#464646',
    fontFamily: 'Roboto-Medium',
  },
  legendItem: {
    //flex:1,
    width: (width/2) - getCorrectShapeSizeForScreen(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: getCorrectShapeSizeForScreen(3),
    //justifyContent: 'space-around',
    paddingHorizontal: getCorrectShapeSizeForScreen(3),
  },
  legendDot: {
    width: getCorrectShapeSizeForScreen(14),
    height: getCorrectShapeSizeForScreen(14),
    //backgroundColor: 'blue',
    //margin: getCorrectShapeSizeForScreen(2),
  },
  legendKey: {
    //flex:1,
    flexDirection: 'row',
    fontSize: getCorrectFontSizeForScreen(12),
    marginLeft: getCorrectShapeSizeForScreen(8),
    fontFamily: 'Roboto-Light',
    color: '#464646',
  },
  legendValue: {
    fontSize: getCorrectFontSizeForScreen(12),
    marginLeft: getCorrectShapeSizeForScreen(5),
    //marginVertical: getCorrectShapeSizeForScreen(3),
    color: '#464646',
    fontFamily: 'Roboto-Medium',
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
