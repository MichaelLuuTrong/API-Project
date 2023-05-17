'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://photos.zillowstatic.com/fp/ec614a08ba4b273e7f08083cb3d757ea-uncropped_scaled_within_1536_1152.webp'
      },
      {
        reviewId: 2,
        url: 'https://photos.zillowstatic.com/fp/1cebced06d0399af7232f79e8d9d21da-uncropped_scaled_within_1536_1152.webp'
      },
      {
        reviewId: 3,
        url: 'https://photos.zillowstatic.com/fp/ace1699e82a5d803cc5cbce1977a0a91-uncropped_scaled_within_1536_1152.webp'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
