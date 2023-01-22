import { PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { HealthDataProps, WorkoutProps } from '../../../services/workout/types';
import WoAerobic from './WoAerobic';

interface Props {
  data: HealthDataProps;
  onDownload?: () => void;
  onPress?: () => void;
  showDate?: boolean;
  wos: WorkoutProps[];
  loadingIds: string[];
}

const DeviceWo = ({
  data,
  onPress,
  showDate,
  wos,
  loadingIds,
  onDownload,
}: Props) => {
  const navigation = useNavigation<HomeStackParamsList>();
  const enableImport = (() => {
    const found = wos?.find(w => w.healthData?.activityId === data.activityId);
    return found ? false : true;
  })();

  const isLoading = loadingIds?.find(id => data.activityId === id)
    ? true
    : false;

  const onRedirectToView = (screen: HomeStackScreens) => () => {
    navigation.push(screen, { data });
  };

  return (
    <FlexBox marginBottom={10}>
      <FlexBox flex={1} column>
        <FlexBox
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={10}>
          <PrimaryText
            size="small"
            numberOfLines={1}
            marginRight={5}
            textTransform="capitalize">
            {data.activityName}
          </PrimaryText>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : enableImport ? (
            <Icon
              icon="download"
              size={20}
              color={Colors.white}
              onPress={onDownload}
              hitSlop={10}
            />
          ) : (
            <Icon icon="checked" size={20} color={Colors.green} />
          )}
        </FlexBox>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal
          contentContainerStyle={{ alignItems: 'stretch' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <WoAerobic
            healthData={data}
            onPress={onPress}
            color={Colors.lightWhite}
            showDate={showDate}
            onViewRoute={onRedirectToView(HomeStackScreens.Map)}
            onViewSummary={onRedirectToView(
              HomeStackScreens.WorkoutActivitySummary,
            )}
          />
        </ScrollView>
      </FlexBox>
    </FlexBox>
  );
};

export default DeviceWo;
