import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { AppDispatch } from '../../../App';
import { ReducerProps } from '../../services';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import { ExercisesVideoBatchProps } from '../../services/global/types';
import { HomeStackScreens } from '../home/types';
import { AdminStackList } from '../admin/screens/types';
import { ExerciseActionProps } from '../../services/exercises/types';
import { removeExercise } from '../../services/exercises/actions';
import { createThumbnail } from 'react-native-create-thumbnail';
import { ProgramStackScreens } from '../program/types';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import {
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
  VideoPicker,
} from '@app/elements';
import { AutoId } from '@app/utils';

interface Props {
  navigation: any;
  route: any;
  dispatch: AppDispatch;
  removeExercise: ExerciseActionProps['removeExercise'];
}

const UploadExerciseVideo = ({
  navigation,
  dispatch,
  route,
  removeExercise,
}: Props) => {
  const { exerciseProps } = useSelector((state: ReducerProps) => ({
    exerciseProps: state.exercises.targetExercise,
    user: state.user,
  }));

  const [uri, setUri] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [trashVid, setTrashVid] = useState(false);

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

  const videoURL = useMemo(() => {
    if (uri) return uri;
    if (exerciseProps) {
      if (trashVid) return '';
      if (exerciseProps.url) return exerciseProps.url;
      if (exerciseProps.localUrl) return exerciseProps.localUrl;
    }
    return '';
  }, [uri, trashVid, exerciseProps]);

  const videoThumbnail = useMemo(() => {
    if (thumbnail) return thumbnail;
    if (exerciseProps) {
      if (trashVid) return '';
      if (exerciseProps.thumbnail) return exerciseProps.thumbnail;
      if (exerciseProps.localThumbnail) return exerciseProps.localThumbnail;
    }
    return '';
  }, [thumbnail, exerciseProps, trashVid]);

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      rightContent={
        <FlexBox flex={1}>
          {exerciseProps?._id && (
            <Icon icon="trash_bin" size={20} onPress={onTrash} />
          )}
        </FlexBox>
      }>
      <FlexBox column>
        <PrimaryText size="large">Upload Video</PrimaryText>
        <PrimaryText>Duration must be 30 seconds or less.</PrimaryText>
        <VideoPicker
          uri={videoURL}
          setUri={setUri}
          dispatch={dispatch}
          thumbnail={videoThumbnail}
        />
        <FlexBox marginTop={20}>
          <PrimaryButton onPress={onRemoveVid} varient="secondary">
            Clear Video
          </PrimaryButton>
          <PrimaryButton onPress={onCompressAndSaveVideo} marginLeft={20}>
            Next
          </PrimaryButton>
        </FlexBox>
      </FlexBox>
    </ScreenTemplate>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  removeExercise: (exericseUid?: string) =>
    dispatch(removeExercise(exericseUid)),
  dispatch,
});

export default connect(null, mapDispatchToProps)(UploadExerciseVideo);
