'use strict';
const User = require('./user');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      block.belongsTo(User, { foreignKey: 'block_by',});
      block.belongsTo(User, { foreignKey: 'block_to',});
    }
  }
  block.init({
    block_by: {
      DataTypes : INTEGER,
      references : {model : 'users', key : 'id'}
    },
    block_to: {
      DataTypes : INTEGER,
      references : {model : 'users', key : 'id'}
    },
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'block',
  });
  return block;
};