import React, { useEffect, useState, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  fetchExerciseAnalytics,
  fetchExerciseAnalyticsDates,
} from '../../services/misc/actions';
import { MiscActionProps, AnalyticsProps } from '../../services/misc/types';
import DateTools from '../../utils/DateTools';
import AnalyticsGraph from '../../components/analytics/Graph';
import _ from 'lodash';
import Loading from '../../components/elements/Loading';
import {
  DateSelectionTypes,
  DEFAULT_DATES,
} from '../../components/analytics/types';
import {
  AnalyticDataProps,
  SelectedDateProps,
} from '../../components/analytics/types';
import {
  DataTable,
  StackedBarChart,
  DateSelection,
  HealthProgress,
} from '../../components/analytics';
import {
  PaginatedHorizontalList,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import { ReducerProps } from 'src/services';

interface Props {
  route: any;
  navigation: any;
  fetchExerciseAnalytics: MiscActionProps['fetchExerciseAnalytics'];
  fetchExerciseAnalyticsDates: MiscActionProps['fetchExerciseAnalyticsDates'];
}

interface ExerciseObjProps {
  [date: string]: number[];
}

const ExerciseAnalytics = ({
  route,
  navigation,
  fetchExerciseAnalytics,
  fetchExerciseAnalyticsDates,
}: Props) => {
  const { exercises } = useSelector((state: ReducerProps) => ({
    exercises: state.exercises.data,
  }));
  const [analytics, setAnalytics] = useState<AnalyticsProps>();
  const [fromDate] = useState(DateTools.dateToStr(DEFAULT_DATES.start.date));
  const [toDate] = useState(DateTools.dateToStr(DEFAULT_DATES.end.date));
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [data, setData] = useState<AnalyticDataProps[]>([]);

  const handleFetchedAnalytics = (
    fetchedAnalytics: void | AnalyticsProps[],
  ) => {
    const { exerciseUid } = route.params;
    if (fetchedAnalytics && fetchedAnalytics.length > 0) {
      setAnalytics(fetchedAnalytics[0]);
      initiateData(fetchedAnalytics[0]);
    } else {
      //get exercise
      const exercise = exercises.find(e => e._id === exerciseUid);
      setAnalytics({
        exerciseUid,
        exercise,
        data: [],
      });
      setData([]);
      setDates([]);
    }
  };

  const onFetchAndInitiate = useCallback(async () => {
    if (!route.params || !route.params.exerciseUid) {
      navigation.goBack();
      return;
    }

    const { athlete, exerciseUid } = route.params;
    setLoading(true);
    //get the most recent data
    await fetchExerciseAnalytics(fromDate, toDate, [exerciseUid], athlete)
      .then(handleFetchedAnalytics)
      .catch(err => {
        console.log(err);
        setAnalytics(undefined);
      });

    setLoading(false);
  }, [route]);

  useEffect(() => {
    onFetchAndInitiate();
  }, [route]);

  const initiateData = (analyticsProps: AnalyticsProps) => {
    if (analyticsProps) {
      //dealing with same dates
      const exercisesObj: ExerciseObjProps = _.reduce(
        analyticsProps.data,
        (result: any, value) => {
          const key = value.date as string;

          const mapData: number[] = value.data
            .filter(dta => dta.performVal && !dta.warmup)
            .map(dta => dta.performVal) as number[];

          if (!result[key]) {
            result[key] = [];
          }

          mapData.forEach(m => {
            result[key].push(m);
          });

          return result;
        },
        {},
      );

      const dataStore: AnalyticDataProps[] = [];

      for (const key in exercisesObj) {
        const performVals = exercisesObj[key];

        const mean = _.mean(performVals);
        const max = _.max(performVals);
        const min = _.min(performVals);

        dataStore.push({
          avg: mean ? mean : 0,
          max: max ? max : 0,
          min: min ? min : 0,
          date: DateTools.UTCISOToLocalDate(key),
        });
      }

      //sort dataStore by date
      const sortedDataStore = dataStore.sort((a, b) => {
        const dateA = a.date;
        const dateB = b.date;
        return dateA.getTime() - dateB.getTime();
      });

      const datesStore: any = _.uniq(
        sortedDataStore.map(d => {
          const date = d.date;
          return date;
        }),
      );
      setData(sortedDataStore);
      setDates(datesStore);
    }
  };

  const onDatesSubmission = async (
    selectionType: DateSelectionTypes,
    dateFilters: SelectedDateProps[],
  ) => {
    if (!analytics) return;
    const { athlete } = route.params;
    const dateFilterStrs = dateFilters.map(({ date }) =>
      DateTools.dateToStr(date),
    );
    if (dateFilterStrs.length < 1) return;
    if (selectionType === DateSelectionTypes.range) {
      if (dateFilterStrs.length !== 2) return;
      setIsFetching(true);
      const startDate = dateFilterStrs[0];
      const endDate = dateFilterStrs[1];
      await fetchExerciseAnalytics(
        startDate,
        endDate,
        [analytics.exerciseUid],
        athlete,
      ).then(handleFetchedAnalytics);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      await fetchExerciseAnalyticsDates(
        dateFilterStrs,
        [analytics.exerciseUid],
        athlete,
      ).then(handleFetchedAnalytics);
      setIsFetching(false);
    }
  };

  return (
    <ScreenTemplate
      isBackVisible
      leftContentFlex={0}
      rightContentFlex={0}
      headerTitleFormatted={analytics?.exercise?.name || 'Exercise Analytics'}>
      {(() => {
        if (loading) return <Loading white />;
        return (
          <FlexBox flex={1} column>
            <FlexBox paddingRight={15} paddingLeft={15} column>
              <PrimaryText textTransform="capitalize">
                Measurement: {analytics?.exercise?.measSubCat || 'N/A'}
              </PrimaryText>
              <DateSelection
                onDatesSubmission={onDatesSubmission}
                isFetching={isFetching}
              />
              <HealthProgress analytics={analytics} />
            </FlexBox>
            {isFetching ? (
              <Loading white />
            ) : (
              <PaginatedHorizontalList
                childrens={[
                  <StackedBarChart data={data} key="stack-bar-chart" />,
                  <DataTable data={analytics?.data || []} key="data-table" />,
                  <AnalyticsGraph
                    dates={dates}
                    data={data}
                    key="analytics-graph"
                  />,
                ]}
                navItems={['bar_chart', 'box_table', 'box_graph']}
              />
            )}
          </FlexBox>
        );
      })()}
    </ScreenTemplate>
  );
};

export default connect(null, {
  fetchExerciseAnalytics,
  fetchExerciseAnalyticsDates,
})(ExerciseAnalytics);
