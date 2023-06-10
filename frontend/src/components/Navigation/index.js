import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import airbab from '../../img/airbab.png';
import airbabname from '../../img/airbabname.png'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (

        <nav className='navBarFull'>
            <div className='navBarLeft'>
                <NavLink exact to="/"><img src={airbab} alt='airbabIcon' className='airbabIcon' /></NavLink>
                <NavLink exact to="/"><img src={airbabname} alt='airbab' className='airbabName' /></NavLink>
            </div>

            <div className='navBarRight'>
                {sessionUser &&
                    <div className='createSpotDiv'>
                        <NavLink className='createSpotLink' exact to='/spots/new'>Create a New Spot</NavLink>
                    </div>}
                {isLoaded && (
                    <div className='profileButtonDiv'>
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
