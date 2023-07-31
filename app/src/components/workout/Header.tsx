import React, { useContext } from 'react';
import { GeneratedProgramProps } from '../../services/program/types';
import LikeCom from '../Like';
import StagingActions from './StagingActions';
import { PrimaryText } from '@app/elements';
import { Colors, rgba } from '@app/utils';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { WorkoutContext } from '@app/contexts';

interface Props {
  program?: GeneratedProgramProps | undefined;
  isLiked?: boolean;
  onLikePress?: () => void;
}

const WorkoutHeader = ({ program, onLikePress, isLiked }: Props) => {
  const { workout, athlete, onUpdateStatus, isProgram } =
    useContext(WorkoutContext);
  const likeUids = workout.likeUids ? workout.likeUids : [];

  return (
    <FlexBox column paddingTop={10}>
      {!isProgram && (
        <StagingActions
          onUpdateStatus={onUpdateStatus}
          status={workout.status}
          athlete={athlete}
        />
      )}
      <FlexBox
        padding={15}
        borderTopWidth={1}
        borderTopColor={rgba(Colors.lightWhiteRgb, 0.5)}>
        <FlexBox flex={1} column>
          <FlexBox alignItems="center">
            <PrimaryText textTransform="capitalize" size="medium">
              {workout.name}
            </PrimaryText>
          </FlexBox>
          {!!workout.description && (
            <PrimaryText>{workout.description}</PrimaryText>
          )}
          {program && (
            <FlexBox marginTop={5} alignItems="center" alignSelf="flex-start">
              <Icon
                icon="folder"
                size={18}
                containerStyles={{ marginRight: 5 }}
                color={Colors.white}
              />
              <PrimaryText textTransform="capitalize">
                {program.name}
              </PrimaryText>
            </FlexBox>
          )}
        </FlexBox>
        {/* disabled for MVP */}
        {!isProgram && false && (
          <FlexBox flex={0.2}>
            <LikeCom
              likeUids={likeUids}
              status={workout.status}
              isLiked={isLiked}
              onLikePress={onLikePress}
            />
          </FlexBox>
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default WorkoutHeader;
