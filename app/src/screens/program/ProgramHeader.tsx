import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { updateProgramHeader } from '../../services/program/actions';
import PrimaryButton from '../../components/elements/PrimaryButton';
import {
  ProgramActionProps,
  NewProgramProps,
} from '../../services/program/types';
import { ReducerProps } from '../../services';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import { ImageProps } from '../../services/user/types';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { Input, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { RouteProp } from '@react-navigation/native';

interface Props {
  updateProgramHeader: ProgramActionProps['updateProgramHeader'];
  navigation: any;
  route: RouteProp<any>;
}

const imageOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 1,
  selectionLimit: 1,
  includeBase64: true,
};

const ProgramHeader = ({ updateProgramHeader, navigation, route }: Props) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImageProps>();
  const [isEdit, setIsEdit] = useState(false);
  const program = useSelector(
    (state: ReducerProps) => state.program.targetProgram,
  );
  const setBanner = useBanner();

  useEffect(() => {
    if (program && route.params && route.params.edit) {
      setName(program.name);
      setDescription(program.description);
      setIsPrivate(program.isPrivate);
      setId(program._id);
      setImage({
        uri: program.imageUri,
      });
      setIsEdit(true);
    } else {
      setName('');
      setDescription('');
      setIsPrivate(false);
      setId('');
      setImage(undefined);
      setIsEdit(false);
    }
  }, [program, route]);

  useEffect(() => {
    if (route && route.params) {
      const { value, label } = route.params;
      switch (label) {
        case 'name':
          setName(value);
          break;
        case 'description':
          setDescription(value);
          break;
      }
    }
  }, [route]);

  const onCreateProgram = () => {
    if (loading) return;

    if (!name || !description) {
      return setBanner('Name and description are required.', BannerTypes.error);
    }

    setLoading(true);

    const programData: NewProgramProps = {
      name,
      description,
      isPrivate,
      accessCodes: [],
    };

    if (id) programData._id = id;

    updateProgramHeader(programData, image ? image.base64 : undefined)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const onSelectImage = async () => {
    if (!isEdit) return;
    launchImageLibrary(
      imageOptions,
      ({ errorCode, errorMessage, didCancel, assets }) => {
        if (didCancel) {
          //user canceled
          return;
        }
        if (errorCode) {
          console.log(errorMessage);
          return;
        }

        //get image base64 string
        if (!assets) {
          console.log('nothing selected');
          return;
        }

        const selected = assets[0];

        if (selected.base64 && selected.uri) {
          setImage({
            base64: selected.base64,
            uri: selected.uri,
          });
        }
        //try again
      },
    );
  };

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      headerTitleFormatted={route.params?.headerTitle ?? 'Edit Program'}>
      <Input
        defaultValue={name}
        label="Name:"
        onChangeText={text => setName(text)}
        styles={{ marginBottom: 10 }}
      />

      <Input
        defaultValue={description}
        label="Description:"
        onChangeText={text => setDescription(text)}
        styles={{ marginBottom: 10 }}
      />

      {isEdit && (
        <FlexBox height="40%" marginTop={10}>
          <ProgramHeaderImage
            uri={image && image.uri ? image.uri : ''}
            container={{ borderRadius: 0 }}
            onPress={onSelectImage}
          />
        </FlexBox>
      )}

      <PrimaryButton onPress={onCreateProgram} marginTop={20} loading={loading}>
        Save
      </PrimaryButton>
    </ScreenTemplate>
  );
};
export default connect(null, { updateProgramHeader })(ProgramHeader);
