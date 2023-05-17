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
        spotId: 1,
        userId: 3,
        review: 'Very clean and well funished and stocked. Would return.',
        stars: 5
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Clean but not as much space as I expected.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'A lot smaller than expected and could have been cleaner. Good location though.',
        stars: 3
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
