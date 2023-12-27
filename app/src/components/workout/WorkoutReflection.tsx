import { WorkoutContext } from '@app/contexts';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { WorkoutStatus } from 'src/services/workout/types';
import Input from '../elements/Input';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';
import ReflectionImage from './overview/ReflectionImage';
import { ImageProps } from '@app/services';

const WorkoutReflection = () => {
  const [image, setImage] = useState<ImageProps>();
  const { setReflection, workout, isProgram, onCompleteWorkout } =
    useContext(WorkoutContext);
  const banner = useBanner();
  const { mutateAsync, isLoading } = useMutation(async (image: ImageProps) => {
    await onCompleteWorkout?.(undefined, image);
    banner('Image successfully uploaded!', BannerTypes.success);
    return;
  });
  const workoutImageUri = workout.imageUri
    ? workout.imageUri
    : workout.localImageUri;
  const imageHasChanged = image && image?.uri !== workoutImageUri;

  const onSaveImage = () => {
    if (imageHasChanged && !isLoading) {
      mutateAsync(image);
    }
  };

  return (
    <FlexBox
      column
      backgroundColor={
        workout.status === WorkoutStatus.completed
          ? Colors.lightPrimary
          : undefined
      }
      borderRadius={5}
      applyBoxShadow={workout.status === WorkoutStatus.completed}>
      {imageHasChanged && (
        <FlexBox
          position="absolute"
          top={10}
          right={40}
          zIndex={100}
          onPress={onSaveImage}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Icon icon="save" color={Colors.white} size={20} />
          )}
        </FlexBox>
      )}
      <Pressable onPress={() => Keyboard.dismiss()}>
        {workout.status === WorkoutStatus.inProgress && (
          <Input
            label="Summary"
            onChangeText={txt => setReflection?.(txt)}
            defaultValue={workout.reflection}
            placeholder="Write a caption..."
            multiline={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            maxLength={150}
            styles={{
              marginBottom: StyleConstants.baseMargin,
              borderRadius: 0,
            }}
          />
        )}
        {!isProgram && (
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
        )}
        {workout.status === WorkoutStatus.completed && (
          <FlexBox column padding={15}>
            <PrimaryText opacity={0.6} marginBottom={5} size="medium">
              Summary
            </PrimaryText>
            <FlexBox>
              <ScrollView>
                <View onStartShouldSetResponder={() => true}>
                  <PrimaryText>
                    {workout.reflection || 'Nothing to say...'}
                  </PrimaryText>
                </View>
              </ScrollView>
            </FlexBox>
          </FlexBox>
        )}
      </Pressable>
    </FlexBox>
  );
};

export default WorkoutReflection;
