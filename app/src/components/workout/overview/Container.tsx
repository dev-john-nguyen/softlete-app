import React, { useEffect } from 'react';
import {
  HealthDataProps,
  HealthDisMeas,
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutTypes,
} from '../../../services/workout/types';
import { ImageProps } from '../../../services/user/types';
import HealthImportContainer from './HealthImportContainer';
import AppleHealthKit from 'react-native-health';
import _ from 'lodash';
import { FlexBox } from '@app/ui';
import { useNavigation } from '@react-navigation/native';

interface Props {
  workout: ViewWorkoutProps;
  updateWoHealthData?: WorkoutActionProps['updateWoHealthData'];
  athlete?: boolean;
  image?: ImageProps;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}

const OverviewContainer = ({
  workout,
  updateWoHealthData,
  athlete,
  image,
  setImage,
}: Props) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (workout.type !== WorkoutTypes.TraditionalStrengthTraining) {
      navigation.setOptions({ headerTitle: '' });
    }
  }, [workout, navigation]);

  const onImportData = (data: HealthDataProps) =>
    updateWoHealthData &&
    updateWoHealthData(workout._id, data).catch(err => console.log(err));

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
      )
        return;
    }

    const dataObj: HealthDataProps = {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      heartRates: data.heartRates,
      disMeas: HealthDisMeas.mi,
      activityId: data.activityId,
      date: workout.date,
    };
    onImportData(dataObj);
  };

  return (
    <FlexBox screenWidth column flex={1} zIndex={100} marginTop={10}>
      <HealthImportContainer
        workout={workout}
        type={AppleHealthKit.Constants.Observers.Workout}
        onImportData={onChangeHealthData}
        setImage={setImage}
        image={image}
      />
    </FlexBox>
  );
};

export default OverviewContainer;
