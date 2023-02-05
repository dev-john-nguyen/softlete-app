import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ViewWorkoutProps, WorkoutStatus } from '../../services/workout/types';
import { GeneratedProgramProps } from '../../services/program/types';
import DateTools from '../../utils/DateTools';
import { SafeAreaView } from 'react-native-safe-area-context';
import LikeCom from '../Like';
import StagingActions from './StagingActions';
import { PrimaryText } from '@app/elements';
import { Colors, rgba, StyleConstants } from '@app/utils';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';

interface Props {
  workout: ViewWorkoutProps;
  program?: GeneratedProgramProps | undefined;
  onUpdateStatus?: (status: WorkoutStatus) => void;
  athlete?: boolean;
  isLiked?: boolean;
  onLikePress?: () => void;
  likeUids: string[];
  template?: boolean;
}

const WorkoutHeader = ({
  workout,
  program,
  onUpdateStatus,
  athlete,
  onLikePress,
  isLiked,
  likeUids,
  template,
}: Props) => {
  const headerText = useMemo(() => {
    if (!program) return '';

    const dObj = DateTools.UTCISOToLocalDate(program.startDate);
    if (!dObj) return program.name;
    const dStr = DateTools.dateToStr(dObj);
    const monthDayStr = DateTools.strToMMDD(dStr);
    return monthDayStr + ' ' + program.name;
  }, [program]);

  return (
    <View>
      {!template && (
        <StagingActions
          onUpdateStatus={onUpdateStatus}
          status={workout.status}
          athlete={athlete}
        />
      )}
      <SafeAreaView edges={['bottom']} style={styles.container}>
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
            <FlexBox marginTop={5} alignItems="center">
              <Icon
                icon="folder"
                size={20}
                containerStyles={{ marginRight: 5 }}
                color={Colors.white}
              />
              <PrimaryText>{headerText}</PrimaryText>
            </FlexBox>
          )}
        </FlexBox>
        {/* disabled for MVP */}
        {!template && false && (
          <FlexBox flex={0.2}>
            <LikeCom
              likeUids={likeUids}
              status={workout.status}
              isLiked={isLiked}
              onLikePress={onLikePress}
            />
          </FlexBox>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
    paddingTop: StyleConstants.baseMargin,
    paddingBottom: StyleConstants.smallMargin,
    marginTop: StyleConstants.smallMargin,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: rgba(Colors.lightWhiteRgb, 0.2),
  },
});
export default WorkoutHeader;
