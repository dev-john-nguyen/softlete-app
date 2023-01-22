import { InfoListBox, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, Constants, normalize, rgba } from '@app/utils';
import sortBy from 'lodash/sortBy';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import {
  WorkoutExerciseProps,
  WorkoutProps,
  WorkoutStatus,
  WorkoutTypes,
} from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import { HomeBoxShadow } from '../types';
import WoAerobic from './WoAerobic';

interface WoExercisesProps {
  exercises?: WorkoutExerciseProps[];
  onPress: () => void;
  color: string;
}

const WoExercises: FC<WoExercisesProps> = ({
  exercises = [],
  onPress,
  color,
}) => {
  return (
    <FlexBox>
      {sortBy(exercises, e => [e.group, e.order]).map((exercise, i) => {
        const name = (() => {
          if (exercise.exercise) {
            const { name } = exercise.exercise;
            if (name) return name;
          }
          return '';
        })();

        return (
          <InfoListBox
            key={exercise._id || i}
            onPress={onPress}
            letter={exercise.group}
            desc={name}
            color={color}
          />
        );
      })}
    </FlexBox>
  );
};

interface Props {
  wo: WorkoutProps;
  onPress: () => void;
  onViewRoute?: () => void;
}

const WoItem = ({ wo, onPress, onViewRoute }: Props) => {
  return (
    <FlexBox marginBottom={10} onPress={onPress} column>
      <FlexBox flex={1} style={{ ...HomeBoxShadow }} column>
        <FlexBox
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={10}>
          <FlexBox>
            <PrimaryText
              size="small"
              numberOfLines={1}
              marginRight={5}
              textTransform="capitalize">
              {wo.name}
            </PrimaryText>
            {wo.status === WorkoutStatus.completed && (
              <Icon
                icon="checkmark"
                direction="right"
                hitSlop={10}
                size={20}
                color={Colors.green}
              />
            )}
          </FlexBox>
          <Icon
            icon="chevron"
            direction="right"
            hitSlop={10}
            size={15}
            strokeColor={Colors.white}
          />
        </FlexBox>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal
          contentContainerStyle={{ alignItems: 'center' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {wo.type === WorkoutTypes.TraditionalStrengthTraining ? (
            <WoExercises
              exercises={wo.exercises}
              onPress={onPress}
              color={BaseColors.lightWhite}
            />
          ) : (
            <WoAerobic
              healthData={wo.healthData}
              onPress={onPress}
              color={BaseColors.lightWhite}
              onViewRoute={onViewRoute}
            />
          )}
        </ScrollView>
      </FlexBox>
    </FlexBox>
  );
};

export default WoItem;
