import React, { FC, useCallback, useMemo, useState } from 'react';
import { ListRenderItemInfo, ActivityIndicator } from 'react-native';
import { Colors } from '@app/utils';
import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import DeviceWo from '../../components/home/components/DeviceWo';
import { ReducerProps } from '../../services';
import {
  HealthDataProps,
  WorkoutActionProps,
  WorkoutProps,
} from '../../services/workout/types';
import { useDeviceWos } from '../../hooks/workout/activities.hooks';
import {
  updateWorkoutHeader,
  updateWoWorkoutRoute,
  updateWoHealthData,
} from '../../services/workout/actions';
import { setBanner } from '../../services/banner/actions';
import { BannerActionsProps, BannerTypes } from '../../services/banner/types';
import { handleDeviceActivityImport } from '../../helpers/route.helpers';
import { FlexBox } from '@app/ui';

interface Props {
  wos: WorkoutProps[];
  updateWorkoutHeader: WorkoutActionProps['updateWorkoutHeader'];
  updateWoWorkoutRoute: WorkoutActionProps['updateWoWorkoutRoute'];
  updateWoHealthData: WorkoutActionProps['updateWoHealthData'];
  setBanner: BannerActionsProps['setBanner'];
}

const DeviceActivities: FC<Props> = ({
  wos,
  updateWorkoutHeader,
  updateWoWorkoutRoute,
  updateWoHealthData,
  setBanner,
}) => {
  const { isFetching, deviceWos, setFetchStartDate, stopFetching } =
    useDeviceWos();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const onImportDeviceWo = (activity: HealthDataProps) => {
    return async () => {
      setLoadingIds(ids => [...ids, activity.activityId]);
      try {
        await handleDeviceActivityImport(activity, {
          updateWoHealthData,
          updateWoWorkoutRoute,
          updateWorkoutHeader,
        });
      } catch (err) {
        setBanner(BannerTypes.error, err as string);
      }
      setLoadingIds(ids => ids.filter(id => id !== activity.activityId));
    };
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HealthDataProps>) => {
      return (
        <DeviceWo
          data={item}
          onDownload={onImportDeviceWo(item)}
          wos={wos}
          loadingIds={loadingIds}
          showDate
        />
      );
    },
    [deviceWos, wos, loadingIds],
  );

  const renderListEmptyComponent = useMemo(() => {
    if (!isFetching)
      return (
        <FlexBox justifyContent="center" alignItems="center" column>
          <PrimaryText>No Activities To Import</PrimaryText>
        </FlexBox>
      );

    return <></>;
  }, [isFetching]);

  const ListFooterComponent = useCallback(() => {
    if (isFetching) {
      return (
        <FlexBox
          width="100%"
          padding={15}
          alignItems="center"
          justifyContent="center">
          <ActivityIndicator size="small" color={Colors.white} />
        </FlexBox>
      );
    }
    return <></>;
  }, [isFetching]);

  const onEndReached = () => {
    // push start date back
    if (isFetching || stopFetching) return;
    setFetchStartDate(activeDate => {
      activeDate.setDate(activeDate.getDate() - 30);
      return new Date(activeDate);
    });
  };

  const keyExtractor = (item: HealthDataProps, index: number) =>
    item.activityId ? item.activityId : index.toString();

  return (
    <ScreenTemplate
      middleContent={<PrimaryText size="large">Device Activities</PrimaryText>}
      rotateBack="-90deg"
      isBackVisible
      applyContentPadding>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={deviceWos}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0}
        onEndReached={onEndReached}
      />
    </ScreenTemplate>
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  wos: state.workout.workouts,
});

export default connect(mapStateToProps, {
  updateWorkoutHeader,
  updateWoWorkoutRoute,
  setBanner,
  updateWoHealthData,
})(DeviceActivities);
