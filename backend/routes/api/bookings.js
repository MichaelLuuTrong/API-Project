const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const review = require('../../db/models/review');

//Get all of the current user's bookings//
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let userBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['id', 'url', 'preview']
                    }
                ]
            }
        ]
    });
    let Bookings = [];

    if (userBookings) {
        (userBookings).forEach(userBooking => {
            userBooking = userBooking.toJSON();
            (userBooking.Spot.SpotImages).forEach(image => {
                if (image.preview === true) {
                    userBooking.Spot.previewImage = image.url;
                } else {
                    userBooking.Spot.previewImage = null
                }
            })
            delete userBooking.Spot.SpotImages;
            Bookings.push(userBooking)
        })
    }
    res.json({ Bookings })
})



module.exports = router
