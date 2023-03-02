import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import { normalize, capitalize } from '../../utils/tools';
import BaseColors from '../../utils/BaseColors';
import {
  ExerciseActionProps,
  Categories,
  ExerciseProps,
} from '../../services/exercises/types';
import { removeExercise, findExercise } from '../../services/exercises/actions';
import { connect } from 'react-redux';
import StyleConstants from '../../components/tools/StyleConstants';
import { ReducerProps } from '../../services';
import { UserProps } from '../../services/user/types';
import { Picker } from '@react-native-picker/picker';
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
} from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';

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

    const errorsStore = [];

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

  const pickerItems = useMemo(() => {
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

  const pickerValue = useMemo(() => {
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
    <ScreenTemplate
      applyContentPadding
      isBackVisible
      isPickerOpen={!!picker}
      onPickerClose={() => setPicker(PickerOptions.disable)}
      pickerValue={pickerValue}
      pickerItems={pickerItems}
      onPickerChangeValue={onPickerValueChange}>
      <FlexBox justifyContent="flex-end" alignItems="flex-end">
        {loading ? (
          <ActivityIndicator color={BaseColors.white} /> ? (
            exerciseProps?._id &&
            isOwner && (
              <Icon
                icon="trash_bin"
                color={BaseColors.white}
                onPress={onDelete}
                size={20}
              />
            )
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </FlexBox>
      {confirm ? (
        <ConfirmModal
          onConfirm={onDelete}
          onDeny={() => setConfirm(false)}
          header={`Are you sure you want to remove ${name}?`}
        />
      ) : (
        <></>
      )}
      <PrimaryText size="large">Exercise Details</PrimaryText>
      <PrimaryText>Fill out the form below.</PrimaryText>
      {!isOwner ? (
        <FlexBox>
          <Icon icon="info" color={BaseColors.white} size={20} />
          <PrimaryText marginLeft={5}>You have limited access.</PrimaryText>
        </FlexBox>
      ) : (
        <></>
      )}
      {errors.length > 0 ? (
        <FlexBox marginTop={5} marginBottom={5}>
          {errors.map(e => (
            <PrimaryText key={Math.random()}>*{e}</PrimaryText>
          ))}
        </FlexBox>
      ) : (
        <></>
      )}
      <Input
        label="Name"
        placeholder="Name"
        onChangeText={txt => isOwner && setName(txt)}
        value={name}
        autoCapitalize="words"
        maxLength={50}
        editable={isOwner}
        styles={{ marginBottom: StyleConstants.smallMargin }}
      />

      <Input
        label="Description"
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
        disabled={!isOwner}
        textTransform="capitalize">
        {category ? category : 'Category'}
      </PickerButton>

      <PrimaryButton onPress={onSubmit} alignSelf="flex-end">
        Next
      </PrimaryButton>
    </ScreenTemplate>
  );
};

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
