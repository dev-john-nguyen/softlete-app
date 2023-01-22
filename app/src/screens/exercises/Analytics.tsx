import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ReducerProps } from '../../services';
import {
  fetchExerciseAnalytics,
  fetchExerciseAnalyticsDates,
} from '../../services/misc/actions';
import { MiscActionProps, AnalyticsProps } from '../../services/misc/types';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../../components/tools/StyleConstants';
import DateTools from '../../utils/DateTools';
import AnalyticsGraph from '../../components/analytics/Graph';
import _ from 'lodash';
import Loading from '../../components/elements/Loading';
import {
  AnalyticsFilters,
  DateSelectionTypes,
  DEFAULT_DATES,
} from '../../components/analytics/types';
import SecondaryText from '../../components/elements/SecondaryText';
import { ExerciseProps } from '../../services/exercises/types';
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
import PaginatedHorizontalList from '../../components/PaginatedHorizontalList';
import BarChartSvg from '../../assets/BarChartSvg';
import BoxGraphSvg from '../../assets/BoxGraphSvg';
import TableSvg from '../../assets/TableSvg';
import { ScreenTemplate } from '@app/elements';

interface Props {
  route: any;
  navigation: any;
  fetchExerciseAnalytics: MiscActionProps['fetchExerciseAnalytics'];
  fetchExerciseAnalyticsDates: MiscActionProps['fetchExerciseAnalyticsDates'];
  exercises: ExerciseProps[];
}

interface ExerciseObjProps {
  [date: string]: number[];
}

const ExerciseAnalytics = ({
  route,
  navigation,
  fetchExerciseAnalytics,
  exercises,
  fetchExerciseAnalyticsDates,
}: Props) => {
  const [analytics, setAnalytics] = useState<AnalyticsProps>();
  const [fromDate] = useState(DateTools.dateToStr(DEFAULT_DATES.start.date));
  const [toDate] = useState(DateTools.dateToStr(DEFAULT_DATES.end.date));
  const [dateFilters, setDateFilters] = useState<SelectedDateProps[]>([
    DEFAULT_DATES.start,
    DEFAULT_DATES.end,
  ]);
  const [selectionType, setSelectionType] = useState(DateSelectionTypes.range);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [data, setData] = useState<AnalyticDataProps[]>([]);
  const [filter, setFilter] = useState<AnalyticsFilters>(AnalyticsFilters.AVG);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: BaseColors.black,
      headerTitle: analytics?.exercise?.name || 'Analytics',
    });
  }, [analytics, data]);

  const initiateData = (analyticsProps: AnalyticsProps) => {
    if (analyticsProps) {
      //dealing with same dates
      const exercisesObj: ExerciseObjProps = _.reduce(
        analyticsProps.data,
        (result: any, value) => {
          const key = value.date as string;

          let mapData: number[] = value.data
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

      let dataStore: AnalyticDataProps[] = [];

      for (var key in exercisesObj) {
        if (exercisesObj.hasOwnProperty(key)) {
          let performVals = exercisesObj[key];

          let mean = _.mean(performVals);
          let max = _.max(performVals);
          let min = _.min(performVals);

          dataStore.push({
            avg: mean ? mean : 0,
            max: max ? max : 0,
            min: min ? min : 0,
            date: DateTools.UTCISOToLocalDate(key),
          });
        }
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

  const renderData = () => {
    switch (filter) {
      case AnalyticsFilters.LOW:
        return data.map(d => d.min);
      case AnalyticsFilters.HIGH:
        return data.map(d => d.max);
      case AnalyticsFilters.AVG:
      default:
        return data.map(d => d.avg);
    }
  };

  const onDatesSubmission = async () => {
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
    <ScreenTemplate headerPadding>
      {(() => {
        if (loading) return <Loading white />;

        return (
          <View style={styles.container}>
            <View
              style={{
                margin: StyleConstants.baseMargin,
                marginBottom: StyleConstants.smallMargin,
              }}>
              <SecondaryText styles={styles.measText}>
                Measurement: {analytics?.exercise?.measSubCat || 'N/A'}
              </SecondaryText>
              <DateSelection
                dateFilters={dateFilters}
                setDateFilters={setDateFilters}
                onDatesSubmission={onDatesSubmission}
                selectionType={selectionType}
                setSelectionType={setSelectionType}
                isFetching={isFetching}
              />
              <HealthProgress analytics={analytics} />
            </View>
            {isFetching ? (
              <Loading white />
            ) : (
              <PaginatedHorizontalList
                childrens={[
                  <StackedBarChart data={data} />,
                  <DataTable data={analytics?.data || []} />,
                  <AnalyticsGraph dates={dates} data={renderData()} />,
                ]}
                navItems={[
                  <BarChartSvg strokeColor={BaseColors.white} />,
                  <TableSvg strokeColor={BaseColors.white} />,
                  <BoxGraphSvg strokeColor={BaseColors.white} />,
                ]}
              />
            )}
          </View>
        );
      })()}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measText: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.white,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  exercises: state.exercises.data,
});

export default connect(mapStateToProps, {
  fetchExerciseAnalytics,
  fetchExerciseAnalyticsDates,
})(ExerciseAnalytics);
