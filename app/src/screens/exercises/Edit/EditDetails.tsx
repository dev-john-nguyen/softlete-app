import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import { normalize, capitalize } from '../../../utils/tools';
import {
  ExerciseActionProps,
  Categories,
  ExerciseProps,
} from '../../../services/exercises/types';
import {
  removeExercise,
  findExercise,
} from '../../../services/exercises/actions';
import { connect } from 'react-redux';
import StyleConstants from '../../../components/tools/StyleConstants';
import { ReducerProps } from '../../../services';
import { UserProps } from '../../../services/user/types';
import { HomeStackScreens } from '../../home/types';
import { ProgramStackScreens } from '../../program/types';
import { AppDispatch } from '../../../../App';
import { SET_TARGET_EXERCISE } from '../../../services/exercises/actionTypes';
import {
  Input,
  PickerButton,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { Colors } from '@app/utils';
import { useDelete, useIsOwner } from './hooks';

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
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [picker, setPicker] = useState<PickerOptions>(PickerOptions.disable);
  const setBanner = useBanner();
  const { onDelete } = useDelete();
  const { isOwner } = useIsOwner();
  const workoutParams = route.params?.workoutParams;

  const handleNavigation = (goBack?: boolean) => {
    if (route && route.params) {
      if (route.params.programStack) {
        if (goBack) {
          return navigation.navigate(
            ProgramStackScreens.ProgramSearchExercises,
            { workoutParams },
          );
        } else {
          return navigation.navigate(ProgramStackScreens.ProgramEditExercise, {
            workoutParams,
          });
        }
      }
    }

    if (goBack) {
      return navigation.navigate(HomeStackScreens.SearchExercises, {
        workoutParams,
      });
    } else {
      return navigation.navigate(HomeStackScreens.EditExercise, {
        workoutParams,
      });
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

    setIsAdmin(admin || user.admin ? true : false);
    //reset all states
    setLoading(false);
  }, [route]);

  const onSubmit = async () => {
    if (!exerciseProps) return;

    if (!name) return setBanner('Name is required.', BannerTypes.error);

    if (
      (exerciseProps._id &&
        exerciseProps.name?.toLowerCase() !== name.toLowerCase()) ||
      !exerciseProps._id
    ) {
      const isValid = await validateName();
      if (!isValid)
        return setBanner('This name is already used.', BannerTypes.error);
    }

    dispatch({
      type: SET_TARGET_EXERCISE,
      payload: {
        ...exerciseProps,
        name: name,
        category: category,
        description: description,
        muscleGroups: exerciseProps.muscleGroups ?? [],
      },
    });
    handleNavigation();
  };

  const validateName = async () => {
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
        return Object.values(Categories).map(item => ({
          label: capitalize(item),
          value: item,
        }));
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

  const onDeletePress = async () => {
    if (!exerciseProps?._id) return navigation.goBack();
    if (await onDelete(exerciseProps)) {
      handleNavigation(true);
    }
  };

  const rightContent = useMemo(() => {
    if (loading) return <ActivityIndicator color={Colors.white} />;
    if (exerciseProps?._id && isOwner) {
      return (
        <Icon
          icon="trash_bin"
          onPress={onDeletePress}
          size={20}
          color={Colors.white}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, exerciseProps, isOwner]);

  return (
    <ScreenTemplate
      headerTitleFormatted="Exercise Details"
      applyContentPadding
      isBackVisible
      isPickerOpen={!!picker}
      onPickerClose={() => setPicker(PickerOptions.disable)}
      pickerValue={pickerValue}
      pickerOptions={pickerItems}
      onPickerChangeValue={onPickerValueChange}
      rightContent={
        <FlexBox flex={1} alignItems="center" justifyContent="flex-end">
          {rightContent}
        </FlexBox>
      }>
      {!isOwner ? (
        <FlexBox>
          <Icon icon="info" color={Colors.white} size={20} />
          <PrimaryText marginLeft={5}>You have limited access.</PrimaryText>
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
        textTransform="capitalize"
        arrow
        arrowDirection="down">
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
