import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios, { AxiosResponse } from 'axios';
import { useRef } from 'react';
import { useState } from 'react';
import Button from './Button';
import CardElementStyles from './styles/card-element-styles';

const SubscribeFrom = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [errField, setErrField] = useState('')
    const clientSecret = useRef('');

    const onSubscribe = async (e: any) => {
        // Block native form submission.
        e.preventDefault();

        if (loading) return;

        if (!stripe || !elements) return;

        //validate email and name
        if (!email) setErrField('email')

        if (!name) return setErrField('name')


        setLoading(true);

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.

        if (!clientSecret.current) {
            try {
                const { data }: AxiosResponse<{ clientSecret: string }, any> = await axios.post('/api/subscription/create', { email, name })
                clientSecret.current = data.clientSecret

            } catch (err: any) {
                console.log(err)
                let errorMsg = typeof err.response.data === 'string' ? err.response.data : 'Something went wrong trying to initialize your subscription.';
                setErrMsg(errorMsg)
                setLoading(false)
                return;
            }
        }

        const cardElement: any = elements.getElement(CardElement);

        if (!clientSecret.current) {
            setErrMsg("Couldn't fetch your subscription. Please try again or contact us directly.")
            setLoading(false)
            return;
        }


        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.current, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    email: email,
                    name: name
                },
            }
        });


        if (error) {
            console.log(error)
            setErrMsg(error.message ? error.message : "Failed to finalize your subscription. Please try again.")
            setErrField('card');
            clientSecret.current = ''
        } else if (paymentIntent) {
            console.log(
                'Success',
                `The payment was confirmed successfully! currency: ${paymentIntent.currency}`
            );
            console.log('Success from promise', paymentIntent);
            await axios.post('api/subscription/update-payment-method', { paymentMethodId: paymentIntent.payment_method }).catch((err) => console.log(err))
            clientSecret.current = ''
        }

        setLoading(false)
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={onSubscribe}>
                <div className="form-header">
                    <h1>Subscribe</h1>
                    <p>You are subscribing for the premium service of this service. You'll receive access to more content.</p>
                </div>
                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }
                <div className={`form-control ${errField === 'name' && 'form-control-error'}`}>
                    <label htmlFor='name'>Name</label>
                    <input
                        type="text"
                        id='name'
                        placeholder='John Doe'
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={`form-control ${errField === 'email' && 'form-control-error'}`}>
                    <label htmlFor='email'>Email</label>
                    <input
                        type="email"
                        id='email'
                        placeholder='john.doe@johndoe.com'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={`form-control ${errField === 'card' && 'form-control-error'}`}>
                    <label htmlFor='email'>Card</label>
                    <CardElement
                        className='stripe-card-element'
                        options={CardElementStyles}
                    />
                </div>
                <Button type='submit' loading={loading} text={'Subscribe'} />
            </form>
        </div>
    )
};

export default SubscribeFrom;
