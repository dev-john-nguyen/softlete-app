import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import { Colors, rgba, StyleConstants } from '@app/utils';
import { StyleSheet, Pressable, View } from 'react-native';
import {
  GeneratedProgramProps,
  ProgramActionProps,
} from '../../services/program/types';
import { FlatList } from 'react-native-gesture-handler';
import DateTools from '../../utils/DateTools';
import { connect, useSelector } from 'react-redux';
import { ReducerProps } from '../../services';
import { removeGeneratedProgram } from '../../services/program/actions';
import { AppDispatch } from '../../../App';
import { SET_FILTER_BY_PROGRAM } from '../../services/workout/actionTypes';
import { normalize } from '../../utils/tools';
import TrashSvg from '../../assets/TrashSvg';

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
  const [deleteItem, setDeleteItem] = useState('');
  const timeout: any = useRef();

  useEffect(() => {
    if (athlete) return;
    if (deleteItem) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(async () => {
        await removeGeneratedProgram(deleteItem);
        setDeleteItem('');
      }, 2000);
    } else {
      clearTimeout(timeout.current);
    }
  }, [deleteItem]);

  const renderItemText = (item: GeneratedProgramProps) => {
    //get state
    const dObj = DateTools.UTCISOToLocalDate(item.startDate);
    if (!dObj) return item.name;
    const dStr = DateTools.dateToStr(dObj);
    const monthDayStr = DateTools.strToMMDD(dStr);

    return item.name;
  };

  const onProgramSelect = (programUid: string) =>
    !athlete && dispatch({ type: SET_FILTER_BY_PROGRAM, payload: programUid });

  const onPressIn = (id: string) => {
    if (athlete) return;
    //set timer
    if (selectedProgram === id) {
      setDeleteItem(id);
    }
  };

  const onPressOut = () => {
    //end
    if (athlete) return;
    setDeleteItem('');
  };

  const renderListHeaderComponent = useCallback(
    () => (
      <Pressable
        onPress={() => onProgramSelect('')}
        style={({ pressed }) => [
          styles.itemContainer,
          {
            backgroundColor: pressed
              ? rgba(Colors.primary, 0.5)
              : !selectedProgram
              ? Colors.lightPrimary
              : Colors.lightPrimary,
          },
        ]}>
        <PrimaryText
          size="small"
          color={!selectedProgram ? Colors.white : Colors.secondary}
          numberOfLines={1}
          fontSize={10}>
          All
        </PrimaryText>
      </Pressable>
    ),
    [selectedProgram],
  );

  const renderItem = useCallback(
    ({ item }: { item: GeneratedProgramProps }) => {
      return (
        <Pressable
          onPressIn={() => onPressIn(item._id)}
          onPressOut={onPressOut}
          onPress={() => onProgramSelect(item._id)}
          style={({ pressed }) => [
            styles.itemContainer,
            {
              borderColor: pressed
                ? rgba(Colors.primaryRgb, 1)
                : selectedProgram === item._id
                ? rgba(Colors.primaryRgb, 0.8)
                : rgba(Colors.primaryRgb, 0.2),
            },
          ]}>
          <PrimaryText
            size="small"
            color={
              selectedProgram === item._id ? Colors.white : Colors.secondary
            }
            numberOfLines={1}>
            {renderItemText(item)}
          </PrimaryText>
          {deleteItem === item._id && (
            <View
              style={{
                position: 'absolute',
                left: '-5%',
                alignSelf: 'center',
                height: normalize.width(20),
                width: normalize.width(20),
              }}>
              <TrashSvg fillColor={Colors.primary} />
            </View>
          )}
        </Pressable>
      );
    },
    [programs, selectedProgram, deleteItem],
  );

  return (
    <FlexBox
      width="100%"
      borderColor={rgba(Colors.whiteRbg, 0.2)}
      padding={5}
      borderWidth={1}
      borderRadius={100}
      marginTop={5}
      marginBottom={10}>
      <FlatList
        data={athlete ? [] : programs}
        horizontal={true}
        style={{ flexGrow: 1 }}
        ListHeaderComponent={renderListHeaderComponent}
        contentContainerStyle={{ alignItems: 'flex-start' }}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
      />
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    marginRight: StyleConstants.smallMargin,
    borderRadius: 100,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  removeGeneratedProgram: async (programUid: string) =>
    dispatch(removeGeneratedProgram(programUid)),
  dispatch,
});

export default connect(null, mapDispatchToProps)(DashboardFilter);
