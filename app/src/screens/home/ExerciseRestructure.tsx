import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  WorkoutExerciseProps,
  WorkoutActionProps,
  RootWorkoutProps,
  WorkoutExercisesObjProps,
} from '../../services/workout/types';
import ExerciseList from '../../components/restructure/List';
import { useSharedValue } from 'react-native-reanimated';
import { listToObject } from '../../components/restructure/utils';
import { connect } from 'react-redux';
import { ReducerProps } from '../../services';
import { exercisesArrToObj, normalize } from '../../utils/tools';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import SaveSvg from '../../assets/SaveSvg';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../../components/tools/StyleConstants';
import { updateWorkoutExercises } from '../../services/workout/actions';
import _ from 'lodash';
import { setBanner } from '../../services/banner/actions';
import { BannerActionsProps, BannerTypes } from '../../services/banner/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import BackButton from '../../components/elements/BackButton';
import PrimaryText from '../../components/elements/PrimaryText';

interface Props {
  navigation: any;
  route: any;
  viewWorkout: RootWorkoutProps['viewWorkout'];
  updateWorkoutExercises: WorkoutActionProps['updateWorkoutExercises'];
  setBanner: BannerActionsProps['setBanner'];
}

const ExerciseRestructure = ({
  route,
  navigation,
  viewWorkout,
  updateWorkoutExercises,
  setBanner,
}: Props) => {
  const [exercises, setExercises] = useState<WorkoutExerciseProps[]>([]);
  const [exercisesObj, setExerciseObj] = useState<WorkoutExercisesObjProps>({});
  const [groups, setGroups] = useState<string[]>([]);
  const [curGroup, setCurGroup] = useState<string>('');
  const exercisePos = useSharedValue<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [trashBin, setTrashBin] = useState<WorkoutExerciseProps[]>([]);
  const [prevExerciseObj, setPrevExerciseObj] =
    useState<WorkoutExercisesObjProps>({});
  const headerHeight = useHeaderHeight();

  const initiateData = useCallback(() => {
    if (viewWorkout) {
      if (!viewWorkout.exercises || viewWorkout.exercises.length < 1) {
        setBanner(
          BannerTypes.warning,
          "Workout doesn't contain any exercises.",
        );
        navigation.goBack();
        return;
      }

      //need to initiate exercseObj
      const WoExObj = _.cloneDeep(exercisesArrToObj(viewWorkout.exercises));

      const keys = Object.keys(WoExObj).sort(
        (a, b) => parseInt(a) - parseInt(b),
      );

      //add additional one
      const lastKey = keys[keys.length - 1];
      const newKey = parseInt(lastKey) + 1;
      WoExObj[newKey.toString()] = [];

      setGroups([...keys, newKey.toString()]);
      setCurGroup(keys[0]);

      const curEx = [...WoExObj[keys[0]]].sort((a, b) => a.order - b.order);
      exercisePos.value = listToObject(curEx);
      setExerciseObj(WoExObj);
      setPrevExerciseObj(_.cloneDeep(WoExObj));
    }
  }, [viewWorkout]);

  useEffect(() => {
    initiateData();
  }, [viewWorkout]);

  const handleUpdateExerciseState = useCallback(() => {
    const curExercises = exercisesObj[curGroup];
    if (!curExercises) {
      setExercises([]);
      return;
    }
    exercisePos.value = listToObject([...curExercises]);
    setExercises([...curExercises]);
  }, [curGroup, exercisesObj]);

  useEffect(() => {
    if (curGroup) handleUpdateExerciseState();
  }, [curGroup, exercisesObj]);

  const onSave = () => {
    if (loading) return;

    setLoading(true);
    //update the current order of the exercises
    exercisesObj[curGroup] = handleExerciseReorder(exercisesObj[curGroup]);

    if (_.isEqual(prevExerciseObj, exercisesObj)) {
      setBanner(BannerTypes.warning, 'No changes were made.');
      setLoading(false);
      return;
    }

    //prepare exercises
    const saveExercises: WorkoutExerciseProps[] = [];

    Object.keys(exercisesObj).forEach(k => {
      exercisesObj[k].forEach(e => {
        saveExercises.push(e);
      });
    });

    let removedExercises: WorkoutExerciseProps[] = [];

    if (trashBin.length > 0) {
      trashBin.forEach(t => {
        removedExercises.push({
          ...t,
          remove: true,
        });
      });
    }

    if (saveExercises.length < 1 && removedExercises.length < 1)
      return setLoading(false);

    updateWorkoutExercises(viewWorkout._id, saveExercises, removedExercises)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const onExerciseToGroup = (exerciseUid: string, targetGroup: string) => {
    const objExIndex = exercisesObj[curGroup].findIndex(
      e => e._id === exerciseUid,
    );
    if (objExIndex < 0) return;
    //remove and change group
    //need to update the group
    if (exercisesObj[targetGroup]) {
      exercisesObj[targetGroup].push(exercisesObj[curGroup][objExIndex]);
    } else {
      exercisesObj[targetGroup] = [exercisesObj[curGroup][objExIndex]];
    }

    exercisesObj[curGroup].splice(objExIndex, 1);
    regenerateExerciseObj();
  };

  const regenerateExerciseObj = () => {
    const newObj: WorkoutExercisesObjProps = {};

    let count = 0;

    Object.keys(exercisesObj)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach(key => {
        const groupExs = exercisesObj[key];
        if (groupExs.length > 0) {
          newObj[count] = groupExs.map(e => ({ ...e, group: count }));
          count++;
        }
      });

    const newGroups = Object.keys(newObj).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );
    const lastGroup = newGroups[newGroups.length - 1];
    const newGroup = parseInt(lastGroup) + 1;
    newObj[newGroup] = [];
    setGroups([...newGroups, newGroup.toString()]);
    setExerciseObj({ ...newObj });
  };

  const onRemove = (id: string) => {
    const foundIndex = exercises.findIndex(
      ex => ex._id === id || ex.tempId === id,
    );
    if (foundIndex < 0) return;
    const remove = exercises[foundIndex].remove;
    exercises[foundIndex].remove = remove ? false : true;
    setExercises([...exercises]);
  };

  const handleExerciseReorder = (exs: WorkoutExerciseProps[]) => {
    if (!exs || exs.length < 1) return [];

    for (let i = 0; i < exs.length; i++) {
      const { _id } = exs[i];
      if (_id && exercisePos.value[_id] != null) {
        exs[i] = {
          ...exs[i],
          group: parseInt(curGroup),
          order: exercisePos.value[_id],
        };
      }
    }

    exs.sort((a, b) => a.order - b.order);
    return [...exs];
  };

  const onChangeGroup = (nextGroup: string) => {
    //this is not getting the most up to date exerciseObj because list header doesn't rerender when exerciseObj rerenders
    //must use setExerciseObj to get most recent obj
    if (nextGroup === curGroup) return;

    setExerciseObj(obj => {
      if (obj[curGroup]) {
        obj[curGroup] = handleExerciseReorder(obj[curGroup]);
        setExerciseObj({ ...obj });
      }
      return { ...obj };
    });

    setCurGroup(nextGroup);
  };

  const onTrashExercise = (exerciseUid: string) => {
    //current group
    const exerciseIndex = exercisesObj[curGroup].findIndex(
      e => e._id === exerciseUid,
    );
    if (exerciseIndex > -1) {
      setTrashBin(s => [...s, exercisesObj[curGroup][exerciseIndex]]);
      exercisesObj[curGroup].splice(exerciseIndex, 1);
    }
    regenerateExerciseObj();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <View style={[{ height: headerHeight }, styles.headerContainer]}>
        <BackButton onPress={() => navigation.goBack()} rotateBack="0" />
        <PrimaryText styles={styles.middleText}>Restructure</PrimaryText>
        <Pressable style={styles.rightContainer} onPress={onSave} hitSlop={5}>
          {loading ? (
            <ActivityIndicator size="small" color={BaseColors.black} />
          ) : (
            <SaveSvg strokeColor={BaseColors.black} />
          )}
        </Pressable>
      </View>
      <ExerciseList
        exercisesProps={exercises}
        groupsProps={groups}
        onSave={onSave}
        onRemove={onRemove}
        curGroup={curGroup}
        onChangeGroup={onChangeGroup}
        onExerciseToGroup={onExerciseToGroup}
        exercisePos={exercisePos}
        onTrashExercise={onTrashExercise}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  leftContainer: {},
  middleText: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.black,
  },
  rightContainer: {
    height: normalize.width(20),
    width: normalize.width(20),
    marginRight: StyleConstants.baseMargin,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  viewWorkout: state.workout.viewWorkout,
});

export default connect(mapStateToProps, { updateWorkoutExercises, setBanner })(
  ExerciseRestructure,
);
