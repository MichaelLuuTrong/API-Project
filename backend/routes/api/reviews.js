const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const review = require('../../db/models/review');

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

//Delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewToDelete = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (reviewToDelete) {
        if (req.user.dataValues.id === reviewToDelete.userId) {
            await reviewToDelete.destroy()
            return res.send({ message: "Successfully deleted" })
        } else {
            res.status(403).send({ message: "You are not the owner of that review!" })
        }
    } else {
        res.status(404).send({ message: "Review couldn't be found" })
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

//Add an image to a review based on the review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { user } = req
    const { url } = req.body
    const reviewToAddImageTo = await Review.findOne({
        where: { id: req.params.reviewId }
    });

    const imageCount = await ReviewImage.count({
        where: { reviewId: req.params.reviewId }
    });

    if (!reviewToAddImageTo) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (user.id !== reviewToAddImageTo.userId) {
        return res.status(403).json({ message: "You cannot add an image to someone else's review" })
    }

    if (imageCount >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
    }

    const newImageReview = await ReviewImage.create({
        url,
        reviewId: reviewToAddImageTo.id
    })

    return res.status(200).json({
        id: newImageReview.id,
        url: newImageReview.url
    })
})


module.exports = router;
