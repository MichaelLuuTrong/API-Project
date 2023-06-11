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
        url: 'https://photos.zillowstatic.com/fp/abd81d606eeedd9fc24481f74514aba6-cc_ft_1536.webp',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://photos.zillowstatic.com/fp/e66d224d531fc49f8fd2b4dff41b0f78-uncropped_scaled_within_1536_1152.webp',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://photos.zillowstatic.com/fp/380087641f08c31b11564d886408951d-cc_ft_384.webp',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/b4db5900-b90e-4cc3-b12b-6d17953d0079.jpg',
        preview: true
      }
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
