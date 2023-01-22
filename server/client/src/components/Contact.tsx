import axios from "axios";
import { useState } from "react";
import Loading from "./Loading";

const Contact = () => {
    const [errMsg, setErrMsg] = useState('');
    const [errField, setErrField] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return;
        //validate form
        if (!name) {
            return setErrField('name')
        } else if (!email) {
            return setErrField('email')
        } else if (!message) {
            return setErrField('message')
        }
        //validated
        setLoading(true)
        axios.post('/api/feedback/contact', { name, email, message })
            .then(() => {
                alert("You'll hear from us soon!")
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
            <h1 className='legal-header'>Contact</h1>
            <p className='legal-header-sub'>Please fill out the form below</p>
            <form className='form' onSubmit={onSubmit}>

                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }

                <div className={`form-control ${errField === 'name' && 'form-control-error'}`}>
                    <label htmlFor='name'>Name</label>
                    <input
                        id='name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder='John Doe'
                    />
                </div>

                <div className={`form-control ${errField === 'email' && 'form-control-error'}`}>
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder='John.Doe@email.com'
                    />
                </div>


                <div className={`form-control ${errField === 'message' && 'form-control-error'}`}>
                    <label htmlFor='comments'>Message</label>
                    <textarea
                        id='comments'
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        placeholder='Message'
                    />
                </div>

                <button type='submit'>
                    Submit {loading && <Loading />}
                </button>
            </form>
        </div>
    )
}

export default Contact;