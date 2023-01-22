import React, { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import PATHS, { SERVERURL } from '../../utils/PATHS';
import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { FlexBox } from '@app/ui';

interface Props {}

const BugReport = ({}: Props) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const sendBugReport = async () => {
    if (loading) return;
    if (!description || !type)
      return Alert.alert('Description and type are required.');
    setLoading(true);
    try {
      await axios.post(SERVERURL + PATHS.bug.create, { type, description });
      Alert.alert('Bug Reported!');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <ScreenTemplate headerPadding>
      <FlexBox flexDirection="column" padding={20} paddingTop={5}>
        <PrimaryText fontSize={20}>Bug Report Form</PrimaryText>

        <Input
          label="Location"
          placeholder="Where did it occur?"
          onChangeText={txt => setType(txt)}
          multiline
          maxLength={100}
          value={type}
          mt={20}
          mb={20}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={txt => setDescription(txt)}
          placeholder="Please give a detail explanation of the issue you found."
          multiline
          maxLength={500}
          mb={20}
        />

        <PrimaryButton loading={loading} onPress={sendBugReport}>
          Send
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default BugReport;
