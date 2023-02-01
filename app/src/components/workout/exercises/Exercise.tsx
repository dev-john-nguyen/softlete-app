import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {
  WorkoutExerciseProps,
  WorkoutExerciseDataProps,
  WorkoutStatus,
  WorkoutActionProps,
  WorkoutProps,
} from '../../../services/workout/types';
import PrimaryText from '../../elements/PrimaryText';
import ExerciseData from './data/Container';
import StyleConstants from '../../tools/StyleConstants';
import { normalize } from '../../../utils/tools';
import { MeasSubCats, ExerciseProps } from '../../../services/exercises/types';
import _ from 'lodash';
import { Colors } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  exercise: WorkoutExerciseProps;
  onPress?: (exercise: ExerciseProps) => void;
  onUpdateData: (updatedData: WorkoutExerciseDataProps[]) => void;
  workout: WorkoutProps;
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
  workout,
  athlete,
  onCalcRefUpdate,
  removeWorkoutExercise,
  showGoBack,
  goToFirstItem,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const mount = useRef(false);

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const onExercisePress = () => {
    onPress && exercise.exercise && onPress(exercise.exercise);
  };

  const onTrash = () => {
    if (!athlete) {
      if (loading) return;
      setLoading(true);
      removeWorkoutExercise(exercise)
        .then(() => {
          mount.current && setLoading(false);
        })
        .catch(err => {
          console.log(err);
          mount.current && setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.headerContainer}
        onPress={() => Keyboard.dismiss()}>
        <Pressable style={styles.header} onPress={onExercisePress}>
          {exercise.exercise ? (
            <PrimaryText
              size="large"
              numberOfLines={1}
              textTransform="capitalize">
              {exercise.exercise.name}
            </PrimaryText>
          ) : (
            <ActivityIndicator size="small" color={Colors.white} />
          )}
        </Pressable>
        {!athlete && workout.status === WorkoutStatus.pending ? (
          loading ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.trash}
            />
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
      </Pressable>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StyleConstants.baseMargin,
    width: normalize.width(1),
  },
  trash: {
    width: normalize.width(20),
    height: normalize.width(20),
    alignSelf: 'flex-start',
    marginLeft: StyleConstants.smallMargin,
  },
  headerContainer: {
    marginBottom: StyleConstants.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
  },
  header: {
    alignSelf: 'flex-start',
    flex: 1,
  },
});
export default React.memo(WorkoutExercise, areEqual);
