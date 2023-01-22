import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from 'react';
import Button from "./Button";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errField, setErrField] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!email) return setErrField('email');
        if (!password) return setErrField('password');

        setLoading(true)
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
            .catch(error => {
                setErrMsg('Invalid email or password. Please try again.')
            })
        setLoading(false)
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h1>Login</h1>
                </div>
                {
                    errMsg &&
                    <div className="form-errors">
                        <p>{errMsg}</p>
                    </div>
                }
                <div className={`form-control ${errField === 'email' && 'form-control-error'}`}>
                    <label htmlFor='email'>Email</label>
                    <input
                        type="email"
                        id='email'
                        placeholder='john.doe@johndoe.com'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className={`form-control ${errField === 'password' && 'form-control-error'}`}>
                    <label htmlFor='password'>Password</label>
                    <input
                        type="password"
                        id='password'
                        placeholder='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>
                <Button type='submit' loading={loading} text="Submit" />
            </form>
        </div>
    )
}

export default Login;