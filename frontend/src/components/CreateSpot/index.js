import { useState, useEffect } from 'react'
import { createSpot } from '../../store/spots'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './CreateSpot.css'

const CreateSpot = () => {
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
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    //
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const [responseErrors, setResponseErrors] = useState({})
    //
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const errorArray = [];
        if (!country.length) errorArray.country = 'Country is Required'
        if (!address.length) errorArray.address = 'Address is required'
        if (!city.length) errorArray.city = 'City is required'
        if (!state.length) errorArray.state = 'State is required'
        if (description.length < 30) errorArray.description = 'Description needs a minimum of 30 characters'
        if (!name.length) errorArray.name = 'Name is required'
        if (!price || price <= 0) errorArray.price = 'Price is required'
        if (!previewImage.length) errorArray.previewImage = 'Preview image is required'
        if (previewImage && !((previewImage.endsWith('.png') || (previewImage.endsWith('.jpg') || (previewImage.endsWith('.jpeg')))))) errorArray.previewImageValidation = 'Image URL must end in .png, .jpg, or .jpeg'
        if (image1 && !(image1.endsWith('.png') || (image1.endsWith('.jpg') || (image1.endsWith('.jpeg'))))) errorArray.image1Validation = 'Image URL must end in .png, .jpg, or .jpeg'
        if (image2 && !(image2.endsWith('.png') || (image2.endsWith('.jpg') || (image2.endsWith('.jpeg'))))) errorArray.image2Validation = 'Image URL must end in .png, .jpg, or .jpeg'
        if (image3 && !(image3.endsWith('.png') || (image3.endsWith('.jpg') || (image3.endsWith('.jpeg'))))) errorArray.image3Validation = 'Image URL must end in .png, .jpg, or .jpeg'
        if (image4 && !(image4.endsWith('.png') || (image4.endsWith('.jpg') || (image4.endsWith('.jpeg'))))) errorArray.image4Validation = 'Image URL must end in .png, .jpg, or .jpeg'
        setErrors(errorArray);
    }, [country, address, city, state, description, name, price, previewImage, image1, image2, image3, image4])

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
        const imageResponses = [];
        imageResponses.push(previewImage);
        if (!(image1 === '')) { imageResponses.push(image1) }
        if (!(image2 === '')) { imageResponses.push(image2) }
        if (!(image3 === '')) { imageResponses.push(image3) }
        if (!(image4 === '')) { imageResponses.push(image4) }

        if (!Object.values(errors).length) {
            let createdSpot = await dispatch(createSpot(nonImageResponses, imageResponses))
            if (!createdSpot.errors) {
                history.push(`/spots/${createdSpot.id}`)
            }
            else {
                setResponseErrors(createdSpot.errors)
            }
        }
    }
    return (
        <div onSubmit={formSubmit} className='formDiv'>
            <form className='form'>
                <h1>Create a New Spot</h1>
                {submitted && (Object.values(responseErrors).length) ? <div>{Object.values(responseErrors)}</div> : null}
                <div className='formSubmissionDiv'>
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <div className="countryLabelandError">
                        <label>Country</label>
                        {submitted ? <div className='validationerror'>{errors.country}</div> : null}
                    </div>
                    <input
                        className='countryField'
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div >
                    <div className="streetAddressandError">
                        <label>Street Address</label>
                        {submitted ? <div className='validationerror'>{errors.address}</div> : null}
                    </div>
                    <input
                        className='addressField'
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="cityandStateDiv">
                    <div>
                        <div className="cityLabelandError">
                            <label>City</label>
                            {submitted ? <div className='validationerror'>{errors.city}</div> : null}
                        </div>
                        <input
                            className='cityField'
                            type="text"
                            name="city"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className='comma'>,</div>
                    <div>
                        <div className="stateLabelandError">
                            <label>State</label>
                            {submitted ? <div className='validationerror'>{errors.state}</div> : null}
                        </div>
                        <input
                            className='stateField'
                            type="text"
                            name="state"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                </div>
                <div className='lineDiv'></div>
                <div className='formSubmissionDiv'>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neigborhood.</p>
                    <textarea
                        className='descriptionField'
                        name="description"
                        value={description}
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        rows="6"
                        cols="50"
                    >
                    </textarea>
                    {submitted ? <div className='validationerror'>{errors.description}</div> : null}
                </div>
                <div className='lineDiv'></div>
                <div className='formSubmissionDiv'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        className='nameField'
                        type="text"
                        name="name"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {submitted ? <div className='validationerror'>{errors.name}</div> : null}
                </div>
                <div className='lineDiv'></div>
                <div className='formSubmissionDiv'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className='priceDiv'>
                        <div className='dollarSign'>$</div>
                        <input
                            className='priceField'
                            type="number"
                            min="0.01"
                            step="0.01"
                            name="price"
                            placeholder="Price per night (USD)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    {submitted ? <div className='validationerror'>{errors.price}</div> : null}
                </div>
                <div className='lineDiv'></div>
                <div>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div>
                        <input
                            className='imageField'
                            type='text'
                            name='previewImage'
                            placeholder='Preview Image URL'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        ></input>
                        {submitted ? <div className='validationerror'>{errors.previewImage}</div> : null}
                        {submitted ? <div className='validationerror'>{errors.previewImageValidation}</div> : null}
                        <input
                            className='imageField'
                            type='text'
                            name='image1'
                            placeholder='Image URL'
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                        ></input>
                        {submitted ? <div className='validationerror'>{errors.image1Validation}</div> : null}
                        <input
                            className='imageField'
                            type='text'
                            name='image2'
                            placeholder='Image URL'
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                        ></input>
                        {submitted ? <div className='validationerror'>{errors.image2Validation}</div> : null}

                        <input
                            className='imageField'
                            type='text'
                            name='image3'
                            placeholder='Image URL'
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                        ></input>
                        {submitted ? <div className='validationerror'>{errors.image3Validation}</div> : null}
                        <input
                            className='imageField'
                            type='text'
                            name='image4'
                            placeholder='Image URL'
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                        ></input>
                        {submitted ? <div className='validationerror'>{errors.image4Validation}</div> : null}

                    </div>
                </div>
                <div className='lineDiv'></div>
                <div className='createSpotButtonDiv'>
                    <button className="createSpotButton" type='submit'>Create Spot</button>
                </div>
            </form >
        </div >
    )
}

export default CreateSpot
