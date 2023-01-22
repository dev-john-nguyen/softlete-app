import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ReducerProps } from '../../services';
import { connect, useSelector } from 'react-redux';
import {
  fetchWorkouts,
  duplicateWorkout,
} from '../../services/workout/actions';
import {
  WorkoutActionProps,
  MonthWorkoutsProps,
} from '../../services/workout/types';
import { Calendar } from 'react-native-calendars';
import CalendarTheme from '../../components/calendar/CalendarTheme';
import { Colors, rgba } from '@app/utils';
import { AppDispatch } from '../../../App';
import { SET_SELECTED_DATE } from '../../services/workout/actionTypes';
import DateTools from '../../utils/DateTools';
import { ProgramActionProps } from '../../services/program/types';
import DashboardContent from '../../components/calendar/Content';
import DashboardFilter from '../../components/calendar/Filter';
import CalendarHeader from '../../components/calendar/CustomHeader';
import { HomeStackScreens } from './types';
import { DateData } from 'react-native-calendars/src/types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

interface Props {
  route: any;
  navigation: any;
  fetchWorkouts: WorkoutActionProps['fetchWorkouts'];
  selectedDate: string;
  dispatch: AppDispatch;
  duplicateWorkout: WorkoutActionProps['duplicateWorkout'];
  monthWorkouts: MonthWorkoutsProps;
  removeGeneratedProgram: ProgramActionProps['removeGeneratedProgram'];
  offline: boolean;
}

const Cal = ({
  navigation,
  fetchWorkouts,
  dispatch,
  duplicateWorkout,
}: Props) => {
  const { selectedDate, monthWorkouts, offline } = useSelector(
    (state: ReducerProps) => ({
      selectedDate: state.workout.selectedDate,
      monthWorkouts: state.workout.monthWorkouts,
      offline: state.global.offline,
    }),
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const mount = useRef(false);

  const onPasteWorkout = (d: DateData) => {
    if (loading || !d) return;
    setLoading(true);
    duplicateWorkout(d.dateString)
      .then(() => setLoading(false))
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const onMonthChange = async (dateData: DateData[]) => {
    //fetch the month workotus
    setFetching(true);
    const d = dateData[0];
    const amtOfDays = new Date(d.year, d.month, 0).getDate(); //d.month is the next month
    const fromDate = new Date(d.year, d.month - 1, 1);
    const toDate = new Date(d.year, d.month - 1, amtOfDays);
    const fromDateStr = DateTools.dateToStr(fromDate);
    const toDateStr = DateTools.dateToStr(toDate);
    dispatch({ type: SET_SELECTED_DATE, payload: d.dateString });
    await fetchWorkouts(fromDateStr, toDateStr);
    mount.current && setFetching(false);
  };

  const onDayPress = (d: DateData) =>
    dispatch({ type: SET_SELECTED_DATE, payload: d.dateString });

  const onGoOnline = () => {
    navigation.navigate(HomeStackScreens.GoOnlineModal);
  };

  const renderCustomHeader = useCallback(
    props => {
      return (
        <CalendarHeader
          monthProps={props.month}
          addMonth={props.addMonth}
          loading={fetching}
          offline={offline}
          goOnline={onGoOnline}
        />
      );
    },
    [selectedDate, fetching, offline],
  );

  const renderSelectDateDots = () => {
    const keys = Object.keys(monthWorkouts);
    for (let i = 0; i < keys.length; i++) {
      const date = keys[i];
      if (date === selectedDate) {
        return monthWorkouts[date].dots.map(d => {
          if (d.color === Colors.secondary) {
            return {
              ...d,
              color: rgba(Colors.primaryRgb, 0.3),
            };
          }
          return d;
        });
      }
    }
    return [];
  };

  return (
    <ScreenTemplate isBackVisible rotateBack="-90deg" applyContentPadding>
      <Calendar
        style={{
          width: '100%',
          alignSelf: 'center',
        }}
        current={selectedDate}
        theme={CalendarTheme}
        markingType={'multi-dot'}
        hideArrows={false}
        markedDates={{
          ...monthWorkouts,
          [selectedDate]: {
            selected: true,
            selectedColor: rgba(Colors.whiteRbg, 0.8),
            dots: renderSelectDateDots(),
          },
        }}
        onDayPress={onDayPress}
        onDayLongPress={onPasteWorkout}
        onVisibleMonthsChange={onMonthChange}
        monthFormat={'MMMM'}
        customHeader={renderCustomHeader}
      />
      <DashboardFilter />
      <DashboardContent navigation={navigation} loading={fetching} />
    </ScreenTemplate>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchWorkouts: (fromDate: string, toDate: string) =>
      dispatch(fetchWorkouts(fromDate, toDate)),
    duplicateWorkout: (d: string) => dispatch(duplicateWorkout(d)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(Cal);
