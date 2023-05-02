import { InfoListBox, PrimaryButton, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, DateTools } from '@app/utils';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import useBanner from 'src/hooks/utils/useBanner';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { ThunkAppDispatch } from 'src/services';
import { BannerTypes } from 'src/services/banner/types';
import { ExerciseProps } from 'src/services/exercises/types';
import { removeExerciseGoalAsync } from 'src/services/goals/slice';
import { ExerciseGoalProps, GoalStatus } from 'src/services/goals/types';
import { useGoalExerciseAnalytics } from '../hooks';

type Props = {
  goal: ExerciseGoalProps;
  exercise: ExerciseProps;
};
const GoalProfile: React.FC<Props> = ({ goal, exercise }) => {
  const dispatch = useDispatch<ThunkAppDispatch>();
  const navigation = useNavigation<NavigationProp<HomeStackParamsList>>();
  const setBanner = useBanner();
  const { data, isFetching } = useGoalExerciseAnalytics(goal, exercise);

  const onEdit = () => {
    navigation.navigate(HomeStackScreens.GoalFormModal, { exercise, goal });
  };

  const removeGoalHandler = () => {
    dispatch(removeExerciseGoalAsync(goal._id))
      .unwrap()
      .catch(err => {
        console.log(err);
        setBanner('An error occurred.', BannerTypes.error);
      });
  };

  const onDeleteClick = () => {
    Alert.alert(
      'Confirmation',
      "Are you sure you want to delete this goal? You can't undo this action.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: removeGoalHandler,
        },
      ],
    );
  };

  const goalStatus = useMemo(() => {
    return GoalStatus.pending;
  }, [goal]);

  return (
    <FlexBox column flex={1}>
      <FlexBox column marginTop={10} alignItems="flex-start">
        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          width="100%">
          <PrimaryButton textTransform="capitalize">{goalStatus}</PrimaryButton>
          <FlexBox>
            <Icon
              icon="pencil"
              size={20}
              color={Colors.white}
              onPress={onEdit}
              containerStyles={{ marginRight: 20 }}
            />
            <Icon
              icon="trash_bin"
              size={20}
              color={Colors.white}
              onPress={onDeleteClick}
            />
          </FlexBox>
        </FlexBox>
        <PrimaryText opacity={0.6} marginTop={10}>
          Name:
        </PrimaryText>
        <PrimaryText>{goal.name}</PrimaryText>

        <PrimaryText opacity={0.6} marginTop={5}>
          Description:
        </PrimaryText>

        <FlexBox maxHeight={40}>
          <ScrollView>
            <PrimaryText>{goal.description}</PrimaryText>
          </ScrollView>
        </FlexBox>

        <FlexBox marginTop={5}>
          <PrimaryText opacity={0.6}>Date Range: </PrimaryText>
          <PrimaryText>
            {`${DateTools.convertLocalStrToFormatStr(
              goal.startDate,
              '/',
            )} - ${DateTools.convertLocalStrToFormatStr(goal.endDate, '/')}`}
          </PrimaryText>
        </FlexBox>

        <FlexBox marginTop={5}>
          <PrimaryText opacity={0.6}>Target:</PrimaryText>
          <PrimaryText> {goal.goal}</PrimaryText>
        </FlexBox>
      </FlexBox>

      <PrimaryText marginTop={10} opacity={0.6}>
        *Dates Hit or Exceed Target Goal
      </PrimaryText>

      {isFetching ? (
        <FlexBox
          marginTop={20}
          alignItems="center"
          justifyContent="center"
          flex={1}>
          <ActivityIndicator size={20} color={Colors.white} />
        </FlexBox>
      ) : (
        <FlexBox marginTop={10} flex={1}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {data.map(item => {
              const date = DateTools.convertUTCStrToLocalStr(
                item.date as string,
                '/',
                'd',
                false,
              );
              return (
                <FlexBox key={item._id || date} alignItems="center">
                  <FlexBox
                    column
                    alignItems="center"
                    marginRight={10}
                    opacity={0.8}>
                    <Icon size={20} icon="calendar" color={Colors.white} />
                    <PrimaryText variant="primary" size="small">
                      {date}
                    </PrimaryText>
                  </FlexBox>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    style={{ marginBottom: 10 }}>
                    {item.data.map((data, set) => {
                      if ((data.performVal ?? 0) > goal.goal) {
                        const label = set + 1 + ' x ' + data.reps;
                        return (
                          <InfoListBox
                            key={data._id || label}
                            secondary
                            label={label}
                            desc={(data.performVal ?? 0).toString()}
                          />
                        );
                      }
                    })}
                  </ScrollView>
                </FlexBox>
              );
            })}
          </ScrollView>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default GoalProfile;
