import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import PaymentIcon from '@mui/icons-material/Payment';
import CardElementStyles from './styles/card-element-styles';

interface CardDetails {
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PaymentMethodForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState<CardDetails | undefined>()
    const mount = useRef(false);
    const clientSecret = useRef('')

    const getDefaultCard = () => {
        axios.get('/api/subscription/default-card')
            .then(({ data }) => {
                if (data) {
                    setCard(data as CardDetails)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        mount.current = true;
        getDefaultCard()
        return () => {
            mount.current = false;
        }
    }, [])

    const onChangePaymentMethod = async (e: any) => {
        e.preventDefault();
        if (loading) return;
        if (!stripe || !elements) return;

        setLoading(true)

        const cardElement: any = elements.getElement(CardElement);

        if (!clientSecret.current) {
            await axios.get('/api/subscription/setup-intent')
                .then((res: any) => {
                    if (res.data) clientSecret.current = res.data as string
                })
                .catch(err => {
                    console.log(err)
                })

            if (!clientSecret.current) {
                setErrMsg('Failed to set set up the new card')
                return setLoading(false)
            };
        }

        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret.current, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
        })

        if (error) {
            console.log(`Error code: ${error.code}`, error.message);
            setErrMsg(error.message ? error.message : "Couldn't confirm your card. Please try again");
        } else if (setupIntent) {
            await axios.post('api/subscription/update-payment-method', { paymentMethodId: setupIntent.payment_method }).catch((err) => console.log(err))
        }
        clientSecret.current = ''
        setLoading(false)
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={onChangePaymentMethod}>
                <div className="form-header">
                    <h1>Update Card</h1>
                </div>
                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }
                <div className="form-default-card">
                    {card && (
                        <div className="card">
                            <div>
                                <PaymentIcon htmlColor="#fff" className='card_icon' />
                            </div>
                            <p className="card_brand">{card.brand}</p>
                            <p className="card_last4">*{card.last4}</p>
                            <p className="card_exp-month">{card.exp_month && months[card.exp_month - 1]}</p>
                            <p className="card_exp-year">{card.exp_year}</p>
                        </div>
                    )}
                </div>
                <div className={`form-control ${errMsg && 'form-control-error'}`}>
                    <label htmlFor='email'>Card</label>
                    <CardElement
                        className='stripe-card-element'
                        options={CardElementStyles}
                    />
                </div>
                <Button type='submit' loading={loading} text={'Update'} />
            </form>
        </div>
    )
};

export default PaymentMethodForm;
