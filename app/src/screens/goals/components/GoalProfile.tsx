import { InfoListBox, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, DateTools, rgba } from '@app/utils';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import useBanner from 'src/hooks/utils/useBanner';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { ThunkAppDispatch } from 'src/services';
import { BannerTypes } from 'src/services/banner/types';
import { ExerciseProps } from 'src/services/exercises/types';
import { removeExerciseGoalAsync } from 'src/services/goals/slice';
import { GoalProps, GoalTypes } from 'src/services/goals/types';
import { GoalStatusProps } from '../types';
import GoalAnalytics from './GoalAnalytics';
import GoalEnduranceAnalytics from './GoalEnduranceAnalytics';

type Props = {
  goal: GoalProps & GoalStatusProps;
  exercise?: ExerciseProps;
};
const GoalProfile: React.FC<Props> = ({ goal, exercise }) => {
  const dispatch = useDispatch<ThunkAppDispatch>();
  const navigation = useNavigation<NavigationProp<HomeStackParamsList>>();
  const setBanner = useBanner();
  const {
    params: { type },
  } = useRoute<RouteProp<HomeStackParamsList, 'Goals'>>();

  const onEdit = () => {
    // need to edit for endurance
    navigation.navigate(HomeStackScreens.GoalFormModal, {
      exercise,
      goal,
      type,
    });
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

  return (
    <FlexBox column flex={1}>
      <FlexBox
        column
        marginTop={5}
        alignItems="flex-start"
        borderBottomWidth={1}
        borderBottomColor={rgba(Colors.whiteRbg, 0.2)}
        paddingBottom={10}
        marginBottom={4}>
        <FlexBox
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%">
          <FlexBox column>
            <PrimaryText opacity={0.6} marginTop={5}>
              Name:
            </PrimaryText>
            <PrimaryText>{goal.name}</PrimaryText>
          </FlexBox>
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

        <PrimaryText opacity={0.6} marginTop={5}>
          Description:
        </PrimaryText>
        <FlexBox maxHeight={40} marginBottom={10}>
          <ScrollView>
            <PrimaryText>{goal.description}</PrimaryText>
          </ScrollView>
        </FlexBox>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <InfoListBox
            secondary
            label="Goal"
            desc={String(goal.goal) + String(goal.measurement)}
          />
          {goal.subType && (
            <InfoListBox
              secondary
              label="Type"
              desc={goal.subType}
              textTransform="capitalize"
            />
          )}
          <InfoListBox
            secondary
            label="Start Date"
            desc={DateTools.convertLocalStrToFormatStr(goal.startDate, '/')}
          />
          <InfoListBox
            secondary
            label="End Date"
            desc={DateTools.convertLocalStrToFormatStr(goal.endDate, '/')}
          />
        </ScrollView>
      </FlexBox>

      {type === GoalTypes.exercise && exercise ? (
        <GoalAnalytics goal={goal} exercise={exercise} />
      ) : (
        <GoalEnduranceAnalytics goal={goal} />
      )}
    </FlexBox>
  );
};

export default GoalProfile;
