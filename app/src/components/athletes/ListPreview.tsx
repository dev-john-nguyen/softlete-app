import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AthleteProfileProps } from '../../services/athletes/types';
import FastImage from 'react-native-fast-image';
import PersonSvg from '../../assets/PersonSvg';
import { normalize } from '../../utils/tools';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';
import BaseColors, { rgba } from '../../utils/BaseColors';
import _ from 'lodash';


interface Props {
    onNavigateToProfile: (athlete: AthleteProfileProps) => void;
    athlete: AthleteProfileProps;
}


const AthleteListPreview = ({ onNavigateToProfile, athlete }: Props) => {

    const onPress = () => onNavigateToProfile(athlete);

    return (
        <Pressable style={styles.container} onPress={onPress} hitSlop={5}>
            <View style={styles.left}>
                {
                    !!athlete.imageUri ? <FastImage
                        style={styles.image}
                        source={{
                            uri: athlete.imageUri,
                            priority: 'normal'
                        }}
                    /> :
                        <View style={styles.image}>
                            <View style={styles.svg}>
                                <PersonSvg strokeColor={BaseColors.white} />
                            </View>
                        </View>
                }
                <SecondaryText styles={styles.username} bold>{athlete.username}</SecondaryText>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: StyleConstants.baseMargin,
        alignItems: 'center',
        borderTopColor: rgba(BaseColors.whiteRbg, .1),
        borderTopWidth: 1,
        borderBottomColor: rgba(BaseColors.whiteRbg, .1),
        borderBottomWidth: 1,
        marginBottom: 5
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    right: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    username: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite
    },
    athlete: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightWhite,
        opacity: .8
    },
    image: {
        width: moderateScale(30),
        height: moderateScale(30),
        marginRight: StyleConstants.smallMargin,
    },
    svg: {
        width: '100%'
    }
})
export default React.memo(AthleteListPreview);