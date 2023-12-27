import { useEffect, useMemo } from 'react';
import {
  ProgramHeaderProps,
  ProgramActionProps,
} from '../../services/program/types';
import request from '../../services/utils/request';
import PATHS from '../../utils/PATHS';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

interface Props {
  fetchPrograms: ProgramActionProps['fetchPrograms'];
}

export function useTemplates({ fetchPrograms }: Props) {
  const dispatch = useDispatch();
  const { programTemplates = [] } = useSelector((state: ReducerProps) => ({
    programTemplates: state.program.programs,
  }));
  const { data: softletePrograms = [], isFetching } = useQuery<
    ProgramHeaderProps[]
  >(['softlete-programs'], async () => {
    const { data } = await request<ProgramHeaderProps[]>(
      'GET',
      PATHS.programs.getSoftlete(),
      dispatch,
    );
    return data;
  });

  useEffect(() => {
    fetchPrograms().catch(err => console.log(err));
  }, [fetchPrograms]);

  const programs = useMemo(() => {
    return [...softletePrograms, ...programTemplates];
  }, [programTemplates, softletePrograms]);

  return { programs, isFetching };
}
