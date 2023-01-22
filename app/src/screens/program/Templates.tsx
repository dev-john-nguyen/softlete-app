import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, SectionList} from 'react-native';
import request from '../../services/utils/request';
import paths from '../../utils/PATHS';
import {connect} from 'react-redux';
import {AppDispatch} from '../../../App';
import {
  ProgramActionProps,
  ProgramHeaderProps,
  ProgramProps,
} from '../../services/program/types';
import StyleConstants from '../../components/tools/StyleConstants';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import SecondaryText from '../../components/elements/SecondaryText';
import BaseColors from '../../utils/BaseColors';
import {normalize} from '../../utils/tools';
import {fetchPrograms, setTargetProgram} from '../../services/program/actions';
import {ReducerProps} from '../../services';
import PlusSvg from '../../assets/PlusSvg';
import {ProgramStackScreens} from './types';
import {UserProps} from '../../services/user/types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import {SectionProps} from '../../types/program/program.types';
import {useTemplates} from '../../hooks/program/templates.hooks';

interface Props {
  navigation: any;
  route: any;
  dispatch: AppDispatch;
  programTemplates: ProgramProps[];
  user: UserProps;
  softleteUid: string;
  fetchPrograms: ProgramActionProps['fetchPrograms'];
}

const Templates = ({
  dispatch,
  navigation,
  programTemplates,
  route,
  user,
  softleteUid,
  fetchPrograms,
}: Props) => {
  const {programs} = useTemplates({
    dispatch,
    softleteUid,
    fetchPrograms,
    programTemplates,
  });

  const onNavToProgram = (program: ProgramHeaderProps, softlete?: boolean) => {
    dispatch(setTargetProgram(program, false, softlete));
    navigation.navigate(ProgramStackScreens.Program, {softlete});
  };

  const onAddPress = () =>
    navigation.navigate(ProgramStackScreens.ProgramHeader);

  const renderItem = useCallback(
    ({item: program, section}: {item: ProgramProps; section: SectionProps}) => {
      return (
        <Pressable
          style={styles.contentContainer}
          onPress={() => onNavToProgram(program)}
          key={program._id}>
          <ProgramHeaderImage
            uri={program.imageUri}
            onPress={() =>
              onNavToProgram(program, section.title === 'Softlete Templates')
            }
            container={styles.image}
          />
          <View style={styles.content}>
            <SecondaryText styles={styles.name} numberOfLines={2} bold>
              {program.name}
            </SecondaryText>
            <SecondaryText styles={styles.description} numberOfLines={4}>
              {program.description}
            </SecondaryText>
          </View>
        </Pressable>
      );
    },
    [programTemplates],
  );

  return (
    <ScreenTemplate headerPadding>
      <SectionList
        sections={programs}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
        contentContainerStyle={{paddingBottom: StyleConstants.baseMargin * 2}}
        renderItem={renderItem}
        initialNumToRender={20}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.titleContainer}>
            <SecondaryText styles={styles.title} bold>
              {title}
            </SecondaryText>
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
      {user.admin && (
        <Pressable style={styles.add} onPress={onAddPress} hitSlop={5}>
          <PlusSvg strokeColor={BaseColors.white} />
        </Pressable>
      )}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StyleConstants.baseMargin,
  },
  contentContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: StyleConstants.baseMargin,
    marginTop: StyleConstants.baseMargin,
    borderColor: BaseColors.lightGrey,
    paddingBottom: StyleConstants.baseMargin,
  },
  name: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightWhite,
    marginBottom: 5,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  description: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.lightWhite,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    marginTop: StyleConstants.baseMargin,
  },
  image: {
    height: normalize.height(6),
  },
  title: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.lightWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    margin: StyleConstants.baseMargin,
    borderBottomColor: BaseColors.lightGrey,
    borderBottomWidth: 1,
    opacity: 0.6,
  },
  add: {
    height: normalize.width(8),
    width: normalize.width(8),
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: BaseColors.primary,
    position: 'absolute',
    bottom: '5%',
    zIndex: 100,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  programTemplates: state.program.programs,
  user: state.user,
  softleteUid: state.global.softleteUid,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchPrograms: async () => dispatch(fetchPrograms()),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Templates);
