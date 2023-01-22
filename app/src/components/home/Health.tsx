import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { HealthDataProps } from '../../services/workout/types';
import BaseColors from '../../utils/BaseColors';
import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
} from 'react-native-health';
import HealthProgressItem from './components/HealthItem';
import SectionHeader from './components/SectionHeader';
import { HomeStackScreens } from '../../screens/home/types';
import HealthContainer from '../HealthDataVisual';
import FilterBarsSvg from '../../assets/FilterBarsSvg';
import { FlexBox } from '@app/ui';
import { getSleepDailyAmts } from 'src/helpers/health.helpers';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

interface Props {
  healthData: HealthDataProps[];
  navigation: any;
}

const HomeHealth = ({ healthData, navigation }: Props) => {
  const [basal, setBasal] = useState(0);
  const [activeCals, setActiveCals] = useState(0);
  const [sleepDuration, setSleepDuration] = useState('');
  const [sleepPct, setSleepPct] = useState(0);
  const d = new Date();
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const fetchHealthData = async () => {
    const options: HealthInputOptions = {
      startDate: today.toISOString(),
    };

    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const sleepStore = await getSleepDailyAmts(yesterday, new Date());

    const sleepAmt = sleepStore.length > 0 ? sleepStore[0].value : 0;
    9;
    setSleepDuration(sleepAmt.toString());
    // 8 represents daily goal
    // Should be changed in the future
    setSleepPct(sleepAmt / 8);

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
          return;
        }
        let totalActive = 0;
        results.forEach(r => {
          totalActive += r.value;
        });
        setActiveCals(_.round(totalActive));
      },
    );
  };

  useEffect(() => {
    fetchHealthData().catch(err => console.log(err));
  }, [healthData]);

  const onNavToHealth = () => {
    navigation.navigate(HomeStackScreens.Health);
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
            <Icon
              icon="filter_bars"
              color={Colors.white}
              size={20}
              onPress={onNavToHealth}
              hitSlop={10}
            />
          </FlexBox>
        }
        desc="This is today's health report. You were able to recovery fully today!"
      />
      <FlexBox marginTop={30} marginBottom={30} justifyContent="space-between">
        <HealthProgressItem
          name="Sleep"
          value={(sleepDuration || '0') + ' hrs'}
          progress={sleepPct}
          progressColor={BaseColors.blue}
          index={1}
        />
        <HealthProgressItem
          name="Active"
          value={activeCals.toString() + ' kcal'}
          progress={0.75}
          progressColor={BaseColors.red}
          index={2}
        />
        <HealthProgressItem
          name="Total"
          value={(activeCals + basal).toString() + ' kcal'}
          progress={0.75}
          progressColor={BaseColors.green}
          index={2}
        />
      </FlexBox>
      <HealthContainer
        setActiveItem={() => undefined}
        activeItem={''}
        sleepVal={sleepDuration}
        hrvVal={'50'}
        rhrVal={'80'}
        rrVal={'78.3'}
      />
    </FlexBox>
  );
};

export default HomeHealth;
