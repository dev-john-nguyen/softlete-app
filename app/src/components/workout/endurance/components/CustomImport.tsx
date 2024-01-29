import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import HealthForm from '../../overview/HealthForm';
import { HealthDataProps } from 'src/services/workout/types';
import { PrimaryText } from '@app/elements';

type Props = {
  onClose: () => void;
  onImportHealthData: (data: HealthDataProps) => Promise<void>;
  healthData?: HealthDataProps;
};

const CustomImport: FC<Props> = ({
  onClose,
  onImportHealthData,
  healthData,
}) => {
  const onSubmitHandler = async (data: HealthDataProps) => {
    onImportHealthData(data);
  };

  return (
    <FlexBox flex={1} column>
      <PrimaryText marginBottom={10}>Customize Your Activity</PrimaryText>
      <HealthForm
        onSubmit={onSubmitHandler}
        activityName=""
        onClose={onClose}
        healthData={healthData}
      />
    </FlexBox>
  );
};

export default CustomImport;
