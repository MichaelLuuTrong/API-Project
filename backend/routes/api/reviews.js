const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

//Get all reviews of the current user

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let allReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['id', 'url', 'preview']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    let Reviews = []
    if (allReviews) {
        allReviews.forEach(review => {
            review = review.toJSON();
            (review.Spot.SpotImages).forEach(image => {
                if (image.preview === true) {
                    review.Spot.previewImage = image.url
                }
                delete review.Spot.SpotImages
            })
            Reviews.push(review)
        })
    };
    res.json({ Reviews })
})

module.exports = router;
