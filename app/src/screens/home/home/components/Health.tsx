import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { HealthDataProps } from '../../../../services/workout/types';
import BaseColors, { rgba } from '../../../../utils/BaseColors';
import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
} from 'react-native-health';
import SectionHeader from '../../../../components/home/components/SectionHeader';
import { HomeStackParamsList, HomeStackScreens } from '../../types';
import HealthContainer from '../../../../components/HealthDataVisual';
import { FlexBox } from '@app/ui';
import { getSleepDailyAmts } from 'src/helpers/health.helpers';
import Icon from '@app/icons';
import { Colors, normalize } from '@app/utils';
import { DemoArrow, HealthCircle } from '@app/elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { StackNavigationProp } from '@react-navigation/stack';
import { DemoStates } from '@app/services';

interface Props {
  healthData: HealthDataProps[];
}

const HomeHealth = ({ healthData }: Props) => {
  const [basal, setBasal] = useState(0);
  const [activeCals, setActiveCals] = useState(0);
  const [sleepDuration, setSleepDuration] = useState(0);
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();
  const { sleepGoal, activeCaloriesGoal } = useSelector(
    (state: ReducerProps) => ({
      sleepGoal: state.goals.user.healths.sleep,
      activeCaloriesGoal: state.goals.user.healths.activeCalories,
    }),
  );

  const fetchHealthData = useCallback(async () => {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const options: HealthInputOptions = {
      startDate: today.toISOString(),
    };

    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const sleepStore = await getSleepDailyAmts(yesterday, new Date());

    const sleepAmt = sleepStore.length > 0 ? sleepStore[0].value : 0;
    9;

    setSleepDuration(sleepAmt);

    AppleHealthKit.getBasalEnergyBurned(
      options,
      (err, results: HealthValue[]) => {
        if (err) {
          console.log(err);
          return;
        }

        let totalBasal = 0;
        results.forEach(r => {
          totalBasal += r.value;
        });

        setBasal(_.round(totalBasal));
      },
    );

    AppleHealthKit.getActiveEnergyBurned(
      options,
      (err, results: HealthValue[]) => {
        if (err) {
          console.log(err);
          return;
        }
        let totalActive = 0;
        results.forEach(r => {
          totalActive += r.value;
        });
        setActiveCals(_.round(totalActive));
      },
    );
  }, []);

  useEffect(() => {
    fetchHealthData().catch(err => console.log(err));
  }, [fetchHealthData, healthData]);

  const onNavToHealth = () => {
    navigation.navigate(HomeStackScreens.Health);
  };

  const onNavToEditGoalForm = () => {
    navigation.navigate(HomeStackScreens.HealthGoalForm);
  };

  return (
    <FlexBox
      flexDirection="column"
      screenWidth
      paddingLeft={20}
      paddingRight={20}>
      <SectionHeader
        title="Health"
        RightElement={
          <FlexBox>
            <DemoArrow
              state={[
                DemoStates.HOME_HEALTH_OVERVIEW,
                DemoStates.HOME_HEALTH_EDIT,
              ]}
            />
            <Icon
              icon="pencil"
              color={Colors.white}
              size={20}
              onPress={onNavToEditGoalForm}
              hitSlop={10}
              containerStyles={{ marginRight: 15 }}
            />
            <Icon
              icon="filter_bars"
              color={Colors.white}
              size={20}
              onPress={onNavToHealth}
              hitSlop={10}
            />
          </FlexBox>
        }
        desc="An overview of your health today. See how you're progressing towards your goals."
      />
      <FlexBox marginTop={30} marginBottom={30} justifyContent="space-between">
        <HealthCircle
          name="Sleep"
          value={String(sleepDuration) + ' hrs'}
          progress={sleepDuration / (sleepGoal?.goal ?? 8)}
          progressColor={BaseColors.blue}
          size={normalize.width(2.5)}
          circleWidth={13}
          icon="crescent_moon"
          index={1}
          secondary
          backgroundColor={rgba(Colors.blueRgb, 0.2)}
        />
        <HealthCircle
          name="Active"
          value={String(activeCals) + ' kcal'}
          progress={activeCals / (activeCaloriesGoal?.goal ?? 200)}
          progressColor={BaseColors.red}
          index={2}
          size={normalize.width(2.5)}
          icon="fire"
          circleWidth={13}
          secondary
          backgroundColor={rgba(Colors.redRgb, 0.2)}
        />
      </FlexBox>
      <HealthContainer
        setActiveItem={() => undefined}
        activeItem={''}
        sleepVal={String(sleepDuration)}
        hrvVal={'50'}
        rhrVal={'80'}
        rrVal={'78.3'}
      />
    </FlexBox>
  );
};

export default HomeHealth;
