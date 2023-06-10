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
        if (username.length < 4) err.username = 'Username must be more than 4 characters.';
        if (password.length < 6) err.password = 'Password must be more than 6 characters.';
        if (email.length < 1) err.email = 'Email must not be empty.'
        if (firstName.length < 1) err.firstName = 'First Name must not be empty.'
        if (lastName.length < 1) err.lastName = 'Last Name must not be empty.'
        setErrors(err);
    }, [username, password, email, firstName, lastName])

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
            confirmPassword: "Confirm Password field must be the same as the Password field"
        })
    }

    return (
        <>
            <h1>Sign Up</h1>
            <div className="signUpErrorsDiv">
                {submitted && errors.firstName && <p className="signupError">{errors.firstName}</p>}
                {submitted && errors.lastName && <p className="signupError">{errors.lastName}</p>}
                {submitted && errors.email && <p className="signupError">{errors.email}</p>}
                {submitted && errors.username && <p className="signupError">{errors.username}</p>}
                {submitted && errors.password && <p className="signupError">{errors.password}</p>}
                {submitted && errors.confirmPassword && (<p className="signupError">{errors.confirmPassword}</p>)}
            </div>
            <form onSubmit={submitPressed}>
                <label>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.firstName && <p>{errors.firstName}</p>} */}
                <label>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.lastName && <p>{errors.lastName}</p>} */}
                <label>
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.email && <p>{errors.email}</p>} */}
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.username && <p>{errors.username}</p>} */}
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.password && <p>{errors.password}</p>} */}
                <label>
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {/* {errors.confirmPassword && (
                    <p>{errors.confirmPassword}</p>
                )} */}
                <button className={Object.values(errors).length ? 'signupButtonDisabled' : 'signupButton changeCursor'} type="submit" disabled={Object.values(errors).length > 0}>Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;
