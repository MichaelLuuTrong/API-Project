'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '89 Douglass St',
        city: 'Brooklyn',
        state: 'New York',
        country: 'The United States of America',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Cozy Condo',
        description: 'A cozy condo with outdoor seating area and modern furnishings.',
        price: 512.15,
      },
      {
        ownerId: 2,
        address: '2687 Bryant St',
        city: 'San Francisco',
        state: 'California',
        country: 'The United States of America',
        lat: 37.751450,
        lng: -122.408700,
        name: 'Fancy Family Home',
        description: 'A family home close to the Chase Center, Oracle Park, and Whole Foods',
        price: 339.21,
      },
      {
        ownerId: 3,
        address: '1412 Mussett St',
        city: 'Austin',
        state: 'Texas',
        country: 'The United States of America',
        lat: 30.373710,
        lng: -97.661340,
        name: 'Happy House',
        description: 'A colorful home with happy vibes',
        price: 189.89,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['89 Douglass St', '2687 Bryant St', '1412 Mussett St'] }
    }, {});
  }
};
