const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
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
        .notEmpty()
        .withMessage('Invalid name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsey: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

const validateFilters = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1"),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid.'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid.'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid.'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid.'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

//Get all Spots owned by the Current User//
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

//Get all Bookings for a Spot based on the Spot's id//
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const spotToSeeBookings = await Spot.findOne({
        where: {
            id: req.params.spotId,
        }
    });

    if (!spotToSeeBookings) {
        return res.status(404).json(
            { message: "Spot couldn't be found" }
        )
    }

    let Bookings = await Booking.findAll({
        where: { spotId: spotToSeeBookings.id },
        attributes: ['spotId', 'startDate', 'endDate']
    })

    //if user owns the spot, reassign Bookings to give more information
    if (user.id === spotToSeeBookings.ownerId) {
        let Bookings = await Booking.findAll({
            where: { spotId: spotToSeeBookings.id },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
        return res.status(200).json({ Bookings })
    }
    return res.status(200).json({ Bookings })
});

//Get details of a Spot from an id//
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

//Get all Spots ** FIX THIS
router.get('/', validateFilters, async (req, res) => {
    // const allSpots = await Spot.findAll({
    //     include: [
    //         {
    //             model: SpotImage,
    //             attributes: ['preview', 'url']
    //         },
    //         {
    //             model: Review,
    //             attributes: ['stars', 'userId']
    //         }
    //     ]
    // });
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    const pagination = {
        where: {}
    }

    if (!page || page > 10) { page = 1 };
    if (!size || size > 20) { size = 20 };

    parsedPage = parseInt(page);
    parsedSize = parseInt(size);

    pagination.limit = parsedSize;
    pagination.offet = (size * (page - 1));

    if (minLat) pagination.where.lat = { [Op.gte]: minLat };
    if (minLng) pagination.where.lng = { [Op.gte]: minLng };
    if (maxLat) pagination.where.lat = { [Op.lte]: maxLat };
    if (maxLng) pagination.where.lng = { [Op.lte]: maxLng };
    if (minPrice) pagination.where.price = { [Op.gte]: minPrice };
    if (maxPrice) pagination.where.price = { [Op.lte]: maxPrice };
    if (minPrice && maxPrice) pagination.where.price = { [Op.between]: [minPrice, maxPrice] }

    const allSpots = await Spot.findAll({
        ...pagination
    })

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

//Create a Booking for a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body
    const spotToBook = await Spot.findOne({
        where: {
            id: req.params.spotId,
        }
    });

    //check if spotToBook exists
    if (!spotToBook) {
        return res.status(404).send({ message: "Spot couldn't be found" })
    };

    const conflictingBookingStartDate = await Booking.findOne({
        where: {
            spotId: spotToBook.id,
            startDate: { [Op.between]: [startDate, endDate] }
        }
    });

    const conflictingBookingEndDate = await Booking.findOne({
        where: {
            spotId: spotToBook.id,
            endDate: { [Op.between]: [startDate, endDate] }
        }
    });

    //check if startDate conflicts
    if (conflictingBookingStartDate) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking"
            }
        })
    };

    //check if endDate conflicts
    if (conflictingBookingEndDate) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                endDate: "End date conflicts with an existing booking"
            }
        })
    };

    //check if endDate on or before startDate
    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    };

    //check if user owns the spot
    if (user.id === spotToBook.ownerId) {
        return res.status(403).json({
            message: "User cannot book a spot they own"
        })
    }

    //if all checks complete, create the booking
    const newBooking = await Booking.create({
        userId: user.id,
        spotId: spotToBook.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    })

    return res.json(newBooking)

})



//Create a Review for a Spot based on the Spot's id//
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

//Get all Reviews by a Spot's id//
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
    if (Reviews.length === 0) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else return res.json({ Reviews })

})

//Add an Image to a Spot based on the Spot's id//
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

//Create a Spot//
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

//Edit a Spot//
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

//Delete a Spot//
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
