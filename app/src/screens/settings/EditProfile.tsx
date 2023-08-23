import React, { useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { FlexBox } from '@app/ui';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../services/user/actions';
import { ReducerProps } from '../../services';
import { ImageProps } from '../../services/user/types';
import Switch from '../../components/elements/Switch';
import UploadProfileImg from '../../components/UploadProfileImg';
import BaseColors from '../../utils/BaseColors';
import {
  Input,
  ScreenTemplate,
  PickerButton,
  PrimaryText,
} from '@app/elements';
import { setBanner } from 'src/services/banner/actions';
import { BannerTypes } from 'src/services/banner/types';
import { capitalize, Colors } from '@app/utils';
import Icon from '@app/icons';

enum AthleteTypes {
  athlete = 'athlete',
  trainer = 'trainer',
}

const EditProfile = () => {
  const user = useSelector((state: ReducerProps) => state.user);
  const dispatch: any = useDispatch();
  const [name, setName] = useState(user.name);
  const [athlete, setAthlete] = useState(user.athlete);
  const [bio, setBio] = useState(user.bio);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<ImageProps>({
    uri: '',
    base64: '',
  });
  const [picker, setPicker] = useState(false);

  const propsAreUpdated = () => {
    if (
      name === user.name &&
      athlete === user.athlete &&
      bio === user.bio &&
      isPrivate === user.isPrivate &&
      !selectedImg.base64
    )
      return false;

    return true;
  };

  const onSave = () => {
    if (loading) return;

    if (!propsAreUpdated()) {
      return dispatch(setBanner(BannerTypes.default, 'No updates found.'));
    }

    setLoading(true);
    dispatch(
      updateProfile(
        { name, athlete, bio, isPrivate },
        selectedImg.base64 as string,
        (status: string) => {
          dispatch(setBanner(BannerTypes.default, status));
        },
      ),
    )
      .then(() => setLoading(false))
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  const pickerOptions = useMemo(() => {
    return Object.values(AthleteTypes).map(item => ({
      label: capitalize(item),
      value: item,
    }));
  }, [athlete]);

  return (
    <ScreenTemplate
      pickerOptions={pickerOptions}
      pickerValue={athlete}
      isPickerOpen={picker}
      onPickerClose={() => setPicker(false)}
      onPickerChangeValue={value => setAthlete(value)}
      headerTitleFormatted="Edit Profile"
      rightContent={
        <FlexBox alignItems="center" flex={1} justifyContent="flex-end">
          {loading ? (
            <ActivityIndicator size="small" color={BaseColors.black} />
          ) : (
            <Icon icon="save" size={20} color={Colors.white} onPress={onSave} />
          )}
        </FlexBox>
      }
      isBackVisible
      applyContentPadding>
      <FlexBox flexDirection="column" flex={1}>
        <Input
          label="Name:"
          onChangeText={txt => setName(txt)}
          mb={10}
          defaultValue={capitalize(name)}
          autoCapitalize="words"
        />

        <PickerButton
          label="Athlete Type:"
          onPress={() => setPicker(true)}
          borderBottom>
          {capitalize(athlete)}
        </PickerButton>

        <Input
          label="Bio:"
          onChangeText={txt => setBio(txt)}
          maxLength={300}
          placeholder="Give a brief description of who you are."
          defaultValue={bio}
          multiline
        />

        <FlexBox marginTop={15} alignItems="center">
          <Switch
            onSwitch={() => setIsPrivate(p => (p ? false : true))}
            active={isPrivate}
          />
          <PrimaryText marginLeft={5}>
            {isPrivate ? 'Private' : 'Public'}
          </PrimaryText>
        </FlexBox>

        <FlexBox alignItems="center" justifyContent="center" marginTop={15}>
          <UploadProfileImg
            onImageUpload={setSelectedImg}
            uri={selectedImg.uri ? selectedImg.uri : user.imageUri}
          />
        </FlexBox>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default EditProfile;
