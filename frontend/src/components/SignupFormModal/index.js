import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const { closeModal } = useModal();

    useEffect(() => {
        const err = {};
        if (username.length < 4) err.username = 'Username must be more than 4 characters in length.';
        if (password.length < 6) err.password = 'Password must be more than 6 characters in length.';
        if (email.length < 1) err.email = 'Please provide an email address.'
        if (firstName.length < 1) err.firstName = 'Please provide your first name.'
        if (lastName.length < 1) err.lastName = 'Please provide your last name.'
        if (confirmPassword.length < 6) err.confirmPassword = 'Confirm Password must be more than 6 characters in length.';
        setErrors(err);
    }, [username, password, email, firstName, lastName, confirmPassword])

    const submitPressed = (e) => {
        e.preventDefault();
        setSubmitted(true)
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        else return setErrors({
            confirmPassword: 'Please make sure your password matches in both fields.'
        })
    }

    return (
        <div className='signupModal'>
            <div className="title">
                <h1>Sign Up</h1>
            </div>

            <div className="signUpErrorsDiv">
                {submitted && errors.firstName && <p className="signupError">{errors.firstName}</p>}
                {submitted && errors.lastName && <p className="signupError">{errors.lastName}</p>}
                {submitted && errors.email && <p className="signupError">{errors.email}</p>}
                {submitted && errors.username && <p className="signupError">{errors.username}</p>}
                {submitted && errors.password && <p className="signupError">{errors.password}</p>}
                {submitted && errors.confirmPassword && (<p className="signupError">{errors.confirmPassword}</p>)}
            </div>
            <form className='entireForm' onSubmit={submitPressed}>
                <input
                    className='firstName'
                    placeholder='First Name'
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    className='lastName'
                    placeholder='Last Name'
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    className='email'
                    placeholder='Email'
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    className='username'
                    placeholder='Username'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    className='password'
                    placeholder='Password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className='confirmPassword'
                    placeholder='Confirm Password'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button className={Object.values(errors).length ? 'signupButtonDisabled' : 'signupButton changeCursor'} type="submit" disabled={Object.values(errors).length > 0}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignupFormModal;
