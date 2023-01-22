import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import { SET_DEMO_STATE } from '../../services/global/actionTypes';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import PrimaryButton from '../elements/PrimaryButton';
import LogoSvg from '../../assets/LogoSvg';
import { normalize } from '../../utils/tools';

interface Props {
    headerText: string;
    bodyText: string;
    topPos: number | string;
    dispatch: AppDispatch;
    nextDemo: string;
    backDemo: string;
    subBodyText?: string;
}


const DemoModal = ({ headerText, bodyText, topPos, dispatch, nextDemo, subBodyText, backDemo }: Props) => {
    const onStopDemo = () => dispatch({ type: SET_DEMO_STATE, payload: '' });
    const onNext = () => dispatch({ type: SET_DEMO_STATE, payload: nextDemo });
    const onBack = () => dispatch({ type: SET_DEMO_STATE, payload: backDemo });

    return (
        <View style={[styles.container, {
            top: topPos
        }, BaseColors.primaryBoxShadow]}>
            <View style={styles.logo}>
                <LogoSvg />
            </View>
            <SecondaryText styles={styles.headerText} bold>{headerText}</SecondaryText>
            <SecondaryText styles={styles.bodyText}>{bodyText}</SecondaryText>
            {
                !!subBodyText && (
                    <SecondaryText styles={styles.subBodyText}>*{subBodyText}</SecondaryText>
                )
            }
            <View style={styles.buttonContainer}>
                <View />
                {/* <Pressable onPress={onBack} style={styles.cancelContainer}>
                    <SecondaryText styles={styles.cancelText}>Back</SecondaryText>
                </Pressable> */}
                <View style={{ flexDirection: 'row' }}>
                    <PrimaryButton onPress={onNext} styles={{ marginRight: 20 }}>Next</PrimaryButton>
                    <Pressable onPress={onStopDemo} style={styles.cancelContainer}>
                        <SecondaryText styles={styles.cancelText}>Cancel</SecondaryText>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: BaseColors.white,
        borderColor: BaseColors.lightGrey,
        borderWidth: 1,
        padding: 20,
        paddingTop: 30,
        borderRadius: StyleConstants.borderRadius,
        zIndex: 1000,
        width: '90%',
        alignSelf: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        marginTop: StyleConstants.largeMargin,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary,
        textTransform: 'capitalize',
        marginBottom: 5,
        textAlign: 'center'
    },
    bodyText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
    },
    subBodyText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightBlack,
        marginTop: 5
    },
    cancelContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    cancelText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightBlack
    },
    logo: {
        position: 'absolute',
        right: 10,
        top: 10,
        height: normalize.width(15),
        width: normalize.width(15)
    }
})
export default connect()(DemoModal);