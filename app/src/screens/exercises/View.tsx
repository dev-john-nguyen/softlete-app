import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ExerciseProps } from '../../services/exercises/types';
import { normalize } from '../../utils/tools';
import BaseColors from '../../utils/BaseColors';
import GraphSvg from '../../assets/GraphSvg';
import PrimaryText from '../../components/elements/PrimaryText';
import SecondaryText from '../../components/elements/SecondaryText';
import YoutubePreview from '../../components/elements/YoutubePreview';
import Loading from '../../components/elements/Loading';
import { RouteProp } from '@react-navigation/native';
import PencilSvg from '../../assets/PencilSvg';
import StyleConstants from '../../components/tools/StyleConstants';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { updatePinExercises } from '../../services/user/actions';
import { PinExerciseProps } from '../../services/misc/types';
import { HomeStackScreens } from '../home/types';
import { NetworkStackScreens } from '../network/types';
import Switch from '../../components/elements/Switch';
import RulerSvg from '../../assets/RulerSvg';
import CategorySvg from '../../assets/CategorySvg';
import ScaleSvg from '../../assets/ScaleSvg';
import BodySvg from '../../assets/body/BodySvg';
import DumbbellSvg from '../../assets/DumbbellSvg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { AppDispatch } from '../../../App';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import { UserProps } from '../../services/user/types';
import ExerciseVideo from '../../components/elements/ExerciseVideo';
import { AthleteProfileProps } from '../../services/athletes/types';
import { ProgramStackScreens } from '../program/types';
import ErrorSvg from '../../assets/ErrorSvg';
import reportExercise from '../utils/report-exercise';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

interface Props {
  route: any;
  navigation: any;
  pinExercises: PinExerciseProps[];
  exercisesStore: ExerciseProps[];
  offline: boolean;
  dispatch: AppDispatch;
  user: UserProps;
  athleteProps: AthleteProfileProps;
}

const Description = ({ description }: { description?: string }) => {
  const [extend, setExtend] = useState(false);

  if (!description) return <></>;

  return (
    <Pressable onPress={() => setExtend(bol => !bol)}>
      <SecondaryText styles={styles.des}>
        {(() => {
          if (description.length > 100) {
            if (extend) return description;
            return description.substring(0, 100) + '...';
          }
          return description;
        })()}
      </SecondaryText>
    </Pressable>
  );
};

const Exercise = ({
  route,
  navigation,
  pinExercises,
  exercisesStore,
  offline,
  dispatch,
  user,
  athleteProps,
}: Props) => {
  const [exercise, setExercise] = useState<ExerciseProps>();
  const [isPin, setIsPin] = useState(false);
  const [athlete, setAthlete] = useState(false);
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !offline && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              style={styles.actionContainer}
              onPress={onNavigateToAnalytics}
              hitSlop={5}>
              <View style={styles.edit}>
                <GraphSvg color={BaseColors.white} />
              </View>
            </Pressable>
            {athlete ? (
              <Pressable
                style={styles.actionContainer}
                onPress={onReportImage}
                hitSlop={5}>
                <Pressable style={styles.edit} onPress={onReportImage}>
                  <ErrorSvg fillColor={BaseColors.white} />
                </Pressable>
              </Pressable>
            ) : (
              <Pressable
                style={styles.actionContainer}
                onPress={onNavigateToUpdate}
                hitSlop={5}>
                <Pressable style={styles.edit} onPress={onNavigateToUpdate}>
                  <PencilSvg fillColor={BaseColors.white} />
                </Pressable>
              </Pressable>
            )}
          </View>
        ),
    });
  }, [exercise, offline]);

  useEffect(() => {
    if (!route.params || !route.params.exercise) {
      navigation.goBack();
    }

    setAthlete(route.params.athlete ? true : false);

    const ex = exercisesStore.find(e => e._id === route.params.exercise._id);

    if (ex) {
      setExercise(ex);
    } else {
      setExercise(route.params.exercise);
    }
  }, [route, exercisesStore]);

  useEffect(() => {
    exercise &&
      setIsPin(
        pinExercises.find(p => p.exerciseUid === exercise._id) ? true : false,
      );
  }, [pinExercises, exercise]);

  const onUpdatePinExercises = (pin: boolean) => {
    setIsPin(pin);
    if (!exercise || athlete || offline || !exercise._id) return;
    dispatch(updatePinExercises({ exerciseUid: exercise._id, exercise }, pin));
  };

  const onNavigateToUpdate = () => {
    if (athlete) return;
    if (!exercise) return navigation.goBack();

    dispatch({ type: SET_TARGET_EXERCISE, payload: exercise });

    if (route.params && route.params.programStack) {
      if (exercise.userUid !== user.uid) {
        if (exercise.softlete && user.admin) {
          return navigation.navigate(ProgramStackScreens.ProgramUploadVideo);
        } else {
          return navigation.navigate(ProgramStackScreens.ProgramEditExercise);
        }
      } else {
        return navigation.navigate(ProgramStackScreens.ProgramUploadVideo);
      }
    }

    if (exercise.userUid !== user.uid) {
      if (exercise.softlete && user.admin) {
        return navigation.navigate(HomeStackScreens.UploadExerciseVideo);
      } else {
        return navigation.navigate(HomeStackScreens.EditExercise);
      }
    } else {
      return navigation.navigate(HomeStackScreens.UploadExerciseVideo);
    }
  };

  const onNavigateToAnalytics = () => {
    if (!exercise) return;
    if (athlete) {
      navigation.navigate(NetworkStackScreens.AthleteAnalytics, {
        exerciseUid: exercise._id,
      });
    } else {
      if (route.params && route.params.programStack) {
        navigation.navigate(ProgramStackScreens.ProgramExerciseAnalytics, {
          exerciseUid: exercise._id,
        });
      } else {
        navigation.navigate(HomeStackScreens.ExerciseAnalytics, {
          exerciseUid: exercise._id,
        });
      }
    }
  };

  const onReportImage = () => {
    exercise && reportExercise(athleteProps.uid, user.uid, exercise?._id);
  };

  if (!exercise) return <Loading />;

  return (
    <ScreenTemplate>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <ScrollView
          style={[styles.container, { marginTop: headerHeight }]}
          contentContainerStyle={{ paddingBottom: StyleConstants.baseMargin }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <PrimaryText styles={styles.header}>{exercise.name}</PrimaryText>
          <Description description={exercise.description} />
          {!athlete && (
            <View style={styles.pinContainer}>
              <Switch
                onSwitch={() => onUpdatePinExercises(isPin ? false : true)}
                active={isPin}
                styles={{ marginRight: StyleConstants.smallMargin, top: -5 }}
              />
              <SecondaryText styles={styles.label}>
                {isPin ? 'Pinned' : 'Unpinned'}
              </SecondaryText>
            </View>
          )}

          <ScrollView
            horizontal
            style={{ marginTop: StyleConstants.baseMargin }}
            contentContainerStyle={{
              flexDirection:
                exercise.localUrl || exercise.url ? 'row' : 'row-reverse',
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <ExerciseVideo props={exercise} />
            <YoutubePreview id={exercise.youtubeId} />
          </ScrollView>

          <View style={styles.body}>
            <BodySvg muscleGroup={exercise.muscleGroup} />
          </View>

          <ScrollView
            horizontal
            style={{ marginTop: StyleConstants.baseMargin }}
            contentContainerStyle={{ alignItems: 'flex-start' }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.itemContainer}>
              <View style={styles.svg}>
                <CategorySvg fillColor={BaseColors.lightWhite} />
              </View>
              <SecondaryText styles={styles.label}>Category</SecondaryText>
              <SecondaryText styles={[styles.text, styles.textCap]} bold>
                {exercise.category}
              </SecondaryText>
            </View>

            <View style={styles.itemContainer}>
              <View style={styles.svg}>
                <DumbbellSvg fillColor={BaseColors.lightWhite} />
              </View>
              <SecondaryText styles={styles.label}>Equipment</SecondaryText>
              <SecondaryText styles={[styles.text, styles.textCap]} bold>
                {exercise.equipment}
              </SecondaryText>
            </View>

            <View style={styles.itemContainer}>
              <View style={styles.svg}>
                <ScaleSvg fillColor={BaseColors.lightWhite} />
              </View>
              <SecondaryText styles={styles.label}>Measurement</SecondaryText>
              <SecondaryText styles={[styles.text, styles.textCap]} bold>
                {exercise.measCat}
              </SecondaryText>
            </View>

            <View style={styles.itemContainer}>
              <View style={styles.svg}>
                <RulerSvg fillColor={BaseColors.lightWhite} />
              </View>
              <SecondaryText styles={styles.label}>Unit</SecondaryText>
              <SecondaryText styles={[styles.text, styles.textCap]} bold>
                {exercise.measSubCat}
              </SecondaryText>
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: StyleConstants.baseMargin,
    marginTop: StyleConstants.baseMargin,
  },
  body: {
    height: normalize.width(2),
    width: normalize.width(2),
    alignSelf: 'center',
    marginTop: StyleConstants.baseMargin,
  },
  svg: {
    height: normalize.width(15),
    width: normalize.width(15),
    marginBottom: StyleConstants.smallMargin,
  },
  actionContainer: {
    marginRight: StyleConstants.baseMargin,
  },
  edit: {
    height: normalize.width(20),
    width: normalize.width(20),
  },
  des: {
    fontSize: StyleConstants.smallFont,
  },
  pinned: {
    height: normalize.width(20),
    width: normalize.width(20),
    marginRight: StyleConstants.smallMargin,
  },
  pin: {
    height: normalize.width(13),
    width: normalize.width(13),
    padding: 8,
    borderRadius: 100,
    backgroundColor: BaseColors.primary,
    marginRight: StyleConstants.smallMargin,
  },
  header: {
    fontSize: StyleConstants.largeFont,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  graph: {
    width: normalize.width(16),
    height: normalize.width(16),
    marginLeft: 10,
  },
  analytics: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.white,
  },
  itemContainer: {
    marginTop: StyleConstants.baseMargin,
    borderColor: BaseColors.white,
    borderWidth: 1,
    padding: StyleConstants.baseMargin,
    borderRadius: StyleConstants.borderRadius,
    marginRight: StyleConstants.baseMargin,
    shadowColor: BaseColors.lightPrimary,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.lightWhite,
    marginRight: StyleConstants.smallMargin,
    marginBottom: StyleConstants.smallMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.black,
    paddingTop: StyleConstants.baseMargin,
  },
  textCap: {
    textTransform: 'capitalize',
  },
  url: {
    textDecorationLine: 'underline',
    fontSize: StyleConstants.smallFont,
    color: BaseColors.primary,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  pinExercises: state.user.pinExercises,
  exercisesStore: state.exercises.data,
  offline: state.global.offline,
  user: state.user,
  athleteProps: state.athletes.curAthlete,
});

export default connect(mapStateToProps)(Exercise);
