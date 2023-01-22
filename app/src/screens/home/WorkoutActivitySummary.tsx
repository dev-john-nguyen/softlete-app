import {
  LineChartGraph,
  PrimaryText,
  ScreenTemplate,
  InfoListBox,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { ScrollView } from 'react-native';
import HeartRateChart from 'src/components/workout/overview/HeartRateChart';
import { useRouteMarkers } from 'src/hooks/workout/route.hooks';

const ActivitySummary = () => {
  const { workoutTracker } = useRouteMarkers();
  const data = workoutTracker.getFormattedData();
  const segments = workoutTracker.getSegmentData();

  const renderGeneralStats = (() => {
    return (
      <FlexBox column>
        <InfoListBox
          secondary
          icon="fire"
          desc={data?.calories || ''}
          color={Colors.white}
          label="Calories Burned"
          screenWidthPct={0.8}
          marginBottom={10}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <InfoListBox
            secondary
            icon="clock"
            desc={data?.duration || ''}
            color={Colors.white}
            label="Time"
          />

          <InfoListBox
            secondary
            icon="ruler"
            desc={data?.distance || ''}
            color={Colors.white}
            label="Distance"
          />

          <InfoListBox
            secondary
            icon="run"
            desc={data?.averagePace || ''}
            color={Colors.white}
            label="Avg Pace"
          />

          <InfoListBox
            secondary
            icon="pyramid"
            desc={data?.averageAltitude || ''}
            color={Colors.white}
            label="Avg Altitude"
          />
        </ScrollView>

        <InfoListBox
          secondary
          icon="heart"
          desc={data?.averageHeartRate || ''}
          color={Colors.white}
          label="Average Heart Rate"
          screenWidthPct={0.5}
          marginTop={10}
          marginBottom={10}
        />
      </FlexBox>
    );
  })();

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      isLoading={!workoutTracker.workoutId}>
      <FlexBox column>
        <FlexBox column marginBottom={10}>
          <PrimaryText size="large" marginBottom={2}>
            {data?.activityName || 'Unknown'}
          </PrimaryText>
          <PrimaryText marginBottom={2}>
            Date: {workoutTracker.getDate()}
          </PrimaryText>
        </FlexBox>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}>
          <FlexBox marginBottom={5} column>
            {renderGeneralStats}
            <FlexBox marginTop={10} width="100%">
              <HeartRateChart data={data?.heartRates || []} />
            </FlexBox>
          </FlexBox>

          <FlexBox column>
            <PrimaryText marginBottom={5} size="medium" bold>
              Segments
            </PrimaryText>
            {segments.length < 1 ? (
              <FlexBox>
                <PrimaryText>No Segments Found</PrimaryText>
              </FlexBox>
            ) : (
              segments.map((segment, i) => (
                <FlexBox column key={i} marginBottom={5}>
                  <PrimaryText opacity={0.6} marginBottom={2}>
                    Mile {segment.order}:
                  </PrimaryText>
                  <PrimaryText opacity={1} marginBottom={2}>
                    Pace: {segment.paceLabel}
                  </PrimaryText>
                  <PrimaryText opacity={1}>
                    Altitude: {segment.averageAltitudeLabel}
                  </PrimaryText>
                </FlexBox>
              ))
            )}
          </FlexBox>
          <FlexBox marginTop={10} column>
            <LineChartGraph
              header="Pace Trend"
              subHeader="Minute/Mile"
              data={workoutTracker.getPacesInTimeDecimal()}
              decimalPlaces={2}
              paddingRight={35}
            />
            <LineChartGraph
              header="Altitude Trend"
              subHeader="Meters"
              data={workoutTracker.getAltitudes()}
            />
          </FlexBox>
        </ScrollView>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default ActivitySummary;
