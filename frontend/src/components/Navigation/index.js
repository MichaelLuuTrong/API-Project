import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import airbab from '../../img/airbab.png';
import airbabname from '../../img/airbabname.png'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    return (

        <nav className='navBarFull'>
            <div className='navBarLeft'>
                <NavLink exact to="/"><img src={airbab} alt='airbabIcon' className='airbabIcon' /></NavLink>
                <NavLink exact to="/"><img src={airbabname} alt='airbab' className='airbabName' /></NavLink>
            </div>
            {sessionUser &&
                <div className='createSpotDiv'>
                    <button className='createSpotButton' onClick={() => history.push('/spots/new')}>Create a New Spot
                    </button>
                </div>}
            <div className='navBarRight'>
                {isLoaded && (
                    <div>
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
