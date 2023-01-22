import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import AthletesSvg from '../../assets/AthletesSvg';
import PrimaryButton from '../../components/elements/PrimaryButton';
import PrimaryText from '../../components/elements/PrimaryText';
import SecondaryText from '../../components/elements/SecondaryText';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import { IndexStackList } from '../types';


interface Props {
    navigation: any;
}


const About = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <PrimaryText styles={styles.header}>Welcome</PrimaryText>
                <SecondaryText styles={styles.subText}>We have the tools you need to succeed!</SecondaryText>
                <PrimaryButton onPress={() => navigation.navigate(IndexStackList.SignIn)} styles={styles.btn}>Let's Go!</PrimaryButton>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: StyleConstants.baseMargin,
        justifyContent: 'center',
        alignItems: 'center'
    },
    svg: {
        width: normalize.width(1.5),
        height: normalize.width(1.5),
        alignSelf: 'center',
    },
    header: {
        fontSize: normalize.width(10),
        color: BaseColors.white,
        textAlign: 'center'
    },
    subText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.white,
        textAlign: 'center',
        marginTop: StyleConstants.smallMargin,
        textTransform: 'capitalize'
    },
    txt: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.white,
        textAlign: 'center',
        marginTop: StyleConstants.smallMargin,
        textTransform: 'capitalize'
    },
    btn: {
        alignSelf: 'center',
        marginTop: StyleConstants.baseMargin
    }
})
export default About;