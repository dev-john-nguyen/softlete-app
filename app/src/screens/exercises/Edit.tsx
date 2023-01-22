import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  normalize,
  validateUrl,
  capitalize,
  getYoutubeThumbNail,
  getYoutubeUrl,
} from '../../utils/tools';
import BaseColors from '../../utils/BaseColors';
import {
  ExerciseActionProps,
  MeasCats,
  MeasSubCats,
  ExerciseFormProps,
  ExerciseProps,
  MuscleGroups,
  Equipments,
  ExerciseBaseProps,
  DisCats,
  TimeCats,
  WtCats,
} from '../../services/exercises/types';
import SecondaryText from '../../components/elements/SecondaryText';
import {
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
  fetchMusclesAndEquipments,
} from '../../services/exercises/actions';
import { connect } from 'react-redux';
import TrashSvg from '../../assets/TrashSvg';
import StyleConstants from '../../components/tools/StyleConstants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Input from '../../components/elements/Input';
import { ReducerProps } from '../../services';
import { UserProps } from '../../services/user/types';
import InfoSvg from '../../assets/InfoSvg';
import FastImage from 'react-native-fast-image';
import CustomPicker from '../../components/elements/Picker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import PrimaryText from '../../components/elements/PrimaryText';
import SaveSvg from '../../assets/SaveSvg';
import Constants from '../../utils/Constants';
import { HomeStackScreens } from '../home/types';
import { ProgramStackScreens } from '../program/types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { PickerButton } from '@app/elements';

interface Props {
  navigation: any;
  route: any;
  createNewExercise: ExerciseActionProps['createNewExercise'];
  updateExercise: ExerciseActionProps['updateExercise'];
  removeExercise: ExerciseActionProps['removeExercise'];
  findExercise: ExerciseActionProps['findExercise'];
  fetchMusclesAndEquipments: ExerciseActionProps['fetchMusclesAndEquipments'];
  user: UserProps;
  equipments: ExerciseBaseProps['equipments'];
  exerciseProps?: ExerciseProps;
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
  user,
  fetchMusclesAndEquipments,
  equipments,
  exerciseProps,
}: Props) => {
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
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const _keyboardHeight = useSharedValue(normalize.height(2));
  const headerHeight = useHeaderHeight();

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

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', e => {
      _keyboardHeight.value = e.endCoordinates.height;
      setKeyboardShow(true);
    });

    const hideSub = Keyboard.addListener('keyboardWillHide', e => {
      setKeyboardShow(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: keyboardShow ? withTiming(_keyboardHeight.value) : withTiming(50),
    };
  }, [keyboardShow]);

  const onSubmit = async () => {
    if (loading || !exerciseProps) return;

    let errorsStore = [];

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

  const renderPickeritems = useCallback(() => {
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
  }, [picker]);

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

  const renderPickerValue = useCallback(() => {
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
    <ScreenTemplate>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={[styles.actionContainer, { height: headerHeight }]}>
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color={BaseColors.white} />
              <SecondaryText styles={[styles.label, { marginLeft: 10 }]}>
                {saveMsg}
              </SecondaryText>
            </View>
          ) : (
            <>
              {exerciseProps?._id && isOwner && (
                <Pressable style={styles.svg} onPress={onDelete}>
                  <TrashSvg fillColor={BaseColors.white} />
                </Pressable>
              )}

              <Pressable style={styles.svg} onPress={onSubmit}>
                <SaveSvg strokeColor={BaseColors.white} />
              </Pressable>
            </>
          )}
        </View>

        <ScrollView
          style={{
            paddingLeft: StyleConstants.baseMargin,
            paddingRight: StyleConstants.baseMargin,
          }}>
          <PrimaryText styles={styles.headerText}>Exercise Details</PrimaryText>
          <SecondaryText styles={styles.headerSubText}>
            Optional Fields
          </SecondaryText>
          {!isOwner && (
            <View style={styles.infoContainer}>
              <View style={styles.info}>
                <InfoSvg fillColor={BaseColors.white} />
              </View>
              <SecondaryText styles={styles.infoText}>
                You have limited access.
              </SecondaryText>
            </View>
          )}
          <View style={styles.errorContainer}>
            {errors.length > 0 &&
              errors.map((e, i) => (
                <SecondaryText styles={styles.errorText} key={Math.random()}>
                  *{e}
                </SecondaryText>
              ))}
          </View>

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

          <View style={styles.youtube}>
            <FastImage
              source={{ uri: youtubeThumbnail }}
              style={styles.image}
            />
          </View>

          <Animated.View style={animatedStyles} />
        </ScrollView>
        <CustomPicker
          open={!!picker}
          setOpen={() => setPicker(PickerOptions.disable)}
          value={renderPickerValue()}
          pickerItems={renderPickeritems()}
          setValue={onPickerValueChange}
        />
      </SafeAreaView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: StyleConstants.mediumFont,
    color: BaseColors.white,
  },
  headerSubText: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightWhite,
    marginBottom: StyleConstants.smallMargin,
  },
  label: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.lightWhite,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: StyleConstants.smallMargin,
    marginRight: StyleConstants.baseMargin,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  infoText: {
    fontSize: StyleConstants.extraSmallFont,
    margin: 5,
  },
  headerContainer: {
    alignItems: 'flex-end',
  },
  errorContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
  svg: {
    height: normalize.width(20),
    width: normalize.width(20),
    marginLeft: StyleConstants.baseMargin,
  },
  errorText: {
    fontSize: normalize.width(30),
  },
  youtube: {
    ...Constants.videoSmallDim,
    alignSelf: 'flex-start',
    top: 0,
    marginTop: StyleConstants.smallMargin,
    borderColor: BaseColors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
  },
  info: {
    height: normalize.width(20),
    width: normalize.width(20),
    alignSelf: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: BaseColors.white,
    padding: 15,
    borderRadius: StyleConstants.borderRadius,
    borderWidth: 1,
    borderColor: BaseColors.lightGrey,
    marginBottom: StyleConstants.smallMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.black,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  user: state.user,
  equipments: state.exercises.equipments,
  exerciseProps: state.exercises.targetExercise,
});

export default connect(mapStateToProps, {
  updateExercise,
  createNewExercise,
  removeExercise,
  findExercise,
  fetchMusclesAndEquipments,
})(EditExercise);
