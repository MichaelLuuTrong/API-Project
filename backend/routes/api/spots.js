const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Invalid name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['preview', 'url']
            },
            {
                model: Review,
                attributes: ['stars', 'userId']
            }
        ]
    });
    let Spots = [];
    allSpots.forEach(element => {
        Spots.push(element.toJSON())
    })

    Spots.forEach(spot => {
        let reviewCounter = 0
        let starsCounter = 0
        spot.Reviews.forEach(review => {
            // console.log(review)
            starsCounter += review.stars;
            reviewCounter++
        })
        let averageReview = (starsCounter / reviewCounter)
        // console.log(averageReview)
        spot.avgRating = averageReview;
        delete spot.Reviews
    })

    Spots.forEach(spot => {
        spot.SpotImages.forEach(image => {
            // console.log(element.preview);
            if (image.preview === true) {
                // console.log(element.url)
                spot.previewImage = image.url;
            } else spot.previewImage = null
        })
        delete spot.SpotImages
    })


    return res.json({ Spots })
})

router.post('/', validateSpot, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = req.body;
    const ownerId = req.user.dataValues.id;
    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201)
    return res.json(newSpot)
})

router.put('/:spotId', validateSpot, requireAuth, async (req, res) => {
    const spotToChange = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });
    if (req.user.dataValues.id === spotToChange.ownerId) {
        if (spotToChange) {
            await spotToChange.update({
                id: req.params.spotId,
                ownerId: req.user.dataValues.id,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                lat: req.body.lat,
                lng: req.body.lng,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                createdAt: req.body.createdAt,
                updatedAt: Date.now()

            })
            return res.json(spotToChange)
        } else {
            res.status(404).send({ message: "Spot couldn't be found" })
        }
    } else {
        res.status(404).send({ message: "You are not the owner of that spot!" })
    }
})


module.exports = router;
