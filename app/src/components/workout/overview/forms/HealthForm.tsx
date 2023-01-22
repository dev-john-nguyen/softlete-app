import _ from 'lodash';
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { HealthActivity } from 'react-native-health';
import Chevron from '../../../../assets/ChevronSvg';
import ClockSvg from '../../../../assets/ClockSvg';
import FireSvg from '../../../../assets/FireSvg';
import HeartSvg from '../../../../assets/HeartSvg';
import RulerSvg from '../../../../assets/RulerSvg';
import {
  HealthDataProps,
  HealthDisMeas,
} from '../../../../services/workout/types';
import AutoId from '../../../../utils/AutoId';
import BaseColors from '../../../../utils/BaseColors';
import { normalize, strToFloat } from '../../../../utils/tools';
import StyleConstants from '../../../tools/StyleConstants';
import HealthItem from '../HealthItem';
import { convertMsToTime } from '../../../../utils/format';
import BaseForm from './BaseForm';
import DurationForm from './DurationForm';
import MeasForm from './MeasForm';

interface Props {
  onSubmit: (data: HealthDataProps) => void;
  onClose?: () => void;
  healthData?: HealthDataProps;
  activityName: string;
}

interface StateProps {
  duration: number;
  editName: string;
  distance: number;
  calories: number;
  disMeas: HealthDisMeas;
  avgHr: number;
  activityId: string;
}

class HealthForm extends React.Component<Props, StateProps> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editName: '',
      duration: 0,
      distance: 0,
      calories: 0,
      disMeas: HealthDisMeas.mi,
      avgHr: 0,
      activityId: '',
    };
  }

  componentWillUnmount() {
    const manualData: HealthDataProps = {
      activityId: this.state.activityId,
      activityName: this.props.activityName as HealthActivity,
      calories: this.state.calories,
      sourceName: 'Manual',
      duration: this.state.duration,
      heartRates: new Array(15).fill(this.state.avgHr),
      distance: this.state.distance,
      disMeas: this.state.disMeas,
      date: '',
    };
    this.props.onSubmit(manualData);
  }

  componentDidMount() {
    const { healthData } = this.props;
    healthData && this.updateHealthDateState(healthData);
  }

  componentDidUpdate(prevProps: Props) {
    if (!_.isEqual(this.props.healthData, prevProps.healthData)) {
      this.updateHealthDateState(this.props.healthData);
    }
  }

  updateHealthDateState(healthData?: HealthDataProps) {
    if (healthData) {
      let heartRate = 0;
      if (healthData.heartRates) {
        if (healthData.heartRates.length > 2) {
          const mean = _.mean(healthData.heartRates);
          heartRate = _.floor(mean);
        } else if (healthData.heartRates.length > 0) {
          heartRate = _.floor(healthData.heartRates[0]);
        }
      }
      this.setState({
        duration: healthData.duration,
        distance: _.round(healthData.distance, 2),
        calories: _.round(healthData.calories),
        disMeas: healthData.disMeas ? healthData.disMeas : HealthDisMeas.mi,
        avgHr: heartRate,
        activityId: healthData.activityId,
      });
    } else {
      this.setState({
        duration: 0,
        distance: 0,
        calories: 0,
        avgHr: 0,
        disMeas: HealthDisMeas.mi,
        activityId: AutoId.newId(20),
      });
    }
  }

  renderValue = (num: number) => (num ? num.toString() : '');

  renderPlaceHolder = (num: number) => (num ? num.toString() : '0');

  onParseText = (val: string, round?: boolean) => {
    let num = 0;
    if (round) {
      const round = parseInt(val);
      if (round) {
        num = round;
      }
    } else {
      const float = strToFloat(val);
      if (float) {
        num = float as number;
      }
    }
    return num;
  };

  renderBack = (action: (action: any) => void) => {
    return (
      <Pressable onPress={action} style={styles.back}>
        <Chevron strokeColor={BaseColors.white} />
      </Pressable>
    );
  };

  render() {
    if (this.state.editName) {
      switch (this.state.editName) {
        case 'duration':
          return (
            <View style={styles.editContainer}>
              <DurationForm
                onDurationUpdate={num => this.setState({ duration: num })}
                renderBack={this.renderBack(() =>
                  this.setState({ editName: '' }),
                )}
              />
            </View>
          );
        case 'distance':
          return (
            <View style={styles.editContainer}>
              <MeasForm
                meas={this.state.disMeas}
                onMeasChange={m => this.setState({ disMeas: m })}
                disPlaceHolder={this.renderPlaceHolder(this.state.distance)}
                distance={this.renderValue(this.state.distance)}
                onChangeDistance={txt =>
                  this.setState({ distance: this.onParseText(txt) })
                }
                renderBack={this.renderBack(() =>
                  this.setState({ editName: '' }),
                )}
              />
            </View>
          );
        case 'calories':
          return (
            <View style={styles.editContainer}>
              <BaseForm
                value={this.state.calories.toString()}
                onChange={txt =>
                  this.setState({ calories: this.onParseText(txt) })
                }
                placeholder={this.renderPlaceHolder(this.state.calories)}
                title={'Calories'}
                label={'kcal Burned'}
                renderBack={this.renderBack(() =>
                  this.setState({ editName: '' }),
                )}
              />
            </View>
          );
        case 'avghr':
          return (
            <View style={styles.editContainer}>
              <BaseForm
                value={this.state.avgHr.toString()}
                onChange={txt =>
                  this.setState({ avgHr: this.onParseText(txt, true) })
                }
                placeholder={this.renderPlaceHolder(this.state.avgHr)}
                title={'Avg Heart Rate'}
                label={'Beats Per Minute (BPM)'}
                renderBack={this.renderBack(() =>
                  this.setState({ editName: '' }),
                )}
              />
            </View>
          );
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.btnContainer}>
          {this.props.onClose && this.renderBack(this.props.onClose)}
        </View>
        <View style={styles.healthRowContainer}>
          <HealthItem
            svg={<ClockSvg fillColor={BaseColors.white} />}
            label="Duration"
            text={convertMsToTime(this.state.duration)}
            onPress={() => this.setState({ editName: 'duration' })}
            edit
          />
          <HealthItem
            svg={<RulerSvg fillColor={BaseColors.white} />}
            label="Distance"
            text={`${this.state.distance} ${this.state.disMeas}`}
            onPress={() => this.setState({ editName: 'distance' })}
            edit
          />
        </View>
        <View style={styles.healthRowContainer}>
          <HealthItem
            svg={<FireSvg fillColor={BaseColors.white} />}
            label="Calories"
            text={`${this.state.calories} kcal`}
            onPress={() => this.setState({ editName: 'calories' })}
            edit
          />
          <HealthItem
            svg={<HeartSvg fillColor={BaseColors.white} />}
            label="Avg HR"
            text={`${this.state.avgHr} bpm`}
            onPress={() => this.setState({ editName: 'avghr' })}
            edit
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  editContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  healthRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: StyleConstants.baseMargin,
  },
  back: {
    width: normalize.width(20),
    height: normalize.width(20),
    marginBottom: 5,
  },
  doneBtn: {
    alignSelf: 'flex-start',
    fontSize: StyleConstants.extraSmallFont,
    marginBottom: StyleConstants.baseMargin,
  },
  btnContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  import: {
    fontSize: StyleConstants.extraSmallFont,
    alignSelf: 'flex-start',
  },
  itemContainer: {
    marginTop: StyleConstants.baseMargin,
    backgroundColor: BaseColors.white,
    padding: StyleConstants.baseMargin,
    borderRadius: StyleConstants.borderRadius,
    marginRight: StyleConstants.baseMargin,
    shadowColor: BaseColors.lightPrimary,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  svg: {
    width: normalize.width(15),
    height: normalize.width(15),
    marginBottom: StyleConstants.smallMargin,
  },
  label: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.secondary,
    marginRight: StyleConstants.smallMargin,
    marginBottom: StyleConstants.smallMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.primary,
    paddingTop: StyleConstants.baseMargin,
  },
});

export default HealthForm;
