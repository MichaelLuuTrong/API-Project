'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-08')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023-06-02'),
        endDate: new Date('2023-06-09')
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2023-06-03'),
        endDate: new Date('2023-06-10')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
