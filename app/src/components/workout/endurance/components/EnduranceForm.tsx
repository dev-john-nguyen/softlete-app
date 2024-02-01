import React, { useState } from 'react';
import { InfoListBox, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import CustomImport from './CustomImport';
import ImportDeviceActivities from './ImportDeviceActivities';
import { HealthDataProps, HealthDisMeas } from 'src/services/workout/types';
import { useWorkoutState } from '@app/contexts';
import isEqual from 'lodash/isEqual';
import useBanner from 'src/hooks/utils/useBanner';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

enum ActivityImportOptions {
  Custom,
  Device,
}

type Props = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const EnduranceForm: React.FC<Props> = ({ setEdit }) => {
  const { workout, updateWoHealthData, isProgram } = useWorkoutState();
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
          setBanner('Your data has successfully saved!');
        })
        .catch(err => {
          setBanner('Oops! Something went wrong. Please try again.');
          console.log(err);
        });
      setEdit(false);
    }
  };

  if (importValue === ActivityImportOptions.Custom) {
    return (
      <CustomImport
        onClose={() => setImportValue(undefined)}
        onImportHealthData={onImportHealthData}
        healthData={workout.healthData}
      />
    );
  }

  if (importValue === ActivityImportOptions.Device) {
    return <ImportDeviceActivities onImportHealthData={onImportHealthData} />;
  }

  return (
    <FlexBox column flex={1}>
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
        {!isProgram && (
          <InfoListBox
            opacity={isProgram ? 0.5 : 1}
            onPress={() => setImportValue(ActivityImportOptions.Device)}
            label="Import"
            icon="download"
            desc="Device Import"
            secondary
          />
        )}
      </FlexBox>

      <FlexBox flex={1} alignItems="center" justifyContent="center">
        <PrimaryText variant="primary" fontSize={50} opacity={1}>
          Train
        </PrimaryText>
        <Icon
          icon="cardio"
          size={120}
          color={Colors.white}
          containerStyles={{ opacity: 0.1, position: 'absolute' }}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default EnduranceForm;
