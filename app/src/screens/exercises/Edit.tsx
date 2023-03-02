import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import {
  validateUrl,
  capitalize,
  getYoutubeThumbNail,
  getYoutubeUrl,
} from '../../utils/tools';
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
} from '../../services/exercises/types';
import {
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
  fetchMusclesAndEquipments,
} from '../../services/exercises/actions';
import { connect, useSelector } from 'react-redux';
import StyleConstants from '../../components/tools/StyleConstants';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Input from '../../components/elements/Input';
import { ReducerProps } from '../../services';
import FastImage from 'react-native-fast-image';
import { Picker } from '@react-native-picker/picker';
import { HomeStackScreens } from '../home/types';
import { ProgramStackScreens } from '../program/types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { PickerButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors, Constants } from '@app/utils';
import useKeyboard from 'src/hooks/utils/useKeyboard';

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
  muscleGroup = 'muscleGroup',
  disable = '',
}

const EditExercise = ({
  route,
  navigation,
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
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
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroups>(
    MuscleGroups.other,
  );
  const [equipment, setEquipment] = useState<string>(Equipments.none);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isOwner, setIsOwner] = useState(true);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const keyboardHeight = useKeyboard();

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

    let admin = false;

    if (route.params && route.params.admin) {
      admin = true;
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
    setMuscleGroup(exerciseProps.muscleGroup);
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
    setErrors([]);
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

    const errorsStore = [];

    setLoading(true);

    let youtubeId = '';

    if (youtubeUrl) {
      youtubeId = await fetchUrl();
      if (!youtubeId) errorsStore.push('Invalid youtube url');
    }

    if (errorsStore.length > 0) {
      setLoading(false);
      setErrors(errorsStore);
      return;
    }

    setErrors([]);

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
      muscleGroup,
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

  const onDelete = async () => {
    if (loading) return;

    if (!exerciseProps?._id) return navigation.goBack();

    setLoading(true);

    await removeExercise(exerciseProps._id);

    setLoading(false);
    handleNavigation();
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
      case PickerOptions.muscleGroup:
        return setMuscleGroup(val);
    }
  };

  const pickerItems = useMemo(() => {
    const getMeasSubCat = () => {
      switch (measCat) {
        case MeasCats.distance:
          return Object.values(DisCats).map(item => (
            <Picker.Item label={capitalize(item)} value={item} key={item} />
          ));
        case MeasCats.time:
          return Object.values(TimeCats).map(item => (
            <Picker.Item label={capitalize(item)} value={item} key={item} />
          ));
        case MeasCats.weight:
          return Object.values(WtCats).map(item => (
            <Picker.Item label={capitalize(item)} value={item} key={item} />
          ));
        default:
          return Object.values(MeasSubCats).map(item => (
            <Picker.Item label={capitalize(item)} value={item} key={item} />
          ));
      }
    };
    switch (picker) {
      case PickerOptions.measCats:
        return Object.values(MeasCats).map(item => (
          <Picker.Item label={capitalize(item)} value={item} key={item} />
        ));
      case PickerOptions.measSubCats:
        return getMeasSubCat();
      case PickerOptions.muscleGroup:
        return Object.values(MuscleGroups).map(item => (
          <Picker.Item label={capitalize(item)} value={item} key={item} />
        ));
    }
    return [];
  }, [picker, measCat]);

  const pickerValue = useMemo(() => {
    switch (picker) {
      case PickerOptions.measCats:
        return measCat;
      case PickerOptions.measSubCats:
        return measSubCat;
      case PickerOptions.muscleGroup:
        return muscleGroup;
    }
    return '';
  }, [picker]);

  return (
    <ScreenTemplate
      isBackVisible
      isPickerOpen={!!picker}
      onPickerClose={() => setPicker(PickerOptions.disable)}
      pickerValue={pickerValue}
      pickerItems={pickerItems}
      onPickerChangeValue={onPickerValueChange}
      rightContent={
        <FlexBox flex={1} justifyContent="flex-end">
          {loading ? (
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
                  onPress={onDelete}
                  size={25}
                  containerStyles={{ marginRight: 15 }}
                />
              )}
              <Icon
                icon="save"
                color={Colors.white}
                onPress={onSubmit}
                size={25}
              />
            </>
          )}
        </FlexBox>
      }>
      <ScrollView
        style={{
          paddingLeft: StyleConstants.baseMargin,
          paddingRight: StyleConstants.baseMargin,
        }}>
        <PrimaryText size="large">Exercise Details</PrimaryText>
        <PrimaryText>Optional Fields</PrimaryText>
        {!isOwner && (
          <FlexBox marginTop={10} marginBottom={5}>
            <Icon icon="info" color={Colors.white} size={20} />
            <PrimaryText marginLeft={5}>You have limited access.</PrimaryText>
          </FlexBox>
        )}
        {errors.length > 0 && (
          <FlexBox column marginTop={5} marginBottom={10}>
            {errors.map(e => (
              <PrimaryText key={Math.random()}>*{e}</PrimaryText>
            ))}
          </FlexBox>
        )}

        <PickerButton
          label="Measurement Sub Category"
          onPress={() => {
            Keyboard.dismiss();
            setPicker(PickerOptions.measSubCats);
          }}>
          {measSubCat}
        </PickerButton>

        {isOwner && (
          <PickerButton
            label="Muscle Group"
            onPress={() => {
              Keyboard.dismiss();
              isOwner && setPicker(PickerOptions.muscleGroup);
            }}>
            {muscleGroup}
          </PickerButton>
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
          borderColor={Colors.white}
          borderWidth={1}
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
