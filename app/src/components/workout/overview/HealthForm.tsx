import _ from 'lodash';
import React from 'react';
import { View } from 'react-native';
import {
  HealthDataProps,
  HealthDisMeas,
} from '../../../services/workout/types';
import { FlexBox } from '@app/ui';
import { InfoListBox, PrimaryButton } from '@app/elements';
import { convertTimeToFormatTime, strToFloat } from '@app/utils';
import { HealthActivity } from 'react-native-health';
import AutoId from 'src/utils/AutoId';
import { DurationForm, MeasForm, BaseForm } from './FormElements';

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

  componentDidMount() {
    const { healthData } = this.props;
    healthData && this.updateHealthDateState(healthData);
  }

  componentDidUpdate(prevProps: Props) {
    if (!_.isEqual(this.props.healthData, prevProps.healthData)) {
      this.updateHealthDateState(this.props.healthData);
    }
  }

  onSubmitHandler = () => {
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
  };

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

  render() {
    if (this.state.editName) {
      switch (this.state.editName) {
        case 'duration':
          return (
            <FlexBox width="100%">
              <DurationForm
                onDurationUpdate={num => this.setState({ duration: num })}
                onClose={() => this.setState({ editName: '' })}
              />
            </FlexBox>
          );
        case 'distance':
          return (
            <FlexBox width="100%">
              <MeasForm
                disPlaceHolder={this.renderPlaceHolder(this.state.distance)}
                distance={this.renderValue(this.state.distance)}
                onChangeDistance={txt =>
                  this.setState({ distance: this.onParseText(txt) })
                }
                onClose={() => this.setState({ editName: '' })}
              />
            </FlexBox>
          );
        case 'calories':
          return (
            <FlexBox width="100%">
              <BaseForm
                value={this.state.calories.toString()}
                onChange={txt =>
                  this.setState({ calories: this.onParseText(txt) })
                }
                placeholder={this.renderPlaceHolder(this.state.calories)}
                title={'Calories'}
                label={'kcal Burned'}
                onClose={() => this.setState({ editName: '' })}
              />
            </FlexBox>
          );
        case 'avghr':
          return (
            <FlexBox width="100%">
              <BaseForm
                value={this.state.avgHr.toString()}
                onChange={txt =>
                  this.setState({ avgHr: this.onParseText(txt, true) })
                }
                placeholder={this.renderPlaceHolder(this.state.avgHr)}
                title={'Avg Heart Rate'}
                label={'Beats Per Minute (BPM)'}
                onClose={() => this.setState({ editName: '' })}
              />
            </FlexBox>
          );
      }
    }

    return (
      <View>
        <FlexBox justifyContent="space-between" marginBottom={10}>
          <InfoListBox
            secondary
            flex={1}
            icon="clock"
            label="Duration"
            desc={
              convertTimeToFormatTime(
                this.state.duration,
                undefined,
                'sec',
              ) as string
            }
            onPress={() => this.setState({ editName: 'duration' })}
          />
          <InfoListBox
            secondary
            flex={1}
            marginRight={0}
            icon="ruler"
            label="Distance"
            desc={`${this.state.distance} ${this.state.disMeas}`}
            onPress={() => this.setState({ editName: 'distance' })}
          />
        </FlexBox>
        <FlexBox justifyContent="space-between" marginBottom={10}>
          <InfoListBox
            secondary
            flex={1}
            icon="fire"
            label="Calories"
            desc={`${this.state.calories} kcal`}
            onPress={() => this.setState({ editName: 'calories' })}
          />
          <InfoListBox
            secondary
            flex={1}
            marginRight={0}
            icon="heart"
            label="Avg HR"
            desc={`${this.state.avgHr} bpm`}
            onPress={() => this.setState({ editName: 'avghr' })}
          />
        </FlexBox>
        <FlexBox justifyContent="space-between" marginTop={10}>
          {this.props.onClose ? (
            <PrimaryButton variant="secondary" onPress={this.props.onClose}>
              Cancel
            </PrimaryButton>
          ) : (
            <FlexBox />
          )}
          <PrimaryButton onPress={this.onSubmitHandler}>Create</PrimaryButton>
        </FlexBox>
      </View>
    );
  }
}

export default HealthForm;
