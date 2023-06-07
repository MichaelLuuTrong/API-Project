import { useState, useEffect } from 'react'
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
    const [title, setTitle] = useState('')
    //
    const [price, setPrice] = useState('')
    //
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    //

    const formSubmit = async (e) => {
        e.preventDefault()
    }


    return (
        <div onSubmit={formSubmit} className='formDiv'>
            <form className='form'>
                <h1>Create a New Spot</h1>
                <div className='formSubmissionDiv'>
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <label>Country</label>
                        {/* error handler here */}
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
                        {/* error handler here */}
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
                        {/* error handler here */}
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
                        {/* error handler here */}
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
                    {/* error handler here */}
                </div>
                <div className='formSubmissionDiv'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type="text"
                        name="title"
                        placeholder="Name of your spot"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className='formSubmissionDiv'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <p>$</p>
                    <input
                        type="text"
                        name="price"
                        placeholder="Price per night (USD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {/* insert error handling here */}
                <div>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div>
                        <input
                            type='text'
                            name='previewImage'
                            placeholder='Preview Image URL'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        ></input>
                        {/* insert error handling here */}
                        <input
                            type='text'
                            name='image1'
                            placeholder='Image URL'
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                        ></input>
                        {/* insert error handling here */}

                        <input
                            type='text'
                            name='image2'
                            placeholder='Image URL'
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                        ></input>
                        {/* insert error handling here */}

                        <input
                            type='text'
                            name='image3'
                            placeholder='Image URL'
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                        ></input>
                        {/* insert error handling here */}

                        <input
                            type='text'
                            name='image4'
                            placeholder='Image URL'
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                        ></input>
                        {/* insert error handling here */}

                    </div>
                </div>
                <button type='submit'>Create Spot</button>
            </form >
        </div >
    )
}

export default CreateSpot
