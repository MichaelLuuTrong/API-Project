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
            //this sets previewImage to null if there are no spot images
            userBooking.Spot.previewImage = null;
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
});

//Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    let { user } = req;
    let { startDate, endDate } = req.body;
    let booking = Booking.findOne({
        where: { id: req.params.bookingId }
    });

    if (!booking) {
        return res.status(400).json({ message: "Booking couldn't be found" })
    }

    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }

    const allBookings = await Booking.findAll({
        where: { spotId: booking.spotId }
    })

    allBookings.forEach(booking => {
        if (booking.startDate <= startDate || booking.endDate >= startDate) {
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    "startDate": "Start date conflicts with an existing booking",
                }
            })
        }
    })

    allBookings.forEach(booking => {
        if (booking.endDate <= endDate || booking.startDate <= endDate) {
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    })

    if (booking.endDate < new Date() || booking.startDate < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    }

    if (user.id === booking.userId) {
        if (startDate) { booking.startDate = new Date(startDate) };
        if (endDate) { booking.endDate = new Date(endDate) }
        await booking.save()
        return res.status(200).json(booking)
    } else {
        res.status(403).json({ message: "You cannot change someone else's booking" })
    }

})

//Delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { user } = req;
    const bookingToDelete = await Booking.findOne({
        where: { id: req.params.bookingId }
    })

    if (!bookingToDelete) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    if (bookingToDelete.startDate <= new Date()) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" })
    }

    if (bookingToDelete.userId === user.id) {
        await bookingToDelete.destroy();
        return res.status(200).json({ message: "Successfully deleted" })
    } else {
        return res.status(403).json({ message: "You cannot delete someone else's booking" })
    }
})


module.exports = router
