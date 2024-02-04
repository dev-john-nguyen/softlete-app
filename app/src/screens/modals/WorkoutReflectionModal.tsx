import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { ImageProps, setBanner } from '@app/services';
import { FlexBox } from '@app/ui';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import ReflectionImage from 'src/components/workout/overview/ReflectionImage';
import { ReducerProps } from 'src/services';
import DeviceHealthImport from './components/DeviceHealthImport';
import { HealthDataProps, HealthDisMeas } from 'src/services/workout/types';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { useImportDeviceActivities } from 'src/hooks/base/device-import.hooks';
import useBanner from 'src/hooks/utils/useBanner';

const WorkoutReflectionModal = () => {
  const [image, setImage] = useState<ImageProps>();
  const [reflection, setReflection] = useState('');
  const [viewHealth, setViewHealth] = useState(false);
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
  }));
  const { importDeviceActivity } = useImportDeviceActivities();
  const setBanner = useBanner();

  const workoutImageUri = workout.imageUri
    ? workout.imageUri
    : workout.localImageUri;

  const onSaveReflection = () => {};

  const onImportData = async (data: HealthDataProps) => {
    // does this handle program differently
    const updatedHealthData: HealthDataProps = {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      heartRates: data.heartRates,
      disMeas: HealthDisMeas.mi,
      activityId: data.activityId,
      date: workout.date as string,
    };
    await importDeviceActivity(updatedHealthData, workout._id);
    setBanner('Successfully updated!');
  };

  return (
    <ScreenTemplate applyContentPadding isBackVisible rotateBack="-90deg">
      {viewHealth ? (
        <FlexBox column flex={1}>
          <DeviceHealthImport workout={workout} onImportData={onImportData} />
          <FlexBox flex={1} alignItems="center" justifyContent="center">
            <PrimaryText variant="primary" fontSize={50} opacity={1}>
              Health
            </PrimaryText>
            <Icon
              icon="cardio"
              size={120}
              color={Colors.white}
              containerStyles={{ opacity: 0.1, position: 'absolute' }}
            />
          </FlexBox>
        </FlexBox>
      ) : (
        <FlexBox column flex={1}>
          <ReflectionImage
            setImage={
              setImage as React.Dispatch<
                React.SetStateAction<ImageProps | undefined>
              >
            }
            image={image}
            imageUri={workoutImageUri}
            allowUpload
            hideSvg={!!workoutImageUri || !!image?.uri}
          />
          <Input
            onChangeText={txt => setReflection(txt)}
            defaultValue={workout.reflection}
            placeholder="Write about how your workout went..."
            multiline={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            maxLength={150}
            mt={20}
          />
          <PrimaryButton
            marginTop={20}
            alignSelf="flex-end"
            onPress={onSaveReflection}>
            Save
          </PrimaryButton>
          <FlexBox flex={1} alignItems="center" justifyContent="center">
            <PrimaryText variant="primary" fontSize={40} opacity={1}>
              Reflect
            </PrimaryText>
            <Icon
              icon="notebook"
              size={100}
              color={Colors.white}
              containerStyles={{ opacity: 0.1, position: 'absolute' }}
            />
          </FlexBox>
        </FlexBox>
      )}
      <FlexBox
        marginBottom={20}
        justifyContent={viewHealth ? 'flex-start' : 'flex-end'}
        alignItems="flex-start">
        <PrimaryButton onPress={() => setViewHealth(s => !s)}>
          {viewHealth ? 'View Reflection' : 'View Health'}
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default WorkoutReflectionModal;
