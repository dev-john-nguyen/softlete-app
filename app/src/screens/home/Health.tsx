import React, { FC, useMemo, useState } from 'react';
import { FlexBox } from '@app/ui';
import { Colors, Constants, rgba } from '@app/utils';
import { LineChart } from 'react-native-chart-kit';
import HealthContainer from '../../components/HealthDataVisual';
import { moderateScale } from '../../components/tools/StyleConstants';
import { DateValueProps, HealthEvalProps } from '../../services/workout/types';
import { normalize } from '../../utils/tools';
import { GraphPlaceholder, PrimaryText, ScreenTemplate } from '@app/elements';
import Icon from '@app/icons';
import { getDates, useHealthSamples } from 'src/hooks/health/health.hooks';

type HealthHeaderProps = {
  desc: string;
  dates: {
    startDate: Date;
    endDate: Date;
  };
};

const HealthHeader: FC<HealthHeaderProps> = ({ desc, dates }) => {
  const FormattedDates = `${Constants.months[dates.startDate.getMonth()].slice(
    0,
    3,
  )} ${dates.startDate.getDate()} - ${Constants.months[
    dates.endDate.getMonth()
  ].slice(0, 3)} ${dates.endDate.getDate()}`;

  return (
    <FlexBox marginBottom={30} marginTop={0} column>
      <FlexBox
        backgroundColor={rgba(Colors.lightWhiteRgb, 0.1)}
        alignSelf="center"
        padding={10}
        paddingLeft={12}
        paddingRight={12}
        marginBottom={10}
        borderRadius={20}>
        <PrimaryText size="small">{FormattedDates}</PrimaryText>
      </FlexBox>
      <FlexBox alignItems="center">
        <Icon icon="logo" size={25} variant="secondary" />
        <PrimaryText flex={1} size="small" marginLeft={5}>
          {desc}
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

const chartDimensions = {
  width: normalize.width(1),
  height: normalize.height(3),
};

const Health = () => {
  const { hrvs, sleeps, rrs, rhrs } = useHealthSamples();
  const [activeItem, setActiveItem] = useState('recovery');

  const lineChartConfig = useMemo(() => {
    const renderLabelFromValue = (value: DateValueProps) =>
      `${Constants.daysOfWeek[value.date.getDay()].slice(0, 3).toUpperCase()}`;

    switch (activeItem) {
      case 'recovery':
        return {
          labels: hrvs.data.map(renderLabelFromValue),
          data: hrvs.data.map(h => h.value),
          desc: hrvs.eval,
        };
      case 'sleep':
        return {
          labels: sleeps.data.map(renderLabelFromValue),
          data: sleeps.data.map(h => h.value),
          desc: sleeps.eval,
        };
      case 'rhr':
        return {
          labels: rhrs.data.map(renderLabelFromValue),
          data: rhrs.data.map(h => h.value),
          desc: rhrs.eval,
        };
      case 'rr':
        return {
          labels: rrs.data.map(renderLabelFromValue),
          data: rrs.data.map(h => h.value),
          desc: rrs.eval,
        };
      case 'hrv':
        return {
          labels: hrvs.data.map(renderLabelFromValue),
          data: hrvs.data.map(h => h.value),
          desc: hrvs.eval,
        };
      default:
        return {
          labels: [],
          data: [],
          desc: '',
        };
    }
  }, [activeItem, hrvs, rhrs, rrs, sleeps]);

  const { sleepToday, hrvToday, rrToday, rhrToday } = useMemo(() => {
    const getAverage = (healthEval: HealthEvalProps, fixed = 1) => {
      let avg = 0;
      if (healthEval.data.length > 0) {
        // skip zeros
        const filtered = healthEval.data.filter(d => d.value);
        avg =
          filtered.reduce((state, val) => state + val.value, 0) /
          filtered.length;
      }
      return String(avg.toFixed(fixed));
    };

    return {
      sleepToday: getAverage(sleeps, 2),
      hrvToday: getAverage(hrvs),
      rrToday: getAverage(rrs),
      rhrToday: getAverage(rhrs),
    };
  }, [hrvs, rhrs, rrs, sleeps]);

  const renderDotContent = (props: {
    x: number;
    y: number;
    index: number;
    indexData: number;
  }) => {
    let label = props.indexData.toFixed(1);
    const leftAdj = -moderateScale(10);
    const topAdj = -moderateScale(35);
    if (activeItem === 'sleep') {
      label = props.indexData.toString().replace('.', ':');
    }
    if (props.indexData === 0) {
      label = '';
    }

    return (
      <FlexBox
        position="absolute"
        left={props.x + leftAdj}
        top={props.y + topAdj}
        key={props.index}>
        <PrimaryText size="small">{label}</PrimaryText>
      </FlexBox>
    );
  };

  return (
    <ScreenTemplate
      isBackVisible
      rotateBack="-90deg"
      applyContentPadding
      middleContent={
        <FlexBox flex={1} alignItems="center" justifyContent="center">
          <PrimaryText size="large">Health</PrimaryText>
        </FlexBox>
      }>
      <HealthHeader desc={lineChartConfig.desc} dates={getDates(6)} />
      {lineChartConfig.data.length === 0 ? (
        <FlexBox
          height={chartDimensions.height}
          alignItems="center"
          justifyContent="center"
          width="100%">
          <GraphPlaceholder hasBgColor={false} />
        </FlexBox>
      ) : (
        <LineChart
          data={{
            labels: lineChartConfig.labels,
            datasets: [
              {
                data: lineChartConfig.data,
              },
            ],
          }}
          width={chartDimensions.width}
          height={chartDimensions.height}
          withVerticalLines={false}
          withHorizontalLines={false}
          withHorizontalLabels={false}
          bezier
          segments={10}
          withDots={true}
          fromZero={true}
          withShadow={false}
          renderDotContent={renderDotContent}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: '#08130D',
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: () => rgba(Colors.whiteRbg, 0.2),
            labelColor: () => rgba(Colors.whiteRbg, 0.5),
            style: {},
            propsForLabels: {
              fontSize: moderateScale(12),
            },
            propsForHorizontalLabels: {},
            propsForDots: {
              r: '5',
              strokeWidth: '1',
              stroke: Colors.lightWhite,
            },
            strokeWidth: 2,
          }}
          style={{
            alignSelf: 'center',
            paddingRight: moderateScale(30),
            left: moderateScale(15),
          }}
        />
      )}
      <HealthContainer
        setActiveItem={setActiveItem}
        activeItem={activeItem}
        sleepVal={sleepToday}
        rrVal={rrToday}
        hrvVal={hrvToday}
        rhrVal={rhrToday}
      />
      <FlexBox marginTop={15} alignSelf="center">
        <PrimaryText size="small">Last 7 Days Averages</PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default Health;
