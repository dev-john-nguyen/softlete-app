import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import screenOptions from '../utils/screenOptions';
import { StripeProvider } from '@stripe/stripe-react-native';
import Card from './Card';
import { PayStackParamsList, PayStackScreens } from './types';
import Checkout from './Checkout';
import Loading from '../../components/elements/Loading';
import axios from 'axios';
import paths, { SERVERURL } from '../../utils/PATHS';

const Tab = createStackNavigator<PayStackParamsList>();

function PayStack(parentProps: any) {
    const [pubKey, setPubKey] = useState('');

    useEffect(() => {
        axios.get(SERVERURL + paths.subscription.getPubKey)
            .then(res => {
                if (res.data) {
                    setPubKey(res.data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    if (!pubKey) return <Loading />

    return (
        <StripeProvider publishableKey={pubKey}>
            <Tab.Navigator screenOptions={(childProps) => screenOptions(parentProps, childProps)}>
                <Tab.Screen name={PayStackScreens.Checkout} component={Checkout} />
                <Tab.Screen name={PayStackScreens.Card} component={Card} />
                <Tab.Screen name={PayStackScreens.Receipt} component={Card} />
            </Tab.Navigator>
        </StripeProvider>
    );
}

export default PayStack;