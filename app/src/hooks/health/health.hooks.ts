import uniqBy from 'lodash/uniqBy';
import { useState, useEffect } from 'react';
import { convertMsToTime } from 'src/components/workout/overview/helpers/format';
import { hrvDesc, sleepDesc, rrDesc } from 'src/content/health';
import {
  getHRSamples,
  getSleepSamples,
  SleepValueProps,
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

  const evalSleepSamples = async () => {
    const { startDate, endDate } = getDates(7);
    try {
      const sleepStore = await getSleepDailyAmts(startDate, endDate);
      setSleeps({
        data: sleepStore.reverse(),
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

  return { hrvs, sleeps, rrs, rhrs };
};

const emptyEval = {
  data: [],
  eval: '',
};
