import React, { useContext, useEffect, useState } from 'react';
import { View, Pressable, Keyboard, ScrollView } from 'react-native';
import {
  HealthDataProps,
  HealthDisMeas,
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutStatus,
  WorkoutTypes,
} from '../../../services/workout/types';
import { ImageProps } from '../../../services/user/types';
import AutoId from '../../../utils/AutoId';
import HealthImportContainer from './HealthImportContainer';
import AppleHealthKit from 'react-native-health';
import { normalize } from '../../../utils/tools';
import _ from 'lodash';
import { HomeWorkoutContext } from '@app/contexts';
import { Input, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import ReflectionImage from './ReflectionImage';
import { StyleConstants } from '@app/utils';
import { useNavigation } from '@react-navigation/native';

interface WorkoutReflectionProps {
  setImage: (img: ImageProps) => void;
  image?: ImageProps;
}

const WorkoutReflection = ({ image, setImage }: WorkoutReflectionProps) => {
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
  }));

  const { setReflection } = useContext(HomeWorkoutContext);

  return (
    <FlexBox column margin={15} marginTop={0}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <ReflectionImage
          setImage={setImage}
          image={image}
          imageUri={workout.imageUri ? workout.imageUri : workout.localImageUri}
          allowUpload={workout.status === WorkoutStatus.inProgress}
        />
        {workout.status === WorkoutStatus.completed ? (
          <FlexBox height={normalize.height(12)} marginTop={10}>
            <ScrollView>
              <View onStartShouldSetResponder={() => true}>
                <PrimaryText>{workout.reflection}</PrimaryText>
              </View>
            </ScrollView>
          </FlexBox>
        ) : (
          <Input
            onChangeText={txt => setReflection?.(txt)}
            placeholder="Write a caption..."
            multiline={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            maxLength={200}
            styles={{ marginTop: StyleConstants.baseMargin, borderRadius: 0 }}
          />
        )}
      </Pressable>
    </FlexBox>
  );
};

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
  const [healthData, setHealthData] = useState<HealthDataProps>();
  const navigation = useNavigation();

  useEffect(() => {
    if (workout.type !== WorkoutTypes.TraditionalStrengthTraining) {
      navigation.setOptions({ headerTitle: '' });
    }
  }, [workout, navigation]);

  useEffect(() => {
    if (workout.healthData) {
      setHealthData(workout.healthData);
    } else {
      setHealthData({
        activityName: workout.type,
        sourceName: 'Custom',
        calories: 0,
        duration: 0,
        distance: 0,
        disMeas: HealthDisMeas.mi,
        heartRates: [],
        activityId: AutoId.newId(20),
        date: workout.date,
      });
    }
  }, [workout]);

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
    setHealthData({ ...dataObj, _id: AutoId.newId(10) });
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
