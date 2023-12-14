import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import {
  ProgramActionProps,
  ProgramHeaderProps,
  ProgramProps,
} from '../../services/program/types';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import { normalize } from '../../utils/tools';
import {
  fetchPrograms,
  setTargetProgram,
} from '../../services/program/actions';
import { ProgramStackScreens } from './types';
import ScreenTemplate from '../../components/elements/screen-template';
import { useTemplates } from '../../hooks/program/templates.hooks';
import { CircleAdd, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
  dispatch: AppDispatch;
  fetchPrograms: ProgramActionProps['fetchPrograms'];
}

const TemplateList = ({ dispatch, navigation, fetchPrograms }: Props) => {
  const { programs } = useTemplates({
    fetchPrograms,
  });

  const onAddPress = () =>
    navigation.navigate(ProgramStackScreens.ProgramHeader, {
      headerTitle: 'New Program',
    });

  const renderItem = useCallback(
    ({ item: program }: { item: ProgramProps }) => {
      const onNavToProgram = (
        program: ProgramHeaderProps,
        softlete?: boolean,
      ) => {
        dispatch(setTargetProgram(program, false, softlete));
        navigation.navigate(ProgramStackScreens.Program, { softlete });
      };
      return (
        <FlexBox
          margin={10}
          column
          onPress={() => onNavToProgram(program)}
          key={program._id}>
          <ProgramHeaderImage
            uri={program.imageUri}
            onPress={() => onNavToProgram(program)}
            container={styles.image}
          />
          <PrimaryText
            variant="primary"
            size="medium"
            textTransform="capitalize"
            numberOfLines={2}
            bold
            marginTop={5}>
            {program.name}
          </PrimaryText>
          <PrimaryText numberOfLines={4}>{program.description}</PrimaryText>
        </FlexBox>
      );
    },
    [dispatch, navigation],
  );

  return (
    <ScreenTemplate applyContentPadding headerTitleFormatted="Programs">
      <FlatList
        data={programs}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
        renderItem={renderItem}
      />
      <CircleAdd onPress={onAddPress} style={{ bottom: 20 }} />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  image: {
    height: normalize.height(6),
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchPrograms: async () => dispatch(fetchPrograms()),
  dispatch,
});

export default connect(null, mapDispatchToProps)(TemplateList);
