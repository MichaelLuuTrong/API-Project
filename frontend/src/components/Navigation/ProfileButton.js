import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from 'react-router-dom'
import "./Navigation.css";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory()
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push("/");
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={openMenu} className="profileMenuButton changeCursor">
                <div className="profileMenuIcons">
                    <i className="fa-solid fa-bars" />
                    <i className="fas fa-user-circle" />
                </div>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className='profileMenu'>
                        <div className='divWithBottomLine'>
                            <p>Hello, {user.username}</p>
                            <p>{user.email}</p>
                        </div>
                        <div className='divWithBottomLine changeCursor'>
                            <button onClick={() => history.push(`/spots/current`)} className="manageSpotsButton changeCursor"> Manage Spots</button>
                        </div>
                        <div className='divWithBottomLine changeCursor'>
                            <button onClick={logout} className="logOutButton changeCursor">Log Out</button>
                        </div>
                    </div>
                ) : (
                    <div className='loginSignup changeCursor'>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                )}
            </div >
        </>
    );
}

export default ProfileButton;
