import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { EdgeInsets } from 'react-native-safe-area-context';
import LogoSvg from '../assets/LogoSvg';
import PersonSvg from '../assets/PersonSvg';
import { UserProps } from '../services/user/types';
import BaseColors from '../utils/BaseColors';
import { normalize } from '../utils/tools';
import SecondaryText from './elements/SecondaryText';
import StyleConstants from './tools/StyleConstants';


interface Props {
    user: UserProps;
    insets: EdgeInsets
    offline: boolean;
    onSwitch: () => void;
}


const DrawerProfile = ({ user, insets, offline, onSwitch }: Props) => {
    return (
        <LinearGradient colors={['#360000', '#7A0000']} style={[styles.container, { paddingTop: insets.top }]}>
            <View>
                <View style={styles.logo}>
                    <LogoSvg secondary />
                </View>
                {
                    !!user.imageUri ? <FastImage
                        style={styles.image}
                        source={{
                            uri: user.imageUri,
                            priority: 'normal'
                        }}
                    /> :
                        <View style={styles.image}>
                            <View style={styles.svg}>
                                <PersonSvg />
                            </View>
                        </View>
                }
                <View>
                    <SecondaryText styles={styles.username} bold>{`${user.username}`}</SecondaryText>
                    <SecondaryText styles={styles.athlete} bold>{`${user.athlete}`}</SecondaryText>
                    {
                        !!user.bio && <SecondaryText styles={styles.bio} numberOfLines={2}>{`${user.bio}`}</SecondaryText>
                    }
                </View>

                <View style={styles.offlineContainer}>
                    <SecondaryText styles={styles.offline} bold>{offline ? "Offline" : "Online"}</SecondaryText>
                    <Switch
                        trackColor={{ false: BaseColors.white, true: BaseColors.lightPrimary }}
                        thumbColor={offline ? "#a33232" : BaseColors.primary}
                        ios_backgroundColor={BaseColors.white}
                        onChange={onSwitch}
                        value={offline}
                        style={{}}
                    />
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        padding: StyleConstants.baseMargin,
        backgroundColor: BaseColors.primary,
    },
    image: {
        width: normalize.width(9),
        height: normalize.width(9),
        borderRadius: 100,
        backgroundColor: BaseColors.white,
    },
    username: {
        fontSize: StyleConstants.smallMediumFont,
        marginTop: 5,
        color: BaseColors.white,
    },
    athlete: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightPrimary,
        textTransform: 'capitalize',
    },
    bio: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.white,
    },
    svg: {
        flex: 1,
        backgroundColor: BaseColors.white,
        borderRadius: 100
    },
    offlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        marginTop: 10,
        width: '100%',
    },
    offline: {
        color: BaseColors.white,
        fontSize: StyleConstants.smallerFont
    },
    logo: {
        position: 'absolute',
        top: 10,
        right: 10,
        height: normalize.width(15),
        width: normalize.width(15)
    }
})
export default DrawerProfile;