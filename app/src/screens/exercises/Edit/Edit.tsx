import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import {
  validateUrl,
  capitalize,
  getYoutubeThumbNail,
  getYoutubeUrl,
} from '../../../utils/tools';
import {
  MeasCats,
  MeasSubCats,
  ExerciseFormProps,
  MuscleGroups,
  Equipments,
  DisCats,
  TimeCats,
  WtCats,
} from '../../../types/exercises.types';
import {
  updateExercise,
  createNewExercise,
  fetchMusclesAndEquipments,
} from '../../../services/exercises/actions';
import { useDispatch, useSelector } from 'react-redux';
import StyleConstants from '../../../components/tools/StyleConstants';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Input from '../../../components/elements/Input';
import { ReducerProps, ThunkAppDispatch } from '../../../services';
import FastImage from 'react-native-fast-image';
import { HomeStackScreens } from '../../home/types';
import { ProgramStackScreens } from '../../program/types';
import ScreenTemplate from '../../../components/elements/screen-template';
import { PickerButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors, Constants, rgba } from '@app/utils';
import useKeyboard from 'src/hooks/utils/useKeyboard';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { PickerOptionProp } from 'src/components/elements/Picker';
import MuscleForm from './MuscleForm';
import { useDelete, useIsOwner } from './hooks';
import { confirmAdminExerciseHandler } from './helpers';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

enum PickerOptions {
  measCats = 'measCats',
  measSubCats = 'measSubCats',
  disable = '',
}

const EditExercise = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();
  const dispatch = useDispatch<ThunkAppDispatch>();
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
  const { isOwner } = useIsOwner();
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const [isSoftlete, setIsSoftlete] = useState(false);
  const keyboardHeight = useKeyboard();
  const setBanner = useBanner();
  const { onDelete, loading: isDeleting } = useDelete();
  const isLoading = isDeleting || loading;
  const fullAccess = isOwner || user.admin;
  const workoutParams = route.params?.workoutParams;

  const handleNavigation = () => {
    if (route && route.params) {
      if (route.params.programStack) {
        return navigation.navigate(
          ProgramStackScreens.ProgramSearchExercises,
          workoutParams,
        );
      }
    }
    return navigation.navigate(HomeStackScreens.SearchExercises, workoutParams);
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

    setIsSoftlete(Boolean(exerciseProps.softlete));
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
        if (isSoftlete && user.admin) {
          const saveAdmin = await confirmAdminExerciseHandler('create');
          exerciseToSave.softlete = saveAdmin;
        }
        await dispatch(createNewExercise(exerciseToSave));
      } else {
        //insert uid
        const dataToSave = {
          ...exerciseToSave,
          _id: exerciseProps._id,
        };

        let saveAdmin = false;

        if (isSoftlete && user.admin) {
          dataToSave.softlete = exerciseProps.softlete;
          saveAdmin = await confirmAdminExerciseHandler('update');
        }

        await dispatch(updateExercise(dataToSave, saveAdmin || isOwner));
      }
    } catch (err) {
      console.log(err);
      requestErr = true;
    }

    setLoading(false);
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
        return setMeasCat(prev => {
          if (prev !== val) {
            setMeasSubCat(MeasSubCats.none);
          }
          return val;
        });
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
            </FlexBox>
          ) : (
            <>
              {exerciseProps?._id && fullAccess && (
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
        {!fullAccess && (
          <FlexBox marginBottom={10}>
            <Icon icon="info" color={Colors.white} size={20} />
            <PrimaryText marginLeft={5}>You have limited access.</PrimaryText>
          </FlexBox>
        )}
        {user.admin && (
          <FlexBox
            alignSelf="flex-start"
            marginBottom={10}
            onPress={() => {
              // only allow new exercises to toggle
              if (!exerciseProps?._id) {
                setIsSoftlete(prev => !prev);
              } else {
                setBanner('Can only toggle for new exercise.');
              }
            }}
            padding={5}
            marginRight={5}
            borderRadius={5}
            backgroundColor={rgba(Colors.whiteRbg, isSoftlete ? 1 : 0.1)}>
            <PrimaryText color={isSoftlete ? Colors.primary : Colors.white}>
              Is Softlete?
            </PrimaryText>
          </FlexBox>
        )}

        <PickerButton
          label="Measurement Category"
          onPress={() => {
            Keyboard.dismiss();
            setPicker(PickerOptions.measCats);
          }}
          textTransform="capitalize"
          arrow
          arrowDirection="down">
          {measCat}
        </PickerButton>

        <PickerButton
          label="Sub-category"
          onPress={() => {
            Keyboard.dismiss();
            setPicker(PickerOptions.measSubCats);
          }}
          textTransform="capitalize"
          arrow
          arrowDirection="down">
          {measSubCat}
        </PickerButton>

        {fullAccess && (
          <MuscleForm
            muscleGroups={muscleGroups}
            setMuscleGroups={setMuscleGroups}
          />
        )}

        {fullAccess && (
          <Input
            label="Equipment"
            placeholder=""
            onChangeText={txt => fullAccess && setEquipment(txt)}
            value={equipment}
            maxLength={200}
            styles={{ marginBottom: StyleConstants.baseMargin }}
          />
        )}

        {fullAccess && (
          <Input
            label="Youtube Url (can also be found under share options)"
            placeholder="Youtube URL"
            onChangeText={txt => fullAccess && setYoutubeUrl(txt)}
            value={youtubeUrl}
            maxLength={500}
            editable={fullAccess}
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

export default EditExercise;
