const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const review = require('../../db/models/review');

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req
    const imageToDelete = await ReviewImage.findOne({
        where: { id: req.params.imageId }
    })
    if (!imageToDelete) {
        return res.status(404).json({ message: "Review Image couldn't be found" })
    };

    const reviewWithImageToDelete = await Review.findOne({
        where: { id: imageToDelete.reviewId }
    })

    if (reviewWithImageToDelete.userId === user.id) {
        await imageToDelete.destroy();
        return res.status(200).json({ message: 'Successfully deleted' })
    } else {
        return res.status(403).json({
            message: "You cannot delete an image from someone else's review"
        })
    }
})


module.exports = router
