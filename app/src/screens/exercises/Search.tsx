import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SectionList } from 'react-native';
import { PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';
import {
  ExerciseProps,
  ExerciseActionProps,
  Categories,
} from '../../services/exercises/types';
import { ReducerProps } from '../../services';
import { connect, useSelector } from 'react-redux';
import ExerciseSearchPreview from '../../components/ExerciseSearchPreview';
import { searchExercises } from '../../services/exercises/actions';
import { updateWorkoutExercises } from '../../services/workout/actions';
import {
  WorkoutActionProps,
  WorkoutExerciseProps,
} from '../../services/workout/types';
import { updateProgramWorkoutExercises } from '../../services/program/actions';
import { ProgramActionProps } from '../../services/program/types';
import _ from 'lodash';
import StyleConstants from '../../components/tools/StyleConstants';
import { HomeStackScreens } from '../home/types';
import CircleAdd from '../../components/elements/CircleAdd';
import SearchHeader from '../../components/SearchHeader';
import SearchFilter from '../../components/SearchFilter';
import { AppDispatch } from '../../../App';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import { ProgramStackScreens } from '../program/types';
import ScreenTemplate from '../../components/elements/screen-template';

interface Props {
  navigation: any;
  route: any;
  searchExercises: ExerciseActionProps['searchExercises'];
  updateWorkoutExercises: WorkoutActionProps['updateWorkoutExercises'];
  updateProgramWorkoutExercises: ProgramActionProps['updateProgramWorkoutExercises'];
  dispatch: AppDispatch;
}

const Exercises = ({
  navigation,
  route,
  searchExercises,
  updateWorkoutExercises,
  updateProgramWorkoutExercises,
  dispatch,
}: Props) => {
  const { exercisesProps, pinExercises, user, offline } = useSelector(
    (state: ReducerProps) => ({
      exercisesProps: state.exercises.data,
      pinExercises: state.misc.pinExercises,
      user: state.user,
      offline: state.global.offline,
    }),
  );
  const [selectedExercises, setSelectedExercises] = useState<
    Map<string, ExerciseProps>
  >(new Map());
  const [exercises, setExercises] = useState<
    { title: string; data: ExerciseProps[] }[]
  >([]);
  const [showFilter, setShowFilter] = useState(false);
  const [catFilter, setCatFilter] = useState('');
  const [equipFilter, setEquipFilter] = useState('');
  const [mGFilter, setMGFilter] = useState('');
  const [hiddenGroups, setHiddenGroups] = useState<string[]>([]);
  const [fetchedExs, setFetchedExs] = useState<
    { title: string; data: ExerciseProps[] }[]
  >([]);
  const [query, setQuery] = useState('');

  const workoutParams = useMemo(() => {
    const { group, order, workoutUid, programTemplateUid } =
      (route?.params as {
        group: number;
        order: number;
        workoutUid: string;
        programTemplateUid?: string;
      }) ?? {};
    return { group, order, workoutUid, programTemplateUid };
  }, [route]);

  useEffect(() => {
    const pinExs = _.intersectionWith(
      exercisesProps,
      pinExercises,
      (a, b) => a._id === b.exerciseUid,
    );

    const pinStore: { title: string; data: ExerciseProps[] } = {
      title: 'Pinned',
      data: [],
    };

    if (pinExs.length > 0 && !hiddenGroups.find(g => g === 'Pinned')) {
      pinStore.data = pinExs;
    }

    let clone = _.cloneDeep(exercisesProps);

    //regex querying
    const regex = new RegExp(
      query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').toLowerCase(),
    );
    clone = clone.filter(e => e.name && regex.test(e.name.toLowerCase()));

    if (equipFilter || catFilter || equipFilter) {
      //filter checks
      //filter each one one at a time
      if (catFilter) {
        clone = clone.filter(item => item.category === catFilter);
      }

      if (mGFilter) {
        clone = clone.filter(item =>
          item.muscleGroups?.some(m => String(m) === mGFilter),
        );
      }

      if (equipFilter) {
        clone = clone.filter(item => item.equipment === equipFilter);
      }
    }

    let grouped = processFetchedExercises(clone);

    //hide all the groups
    if (hiddenGroups.length > 0) {
      grouped = grouped.map(item => {
        const remove = hiddenGroups.find(g => g === item.title);
        if (remove) {
          item.data = [];
        }
        return item;
      });
    }
    grouped.sort((a, b) => a.title.localeCompare(b.title));
    setExercises([pinStore, ...grouped]);
  }, [
    pinExercises,
    hiddenGroups,
    fetchedExs,
    catFilter,
    mGFilter,
    equipFilter,
    exercisesProps,
    query,
  ]);

  const onGoBackHandler = () => {
    if (navigation.canGoBack()) return navigation.goBack();
    navigation.navigate(HomeStackScreens.Home);
  };

  const onSendExerciseToWorkout = () => {
    if (!workoutParams.workoutUid) return navigation.goBack();

    const workoutExercises = Array.from(selectedExercises).map(
      ([, exercise]) => {
        const workoutExercise: WorkoutExerciseProps = {
          group: workoutParams.group,
          order: workoutParams.order,
          exercise: exercise,
          data: [
            {
              reps: 1,
              predictVal: 0,
              pct: 100,
            },
          ],
        };
        return workoutExercise;
      },
    );

    if (
      workoutParams.programTemplateUid ||
      (route.params && route.params.programStack)
    ) {
      updateProgramWorkoutExercises(workoutParams.workoutUid, workoutExercises)
        .then(() => onGoBackHandler())
        .catch(err => console.log(err));
    } else {
      updateWorkoutExercises(workoutParams.workoutUid, workoutExercises)
        .then(() => onGoBackHandler())
        .catch(err => console.log(err));
    }
  };

  const onAddExerciessPress = () => {
    dispatch({ type: SET_TARGET_EXERCISE, payload: {} });
    if (route && route.params && route.params.programStack) {
      navigation.navigate(ProgramStackScreens.ProgramEditExerciseDetails, {
        workoutParams,
      });
    } else {
      navigation.navigate(HomeStackScreens.EditExerciseDetails, {
        workoutParams,
      });
    }
  };

  const onSearch = async (query: string) => {
    setQuery(query);
  };

  const onSearchByCat = async (category: Categories) => {
    const regex = new RegExp(
      category.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').toLowerCase(),
    );
    const queryExercise = exercisesProps.filter(e =>
      regex.test(e.category.toLowerCase()),
    );
    const format = processFetchedExercises(queryExercise);
    setExercises(format);
  };

  const processFetchedExercises = (exs: ExerciseProps[] | void) => {
    if (!exs) return [];

    const groups = _.groupBy(exs, 'category');

    const groupExs: { title: string; data: ExerciseProps[] }[] = [];

    Object.keys(groups).forEach(function (key) {
      groupExs.push({
        title: key,
        data: groups[key].sort((a, b) =>
          (a.name ?? '').localeCompare(b.name ?? '', 'en', {
            sensitivity: 'base',
          }),
        ),
      });
    });

    return groupExs;
  };

  const renderItem = useCallback(
    ({ item }: { item: ExerciseProps }) => {
      const onExercisePress = (exercise: ExerciseProps) => {
        setShowFilter(false);
        if (route.params) {
          setSelectedExercises(prevSelected => {
            if (!exercise._id) return prevSelected;

            if (prevSelected.get(exercise._id)) {
              prevSelected.delete(exercise._id);
            } else {
              prevSelected.set(exercise._id, exercise);
            }
            return new Map(prevSelected);
          });
          // onSendExerciseToWorkout(exercise);
        } else {
          navigation.navigate(HomeStackScreens.Exercise, {
            exercise: exercise,
          });
        }
      };

      return (
        <ExerciseSearchPreview
          exercise={item}
          onPress={() => onExercisePress(item)}
          softlete={item.softlete}
          user={user}
          isActive={selectedExercises.get(item._id as string) ? true : false}
        />
      );
    },
    [navigation, route, selectedExercises, user],
  );

  const onReset = () => {
    setCatFilter('');
    setEquipFilter('');
    setHiddenGroups([]);
    setMGFilter('');
    setShowFilter(false);
    setExercises([]);
    setFetchedExs([]);
  };

  // const handleOnFilter = () => {
  //     Keyboard.dismiss();
  //     setShowFilter(f => f ? false : true);
  // }

  const hideGroup = (group: string) =>
    setHiddenGroups(gs => {
      const foundIndex = gs.findIndex(g => group === g);
      if (foundIndex > -1) {
        gs.splice(foundIndex, 1);
      } else {
        gs.push(group);
      }
      return [...gs];
    });

  return (
    <ScreenTemplate
      isBackVisible
      onGoBack={onGoBackHandler}
      middleContentFlex={1}
      leftContentFlex={0}
      rightContentFlex={0}
      middleContent={
        <SearchHeader
          onSearch={onSearch}
          onChange={onSearch}
          customRightElement={
            !offline ? (
              <FlexBox justifyContent="center" marginLeft={10}>
                <CircleAdd
                  size={10}
                  onPress={onAddExerciessPress}
                  style={{ position: 'relative' }}
                />
              </FlexBox>
            ) : (
              <></>
            )
          }
        />
      }>
      {/* <SearchFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        catFilter={catFilter}
        setCatFilter={setCatFilter}
        equipFilter={equipFilter}
        setEquipFilter={setEquipFilter}
        mGFilter={mGFilter}
        setMGFilter={setMGFilter}
        onReset={onReset}
        onSearchByCat={onSearchByCat}
      /> */}
      <SectionList
        sections={exercises}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
        contentContainerStyle={{ paddingBottom: StyleConstants.baseMargin }}
        renderItem={renderItem}
        initialNumToRender={20}
        renderSectionHeader={({ section: { title } }) => (
          <FlexBox
            onPress={() => hideGroup(title)}
            borderBottomWidth={0.2}
            borderBottomColor={Colors.lightWhite}
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={15}
            paddingRight={15}
            paddingTop={10}
            paddingBottom={10}>
            <PrimaryText
              size="small"
              textTransform="capitalize"
              variant="secondary">
              {title}
            </PrimaryText>
            {hiddenGroups.find(g => g === title) && (
              <FlexBox
                width="4%"
                height={1}
                borderRadius={100}
                backgroundColor={Colors.secondary}
              />
            )}
          </FlexBox>
        )}
        stickySectionHeadersEnabled={false}
        indicatorStyle="white"
      />
      {route.params && (
        <CircleAdd onPress={onSendExerciseToWorkout} style={{ bottom: '3%' }} />
      )}
    </ScreenTemplate>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  searchExercises: async (query: string) => dispatch(searchExercises(query)),
  updateWorkoutExercises: async (
    workoutUid: string,
    exercises: WorkoutExerciseProps[],
  ) => dispatch(updateWorkoutExercises(workoutUid, exercises)),
  updateProgramWorkoutExercises: (
    workoutUid: string,
    exercises: WorkoutExerciseProps[],
    removedExercises?: WorkoutExerciseProps[],
  ) =>
    dispatch(
      updateProgramWorkoutExercises(workoutUid, exercises, removedExercises),
    ),
  dispatch,
});

export default connect(null, mapDispatchToProps)(Exercises);
