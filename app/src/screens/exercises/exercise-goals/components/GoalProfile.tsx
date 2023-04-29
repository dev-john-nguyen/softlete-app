import { InfoListBox, PrimaryButton, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, DateTools, PATHS, getRequestURL } from '@app/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { ExerciseGoal } from 'src/services/goals/types';
import { WorkoutExerciseProps } from 'src/services/workout/types';

type Props = {
  goal: ExerciseGoal;
  exerciseUid: string;
};
const GoalProfile: React.FC<Props> = ({ goal, exerciseUid }) => {
  const { data = [], isFetching } = useQuery<WorkoutExerciseProps[]>(
    ['exercise-goals-data', { exerciseUid, goalUid: goal._id }],
    () =>
      axios
        .get(
          getRequestURL(
            PATHS.goals.get_exercise_goal_analytics(
              exerciseUid,
              String(goal.goal),
            ),
          ),
          {
            params: { exerciseUid },
          },
        )
        .then(res => res.data),
    {
      refetchOnMount: true,
      staleTime: 60000,
    },
  );

  return (
    <FlexBox column flex={1}>
      <FlexBox column marginTop={20} alignItems="flex-start">
        <PrimaryButton textTransform="capitalize">{goal.status}</PrimaryButton>
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
            {`${DateTools.convertUTCStrToLocalStr(
              goal.startDate,
              '/',
            )} - ${DateTools.convertUTCStrToLocalStr(goal.endDate, '/')}`}
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
