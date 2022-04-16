'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../config/db');

  class block extends Model {}

  block.init({
    block_by: {
      type : Sequelize.INTEGER,
      references : {model : 'users', key : 'id'}
    },
    block_to: {
      type : Sequelize.INTEGER,
      references : {model : 'users', key : 'id'}
    },
    isActive: {
      type : Sequelize.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'block',
  });

  module.exports = block;