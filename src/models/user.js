'use strict';
const { Model , DataTypes} = require('sequelize');
const sequelize = require('../config/db');

  class user extends Model {}
  
  user.init({
    username: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user',
  });

  module.exports = user;