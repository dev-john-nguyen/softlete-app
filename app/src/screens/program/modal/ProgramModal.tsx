import React from 'react';
import { ReducerProps } from '../../../services';
import { connect } from 'react-redux';
import { removeProgram } from '../../../services/program/actions';
import {
  ProgramActionProps,
  ProgramProps,
} from '../../../services/program/types';
import { ProgramStackScreens } from '../types';
import MenuModal from 'src/screens/modals/MenuModal';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';

interface Props {
  navigation: any;
  program: ProgramProps;
  removeProgram: ProgramActionProps['removeProgram'];
}

const ProgramModal = ({ navigation, program, removeProgram }: Props) => {
  const setBanner = useBanner();

  const onDelete = () => {
    removeProgram(program._id).catch(err => {
      console.error(err);
      setBanner(
        'Oops! Something went wrong. Unable to remove program.',
        BannerTypes.error,
      );
    });
    navigation.navigate(ProgramStackScreens.TemplateList);
  };

  // disabling for now
  const onAccess = () => navigation.navigate(ProgramStackScreens.ProgramAccess);

  return (
    <MenuModal
      title="Menu"
      menuItems={[
        {
          text: 'Edit',
          icon: 'pencil',
          onPress: () =>
            navigation.navigate(ProgramStackScreens.ProgramHeader, {
              edit: true,
            }),
        },
        {
          text: 'Tips/Help',
          icon: 'info',
          onPress: () => navigation.navigate(ProgramStackScreens.ProgramHelp),
        },
        {
          text: 'Remove',
          icon: 'trash_bin',
          onPress: onDelete,
        },
      ]}
    />
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  program: state.program.targetProgram,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    removeProgram: (programUid: string) => dispatch(removeProgram(programUid)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgramModal);
