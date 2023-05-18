const express = require('express')
const router = express.Router();
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models')


router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['preview', 'url']
            },
            {
                model: Review,
                attributes: ['stars']
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
            // console.log(review.stars)
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


module.exports = router;
