import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { MuscleGroups } from 'src/services/exercises/types';

type MuscleFormProps = {
  setMuscleGroups: React.Dispatch<
    React.SetStateAction<Map<MuscleGroups, boolean>>
  >;
  muscleGroups: Map<MuscleGroups, boolean>;
};

const MuscleForm: FC<MuscleFormProps> = ({ setMuscleGroups, muscleGroups }) => {
  return (
    <FlexBox marginBottom={10} column>
      <PrimaryText size="small" opacity={0.8}>
        Muscle Groups
      </PrimaryText>
      <FlexBox>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.values(MuscleGroups)
            .reverse()
            .map(muscle => {
              const isSelected = muscleGroups.get(muscle);
              return (
                <FlexBox
                  onPress={() =>
                    setMuscleGroups(prevGroups => {
                      const exists = prevGroups.get(muscle);
                      exists
                        ? prevGroups.delete(muscle)
                        : prevGroups.set(muscle, true);
                      return new Map(prevGroups);
                    })
                  }
                  marginTop={10}
                  padding={5}
                  marginRight={5}
                  borderRadius={5}
                  key={muscle}
                  backgroundColor={rgba(Colors.whiteRbg, isSelected ? 1 : 0.1)}>
                  <PrimaryText
                    textTransform="capitalize"
                    color={isSelected ? Colors.primary : Colors.white}>
                    {muscle}
                  </PrimaryText>
                </FlexBox>
              );
            })}
        </ScrollView>
      </FlexBox>
    </FlexBox>
  );
};

export default MuscleForm;
