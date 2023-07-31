import React, { useCallback } from 'react';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import { Colors, rgba } from '@app/utils';
import { Alert } from 'react-native';
import {
  GeneratedProgramProps,
  ProgramActionProps,
} from '../../services/program/types';
import { FlatList } from 'react-native-gesture-handler';
import { connect, useSelector } from 'react-redux';
import { ReducerProps } from '../../services';
import { removeGeneratedProgram } from '../../services/program/actions';
import { AppDispatch } from '../../../App';
import { SET_FILTER_BY_PROGRAM } from '../../services/workout/actionTypes';
import Icon from '@app/icons';
import useBanner from 'src/hooks/utils/useBanner';

/*
 Will need to restyle this and update behavior
*/

interface Props {
  removeGeneratedProgram: ProgramActionProps['removeGeneratedProgram'];
  dispatch: AppDispatch;
  athlete?: boolean;
}

const DashboardFilter = ({
  removeGeneratedProgram,
  dispatch,
  athlete,
}: Props) => {
  const { programs, selectedProgram } = useSelector((state: ReducerProps) => ({
    programs: state.program.generatedPrograms,
    selectedProgram: state.workout.filterByProgramUid,
  }));
  const setBanner = useBanner();

  const onProgramSelect = useCallback(
    (programUid: string) =>
      !athlete &&
      dispatch({ type: SET_FILTER_BY_PROGRAM, payload: programUid }),
    [athlete, dispatch],
  );

  const onDeletePress = () => {
    if (!selectedProgram) {
      return setBanner('Please select a program to remove.');
    }

    const deleteHandler = async () => {
      await removeGeneratedProgram(selectedProgram);
    };

    Alert.alert(
      'Confirmation',
      "Are you sure you want to delete this program? You can't undo this action.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Confirm', onPress: deleteHandler },
      ],
    );
  };

  const renderListHeaderComponent = useCallback(
    () => (
      <FlexBox
        onPress={() => onProgramSelect('')}
        padding={5}
        paddingRight={10}
        paddingLeft={10}
        borderRadius={100}
        backgroundColor={
          !selectedProgram ? Colors.lightPrimary : Colors.lightPrimary
        }>
        <PrimaryText
          color={!selectedProgram ? Colors.white : rgba(Colors.whiteRbg, 0.5)}
          numberOfLines={1}
          size="small">
          All
        </PrimaryText>
      </FlexBox>
    ),
    [onProgramSelect, selectedProgram],
  );

  const renderItem = useCallback(
    ({ item }: { item: GeneratedProgramProps }) => {
      return (
        <FlexBox
          marginLeft={5}
          paddingRight={10}
          paddingLeft={10}
          onPress={() => onProgramSelect(item._id)}
          padding={5}
          borderRadius={100}
          backgroundColor={
            selectedProgram === item._id
              ? Colors.lightPrimary
              : Colors.lightPrimary
          }>
          <PrimaryText
            color={
              selectedProgram === item._id
                ? Colors.white
                : rgba(Colors.whiteRbg, 0.5)
            }
            numberOfLines={1}
            size="small"
            textTransform="capitalize">
            {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
          </PrimaryText>
        </FlexBox>
      );
    },
    [onProgramSelect, selectedProgram],
  );

  return (
    <FlexBox>
      <FlexBox
        flex={1}
        borderColor={rgba(Colors.whiteRbg, 0.2)}
        padding={5}
        borderWidth={1}
        borderRadius={100}
        marginTop={5}
        alignItem="center"
        marginBottom={10}>
        <FlatList
          data={athlete ? [] : programs}
          horizontal={true}
          style={{ flexGrow: 1 }}
          ListHeaderComponent={renderListHeaderComponent}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item._id ? item._id : index.toString()
          }
        />
      </FlexBox>
      <FlexBox flex={0.1} alignItems="center" justifyContent="flex-end">
        <Icon
          icon="trash_bin"
          size={20}
          color={selectedProgram ? Colors.white : rgba(Colors.whiteRbg, 0.5)}
          onPress={onDeletePress}
        />
      </FlexBox>
    </FlexBox>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  removeGeneratedProgram: async (programUid: string) =>
    dispatch(removeGeneratedProgram(programUid)),
  dispatch,
});

export default connect(null, mapDispatchToProps)(DashboardFilter);
