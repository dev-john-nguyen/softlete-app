import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import {
  validateUrl,
  capitalize,
  getYoutubeThumbNail,
  getYoutubeUrl,
} from '../../../utils/tools';
import {
  ExerciseActionProps,
  MeasCats,
  MeasSubCats,
  ExerciseFormProps,
  MuscleGroups,
  Equipments,
  DisCats,
  TimeCats,
  WtCats,
} from '../../../services/exercises/types';
import {
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
  fetchMusclesAndEquipments,
} from '../../../services/exercises/actions';
import { connect, useSelector } from 'react-redux';
import StyleConstants from '../../../components/tools/StyleConstants';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Input from '../../../components/elements/Input';
import { ReducerProps } from '../../../services';
import FastImage from 'react-native-fast-image';
import { HomeStackScreens } from '../../home/types';
import { ProgramStackScreens } from '../../program/types';
import ScreenTemplate from '../../../components/elements/ScreenTemplate';
import { PickerButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors, Constants } from '@app/utils';
import useKeyboard from 'src/hooks/utils/useKeyboard';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { PickerOptionProp } from 'src/components/elements/Picker';
import MuscleForm from './MuscleForm';
import { useDelete } from './hooks';

interface Props {
  navigation: any;
  route: any;
  createNewExercise: ExerciseActionProps['createNewExercise'];
  updateExercise: ExerciseActionProps['updateExercise'];
  removeExercise: ExerciseActionProps['removeExercise'];
  findExercise: ExerciseActionProps['findExercise'];
  fetchMusclesAndEquipments: ExerciseActionProps['fetchMusclesAndEquipments'];
}

enum PickerOptions {
  measCats = 'measCats',
  measSubCats = 'measSubCats',
  disable = '',
}

const EditExercise = ({
  route,
  navigation,
  updateExercise,
  createNewExercise,
  removeExercise,
  fetchMusclesAndEquipments,
}: Props) => {
  const { user, exerciseProps } = useSelector((state: ReducerProps) => ({
    user: state.user,
    exerciseProps: state.exercises.targetExercise,
  }));
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeThumbnail, setYoutubeThumnnail] = useState('');
  const [measCat, setMeasCat] = useState<MeasCats>(MeasCats.weight);
  const [measSubCat, setMeasSubCat] = useState<MeasSubCats>(MeasSubCats.none);
  const [muscleGroups, setMuscleGroups] = useState<Map<MuscleGroups, boolean>>(
    new Map(),
  );
  const [equipment, setEquipment] = useState<string>(Equipments.none);
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isOwner, setIsOwner] = useState(true);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const keyboardHeight = useKeyboard();
  const setBanner = useBanner();
  const { onDelete, loading: isDeleting } = useDelete();
  const isLoading = isDeleting || loading;

  const handleNavigation = () => {
    if (route && route.params) {
      if (route.params.programStack) {
        return navigation.navigate(ProgramStackScreens.ProgramSearchExercises);
      }
    }

    return navigation.navigate(HomeStackScreens.SearchExercises);
  };

  useEffect(() => {
    if (!exerciseProps) {
      navigation.goBack();
      return;
    }

    fetchMusclesAndEquipments();

    setYoutubeUrl(
      exerciseProps.youtubeId ? getYoutubeUrl(exerciseProps.youtubeId) : '',
    );
    setYoutubeThumnnail(
      exerciseProps.youtubeId
        ? getYoutubeThumbNail(exerciseProps.youtubeId)
        : '',
    );
    setMeasCat(exerciseProps.measCat ? exerciseProps.measCat : MeasCats.weight);
    setMeasSubCat(
      exerciseProps.measSubCat ? exerciseProps.measSubCat : MeasSubCats.lb,
    );
    setMuscleGroups(() => {
      const storedMuscleGroups = new Map();
      exerciseProps.muscleGroups.forEach(m => {
        storedMuscleGroups.set(m.toLowerCase(), true);
      });
      return storedMuscleGroups;
    });
    setEquipment(exerciseProps.equipment);
    //if softlete exerciseProps and user is an admin allow user to edit
    setIsOwner(
      exerciseProps.userUid === user.uid ||
        (exerciseProps.softlete && user.admin) ||
        !exerciseProps._id
        ? true
        : false,
    );
    //reset all states
    setLoading(false);
  }, [route]);

  useEffect(() => {
    if (youtubeUrl) {
      fetchUrl();
    }
  }, [youtubeUrl]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(keyboardHeight),
    };
  }, [keyboardHeight]);

  const onSubmit = async () => {
    if (loading || !exerciseProps) return;

    let errorsStore = '';

    setLoading(true);

    let youtubeId = '';

    if (youtubeUrl) {
      youtubeId = await fetchUrl();
      if (!youtubeId) {
        errorsStore = 'The youtube URL provided was invalid. Please try again.';
      }
    }

    if (errorsStore) {
      setLoading(false);
      setBanner(errorsStore, BannerTypes.error);
      return;
    }

    let admin = false;

    if (route.params && route.params.admin) {
      admin = true;
    }

    const exerciseToSave: ExerciseFormProps = {
      name: exerciseProps.name?.toLowerCase(),
      description: exerciseProps.description,
      localUrl: exerciseProps.localUrl,
      category: exerciseProps.category,
      youtubeId: youtubeId,
      measCat: measCat ? measCat : MeasCats.weight,
      measSubCat: measSubCat ? measSubCat : MeasSubCats.lb,
      muscleGroups: Array.from(muscleGroups).map(([m]) => m),
      equipment,
      videoId: exerciseProps.videoId,
      localThumbnail: exerciseProps.localThumbnail,
    };

    let requestErr = false;
    try {
      if (!exerciseProps._id) {
        await createNewExercise(exerciseToSave, admin);
      } else {
        //insert uid
        const dataToSave = {
          ...exerciseToSave,
          _id: exerciseProps._id,
          softlete: exerciseProps.softlete,
        };

        await updateExercise(dataToSave, isOwner, admin);
      }
    } catch (err) {
      console.log(err);
      requestErr = true;
    }

    setLoading(false);
    setSaveMsg('');
    !requestErr && handleNavigation();
  };

  const fetchUrl = async () => {
    if (!youtubeUrl) return '';

    const res = await validateUrl(youtubeUrl);

    if (!res) return '';

    const { invalid, id } = res;

    if (invalid || !id) {
      return '';
    }

    setYoutubeThumnnail(getYoutubeThumbNail(id));
    return id;
  };

  const onPickerValueChange = (val: any) => {
    switch (picker) {
      case PickerOptions.measCats:
        return setMeasCat(val);
      case PickerOptions.measSubCats:
        return setMeasSubCat(val);
    }
  };

  const onDeleteClick = async () => {
    if (!exerciseProps) return;
    if (await onDelete(exerciseProps)) {
      handleNavigation();
    }
  };

  const pickerItems: PickerOptionProp[] = useMemo(() => {
    const getMeasSubCat = () => {
      return Object.values(
        (() => {
          switch (measCat) {
            case MeasCats.distance:
              return DisCats;
            case MeasCats.time:
              return TimeCats;
            case MeasCats.weight:
              return WtCats;
            default:
              return MeasSubCats;
          }
        })(),
      ).map(item => ({
        value: item,
        label: capitalize(item),
      })) as PickerOptionProp[];
    };
    switch (picker) {
      case PickerOptions.measCats:
        return Object.values(MeasCats).map(item => ({
          value: item,
          label: capitalize(item),
        }));
      case PickerOptions.measSubCats:
        return getMeasSubCat();
    }
    return [];
  }, [picker, measCat]);

  const pickerValue = useMemo(() => {
    switch (picker) {
      case PickerOptions.measCats:
        return measCat;
      case PickerOptions.measSubCats:
        return measSubCat;
    }
    return '';
  }, [measCat, measSubCat, picker]);

  return (
    <ScreenTemplate
      headerTitleFormatted="Exercise Details"
      isBackVisible
      isPickerOpen={!!picker}
      onPickerClose={() => setPicker(PickerOptions.disable)}
      pickerValue={pickerValue}
      pickerOptions={pickerItems}
      onPickerChangeValue={onPickerValueChange}
      applyContentPadding
      rightContent={
        <FlexBox flex={1} justifyContent="flex-end" alignItems="center">
          {isLoading ? (
            <FlexBox alignItems="center">
              <ActivityIndicator color={Colors.white} />
              <PrimaryText marginLeft={5}>{saveMsg}</PrimaryText>
            </FlexBox>
          ) : (
            <>
              {exerciseProps?._id && isOwner && (
                <Icon
                  icon="trash_bin"
                  color={Colors.white}
                  onPress={onDeleteClick}
                  size={20}
                  containerStyles={{ marginRight: 15 }}
                />
              )}
              <Icon
                icon="save"
                color={Colors.white}
                onPress={onSubmit}
                size={20}
              />
            </>
          )}
        </FlexBox>
      }>
      <ScrollView>
        {!isOwner && (
          <FlexBox marginTop={10} marginBottom={5}>
            <Icon icon="info" color={Colors.white} size={20} />
            <PrimaryText marginLeft={5}>You have limited access.</PrimaryText>
          </FlexBox>
        )}

        <PickerButton
          label="Measurement Sub Category"
          onPress={() => {
            Keyboard.dismiss();
            setPicker(PickerOptions.measSubCats);
          }}
          textTransform="capitalize"
          arrow
          arrowDirection="down">
          {measSubCat}
        </PickerButton>

        {isOwner && (
          <MuscleForm
            muscleGroups={muscleGroups}
            setMuscleGroups={setMuscleGroups}
          />
        )}

        {isOwner && (
          <Input
            label="Equipment"
            placeholder=""
            onChangeText={txt => isOwner && setEquipment(txt)}
            value={equipment}
            maxLength={200}
            styles={{ marginBottom: StyleConstants.baseMargin }}
          />
        )}

        {isOwner && (
          <Input
            label="Youtube Url (can also be found under share options)"
            placeholder="Youtube URL"
            onChangeText={txt => isOwner && setYoutubeUrl(txt)}
            value={youtubeUrl}
            maxLength={500}
            editable={isOwner}
          />
        )}

        <FlexBox
          alignSelf="flex-start"
          borderRadius={5}
          marginTop={10}
          {...Constants.videoSmallDim}>
          <FastImage
            source={{ uri: youtubeThumbnail }}
            style={{ width: '100%', height: '100%' }}
          />
        </FlexBox>
        <Animated.View style={animatedStyles} />
      </ScrollView>
    </ScreenTemplate>
  );
};

export default connect(null, {
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
  fetchMusclesAndEquipments,
})(EditExercise);
