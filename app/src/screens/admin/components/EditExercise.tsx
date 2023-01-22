import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  normalize,
  validateUrl,
  capitalize,
  getYoutubeThumbNail,
  getYoutubeUrl,
} from '../../../utils/tools';
import BaseColors from '../../../utils/BaseColors';
import {
  ExerciseActionProps,
  Categories,
  MuscleGroups,
  Equipments,
} from '../../../services/exercises/types';
import SecondaryText from '../../../components/elements/SecondaryText';
import {
  updateExercise,
  createNewExercise,
  removeExercise,
  fetchMusclesAndEquipments,
} from '../../../services/exercises/actions';
import { connect, useSelector } from 'react-redux';
import TrashSvg from '../../../assets/TrashSvg';
import ConfirmModal from '../../../components/elements/ConfirmModal';
import StyleConstants, {
  moderateScale,
} from '../../../components/tools/StyleConstants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { IndexStackList } from '../../types';
import Input from '../../../components/elements/Input';
import { ReducerProps } from '../../../services';
import FastImage from 'react-native-fast-image';
import CustomPicker from '../../../components/elements/Picker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import PrimaryText from '../../../components/elements/PrimaryText';
import SaveSvg from '../../../assets/SaveSvg';
import Constants from '../../../utils/Constants';
import ExerciseVideo from '../../../components/elements/ExerciseVideo';
import { AdminStackList } from '../screens/types';
import { PickerButton, ScreenTemplate } from '@app/elements';
import useKeyboard from 'src/hooks/utils/useKeyboard';

interface Props {
  navigation: any;
  route: any;
  createNewExercise: ExerciseActionProps['createNewExercise'];
  updateExercise: ExerciseActionProps['updateExercise'];
  removeExercise: ExerciseActionProps['removeExercise'];
  fetchMusclesAndEquipments: ExerciseActionProps['fetchMusclesAndEquipments'];
}

enum PickerOptions {
  cats = 'cats',
  measCats = 'measCats',
  measSubCats = 'measSubCats',
  equipment = 'equipment',
  muscleGroup = 'muscleGroup',
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeThumbnail, setYoutubeThumnnail] = useState('');
  const [category, setCategory] = useState<Categories>(Categories.other);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroups>(
    MuscleGroups.other,
  );
  const [equipment, setEquipment] = useState<string>(Equipments.none);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const headerHeight = useHeaderHeight();
  const keyboardHeight = useKeyboard();
  const { exerciseProps, equipments } = useSelector(
    ({ exercises }: ReducerProps) => ({
      equipments: exercises.equipments,
      exerciseProps: exercises.targetExercise,
    }),
  );

  useEffect(() => {
    if (!exerciseProps) {
      navigation.navigate(IndexStackList.HomeStack);
      return;
    }

    fetchMusclesAndEquipments();

    setName(exerciseProps.name ? capitalize(exerciseProps.name) : '');
    setDescription(exerciseProps.description ? exerciseProps.description : '');
    setYoutubeUrl(
      exerciseProps.youtubeId ? getYoutubeUrl(exerciseProps.youtubeId) : '',
    );
    setYoutubeThumnnail(
      exerciseProps.youtubeId
        ? getYoutubeThumbNail(exerciseProps.youtubeId)
        : '',
    );
    setCategory(
      exerciseProps.category ? exerciseProps.category : Categories.other,
    );
    setMuscleGroup(exerciseProps.muscleGroup);
    setEquipment(exerciseProps.equipment);

    //reset all states
    setConfirm(false);
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
      height: keyboardHeight ? withTiming(keyboardHeight) : withTiming(50),
    };
  }, [keyboardHeight]);

  const onSubmit = async () => {
    if (loading || !exerciseProps) return;

    let errorsStore = [];

    setLoading(true);

    if (!name) errorsStore.push('Name is required.');

    let youtubeId;

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

    const exerciseToSave: any = {
      name,
      description,
      youtubeId: youtubeId,
      localUrl: exerciseProps.localUrl,
      category,
      muscleGroup,
      equipment,
      videoId: exerciseProps.videoId,
      localThumbnail: exerciseProps.localThumbnail,
    };

    let requestErr = false;
    try {
      if (!exerciseProps._id) {
        await createNewExercise(exerciseToSave, true);
      } else {
        //insert uid
        const dataToSave = {
          ...exerciseToSave,
          _id: exerciseProps._id,
          softlete: exerciseProps.softlete,
        };

        await updateExercise(dataToSave, true, true);
      }
    } catch (err) {
      console.log(err);
      requestErr = true;
    }

    setLoading(false);
    setSaveMsg('');
    !requestErr && navigation.navigate(AdminStackList.AdminExercises);
  };

  const onDelete = async () => {
    if (loading) return;

    if (!confirm) return setConfirm(true);

    if (!exerciseProps?._id) return navigation.goBack();

    setLoading(true);

    await removeExercise(exerciseProps._id);

    setLoading(false);
    navigation.navigate(AdminStackList.AdminExercises);
  };

  const fetchUrl = async () => {
    if (!youtubeUrl) return;

    const res = await validateUrl(youtubeUrl);

    if (!res) return;

    const { invalid, id } = res;

    if (invalid || !id) {
      return;
    }

    setYoutubeThumnnail(getYoutubeThumbNail(id));
    return id;
  };

  const pickerItems = useMemo(() => {
    switch (picker) {
      case PickerOptions.cats:
        return Object.values(Categories);
      case PickerOptions.equipment:
        return equipments;
      case PickerOptions.muscleGroup:
        return Object.values(MuscleGroups);
    }
    return [];
  }, [picker]);

  const onPickerValueChange = (val: any) => {
    switch (picker) {
      case PickerOptions.cats:
        return setCategory(val);
      case PickerOptions.equipment:
        return setEquipment(val);
      case PickerOptions.muscleGroup:
        return setMuscleGroup(val);
    }
  };

  const renderPickerValue = useCallback(() => {
    switch (picker) {
      case PickerOptions.cats:
        return category;
      case PickerOptions.equipment:
        return equipment;
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
              {exerciseProps?._id && (
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

        {confirm && (
          <ConfirmModal
            onConfirm={onDelete}
            onDeny={() => setConfirm(false)}
            header={`Are you sure you want to remove ${name}?`}
          />
        )}
        <ScrollView
          style={{
            paddingLeft: StyleConstants.baseMargin,
            paddingRight: StyleConstants.baseMargin,
          }}>
          <PrimaryText styles={styles.headerText}>Exercise Details</PrimaryText>
          <SecondaryText styles={styles.headerSubText}>
            Fill out the form below.
          </SecondaryText>
          <ExerciseVideo
            small
            props={{
              url: exerciseProps?.url,
              localThumbnail: exerciseProps?.localThumbnail,
              thumbnail: exerciseProps?.thumbnail,
              localUrl: exerciseProps?.localUrl,
            }}
          />
          <View style={styles.errorContainer}>
            {errors.length > 0 &&
              errors.map((e, i) => (
                <SecondaryText styles={styles.errorText} key={Math.random()}>
                  *{e}
                </SecondaryText>
              ))}
          </View>

          <Input
            label="Name"
            placeholder="Name"
            onChangeText={txt => setName(txt)}
            value={name}
            autoCapitalize="words"
            maxLength={50}
            mb={10}
          />

          <Input
            label="Description"
            placeholder="Description"
            onChangeText={txt => setDescription(txt)}
            value={description}
            multiline={true}
            maxLength={100}
            mb={10}
          />

          <PickerButton
            label="Category"
            onPress={() => setPicker(PickerOptions.cats)}>
            {category ? category : 'Category'}
          </PickerButton>

          <PickerButton
            label="Muscle Group"
            onPress={() => setPicker(PickerOptions.muscleGroup)}>
            {muscleGroup}
          </PickerButton>

          <PickerButton
            label="Equipment"
            onPress={() => setPicker(PickerOptions.equipment)}>
            {equipment}
          </PickerButton>

          <Input
            label="Youtube Url"
            placeholder="Youtube URL"
            onChangeText={txt => setYoutubeUrl(txt)}
            value={youtubeUrl}
            maxLength={500}
            mb={10}
          />

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
          setValue={onPickerValueChange}
          options={pickerItems}
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
  },
  headerSubText: {
    fontSize: StyleConstants.smallFont,
    marginBottom: StyleConstants.smallMargin,
  },
  label: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.lightBlack,
    marginBottom: 5,
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
    color: BaseColors.black,
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
    height: moderateScale(20),
    width: moderateScale(20),
    marginLeft: StyleConstants.baseMargin,
  },
  errorText: {
    fontSize: normalize.width(30),
    color: BaseColors.red,
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
    borderRadius: StyleConstants.borderRadius,
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

export default connect(null, {
  updateExercise,
  createNewExercise,
  removeExercise,
  fetchMusclesAndEquipments,
})(EditExercise);
