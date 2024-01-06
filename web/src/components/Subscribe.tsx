import { Elements } from '@stripe/react-stripe-js'
import { Stripe } from '@stripe/stripe-js';
import { Redirect, useLocation } from 'react-router-dom'
import PaymentMethodForm from './PaymentMethodForm';
import SubscribeFrom from './SubscribeForm';
interface Props {
    stripePromise: Stripe | null
}

const Subscribe = ({ stripePromise }: Props) => {
    const location = useLocation();

    if (!stripePromise) return <Redirect to='/signin' />

    return (
        <Elements stripe={stripePromise}>
            {
                location.pathname === '/subscribe' ?
                    <SubscribeFrom />
                    :
                    <PaymentMethodForm />
            }
        </Elements>
    )
}

export default Subscribe;