import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ExerciseProps } from '../../services/exercises/types';
import { normalize } from '../../utils/tools';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { updatePinExercises } from '../../services/user/actions';
import { PinExerciseProps } from '../../services/misc/types';
import { HomeStackScreens } from '../home/types';
import { NetworkStackScreens } from '../network/types';
import BodySvg from '../../assets/body/BodySvg';
import { AppDispatch } from '../../../App';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import { UserProps } from '../../services/user/types';
import ExerciseVideo from '../../components/elements/ExerciseVideo';
import { AthleteProfileProps } from '../../services/athletes/types';
import { ProgramStackScreens } from '../program/types';
import reportExercise from '../utils/report-exercise';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import Icon from '@app/icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  InfoListBox,
  Loading,
  PrimaryText,
  Switch,
  YoutubePreview,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import { StyleConstants } from '@app/utils';

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
      <PrimaryText styles={styles.des}>
        {(() => {
          if (description.length > 100) {
            if (extend) return description;
            return description.substring(0, 100) + '...';
          }
          return description;
        })()}
      </PrimaryText>
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
    <ScreenTemplate
      rightContent={
        <FlexBox alignItems="flex-end" justifyContent="flex-start">
          {!offline && (
            <>
              <Icon
                icon="graph"
                color={Colors.white}
                size={20}
                onPress={onNavigateToAnalytics}
                containerStyles={{ marginRight: 20 }}
              />
              {athlete ? (
                <Icon
                  icon="error"
                  color={Colors.white}
                  size={20}
                  onPress={onReportImage}
                />
              ) : (
                <Icon
                  icon="pencil"
                  color={Colors.white}
                  size={20}
                  onPress={onNavigateToUpdate}
                />
              )}
            </>
          )}
        </FlexBox>
      }>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: StyleConstants.baseMargin }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <PrimaryText size="large" variant="primary" textTransform="capitalize">
          {exercise.name}
        </PrimaryText>
        <Description description={exercise.description} />
        {!athlete && (
          <FlexBox marginTop={15}>
            <Switch
              onSwitch={() => onUpdatePinExercises(isPin ? false : true)}
              active={isPin}
              styles={{ marginRight: StyleConstants.smallMargin, top: -5 }}
            />
            <PrimaryText>{isPin ? 'Pinned' : 'Unpinned'}</PrimaryText>
          </FlexBox>
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
          <FlexBox marginLeft={exercise.localUrl || exercise.url ? 0 : 10}>
            <ExerciseVideo props={exercise} />
          </FlexBox>
          <FlexBox marginLeft={exercise.localUrl || exercise.url ? 10 : 0}>
            <YoutubePreview id={exercise.youtubeId} />
          </FlexBox>
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
          <InfoListBox
            secondary
            desc={exercise.category}
            label="Category"
            icon="category"
            textTransform="capitalize"
          />
          <InfoListBox
            secondary
            desc={exercise.equipment}
            label="Equipment"
            icon="dumb_bell"
            textTransform="capitalize"
          />

          <InfoListBox
            secondary
            desc={exercise.measCat}
            label="Measurement"
            icon="scale"
            textTransform="capitalize"
          />
          <InfoListBox
            secondary
            desc={exercise.measSubCat}
            label="Unit"
            icon="ruler"
            textTransform="capitalize"
          />
        </ScrollView>
      </ScrollView>
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
    backgroundColor: Colors.primary,
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
    color: Colors.white,
  },
  itemContainer: {
    marginTop: StyleConstants.baseMargin,
    borderColor: Colors.white,
    borderWidth: 1,
    padding: StyleConstants.baseMargin,
    borderRadius: StyleConstants.borderRadius,
    marginRight: StyleConstants.baseMargin,
    shadowColor: Colors.lightPrimary,
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
    color: Colors.lightWhite,
    marginRight: StyleConstants.smallMargin,
    marginBottom: StyleConstants.smallMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: Colors.black,
    paddingTop: StyleConstants.baseMargin,
  },
  textCap: {
    textTransform: 'capitalize',
  },
  url: {
    textDecorationLine: 'underline',
    fontSize: StyleConstants.smallFont,
    color: Colors.primary,
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
