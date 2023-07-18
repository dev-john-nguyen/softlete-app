import React, { useCallback, useMemo } from 'react';
import { ReducerProps } from '../../../services';
import { connect, useSelector } from 'react-redux';
import { removeProgram } from '../../../services/program/actions';
import {
  ProgramActionProps,
  ProgramProps,
} from '../../../services/program/types';
import { ProgramStackScreens } from '../types';
import MenuModal, { MenuItemProps } from 'src/screens/modals/MenuModal';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { Alert } from 'react-native';

interface Props {
  navigation: any;
  program: ProgramProps;
  removeProgram: ProgramActionProps['removeProgram'];
}

const ProgramModal = ({ navigation, program, removeProgram }: Props) => {
  const setBanner = useBanner();
  const user = useSelector((state: ReducerProps) => state.user);

  const onDelete = useCallback(() => {
    const deleteHandler = () => {
      removeProgram(program._id).catch(err => {
        console.error(err);
        setBanner(
          'Oops! Something went wrong. Unable to remove program.',
          BannerTypes.error,
        );
      });
      navigation.navigate(ProgramStackScreens.TemplateList);
    };
    Alert.alert(
      'Confirmation',
      "Are you sure you want to delete this program? You can't undo this action.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: deleteHandler },
      ],
    );
  }, [navigation, program._id, removeProgram, setBanner]);

  // disabling for now
  // const onAccess = () => navigation.navigate(ProgramStackScreens.ProgramAccess);

  const menuItems = useMemo(() => {
    const options: MenuItemProps[] = [
      {
        text: 'Tips/Help',
        icon: 'info',
        onPress: () => navigation.navigate(ProgramStackScreens.ProgramHelp),
      },
    ];
    const isAdmin = program._id === user.uid;
    if (!isAdmin) {
      options.unshift(
        {
          text: 'Edit',
          icon: 'pencil',
          onPress: () =>
            navigation.navigate(ProgramStackScreens.ProgramHeader, {
              edit: true,
            }),
        },
        {
          text: 'Remove',
          icon: 'trash_bin',
          onPress: onDelete,
        },
      );
    }
    return options;
  }, [navigation, onDelete, program._id, user.uid]);

  return <MenuModal title="Menu" menuItems={menuItems} />;
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
