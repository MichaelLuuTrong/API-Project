import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const errors = {};
        if (credential.length < 4) errors.credentials = "Username or Email must be 4 or more characters."
        if (password.length < 6) errors.password = "Password must be 6 or more characters."
        setErrors(errors);
    }, [credential, password])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <div className='entireModal'>
            <h1 className='title'>Log In</h1>
            {errors.credential && (
                <div className="errors">{errors.credential}</div>
            )}
            <form className='loginForm' onSubmit={handleSubmit}>
                <input
                    className="userNameorEmail"
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                    placeholder="Username or Email"
                />
                <input
                    className="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                />
                <div className='loginDiv'>
                    <button className={Object.values(errors).length > 0 ? 'invalidLoginButton' : 'validLoginButton changeCursor'} type="submit" disabled={Object.values(errors).length > 0} >Log In</button>
                </div>
            </form>
            <div className='demoUserDiv'>
                <button className="demoUserButton changeCursor" onClick={() => {
                    dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
                        .then(closeModal)
                }}>Log in as Demo User</button>
            </div>
        </div>
    );
}

export default LoginFormModal;
