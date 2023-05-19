const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

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

//Edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;

    const reviewToEdit = await Review.findOne({
        where: { id: req.params.reviewId }
    })

    if (!reviewToEdit) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (reviewToEdit.userId !== user.id) {
        return res.status(403).json({ message: "You cannot edit someone else's review" })
    }

    if (reviewToEdit.userId === user.id) {
        if (review) { reviewToEdit.review = review };
        if (review) { reviewToEdit.stars = stars };
        await reviewToEdit.save();
        return res.status(200).json(reviewToEdit)
    }
})





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
