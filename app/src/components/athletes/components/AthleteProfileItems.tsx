import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ClockSvg from '../../../assets/ClockSvg';
import DumbbellSvg from '../../../assets/DumbbellSvg';
import HeartSvg from '../../../assets/HeartSvg';
import PeopleSvg from '../../../assets/PeopleSvg';
import RulerSvg from '../../../assets/RulerSvg';
import SearchSvg from '../../../assets/SearchSvg';
import { ExerciseProps } from '../../../services/exercises/types';
import { FriendProps } from '../../../services/user/types';
import { HealthDataProps, WorkoutProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import StyleConstants from '../../tools/StyleConstants';
import { convertMsToTime } from '../../../utils/format';
import AthleteProfileItem from './AthleteProfileItem';

interface Props {
  healthData?: HealthDataProps[];
  workouts: WorkoutProps[];
  exercises: ExerciseProps[];
  friends: FriendProps[];
  navigateToFriends: () => void;
  navigateToExercises: () => void;
}

const AthletProfileItems = ({
  healthData,
  workouts,
  exercises,
  friends,
  navigateToFriends,
  navigateToExercises,
}: Props) => {
  const [cals, setCals] = useState(0);
  const [dis, setDis] = useState(0);
  const [dur, setDur] = useState(0);

  const initHealthData = useCallback(() => {
    let calsT = 0;
    let disT = 0;
    let durT = 0;

    if (!healthData || !Array.isArray(healthData)) return;

    healthData.forEach(data => {
      calsT += data.calories;
      disT += data.distance;
      durT += data.duration;
    });

    setCals(_.round(calsT));
    setDis(_.round(disT));
    setDur(_.round(durT));
  }, [healthData]);

  useEffect(() => {
    initHealthData();
  }, [healthData]);

  return (
    <ScrollView style={styles.container} horizontal>
      <AthleteProfileItem
        label="workouts"
        value={workouts.length.toString()}
        svg={<DumbbellSvg fillColor={BaseColors.primary} />}
      />
      <AthleteProfileItem
        label="Exercises"
        value={exercises.length.toString()}
        svg={<SearchSvg strokeColor={BaseColors.primary} />}
        onPress={navigateToExercises}
      />
      <AthleteProfileItem
        label="Followers"
        value={friends.length.toString()}
        svg={<PeopleSvg strokeColor={BaseColors.primary} />}
        onPress={navigateToFriends}
      />
      <AthleteProfileItem
        label="calories"
        value={cals.toString() + ' kcal'}
        svg={<HeartSvg fillColor={BaseColors.primary} />}
      />
      <AthleteProfileItem
        label="Time"
        value={convertMsToTime(dur)}
        svg={<ClockSvg fillColor={BaseColors.primary} />}
      />
      <AthleteProfileItem
        label="Distance"
        value={dis.toString() + ' mi'}
        svg={<RulerSvg fillColor={BaseColors.primary} />}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: StyleConstants.baseMargin,
  },
});

export default AthletProfileItems;
