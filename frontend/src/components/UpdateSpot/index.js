import { useState, useEffect } from 'react'
import { fetchASpot, updateSpotThunk } from '../../store/spots'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import './UpdateSpot.css'

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams()

    const spotInfo = useSelector(state => state.spots.singleSpot)


    useEffect(() => {
        dispatch(fetchASpot(spotId));
    }, [dispatch, spotId])

    useEffect(() => {
        if (spotInfo.country) setCountry(spotInfo.country)
        if (spotInfo.address) setAddress(spotInfo.address)
        if (spotInfo.city) setCity(spotInfo.city)
        if (spotInfo.state) setState(spotInfo.state)
        if (spotInfo.price) setPrice(spotInfo.price)
        if (spotInfo.description) setDescription(spotInfo.description)
        if (spotInfo.name) setName(spotInfo.name)
    }, [spotInfo])

    //
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    //
    const [description, setDescription] = useState('')
    //
    const [name, setName] = useState('')
    //
    const [price, setPrice] = useState('')
    //
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const [responseErrors, setResponseErrors] = useState({})
    //

    useEffect(() => {
        console.log('useEffect2 Ran')
        const errorArray = [];
        if (!address.length) errorArray.address = 'Address is required'
        if (!country.length) errorArray.country = 'Country is Required'
        if (!city.length) errorArray.city = 'City is required'
        if (!state.length) errorArray.state = 'State is required'
        if (description.length < 30) errorArray.description = 'Description needs a minimum of 30 characters'
        if (!name.length) errorArray.name = 'Name is required'
        if (!price || price <= 0) errorArray.price = 'Price is required'
        setErrors(errorArray);
    }, [country, address, city, state, description, name, price])

    const formSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true);
        setResponseErrors({});
        //latitude and longitude information are not implemented in this version of the form.
        //they are hard-coded to bypass SQL validation
        const lat = 45.00;
        const lng = 45.00;

        const nonImageResponses = {
            country,
            address,
            city,
            state,
            description,
            name,
            price,
            lat,
            lng
        };

        if (!Object.values(errors).length) {
            let updatedSpot = await dispatch(updateSpotThunk(spotId, nonImageResponses))
            console.log(updatedSpot)
            if (!updatedSpot.errors) {
                history.push(`/spots/${updatedSpot.id}`)
            }
            else {
                setResponseErrors(updatedSpot.errors)
            }
        }
    }
    const user = useSelector(state => state.session.user)
    if (!user) {
        return (history.push('/'))
    }
    return (
        <div onSubmit={formSubmit} className='formDiv'>
            <form className='form'>
                <h1>Update your Spot</h1>
                {submitted && (Object.values(responseErrors).length) ? <p>{Object.values(responseErrors)}</p> : null}
                <div className='formSubmissionDiv'>
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <label>Country</label>
                        {submitted ? <p className='validationerror'>{errors.country}</p> : null}
                    </div>
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div>
                    <div>
                        <label>Street Address</label>
                        {submitted ? <p className='validationerror'>{errors.address}</p> : null}
                    </div>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <div>
                        <label>City</label>
                        {submitted ? <p className='validationerror'>{errors.city}</p> : null}
                    </div>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div>
                    <div>
                        <label>State</label>
                        {submitted ? <p className='validationerror'>{errors.state}</p> : null}
                    </div>
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div className='formSubmissionDiv'>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neigborhood.</p>
                    <textarea
                        name="description"
                        value={description}
                        placeholder="Please write at least 30 characters"
                        onChange={(e) => setDescription(e.target.value)}
                        rows="6"
                        cols="50"
                    >
                    </textarea>
                    {submitted ? <p className='validationerror'>{errors.description}</p> : null}
                </div>
                <div className='formSubmissionDiv'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {submitted ? <p className='validationerror'>{errors.name}</p> : null}
                </div>
                <div className='formSubmissionDiv'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <p>$</p>
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        name="price"
                        placeholder="Price per night (USD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {submitted ? <p className='validationerror'>{errors.price}</p> : null}
                </div>
                <button type='submit'>Create Spot</button>
            </form >
        </div >
    )
}

export default UpdateSpot
