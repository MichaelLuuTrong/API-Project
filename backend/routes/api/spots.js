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

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Star rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/current', requireAuth, async (req, res) => {
    const currentUserSpots = await Spot.findAll({
        where: { ownerId: req.user.dataValues.id },
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
    })
    let Spots = [];
    currentUserSpots.forEach(element => {
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
    Spots.forEach(spot => {
        if (!spot.previewImage) {
            spot.previewImage = null
        }
    })

    return res.json({ Spots })
})

router.get('/:spotId', async (req, res) => {
    const foundSpot = await Spot.findOne({
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            { model: User },
            { model: Review }
        ],
        where: {
            id: req.params.spotId
        }
    })
    // console.log(foundSpot)
    if (foundSpot) {
        let JSONSpot = foundSpot.toJSON()
        console.log(JSONSpot)
        //REVIEW NUMBER AND AVERAGE
        const reviewsArray = JSONSpot.Reviews;
        let starTotal = 0;
        let reviewTotal = 0;
        reviewsArray.forEach(review => {
            starTotal += review.stars;
            reviewTotal++
        })
        let averageStars = (starTotal / reviewTotal);
        JSONSpot.numReviews = reviewTotal;
        JSONSpot.avgStarRating = averageStars;
        delete JSONSpot.Reviews;

        //OWNER INFO
        JSONSpot.Owner = {
            id: JSONSpot.User.id,
            firstName: JSONSpot.User.firstName,
            lastName: JSONSpot.User.lastName,
        };
        delete JSONSpot.User;

        res.json(JSONSpot)
    } else {
        res.status(404).send({ message: "Spot couldn't be found" })
    }
})

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

router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res) => {
    const spotToAddReviewTo = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });
    //check if review already exists from this user//
    const allReviewsForThisSpot = await Review.findAll({
        where: {
            userId: req.user.dataValues.id
        }
    })
    for (let i = 0; i < allReviewsForThisSpot.length; i++) {
        if (allReviewsForThisSpot[i].dataValues.spotId == req.params.spotId) {
            return res.status(403).send({ message: "User already has a review for this spot" });
        }
    }
    //if review doesn't already exist, proceed
    if (spotToAddReviewTo) {
        const newReview = await Review.create(
            {
                spotId: req.params.spotId,
                userId: req.user.dataValues.id,
                review: req.body.review,
                stars: req.body.stars
            })
        let responseBody = {
            id: newReview.id,
            userId: newReview.userId,
            review: newReview.review,
            stars: newReview.stars,
            createdAt: newReview.createdAt,
            updatedAt: newReview.createdAt,
        }
        console.log(responseBody)
        return res.json(responseBody)
    } else {
        res.status(404).send({ message: "Spot couldn't be found" })
    }
})

router.get('/:spotId/reviews', async (req, res) => {
    const Reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }

        ]
    })
    return res.json({ Reviews })


})

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotToAddImageTo = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });
    if (spotToAddImageTo) {
        if (req.user.dataValues.id === spotToAddImageTo.ownerId) {
            const newSpotImage = await SpotImage.create(
                {
                    spotId: req.params.spotId,
                    url: req.body.url,
                    preview: req.body.preview
                })
            let responseBody = {
                id: newSpotImage.id,
                url: newSpotImage.url,
                preview: newSpotImage.preview
            }
            return res.json(responseBody)
        } else {
            res.status(403).send({ message: "You are not the owner of that spot!" })
        }
    } else {
        res.status(404).send({ message: "Spot couldn't be found" })
    }
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
    if (spotToChange) {
        if (req.user.dataValues.id === spotToChange.ownerId) {
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
            res.status(403).send({ message: "You are not the owner of that spot!" })

        }
    } else {
        res.status(404).send({ message: "Spot couldn't be found" })
    }
})

router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotToDelete = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (spotToDelete) {
        if (req.user.dataValues.id === spotToDelete.ownerId) {
            await spotToDelete.destroy()
            return res.send({ message: "Successfully deleted" })
        } else {
            res.status(403).send({ message: "You are not the owner of that spot!" })
        }
    } else {
        res.status(404).send({ message: "Spot couldn't be found" })
    }
})


module.exports = router;
