import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { useMemo } from 'react';
import { WorkoutStatus } from '../services/workout/types';
import { PrimaryText } from './elements';

interface Props {
  likeUids: string[];
  status: WorkoutStatus;
  isLiked?: boolean;
  onLikePress?: () => void;
}

const LikeCom = ({ likeUids, status, isLiked, onLikePress }: Props) => {
  const likeCount = useMemo(() => {
    let count = likeUids.length;
    if (isLiked) {
      count++;
    }
    return count;
  }, [likeUids, isLiked]);

  return (
    <FlexBox column>
      <FlexBox
        justifyContent="center"
        alignItems="center"
        position="absolute"
        left="2%"
        top="-10%"
        zIndex={100}
        borderRadius={100}
        padding={10}
        borderColor={
          status === WorkoutStatus.completed
            ? Colors.lightGreen
            : Colors.lightWhite
        }
        borderWidth={1}
        onPress={onLikePress}>
        <Icon
          icon="thumbs_up"
          color={
            status === WorkoutStatus.completed
              ? Colors.green
              : Colors.lightWhite
          }
          size={15}
        />
        <PrimaryText
          color={
            status === WorkoutStatus.completed ? Colors.green : Colors.white
          }
          marginLeft={5}>
          {likeCount}
        </PrimaryText>
        {isLiked && (
          <Icon
            icon="checked"
            size={25}
            containerStyles={{ marginRight: 5 }}
            color={
              status === WorkoutStatus.completed ? Colors.green : Colors.primary
            }
          />
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default LikeCom;
