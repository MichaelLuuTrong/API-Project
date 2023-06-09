'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'Cascade', hooks: true });
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'
      });
      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: 'spotId',
        otherKey: 'userId'
      });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'Cascade', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'Cascade', hooks: true })
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users'
      }
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
