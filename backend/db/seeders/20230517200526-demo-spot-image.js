'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {


  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.imgur.com/GFUDvDr.png',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/c6iDwod.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/hciUkFY.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/MrLB0PZ.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/HYYtYpj.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/ZjnNW1X.png',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/VoyHCbP.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/SlpKaMn.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/XL994zZ.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/hwKq7Vt.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/CAbnTTd.png',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/gDVVP4O.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/G1K2Pi6.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/EB5Qhdi.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/2aMrxhI.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/AnHBuHO.png',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/rQbqYLQ.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/jo7t08R.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/qKEoYDn.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/QXLk4ut.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/chIPdL4.png',
        preview: true,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/b7CGrFg.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/UaPg5JV.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/bzcdV9f.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/KbwZgA3.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/1s3yEmX.png',
        preview: true,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/io4F9q9.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/wyjN6nj.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/h52P344.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/TPDrZs4.png',
        preview: false,
      },


    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://photos.zillowstatic.com/fp/abd81d606eeedd9fc24481f74514aba6-cc_ft_1536.webp', 'https://photos.zillowstatic.com/fp/e66d224d531fc49f8fd2b4dff41b0f78-uncropped_scaled_within_1536_1152.webp', 'https://photos.zillowstatic.com/fp/380087641f08c31b11564d886408951d-cc_ft_384.webp'] }
    }, {});
  }
};
