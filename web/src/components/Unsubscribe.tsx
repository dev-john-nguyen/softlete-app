import axios, { AxiosResponse } from 'axios';
import { useRef } from 'react';
import { useState } from 'react';
import Button from './Button';
import Loading from './Loading';

const Unsubscribe = () => {
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const onFormSubmit = (e: any) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true)
        axios.post('/api/subscription/cancel')
            .then(() => {
                alert('successfully unsubscribe')
                setLoading(false)
            })
            .catch((err) => {
                if (err.response) {
                    setErrMsg(err.response.data as string)
                } else {
                    setErrMsg('Unexpected error occurred. Please try again.')
                }
                setLoading(false)
            })
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={onFormSubmit}>
                <div className="form-header">
                    <h1>Are You Sure You Want To Unsubscribe?</h1>
                </div>
                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }
                <Button type='submit' loading={loading} text={'Unsubscribe'} />
            </form>
        </div>
    )
};

export default Unsubscribe;
