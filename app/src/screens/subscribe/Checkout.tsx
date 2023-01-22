import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Input from '../../components/elements/Input';
import axios from 'axios';
import { PayStackScreens } from './types';
import PATHS, { SERVERURL } from '../../utils/PATHS';

interface Props {
    navigation: any;
}

const Checkout = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');

    const onSubmit = async () => {
        // const response = await axios.post(SERVERURL + PATHS.subscribe.createSubscription, {
        //     email,
        //     currency: 'usd',
        //     items: [{ id: 'id' }]
        // }).catch(err => console.log(err))

        // if (!response) return;
        // const { clientSecret, subscriptionId } = await response.data;

        // navigation.navigate(PayStackScreens.Card, {
        //     clientSecret,
        //     subscriptionId
        // })

        // const response = await axios.get(SERVERURL + PATHS.pay.a).catch(err => console.log(err))

        // if (!response) return;
        // const { clientSecret } = await response.data;

        navigation.navigate(PayStackScreens.Card, {})
    }



    return (
        <View style={styles.container}>
            <Input onChangeText={(txt) => setEmail(txt)} value={email} />
            <Button onPress={onSubmit} title='submit' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
export default Checkout;