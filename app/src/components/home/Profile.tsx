import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import FastImage from 'react-native-fast-image';
import PersonSvg from '../../assets/PersonSvg';
import { UserProps } from '../../services/user/types';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';

interface Props {
    user: UserProps;
    offline: boolean;
    onSwitch: () => void;
}


const HomeProfile = ({ user, offline, onSwitch }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
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
                </View>
            </View>
            <SecondaryText styles={styles.bio} numberOfLines={1}>{`${user.bio}`}</SecondaryText>

            {/* <View style={styles.offlineContainer}>
                <SecondaryText styles={styles.offline} bold>{offline ? "Offline" : "Online"}</SecondaryText>
                <Switch
                    trackColor={{ false: BaseColors.white, true: BaseColors.lightPrimary }}
                    thumbColor={offline ? "#a33232" : BaseColors.primary}
                    ios_backgroundColor={BaseColors.white}
                    onChange={onSwitch}
                    value={offline}
                    style={{}}
                />
            </View> */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    image: {
        width: normalize.width(10),
        height: normalize.width(10),
        borderRadius: 100,
        backgroundColor: BaseColors.white,
        borderColor: BaseColors.white,
        borderWidth: 1,
        marginRight: 5
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    username: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary
    },
    athlete: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.secondary,
        textTransform: 'capitalize',
    },
    bio: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightBlack,
        marginTop: 10
    },
    svg: {
        width: normalize.width(10),
        height: normalize.width(10),
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
        fontSize: StyleConstants.extraSmallFont
    }
})
export default HomeProfile;