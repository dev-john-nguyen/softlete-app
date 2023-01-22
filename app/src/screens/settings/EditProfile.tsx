import React, { useCallback, useState } from 'react';
import { StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { FlexBox } from '@app/ui';
import { useDispatch, useSelector } from 'react-redux';
import SecondaryText from '../../components/elements/SecondaryText';
import { updateProfile } from '../../services/user/actions';
import { ReducerProps } from '../../services';
import { ImageProps } from '../../services/user/types';
import Switch from '../../components/elements/Switch';
import UploadProfileImg from '../../components/UploadProfileImg';
import StyleConstants, {
  moderateScale,
} from '../../components/tools/StyleConstants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import CustomPicker from '../../components/elements/Picker';
import { Picker } from '@react-native-picker/picker';
import SaveSvg from '../../assets/SaveSvg';
import {
  Input,
  ScreenTemplate,
  PrimaryText,
  PickerButton,
} from '@app/elements';
import { setBanner } from 'src/services/banner/actions';
import { BannerTypes } from 'src/services/banner/types';
import { capitalize, Colors } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  navigation: any;
  route: any;
}

enum AthleteTypes {
  athlete = 'athlete',
  trainer = 'trainer',
}

const EditProfile = ({}: Props) => {
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

  const renderPickerItems = useCallback(() => {
    return Object.values(AthleteTypes).map(item => (
      <Picker.Item label={capitalize(item)} value={item} key={item} />
    ));
  }, [athlete]);

  return (
    <ScreenTemplate
      middleContent={
        <FlexBox justifyContent="center">
          <PrimaryText fontSize={20}>Edit Profile</PrimaryText>
        </FlexBox>
      }
      rightContent={
        <FlexBox alignItems="center">
          {loading ? (
            <ActivityIndicator size="small" color={BaseColors.black} />
          ) : (
            <Icon icon="save" size={25} color={Colors.white} onPress={onSave} />
          )}
        </FlexBox>
      }
      isBackVisible
      applyContentPadding>
      <FlexBox flexDirection="column" flex={1}>
        <UploadProfileImg
          onImageUpload={setSelectedImg}
          uri={selectedImg.uri ? selectedImg.uri : user.imageUri}
        />

        <Input
          label="Name:"
          onChangeText={txt => setName(txt)}
          mb={20}
          defaultValue={capitalize(name)}
          autoCapitalize="words"
          mt={20}
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
          mt={10}
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
          <SecondaryText styles={[styles.label, { marginLeft: 10 }]}>
            {isPrivate ? 'Private' : 'Public'}
          </SecondaryText>
        </FlexBox>
      </FlexBox>

      <CustomPicker
        open={picker}
        setOpen={() => setPicker(false)}
        value={athlete}
        pickerItems={renderPickerItems()}
        setValue={txt => setAthlete(txt)}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  valueContainer: {
    padding: 10,
    borderBottomColor: rgba(BaseColors.whiteRbg, 0.2),
    borderBottomWidth: 1,
    flex: 1,
  },
  label: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightWhite,
    opacity: 0.5,
    marginRight: StyleConstants.smallMargin,
  },
  value: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightWhite,
    marginRight: StyleConstants.smallMargin,
  },
  save: {
    width: moderateScale(25),
    height: moderateScale(25),
  },
});

export default EditProfile;
