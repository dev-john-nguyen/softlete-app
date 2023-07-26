import React, { useContext, useEffect } from 'react';
import {
  HealthDataProps,
  HealthDisMeas,
  WorkoutTypes,
} from '../../../services/workout/types';
import HealthImportContainer from './HealthImportContainer';
import AppleHealthKit from 'react-native-health';
import _ from 'lodash';
import { FlexBox } from '@app/ui';
import { useNavigation } from '@react-navigation/native';
import { WorkoutContext } from '@app/contexts';

const OverviewContainer = () => {
  const navigation = useNavigation();
  const { updateWoHealthData, workout } = useContext(WorkoutContext);

  useEffect(() => {
    if (workout.type !== WorkoutTypes.TraditionalStrengthTraining) {
      navigation.setOptions({ headerTitle: '' });
    }
  }, [workout, navigation]);

  const onImportData = (data: HealthDataProps) => {
    // this can be updating program or workout
    updateWoHealthData &&
      updateWoHealthData(workout._id, data).catch(err => console.log(err));
  };

  const onChangeHealthData = (data: HealthDataProps) => {
    //check if there is a difference
    if (workout.healthData) {
      const { healthData: woHltDta } = workout;
      if (
        data.activityName === woHltDta.activityName &&
        data.sourceName === woHltDta.sourceName &&
        data.distance === woHltDta.distance &&
        data.calories === woHltDta.calories &&
        data.duration === woHltDta.duration &&
        data.disMeas === woHltDta.disMeas &&
        _.isEqual(data.heartRates, woHltDta.heartRates)
      ) {
        return;
      }
    }
    // does this handle program differently
    const dataObj: HealthDataProps = {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      heartRates: data.heartRates,
      disMeas: HealthDisMeas.mi,
      activityId: data.activityId,
      date: workout.date as string, // date will not exists for program
    };
    onImportData(dataObj);
  };

  return (
    <FlexBox screenWidth column flex={1} zIndex={100} marginTop={10}>
      <HealthImportContainer
        type={AppleHealthKit.Constants.Observers.Workout}
        onImportData={onChangeHealthData}
      />
    </FlexBox>
  );
};

export default OverviewContainer;
