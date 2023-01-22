import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryText from '../../../components/elements/PrimaryText';
import { connect } from 'react-redux';
import { goOnline } from '../../../services/global/actions';
import StyleConstants from '../../../components/tools/StyleConstants';
import BaseColors from '../../../utils/BaseColors';
import { HomeStackScreens } from '../types';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { SERVERURL } from '../../../utils/PATHS';
import NetworkSvg from '../../../assets/NetworkSvg';
import { normalize } from '../../../utils/tools';
import BackButton from '../../../components/elements/BackButton';

interface Props {
  navigation: any;
  route: any;
  dispatch: React.Dispatch<any>;
  goOnline: (callBack: (msg: string) => void) => Promise<boolean>;
}

const GoOnlineModal = ({ navigation, route, dispatch, goOnline }: Props) => {
  const [text, setText] = useState('Going back online...');
  const [loading, setLoading] = useState(true);
  const mount = useRef(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        !loading && (
          <BackButton
            onPress={() => navigation.navigate(HomeStackScreens.Home)}
          />
        ),
      gestureEnabled: loading ? false : true,
    });
  }, [loading]);

  const onGoOnline = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        try {
          //test ping
          await axios.get(SERVERURL);
          //now save
          const changes = await goOnline((msg: string) => {
            setText(msg);
          });

          if (changes) {
            setText('All changes were saved.');
          } else {
            setText('No changes were found.');
          }
        } catch (err) {
          console.log(err);
          setText(
            'Failed to save all changes. Please ensure you have a good internet connection.',
          );
        }
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    mount.current = true;
    onGoOnline();
    return () => {
      mount.current = false;
    };
  }, [route]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.svg}>
          <NetworkSvg fillColor={BaseColors.primary} />
        </View>
        <PrimaryText styles={styles.title}>Going Online</PrimaryText>
        <PrimaryText styles={styles.info}>{text}</PrimaryText>
        {loading && (
          <ActivityIndicator size="large" color={BaseColors.primary} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColors.white,
  },
  content: {
    bottom: '10%',
    margin: StyleConstants.baseMargin,
    alignItems: 'center',
  },
  title: {
    fontSize: StyleConstants.mediumFont,
    color: BaseColors.primary,
    textTransform: 'capitalize',
    marginBottom: StyleConstants.baseMargin,
    marginTop: StyleConstants.baseMargin,
  },
  info: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.black,
    marginBottom: StyleConstants.baseMargin * 2,
  },
  svg: {
    width: normalize.width(6),
    height: normalize.width(6),
  },
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    goOnline: async (callBack: (msg: string) => void) =>
      dispatch(goOnline(callBack)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(GoOnlineModal);
