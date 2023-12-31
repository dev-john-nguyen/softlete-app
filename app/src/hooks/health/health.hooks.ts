import { DateTools } from '@app/utils';
import uniqBy from 'lodash/uniqBy';
import { useState, useEffect, useMemo } from 'react';
import { hrvDesc, sleepDesc, rrDesc } from 'src/content/health';
import {
  getHRSamples,
  getRRSamples,
  getRestingHeartRateSamples,
  getSleepDailyAmts,
} from 'src/helpers/health.helpers';
import { HealthEvalProps, DateValueProps } from 'src/services/workout/types';

export const getDates = (prevD: number) => {
  const today = new Date();
  const lastWeek = new Date(today.setDate(today.getDate() - prevD));
  lastWeek.setHours(0);
  lastWeek.setMinutes(0);
  lastWeek.setSeconds(0);

  return {
    startDate: lastWeek,
    endDate: new Date(),
  };
};

export const useHealthSamples = () => {
  const [hrvs, setHrvs] = useState<HealthEvalProps>(emptyEval);
  const [sleeps, setSleeps] = useState<HealthEvalProps>(emptyEval);
  const [rrs, setRrs] = useState<HealthEvalProps>(emptyEval);
  const [rhrs, setRhrs] = useState<HealthEvalProps>(emptyEval);

  const evalHrvSamples = async () => {
    const { startDate, endDate } = getDates(6);
    try {
      const samples = await getHRSamples(startDate, endDate);
      //need to calc heart rate variability when asleep
      const uniq = uniqBy(samples, s => {
        return new Date(s.endDate).getDate();
      });
      const map: DateValueProps[] = uniq.map(r => ({
        value: r.value * 1000,
        date: new Date(r.endDate),
      }));
      setHrvs({
        data: map,
        eval: hrvDesc,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fillInGapDates = (
    sleepData: DateValueProps[],
    start: Date,
    end: Date,
  ) => {
    const dateSet = new Set(
      sleepData.map(data => data.date.toISOString().split('T')[0]),
    );
    const filledDates = [];
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0];
      if (!dateSet.has(dateStr)) {
        filledDates.push({ value: 0, date: new Date(date) });
      }
    }
    return sleepData
      .concat(filledDates)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const evalSleepSamples = async () => {
    const { startDate, endDate } = getDates(7);
    try {
      const sleepStore = await getSleepDailyAmts(startDate, endDate);
      setSleeps({
        data:
          sleepStore.length > 0
            ? fillInGapDates(sleepStore, startDate, endDate)
            : [],
        eval: sleepDesc,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const evalRRSamples = async () => {
    const { startDate, endDate } = getDates(6);
    try {
      const samples = await getRRSamples(startDate, endDate);
      const uniq = uniqBy(samples, s => {
        return new Date(s.endDate).getDate();
      });
      const map: DateValueProps[] = uniq.map(r => ({
        value: r.value,
        date: new Date(r.endDate),
      }));
      setRrs({
        data: map,
        eval: rrDesc,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const evalRhrSamples = async () => {
    const { startDate, endDate } = getDates(6);
    try {
      const samples = await getRestingHeartRateSamples(startDate, endDate);
      const uniq = uniqBy(samples, s => {
        return new Date(s.endDate).getDate();
      });
      const map: DateValueProps[] = uniq.map(r => ({
        value: r.value,
        date: new Date(r.endDate),
      }));
      setRhrs({
        data: map,
        eval: rrDesc,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    evalHrvSamples();
    evalRRSamples();
    evalSleepSamples();
    evalRhrSamples();
  }, []);

  const averageProps = useMemo(() => {
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
      sleepAvg: getAverage(sleeps, 2),
      hrvAvg: getAverage(hrvs),
      rrAvg: getAverage(rrs),
      rhrAvg: getAverage(rhrs),
    };
  }, [hrvs, rhrs, rrs, sleeps]);

  const todayProps = useMemo(() => {
    const today = new Date();
    const getTodayResult = (value: HealthEvalProps) => {
      const result = value.data.find(
        d => DateTools.compareTwoDates(d.date, today) === 'same',
      );
      return result?.value ?? 0;
    };
    return {
      sleepToday: getTodayResult(sleeps),
      hrvToday: getTodayResult(hrvs),
      rrToday: getTodayResult(rrs),
      rhrToday: getTodayResult(rhrs),
    };
  }, [hrvs, rhrs, rrs, sleeps]);

  return { hrvs, sleeps, rrs, rhrs, ...averageProps, ...todayProps };
};

const emptyEval = {
  data: [],
  eval: '',
};
