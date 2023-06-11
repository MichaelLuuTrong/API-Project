'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 3,
        userId: 1,
        review: 'This place is great! The pool is unreal, I could sit in there all day. The views are amazing and I would love to stay here again. However, the air quality in the area is... not superb. ',
        stars: 4
      },
      {
        spotId: 5,
        userId: 1,
        review: 'This spot is in a great location and close to many hotspots. However, the owner has interesting taste in décor and it was a bit off-putting. I also never stayed in a place so close to the water before, so the noise from boats was unanticipated.',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Despite his unusual and honestly suspicious name, Demo is a great host. He is very kind, accommodating, and communicative. His spot is very well maintained and described as described. I would definitely recommend staying here!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 2,
        review: 'The place was exactly as described, but it is unbelievably cold there. It was beautiful, peaceful, and quiet. However, it should not be legal for it to be that cold anywhere on Earth. If you like the cold, this place is perfect, though.',
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: 'There is lots to do in LA, and this place makes everything only a few minutes drive away. Then, after all the walking and shopping, the pool, patio, living room, and bedrooms are great places to relax and recoup for the next day of adventures.',
        stars: 5
      },
      {
        spotId: 4,
        userId: 3,
        review: 'I love the cold. Everywhere should be this cold. This is a great spot for snowboarding and skiing with friends and family. It is very cozy and very affordable considering the amount of sheer area you get to use. Already thinking of coming back.',
        stars: 4
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
