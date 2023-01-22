import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Linking } from 'react-native';
import * as IAP from 'expo-in-app-purchases';
import Products from '../../utils/Products';
import PrimaryButton from '../../components/elements/PrimaryButton';
import PrimaryText from '../../components/elements/PrimaryText';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecondaryText from '../../components/elements/SecondaryText';
import SitUpSvg from '../../assets/SitUpSvg';
import { normalize } from '../../utils/tools';
import { connect } from 'react-redux';
import { handleSubscriptionPurchased } from '../../services/user/actions';
import { UserActionProps, UserProps } from '../../services/user/types';
import { ReducerProps } from '../../services';
import { HomeStackScreens } from './types';
import { SERVERURL } from '../../utils/PATHS';

interface Props {
    navigation: any;
    dispatch: any;
    handleSubscriptionPurchased: UserActionProps['handleSubscriptionPurchased'];
    user: UserProps;
}


const Subscribe = ({ navigation, dispatch, handleSubscriptionPurchased, user }: Props) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        IAP.getProductsAsync([Products.monthlyId_05_99, Products.monthlyId_00_99])
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (user.subscriptionType && user.subscriptionUpdate) {
            const d = new Date(user.subscriptionUpdate);
            const today = new Date();

            if (
                d.getFullYear() >= today.getFullYear() ||
                d.getMonth() >= today.getMonth() ||
                d.getDate() >= today.getDate()
            ) {
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate(HomeStackScreens.Home)
                }
            }
        }
    }, [user])

    const onSubscribe = async (id: string) => {
        if (loading) return;
        setLoading(true)
        try {
            if (id === Products.monthlyId_00_00) {
                await handleSubscriptionPurchased('', '', id)
            } else {
                await IAP.purchaseItemAsync(id)
            }
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const onPP = async () => {
        const url = SERVERURL + 'privacy-policy'
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            Linking.openURL(url)
        }
    }
    const onTOU = async () => {
        const url = SERVERURL + 'terms'
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            Linking.openURL(url)
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right', 'top']}>
            <View>
                <PrimaryText styles={styles.header}>Subscribe</PrimaryText>
            </View>
            <View style={styles.middleContainer}>
                <View style={{ height: normalize.width(2), width: normalize.width(2) }}>
                    <SitUpSvg />
                </View>
                <PrimaryText styles={styles.subHeader}>Plan, Train, Evaluate, Repeat</PrimaryText>
            </View>
            <View style={styles.bottomContainer}>
                <View style={{ alignItems: 'center' }}>
                    <SecondaryText styles={styles.unlock} bold>All Access</SecondaryText>
                    <SecondaryText styles={styles.unlockDes}>Use our tools to organize your workouts and track your progress.</SecondaryText>
                    <PrimaryButton onPress={() => onSubscribe(Products.monthlyId_00_99)} styles={styles.btn} loading={loading}>$0.99 / Month</PrimaryButton>
                    <PrimaryButton onPress={() => onSubscribe(Products.monthlyId_05_99)} styles={styles.btn} loading={loading}>$5.99 / Month</PrimaryButton>
                    <Pressable style={{ marginTop: StyleConstants.baseMargin }} onPress={() => onSubscribe(Products.monthlyId_00_00)}>
                        <PrimaryText styles={styles.free}>{loading ? <ActivityIndicator size={'small'} /> : "Continue For Free"}</PrimaryText>
                    </Pressable>
                    <SecondaryText styles={styles.des}>Join a community of athletes who are trying to better themselves, just like you.</SecondaryText>
                </View>

                <View style={{ marginTop: StyleConstants.baseMargin }}>
                    <Pressable onPress={onTOU}>
                        <SecondaryText styles={styles.legal}>Terms of Use</SecondaryText>
                    </Pressable>
                    <Pressable onPress={onPP}>
                        <SecondaryText styles={styles.legal}>Privacy Policy</SecondaryText>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: StyleConstants.baseMargin,
    },
    middleContainer: {
        alignItems: 'center',
        marginBottom: StyleConstants.baseMargin * 2,
        flex: 1,
        justifyContent: 'center'
    },
    header: {
        color: BaseColors.primary,
        fontSize: StyleConstants.smallMediumFont,
        textAlign: 'center',
        marginBottom: 5
    },
    subHeader: {
        color: BaseColors.black,
        fontSize: StyleConstants.smallFont,
        textAlign: 'center',
    },
    bottomContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between'
    },
    unlock: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.black
    },
    unlockDes: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.lightBlack,
        marginTop: 5,
        textAlign: 'center'
    },
    des: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightBlack,
        textAlign: 'center',
        marginTop: StyleConstants.baseMargin
    },
    btn: {
        fontSize: StyleConstants.smallFont,
        padding: 15,
        borderRadius: 10,
        marginTop: StyleConstants.baseMargin,
        alignSelf: 'stretch'
    },
    free: {
        color: BaseColors.primary,
        fontSize: StyleConstants.smallFont,
        textAlign: 'center'
    },
    legal: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black,
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline'
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { handleSubscriptionPurchased })(Subscribe);