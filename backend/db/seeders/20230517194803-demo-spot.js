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
        address: 'S Sunset Ridge Dr',
        city: 'Telluride',
        state: 'Colorado',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Sunset Ridge',
        description: 'A gentle stream feeds into the placid pond surrounding this designer mountain estate with panoramic views. Admire the wild beauty of the West through glass walls. You’re minutes from the slopes, with the Alta Lakes a short drive further.',
        price: 4000,
      },
      {
        ownerId: 1,
        address: '443 Sail Walk',
        city: 'Fire Island',
        state: 'New York',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Pyramid House',
        description: 'A soaring ceiling and a wall of glass overlooking the dunes, the ocean and the bay. Beneath, the enormous master suite looks out to the dunes on one side and the pool deck on the other. Cooling ocean breezes flow day and night here.',
        price: 3400,
      },
      {
        ownerId: 2,
        address: '9393 Sierra Mar Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'The Angelano',
        description: 'This Hollywood Hills mansion features a view of the Los Angeles skyline. Glass doors aid the effortless transition between the modern interior and the outdoor living space. Sun beds surround the silky turquoise pool and bubbling hot tub. ',
        price: 2150,
      },
      {
        ownerId: 2,
        address: '360 Chalet',
        city: 'Big Sky',
        state: 'Montana',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Big Sky Chalet',
        description: 'The naturally rugged landscape of Big Sky, Montana surrounds this alpine escape. Sink into the bubbling hot tub to soothe sore muscles. Follow the heated walkway to the patio where sharp mountain peaks soar. ',
        price: 771,
      },
      {
        ownerId: 3,
        address: '255 Bay Point',
        city: 'Naples',
        state: 'Florida',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Moorings Villa',
        description: 'Soaring palm trees and a manicured garden lead the way to this Naples, Florida mansion. Views of the glistening bay stretch beyond the backyard. The elegant interior features sumptuous décor and an airy ambiance. ',
        price: 1640,
      },
      {
        ownerId: 3,
        address: '9982 Reevesbury Drive',
        city: 'Beverly Hills',
        state: 'California',
        country: 'United States',
        lat: 40.68315,
        lng: -73.9916,
        name: 'Beverly Hills Maison',
        description: 'Inspired by the French countryside, this Beverly Hills residence exudes the ideal mix of modernity and charm. Slip into the zero-edge pool whenever you need an instant refresh. Access to shopping, sights, and restaurants are mere minutes away by car.',
        price: 7224,
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
