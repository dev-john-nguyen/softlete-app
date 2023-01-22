import _ from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import PrimaryButton from '../../components/elements/PrimaryButton';
import PrimaryText from '../../components/elements/PrimaryText';
import SecondaryText from '../../components/elements/SecondaryText';
import VideoPicker from '../../components/elements/VideoPicker';
import StyleConstants from '../../components/tools/StyleConstants';
import { ReducerProps } from '../../services';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import { ExercisesVideoBatchProps } from '../../services/global/types';
import AutoId from '../../utils/AutoId';
import BaseColors from '../../utils/BaseColors';
import { HomeStackScreens } from '../home/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminStackList } from '../admin/screens/types';
import {
  ExerciseActionProps,
  ExerciseProps,
} from '../../services/exercises/types';
import { removeExercise } from '../../services/exercises/actions';
import TrashSvg from '../../assets/TrashSvg';
import { normalize } from '../../utils/tools';
import { createThumbnail } from 'react-native-create-thumbnail';
import { UserProps } from '../../services/user/types';
import { ProgramStackScreens } from '../program/types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

interface Props {
  navigation: any;
  route: any;
  dispatch: AppDispatch;
  exerciseProps?: ExerciseProps;
  removeExercise: ExerciseActionProps['removeExercise'];
  user: UserProps;
}

const UploadExerciseVideo = ({
  navigation,
  dispatch,
  route,
  exerciseProps,
  removeExercise,
  user,
}: Props) => {
  const [uri, setUri] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [trashVid, setTrashVid] = useState(false);
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        exerciseProps?._id && (
          <Pressable style={styles.svg} onPress={onTrash}>
            <TrashSvg fillColor={BaseColors.white} />
          </Pressable>
        ),
    });
  }, [exerciseProps]);

  useEffect(() => {
    onCreateThumbnail();
  }, [uri]);

  const onCreateThumbnail = () => {
    if (!uri) return;

    createThumbnail({ url: uri })
      .then(response => {
        setThumbnail(response.path);
      })
      .catch(err => console.log(err));
  };

  const onCompressAndSaveVideo = () => {
    if (!uri) {
      let props;
      //filter props to edit
      if (exerciseProps) {
        props = { ...exerciseProps };
        if (trashVid) {
          props.localUrl = '';
          props.url = '';
          props.videoId = '';
        }
      } else {
        props = {};
      }

      dispatch({ type: SET_TARGET_EXERCISE, payload: props });
      onNavToExerciseEdit();
      return;
    }

    const videoBatchItem: ExercisesVideoBatchProps = {
      videoId: AutoId.newId(10),
      localUrl: uri,
      url: '',
      compressedUrl: '',
      exerciseUid: exerciseProps?._id,
      localThumbnail: thumbnail,
    };

    dispatch({
      type: SET_TARGET_EXERCISE,
      payload: {
        ...exerciseProps,
        ...videoBatchItem,
      },
    });

    onNavToExerciseEdit();
  };

  const onTrash = () => {
    if (exerciseProps) {
      removeExercise(exerciseProps._id).catch(err => console.log(err));
    }
    onNavBack();
  };

  const onRemoveVid = () => {
    setTrashVid(true);
    setUri('');
  };

  const onNavBack = () => {
    if (route && route.params) {
      if (route.params.admin) {
        return navigation.navigate(AdminStackList.AdminExercises);
      }
      if (route.params.programStack) {
        return navigation.navigate(ProgramStackScreens.ProgramSearchExercises);
      }
    }
    return navigation.navigate(HomeStackScreens.SearchExercises);
  };

  const onNavToExerciseEdit = () => {
    setUri('');
    if (route && route.params) {
      if (route.params.admin) {
        return navigation.navigate(AdminStackList.AdminEditExercise);
      }
      if (route.params.programStack) {
        return navigation.navigate(
          ProgramStackScreens.ProgramEditExerciseDetails,
        );
      }
    }
    return navigation.navigate(HomeStackScreens.EditExerciseDetails);
  };

  const getVideoUrl = () => {
    if (uri) return uri;
    if (exerciseProps) {
      if (trashVid) return '';
      if (exerciseProps.url) return exerciseProps.url;
      if (exerciseProps.localUrl) return exerciseProps.localUrl;
    }
    return '';
  };

  const getThumbNail = () => {
    if (thumbnail) return thumbnail;
    if (exerciseProps) {
      if (trashVid) return '';
      if (exerciseProps.thumbnail) return exerciseProps.thumbnail;
      if (exerciseProps.localThumbnail) return exerciseProps.localThumbnail;
    }
    return '';
  };

  return (
    <ScreenTemplate>
      <SafeAreaView
        style={styles.container}
        edges={['bottom', 'left', 'right']}>
        <View style={[styles.container, { marginTop: headerHeight }]}>
          <PrimaryText styles={styles.header}>Upload Video</PrimaryText>
          <SecondaryText styles={styles.sub}>
            Duration must be 30 seconds or less.
          </SecondaryText>
          <VideoPicker
            uri={getVideoUrl()}
            setUri={setUri}
            dispatch={dispatch}
            thumbnail={getThumbNail()}
          />
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={onRemoveVid} varient="secondary">
              Clear Video
            </PrimaryButton>
            <PrimaryButton onPress={onCompressAndSaveVideo}>Next</PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: StyleConstants.baseMargin,
    marginRight: StyleConstants.baseMargin,
  },
  header: {
    fontSize: StyleConstants.mediumFont,
    color: BaseColors.white,
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  sub: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightWhite,
    marginBottom: StyleConstants.smallMargin,
  },
  buttonContainer: {
    marginTop: StyleConstants.baseMargin,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  svg: {
    height: normalize.width(20),
    width: normalize.width(20),
    marginRight: StyleConstants.baseMargin,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  exerciseProps: state.exercises.targetExercise,
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  removeExercise: (exericseUid?: string) =>
    dispatch(removeExercise(exericseUid)),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadExerciseVideo);
