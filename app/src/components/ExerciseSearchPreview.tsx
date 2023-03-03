import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import {
  PrimaryText,
  ProfileImage,
  YoutubePreview,
  ExerciseVideo,
} from '@app/elements';
import React from 'react';
import { UserProps } from 'src/services/absolute-exports';
import { ExerciseProps } from 'src/services/exercises/types';
import Icon from '@app/icons';

interface Props {
  exercise: ExerciseProps;
  onPress: () => void;
  softlete?: boolean;
  user: UserProps;
}

const ExerciseSearchPreview = ({
  exercise,
  onPress,
  softlete,
  user,
}: Props) => {
  return (
    <FlexBox
      onPress={onPress}
      borderBottomWidth={1}
      borderBottomColor={rgba(Colors.whiteRbg, 0.2)}
      justifyContent="space-between"
      alignItems="center"
      padding={15}>
      <FlexBox
        height={25}
        width={25}
        alignItems="center"
        justifyContent="center">
        {user.uid === exercise.userUid && !exercise.softlete ? (
          <ProfileImage imageUri={user.imageUri} />
        ) : (
          <Icon icon="logo" size={25} variant="secondary" />
        )}
      </FlexBox>
      <PrimaryText
        size="small"
        textTransform="capitalize"
        flex={1}
        paddingLeft={10}
        paddingRight={10}>
        {exercise.name}
      </PrimaryText>
      {(() => {
        if (user.uid !== exercise.userUid) {
          if (exercise.url) {
            return <ExerciseVideo props={exercise} small />;
          }
        } else {
          if (exercise.url || exercise.localUrl) {
            return <ExerciseVideo props={exercise} small />;
          }
        }
        return <YoutubePreview id={exercise.youtubeId} small />;
      })()}
    </FlexBox>
  );
};

export default React.memo(ExerciseSearchPreview);
