import React, { useState } from 'react';
import { InfoListBox, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import CustomImport from './CustomImport';
import ImportDeviceActivities from './ImportDeviceActivities';
import { HealthDataProps, HealthDisMeas } from 'src/services/workout/types';
import { useWorkoutState } from '@app/contexts';
import isEqual from 'lodash/isEqual';
import useBanner from 'src/hooks/utils/useBanner';

enum ActivityImportOptions {
  Custom,
  Device,
}

const EnduranceForm = () => {
  const { workout, updateWoHealthData } = useWorkoutState();
  const [importValue, setImportValue] = useState<ActivityImportOptions>();
  const setBanner = useBanner();

  const onImportHealthData = async (data: HealthDataProps) => {
    //check if there is a difference
    if (workout.healthData) {
      const { healthData: woHltDta } = workout;
      if (
        data.activityName === woHltDta.activityName &&
        data.sourceName === woHltDta.sourceName &&
        data.distance === woHltDta.distance &&
        data.calories === woHltDta.calories &&
        data.duration === woHltDta.duration &&
        data.disMeas === woHltDta.disMeas &&
        isEqual(data.heartRates, woHltDta.heartRates)
      ) {
        return;
      }
    }

    // does this handle program differently
    const updatedHealthData: HealthDataProps = {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      heartRates: data.heartRates,
      disMeas: HealthDisMeas.mi,
      activityId: data.activityId,
      date: workout.date as string, // date will not exists for program
    };

    if (updateWoHealthData) {
      await updateWoHealthData(workout._id, updatedHealthData)
        .then(() => {
          setBanner('Data successfully imported!');
        })
        .catch(err => {
          setBanner('Oops! Something went wrong. Please try again.');
          console.log(err);
        });
    }
  };

  if (importValue === ActivityImportOptions.Custom) {
    return (
      <CustomImport
        onClose={() => setImportValue(undefined)}
        onImportHealthData={onImportHealthData}
      />
    );
  }

  if (importValue === ActivityImportOptions.Device) {
    return <ImportDeviceActivities onImportHealthData={onImportHealthData} />;
  }

  return (
    <FlexBox column>
      <PrimaryText marginBottom={10}>
        How do you want to customize your activity?
      </PrimaryText>
      <FlexBox width="100%">
        <InfoListBox
          onPress={() => setImportValue(ActivityImportOptions.Custom)}
          label="Custom"
          icon="pencil"
          desc="Customize Activity"
          secondary
        />
        <InfoListBox
          onPress={() => setImportValue(ActivityImportOptions.Device)}
          label="Import"
          icon="download"
          desc="Device Import"
          secondary
        />
      </FlexBox>
    </FlexBox>
  );
};

export default EnduranceForm;
