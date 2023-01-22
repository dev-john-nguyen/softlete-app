import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import Chevron from '../../assets/ChevronSvg';
import StyleConstants from '../../components/tools/StyleConstants';
import PrimaryText from '../../components/elements/PrimaryText';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import { HelpStackScreens } from './types';
import { useHeaderHeight } from '@react-navigation/elements';
import { SERVERURL } from '../../utils/PATHS';

interface Props {
    navigation: any;
}

const HelpMenu = ({ navigation }: Props) => {
    const headerHeight = useHeaderHeight();

    const onNavToTips = () => navigation.navigate(HelpStackScreens.TipsAndAdvice);

    const onNavToContact = async () => {
        const url = SERVERURL + 'contact'
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            Linking.openURL(url)
        }
    }


    return (
        <View style={styles.container}>
            <View style={{ height: headerHeight }} />
            <PrimaryText styles={styles.headerText}>Help</PrimaryText>

            <Pressable style={styles.selectContainer} onPress={onNavToTips}>
                <PrimaryText styles={styles.text}>Tips/Advice</PrimaryText>
                <View style={styles.chev}>
                    <Chevron strokeColor={BaseColors.black} />
                </View>
            </Pressable>

            <Pressable style={styles.selectContainer} onPress={onNavToContact}>
                <PrimaryText styles={styles.text}>Contact Us</PrimaryText>
                <View style={styles.chev}>
                    <Chevron strokeColor={BaseColors.black} />
                </View>
            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: StyleConstants.baseMargin,
        paddingTop: 0
    },
    headerText: {
        fontSize: StyleConstants.largeFont,
        color: BaseColors.primary
    },
    selectContainer: {
        padding: StyleConstants.baseMargin,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: BaseColors.white,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        color: BaseColors.lightBlack,
        fontSize: StyleConstants.smallerFont
    },
    chev: {
        width: normalize.width(30),
        height: normalize.width(30),
        transform: [{ rotateY: '180deg' }]
    },
})
export default HelpMenu;