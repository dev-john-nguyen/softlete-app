import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Switch, TextInput, Button } from 'react-native';
import { CardField, useConfirmPayment, PaymentMethodCreateParams, CardFieldInput, createPaymentMethod } from '@stripe/stripe-react-native';
import BaseColors from '../../utils/BaseColors';
import axios from 'axios';
import PATHS, { SERVERURL } from '../../utils/PATHS';

interface Props {
    navigation: any;
    route: any;
}

const Card = ({ navigation, route }: Props) => {
    const [email, setEmail] = useState('');
    const [saveCard, setSaveCard] = useState(false);


    useEffect(() => {
        // if (route.params) {
        //     // const { clientSecret, subscriptionId } = route.params;
        //     // if (!clientSecret || !subscriptionId) navigation.goBack()
        // } else {
        //     navigation.goBack()
        // }
    }, [route])

    const { confirmPayment, loading } = useConfirmPayment();

    const handlePayPress = async () => {
        // 1. fetch Intent Client Secret from backend
        const { clientSecret, subscriptionId } = route.params;

        // 2. Gather customer billing information (ex. email)
        const billingDetails: PaymentMethodCreateParams.BillingDetails = {
            email: 'email@stripe.com',
            phone: '+48888000888',
            addressCity: 'Houston',
            addressCountry: 'US',
            addressLine1: '1459  Circle Drive',
            addressLine2: 'Texas',
            addressPostalCode: '77063',
        }; // mocked data for tests

        // 3. Confirm payment with card details
        // The rest will be done automatically using webhooks
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
            type: 'Card',
            billingDetails,
            setupFutureUsage: saveCard ? 'OffSession' : undefined,
        });

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
            console.log('Payment confirmation error', error.message);
        } else if (paymentIntent) {
            Alert.alert(
                'Success',
                `The payment was confirmed successfully! currency: ${paymentIntent.currency}`
            );
            console.log('Success from promise', paymentIntent);
        }
    };

    const handleChangePaymentMethod = async () => {
        const { paymentMethod, error } = await createPaymentMethod({ type: 'Card' })

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
            console.log('Payment confirmation error', error.message);
        } else if (paymentMethod) {
            await axios.post(SERVERURL + PATHS.subscription.updatePaymentMethod, { paymentMethodId: paymentMethod.id })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
        <View>
            <TextInput
                autoCapitalize="none"
                placeholder="E-mail"
                keyboardType="email-address"
                onChange={(value) => setEmail(value.nativeEvent.text)}
                style={styles.input}
            />
            <CardField
                postalCodeEnabled={false}
                autofocus
                placeholder={{
                    number: '4242 4242 4242 4242',
                    postalCode: '12345',
                    cvc: 'CVC',
                    expiration: 'MM|YY',
                }}
                onCardChange={(cardDetails) => {
                }}
                onFocus={(focusedField) => {

                }}
                cardStyle={cardStyles}
                style={styles.cardField}
            />
            <View style={styles.row}>
                <Switch
                    onValueChange={(value) => setSaveCard(value)}
                    value={saveCard}
                />
                <Text style={styles.text}>Save card during payment</Text>
            </View>
            <Button
                onPress={handleChangePaymentMethod}
                title="Pay"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        marginLeft: 12,
    },
    input: {
        height: 44,
        borderBottomColor: BaseColors.primary,
        borderBottomWidth: 1.5,
    },
});

const cardStyles: CardFieldInput.Styles = {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 14,
    placeholderColor: '#999999',
};
export default Card;