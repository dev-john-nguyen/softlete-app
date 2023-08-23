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

const BugReport = () => {
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
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      headerTitleFormatted="Bug Report">
      <PrimaryText>
        Are you having issues? Please fill out the form to let us know.
      </PrimaryText>
      <Input
        label="Location"
        placeholder="Where did it occur?"
        onChangeText={txt => setType(txt)}
        multiline
        maxLength={100}
        value={type}
        mb={10}
        mt={10}
      />

      <Input
        label="Description"
        value={description}
        onChangeText={txt => setDescription(txt)}
        placeholder="Please give a detail explanation of the issue you found."
        multiline
        maxLength={500}
      />

      <PrimaryButton loading={loading} onPress={sendBugReport} marginTop={20}>
        Send
      </PrimaryButton>
    </ScreenTemplate>
  );
};

export default BugReport;
