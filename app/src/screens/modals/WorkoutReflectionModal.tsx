import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { ImageProps } from '@app/services';
import { FlexBox } from '@app/ui';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ReflectionImage from 'src/components/workout/overview/ReflectionImage';
import { ReducerProps, ThunkAppDispatch } from 'src/services';
import DeviceHealthImport from './components/DeviceHealthImport';
import { HealthDataProps, HealthDisMeas } from 'src/services/workout/types';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { useImportDeviceActivities } from 'src/hooks/base/device-import.hooks';
import useBanner from 'src/hooks/utils/useBanner';
import { updateReflection } from 'src/services/workout/actions';
import { useMutation } from '@tanstack/react-query';
import { BannerTypes } from 'src/services/banner/types';

const WorkoutReflectionModal = () => {
  const [image, setImage] = useState<ImageProps>();
  const [reflection, setReflection] = useState('');
  const [viewHealth, setViewHealth] = useState(false);
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
  }));
  const { importDeviceActivity } = useImportDeviceActivities();
  const setBanner = useBanner();
  const dispatch = useDispatch<ThunkAppDispatch>();
  const { mutateAsync: saveReflection, isLoading } = useMutation(
    () => {
      const defaultStrainRating = 0;
      return dispatch(
        updateReflection(workout, defaultStrainRating, reflection, image),
      );
    },
    {
      onSuccess: () => {
        setBanner('Successfully saved!', BannerTypes.success);
      },
    },
  );

  const workoutImageUri = workout.imageUri
    ? workout.imageUri
    : workout.localImageUri;

  const onSaveReflection = () => {
    if (isLoading) return;

    if (
      (!reflection && !image) ||
      (reflection === workout.reflection && !image)
    ) {
      return setBanner('No updates found!', BannerTypes.warning);
    }
    saveReflection();
  };

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
    <ScreenTemplate
      applyContentPadding
      isBackVisible
      rotateBack="-90deg"
      rightContentFlex={1}
      rightContent={
        <FlexBox flex={1} justifyContent="flex-end" alignItems="center">
          <Icon
            icon={viewHealth ? 'notebook' : 'cardio'}
            size={25}
            color={Colors.white}
            onPress={() => setViewHealth(view => !view)}
          />
        </FlexBox>
      }>
      {viewHealth ? (
        <FlexBox column flex={1}>
          <DeviceHealthImport workout={workout} onImportData={onImportData} />
          <FlexBox
            flex={1}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            bottom="30%"
            zIndex={-1}
            alignSelf="center">
            <PrimaryText variant="primary" fontSize={50} opacity={0.5}>
              Health
            </PrimaryText>
            <Icon
              icon="cardio"
              size={120}
              color={Colors.white}
              containerStyles={{
                opacity: 0.1,
                position: 'absolute',
                zIndex: -1,
              }}
            />
          </FlexBox>
        </FlexBox>
      ) : (
        <FlexBox column flex={1} onPress={() => Keyboard.dismiss()}>
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
            onPress={onSaveReflection}
            loading={isLoading}>
            Save
          </PrimaryButton>
          <FlexBox flex={1} alignItems="center" justifyContent="center">
            <PrimaryText variant="primary" fontSize={40} opacity={0.5}>
              Reflect
            </PrimaryText>
            <Icon
              icon="notebook"
              size={100}
              color={Colors.white}
              containerStyles={{
                opacity: 0.1,
                position: 'absolute',
                zIndex: -1,
              }}
            />
          </FlexBox>
        </FlexBox>
      )}
    </ScreenTemplate>
  );
};

export default WorkoutReflectionModal;
