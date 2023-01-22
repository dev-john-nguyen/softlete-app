import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from 'react-native';
import { normalize, capitalize } from '../../utils/tools';
import BaseColors, { rgba } from '../../utils/BaseColors';
import {
  ExerciseActionProps,
  Categories,
  ExerciseProps,
} from '../../services/exercises/types';
import { removeExercise, findExercise } from '../../services/exercises/actions';
import { connect } from 'react-redux';
import TrashSvg from '../../assets/TrashSvg';
import StyleConstants from '../../components/tools/StyleConstants';
import { ReducerProps } from '../../services';
import { UserProps } from '../../services/user/types';
import InfoSvg from '../../assets/InfoSvg';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { HomeStackScreens } from '../home/types';
import { ProgramStackScreens } from '../program/types';
import { AppDispatch } from '../../../App';
import { SET_TARGET_EXERCISE } from '../../services/exercises/actionTypes';
import {
  ConfirmModal,
  Input,
  PickerButton,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
  SecondaryText,
} from '@app/elements';
import CustomPicker from 'src/components/elements/Picker';

interface Props {
  navigation: any;
  route: any;
  removeExercise: ExerciseActionProps['removeExercise'];
  findExercise: ExerciseActionProps['findExercise'];
  dispatch: AppDispatch;
  user: UserProps;
  exerciseProps?: ExerciseProps;
}

enum PickerOptions {
  cats = 'cats',
  disable = '',
}

const EditExerciseDetails = ({
  route,
  navigation,
  removeExercise,
  findExercise,
  user,
  exerciseProps,
  dispatch,
}: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Categories>(Categories.other);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const headerHeight = useHeaderHeight();

  const handleNavigation = (goBack?: boolean) => {
    if (route && route.params) {
      if (route.params.programStack) {
        if (goBack) {
          return navigation.navigate(
            ProgramStackScreens.ProgramSearchExercises,
          );
        } else {
          return navigation.navigate(ProgramStackScreens.ProgramEditExercise);
        }
      }
    }
    if (goBack) {
      return navigation.navigate(HomeStackScreens.SearchExercises);
    } else {
      return navigation.navigate(HomeStackScreens.EditExercise);
    }
  };

  useEffect(() => {
    if (!exerciseProps) {
      navigation.goBack();
      return;
    }

    //validate if the user can edit the details of this workout
    //if not navigate to the final step
    if (
      !(
        exerciseProps.userUid === user.uid ||
        (exerciseProps.softlete && user.admin) ||
        !exerciseProps._id
      )
    ) {
      //navgiate to the next screen
    }

    let admin = false;

    if (route.params && route.params.admin) {
      admin = true;
    }

    setName(exerciseProps.name ? capitalize(exerciseProps.name) : '');
    setDescription(exerciseProps.description ? exerciseProps.description : '');
    setCategory(
      exerciseProps.category ? exerciseProps.category : Categories.other,
    );
    //if softlete exerciseProps and user is an admin allow user to edit
    setIsOwner(
      exerciseProps.userUid === user.uid ||
        (exerciseProps.softlete && user.admin) ||
        !exerciseProps._id
        ? true
        : false,
    );

    setIsAdmin(admin || user.admin ? true : false);
    //reset all states
    setConfirm(false);
    setLoading(false);
    setErrors([]);
  }, [route]);

  const onSubmit = async () => {
    if (!exerciseProps) return;

    let errorsStore = [];

    if (!name) errorsStore.push('Name is required.');

    if (
      (exerciseProps._id &&
        exerciseProps.name?.toLowerCase() !== name.toLowerCase()) ||
      !exerciseProps._id
    ) {
      const isValid = await validateName();
      if (!isValid) errorsStore.push('This name is already used.');
    }

    if (errorsStore.length > 0) {
      setErrors(errorsStore);
      return;
    }

    dispatch({
      type: SET_TARGET_EXERCISE,
      payload: {
        ...exerciseProps,
        name: name,
        category: category,
        description: description,
      },
    });
    handleNavigation();
  };

  const onDelete = async () => {
    if (loading) return;

    if (!confirm) return setConfirm(true);

    if (!exerciseProps?._id) return navigation.goBack();

    setLoading(true);

    await removeExercise(exerciseProps._id);

    setLoading(false);
    handleNavigation();
  };

  const validateName = async () => {
    if (isAdmin) return;
    if (!name) return false;
    const isDuplicate = await findExercise(name).catch(err => console.log(err));
    if (isDuplicate) {
      if (isDuplicate.name !== exerciseProps?.name?.toLowerCase()) {
        return false;
      }
    }
    return true;
  };

  const renderPickeritems = useCallback(() => {
    switch (picker) {
      case PickerOptions.cats:
        return Object.values(Categories).map(item => (
          <Picker.Item label={capitalize(item)} value={item} key={item} />
        ));
    }
    return [];
  }, [picker]);

  const onPickerValueChange = (val: any) => {
    switch (picker) {
      case PickerOptions.cats:
        return setCategory(val);
    }
  };

  const renderPickerValue = useCallback(() => {
    switch (picker) {
      case PickerOptions.cats:
        return category;
    }
    return '';
  }, [picker]);

  const onCatPress = () => {
    Keyboard.dismiss();
    isOwner && setPicker(PickerOptions.cats);
  };

  return (
    <ScreenTemplate>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={[styles.actionContainer, { height: headerHeight }]}>
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color={BaseColors.white} />
            </View>
          ) : (
            <>
              {exerciseProps?._id && isOwner && (
                <Pressable style={styles.svg} onPress={onDelete}>
                  <TrashSvg fillColor={BaseColors.white} />
                </Pressable>
              )}
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
        <View
          style={{
            paddingLeft: StyleConstants.baseMargin,
            paddingRight: StyleConstants.baseMargin,
          }}>
          <PrimaryText styles={styles.headerText}>Exercise Details</PrimaryText>
          <SecondaryText styles={styles.headerSubText}>
            Fill out the form below.
          </SecondaryText>
          {!isOwner && (
            <View style={styles.infoContainer}>
              <View style={styles.info}>
                <InfoSvg fillColor={BaseColors.primary} />
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

          <SecondaryText styles={styles.label}>Name</SecondaryText>
          <Input
            placeholder="Name"
            onChangeText={txt => isOwner && setName(txt)}
            value={name}
            autoCapitalize="words"
            maxLength={50}
            editable={isOwner}
            styles={{ marginBottom: StyleConstants.smallMargin }}
          />

          <SecondaryText styles={styles.label}>Description</SecondaryText>
          <Input
            placeholder="Description"
            onChangeText={txt => isOwner && setDescription(txt)}
            value={description}
            multiline={true}
            maxLength={100}
            editable={isOwner}
            styles={{ marginBottom: StyleConstants.smallMargin }}
            maxHeight={normalize.height(9)}
            variant="textarea"
          />

          <PickerButton
            label="Category"
            onPress={onCatPress}
            disabled={!isOwner}>
            {category ? category : 'Category'}
          </PickerButton>

          <PrimaryButton onPress={onSubmit} styles={styles.btn}>
            Next
          </PrimaryButton>
        </View>
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
    marginBottom: StyleConstants.smallMargin,
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
    color: BaseColors.red,
  },
  info: {
    height: normalize.width(20),
    width: normalize.width(20),
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: StyleConstants.borderRadius,
    borderWidth: 1,
    borderColor: rgba(BaseColors.whiteRbg, 0.8),
    marginBottom: StyleConstants.smallMargin,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.white,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  btn: {
    alignSelf: 'flex-end',
    marginTop: StyleConstants.baseMargin,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  user: state.user,
  equipments: state.exercises.equipments,
  exerciseProps: state.exercises.targetExercise,
});

const mapDispatchToProps = (dispatch: any) => ({
  removeExercise: async (_id?: string, admin?: boolean) =>
    dispatch(removeExercise(_id, admin)),
  findExercise: async (name: string) => dispatch(findExercise(name)),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditExerciseDetails);
