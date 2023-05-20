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

//Edit a booking ** FIX THIS
router.put('/:bookingId', requireAuth, async (req, res) => {
    let { user } = req;
    let { startDate, endDate } = req.body;
    let booking = await Booking.findOne({
        where: { id: req.params.bookingId }
    });

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }

    if (booking.endDate < new Date() || booking.startDate < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    }

    //get all bookings for the spot of the booking to be changed
    //EXCLUDING the booking currently being edited!
    const allBookings = await Booking.findAll({
        where: {
            [Op.and]: [
                { spotId: booking.spotId },
                { id: { [Op.ne]: req.params.bookingId } }
            ]
        }
    })

    //converted to for loops so that they would stop checking spots if the condition is filled once.
    for (let i = 0; i < allBookings.length; i++) {
        if (Date.parse(startDate) >= Date.parse(allBookings[i].startDate) && Date.parse(startDate) <= Date.parse(allBookings[i].endDate)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    "startDate": "Start date conflicts with an existing booking",
                }
            })
        }
    }

    for (let i = 0; i < allBookings.length; i++) {
        if (Date.parse(endDate) <= Date.parse(allBookings[i].endDate) && Date.parse(endDate) >= Date.parse(allBookings[i].startDate)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    }

    // allBookings.forEach(booking => {
    //     if (Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate)) {
    //         return res.status(403).json({
    //             message: "Sorry, this spot is already booked for the specified dates",
    //             errors: {
    //                 "startDate": "Start date conflicts with an existing booking",
    //             }
    //         })
    //     }
    // })
    // allBookings.forEach(booking => {
    //     if (Date.parse(endDate) <= Date.parse(booking.endDate) && Date.parse(endDate) >= Date.parse(booking.startDate)) {
    //         return res.status(403).json({
    //             message: "Sorry, this spot is already booked for the specified dates",
    //             errors: {
    //                 "endDate": "End date conflicts with an existing booking"
    //             }
    //         })
    //     }
    // })

    //if all other checks pass, make sure user is changing their own booking

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
