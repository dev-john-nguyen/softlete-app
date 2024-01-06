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
import { DemoArrow, HealthCircle, PrimaryText } from '@app/elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { StackNavigationProp } from '@react-navigation/stack';
import { DemoStates } from '@app/services';
import { useHealthSamples } from 'src/hooks/health/health.hooks';

interface Props {
  healthData: HealthDataProps[];
}

const HomeHealth = ({ healthData }: Props) => {
  const [basal, setBasal] = useState(0);
  const [activeCals, setActiveCals] = useState(0);
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();
  const { sleepGoal, activeCaloriesGoal } = useSelector(
    (state: ReducerProps) => ({
      sleepGoal: state.goals.user.healths.sleep,
      activeCaloriesGoal: state.goals.user.healths.activeCalories,
    }),
  );
  const {
    sleepToday: sleepDuration,
    hrvToday,
    rrToday,
    rhrToday,
  } = useHealthSamples();

  const fetchHealthData = useCallback(async () => {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const options: HealthInputOptions = {
      startDate: today.toISOString(),
    };
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
              icon="target"
              color={Colors.white}
              size={19}
              onPress={onNavToEditGoalForm}
              hitSlop={10}
              containerStyles={{ marginRight: 15 }}
            />
            <Icon
              icon="filter_bars"
              color={Colors.white}
              size={19}
              onPress={onNavToHealth}
              hitSlop={10}
            />
          </FlexBox>
        }
        desc="An overview of your health today. See how you're progressing towards your health goals."
      />
      <FlexBox marginTop={30} marginBottom={30} justifyContent="space-between">
        <HealthCircle
          name="Sleep"
          value={String(sleepDuration).replace('.', ':') + ' hrs'}
          progress={parseFloat(sleepDuration) / (sleepGoal?.goal ?? 8)}
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
        sleepVal={String(sleepDuration).replace('.', ':')}
        hrvVal={String(hrvToday)}
        rhrVal={String(rhrToday)}
        rrVal={String(rrToday)}
      />
      <FlexBox marginTop={15} alignSelf="center">
        <PrimaryText size="small">{`Today's Results`}</PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default HomeHealth;
