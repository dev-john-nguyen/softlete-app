import axios from "axios";
import { useState } from "react";
import { Rating } from '@mui/material';
import Loading from "./Loading";

const Feedback = () => {
    const [errMsg, setErrMsg] = useState('');
    const [errField, setErrField] = useState('');
    const [ui, setUi] = useState('');
    const [advice, setAdvice] = useState('');
    const [valueRating, setValueRating] = useState(0);
    const [bugs, setBugs] = useState('');
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return;
        //validate form
        if (!ui) {
            return setErrField('ui')
        } else if (!valueRating) {
            return setErrField('valueRating')
        }
        //validated
        setLoading(true)

        axios.post('/api/feedback', { ui, advice, valueRating, bugs, comments })
            .then(() => {
                alert('Thank you for your feedback!')
                setLoading(false)
            })
            .catch((err) => {
                if (err.response) {
                    setErrMsg(err.response.data)
                } else {
                    setErrMsg('Sorry, unexpected error occurred.')
                }
                setLoading(false)
            })

    }

    return (
        <div className="legal">
            <h1 className='legal-header'>Feedback</h1>
            <p className='legal-header-sub'>Please fill out the form below</p>
            <form className='form' onSubmit={onSubmit}>

                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }

                <div className={`form-control ${errField === 'valueRating' && 'form-control-error'}`}>
                    <label>How useful is the product? *</label>
                    <div className="form-control-rating">
                        <Rating
                            size="large"
                            value={valueRating}
                            onChange={(e, value) => value && setValueRating(value)}
                        />
                    </div>
                </div>

                <div className={`form-control ${errField === 'ui' && 'form-control-error'}`}>
                    <label htmlFor='ui'>What was most complex about the app? *</label>
                    <textarea
                        id='ui'
                        onChange={(e) => setUi(e.target.value)}
                        value={ui}
                        placeholder='Did you have trouble finding anything?'
                    />
                </div>

                <div className={`form-control ${errField === 'advice' && 'form-control-error'}`}>
                    <label htmlFor='advice'>Any Ideas And/Or Advice?</label>
                    <textarea
                        id='advice'
                        onChange={(e) => setAdvice(e.target.value)}
                        value={advice}
                        placeholder='What would you like to see?'
                    />
                </div>


                <div className={`form-control ${errField === 'bugs' && 'form-control-error'}`}>
                    <label htmlFor='bugs'>Any Bugs/Issues You've noticed?</label>
                    <textarea
                        id='bugs'
                        onChange={(e) => setBugs(e.target.value)}
                        value={bugs}
                        placeholder='Did anything unexpected happen?'
                    />
                </div>


                <div className={`form-control ${errField === 'comments' && 'form-control-error'}`}>
                    <label htmlFor='comments'>Comments</label>
                    <textarea
                        id='comments'
                        onChange={(e) => setComments(e.target.value)}
                        value={comments}
                        placeholder='Anything else you want to say?'
                    />
                </div>

                <button type='submit'>
                    Submit {loading && <Loading />}
                </button>
            </form>
        </div>
    )
}

export default Feedback;