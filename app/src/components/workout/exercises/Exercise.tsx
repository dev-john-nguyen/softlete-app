import React, { useEffect, useRef, useState, useContext } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import {
  WorkoutExerciseProps,
  WorkoutExerciseDataProps,
  WorkoutStatus,
  WorkoutActionProps,
  ViewWorkoutProps,
} from '../../../types/workouts.types';
import PrimaryText from '../../elements/PrimaryText';
import ExerciseData from './data/Container';
import { MeasSubCats, ExerciseProps } from '../../../types/exercises.types';
import _ from 'lodash';
import { Colors } from '@app/utils';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { WorkoutContext } from '@app/contexts';
import useBanner from 'src/hooks/utils/useBanner';

interface Props {
  exercise: WorkoutExerciseProps;
  onPress?: (exercise: ExerciseProps) => void;
  onUpdateData: (updatedData: WorkoutExerciseDataProps[]) => void;
  workout: ViewWorkoutProps;
  athlete?: boolean;
  onCalcRefUpdate: (calc: number | string) => void;
  removeWorkoutExercise: WorkoutActionProps['removeWorkoutExercise'];
  showGoBack: boolean;
  goToFirstItem: () => void;
}

const areEqual = (prevProps: Props, nextProps: Props) =>
  _.isEqual(prevProps, nextProps);

const WorkoutExercise = ({
  exercise,
  onPress,
  onUpdateData,
  onCalcRefUpdate,
  removeWorkoutExercise,
  showGoBack,
  goToFirstItem,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const mount = useRef(false);
  const { workout, isProgram, athlete } = useContext(WorkoutContext);
  const setBanner = useBanner();

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const onExercisePress = () => {
    onPress && exercise.exercise && onPress(exercise.exercise);
  };

  const onTrash = async () => {
    if (!athlete) {
      if (loading) {
        return;
      }
      setLoading(true);
      await removeWorkoutExercise(exercise);
      if (mount.current) {
        setLoading(false);
        setBanner('Successfully removed exercise.');
      }
    }
  };

  return (
    <FlexBox screenWidth column marginTop={15}>
      <FlexBox
        marginBottom={10}
        alignItems="center"
        justifyContent="space-between"
        paddingLeft={15}
        paddingRight={15}
        onPress={() => Keyboard.dismiss()}>
        <FlexBox
          alignSelf="flex-start"
          flex={1}
          onPress={onExercisePress}
          marginRight={10}
          alignItem="center">
          {exercise.exercise ? (
            <PrimaryText
              numberOfLines={1}
              size="medium"
              bold
              textTransform="capitalize">
              {exercise.exercise.name}
            </PrimaryText>
          ) : (
            <ActivityIndicator size="small" color={Colors.white} />
          )}
        </FlexBox>
        {(!athlete && workout.status !== WorkoutStatus.completed) ||
        isProgram ? (
          loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Icon
              icon="trash_bin"
              size={20}
              color={Colors.white}
              onPress={onTrash}
            />
          )
        ) : (
          <></>
        )}
      </FlexBox>
      <ExerciseData
        calcRef={exercise.calcRef}
        data={exercise.data}
        measSubCat={
          exercise.exercise ? exercise.exercise.measSubCat : MeasSubCats.none
        }
        updateData={onUpdateData}
        workout={workout}
        athlete={athlete}
        onCalcRefUpdate={onCalcRefUpdate}
        showGoBack={showGoBack}
        goToFirstItem={goToFirstItem}
      />
    </FlexBox>
  );
};

export default React.memo(WorkoutExercise, areEqual);
