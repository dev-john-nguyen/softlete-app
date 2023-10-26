import { Alert } from 'react-native';

const adminEditExPrompts = {
  create: {
    title: 'Do you want to create this exercise as an admin exercise?',
    body: 'If you press Yes, then this exercise will be saved as an Admin exercise and all users can access it. The measurements will be saved as defaults as well.',
  },
  update: {
    title: 'Do you want to update this exercise as an admin exercise?',
    body: 'If you press Yes, then the new properties will be updated besides the measurements.',
  },
};

export const confirmAdminExerciseHandler = async (
  prompt: keyof typeof adminEditExPrompts,
): Promise<boolean> => {
  const { title, body } = adminEditExPrompts[prompt];
  return new Promise(resolve => {
    Alert.alert(title, body, [
      {
        text: 'No',
        onPress: () => resolve(false),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => resolve(true) },
    ]);
  });
};
