import React from 'react';
import {
  INIT_DEMO_STATE_DATA,
  SET_NEW_USER_STATE,
} from '../../services/global/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { PrimaryButton, PrimaryText, ScreenTemplate } from '@app/elements';
import { Colors } from '@app/utils';
import Icon from '@app/icons';
import auth from '@react-native-firebase/auth';
import { DemoStates, setDemoState } from '@app/services';

const NewUserAdvise = () => {
  const dispatch = useDispatch();
  const user = useSelector<ReducerProps, ReducerProps['user']>(
    state => state.user,
  );

  const onContinue = () => {
    const currentUser = auth().currentUser;
    dispatch({ type: INIT_DEMO_STATE_DATA, payload: currentUser?.uid });
    dispatch(setDemoState(DemoStates.INIT));
    dispatch({ type: SET_NEW_USER_STATE, payload: false });
  };

  return (
    <ScreenTemplate applyContentPadding>
      <PrimaryText
        variant="primary"
        fontSize={30}
        bold
        textTransform="capitalize"
        marginBottom={10}>
        Welcome {user.name ? user.name : user.username}!
      </PrimaryText>

      <PrimaryText bold>Help/Tips</PrimaryText>
      <PrimaryText marginBottom={10}>
        {`If you get lost or have trouble understanding functionalities, look for the help/tips`}
        <Icon icon="info" size={15} color={Colors.white} />
        {` icon. You can find the help/tips icon in most menus throughout the app.`}
      </PrimaryText>

      <PrimaryText bold>Issues</PrimaryText>
      <PrimaryText marginBottom={10}>
        If you identify any issues please submit a bug report. They can be found
        under the settings of the app or our website.
      </PrimaryText>

      <PrimaryText bold>Feedback</PrimaryText>
      <PrimaryText marginBottom={10}>
        {`Please let us know how we are doing by visiting our website and feeling out the feedback form. We would love to hear from you :).`}
      </PrimaryText>

      <PrimaryText bold>Next</PrimaryText>
      <PrimaryText
        marginBottom={
          20
        }>{`We're going to start with a brief demo to help you become familiar with where most things are in the app.`}</PrimaryText>

      <PrimaryButton onPress={onContinue}>{`I'm ready`}</PrimaryButton>
    </ScreenTemplate>
  );
};

export default NewUserAdvise;
