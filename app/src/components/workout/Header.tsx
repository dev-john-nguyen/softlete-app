import React, { useMemo, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { GeneratedProgramProps } from '../../services/program/types';
import DateTools from '../../utils/DateTools';
import { SafeAreaView } from 'react-native-safe-area-context';
import LikeCom from '../Like';
import StagingActions from './StagingActions';
import { PrimaryText } from '@app/elements';
import { Colors, rgba, StyleConstants } from '@app/utils';
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
  const headerText = useMemo(() => {
    if (!program) return '';

    const dObj = DateTools.UTCISOToLocalDate(program.startDate);
    if (!dObj) return program.name;
    const dStr = DateTools.dateToStr(dObj);
    const monthDayStr = DateTools.strToMMDD(dStr);
    return monthDayStr + ' ' + program.name;
  }, [program]);

  return (
    <FlexBox column paddingTop={10}>
      {!isProgram && (
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
      </SafeAreaView>
    </FlexBox>
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
