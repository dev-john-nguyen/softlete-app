import { FlexBox } from '@app/ui';
import { rgba } from '@app/utils';
import {
  PrimaryText,
  ProfileImage,
  YoutubePreview,
  ExerciseVideo,
} from '@app/elements';
import React from 'react';
import { UserProps } from 'src/services/absolute-exports';
import { ExerciseProps } from 'src/services/exercises/types';
import BaseColors from 'src/utils/BaseColors';
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
      borderBottomColor={rgba(BaseColors.whiteRbg, 0.2)}
      justifyContent="space-between"
      alignItems="center"
      padding={15}>
      <FlexBox>
        {user.uid === exercise.userUid && !exercise.softlete ? (
          <FlexBox width={15} height={15}>
            <ProfileImage imageUri={user.imageUri} />
          </FlexBox>
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
