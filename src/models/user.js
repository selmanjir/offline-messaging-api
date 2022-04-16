'use strict';
const {Sequelize, Model} = require('sequelize');
const sequelize = require('../config/db');

  class user extends Model {}
  
  user.init({
    username: {
      type : Sequelize.STRING
    },
    full_name: {
      type : Sequelize.STRING
    },
    email: {
      type : Sequelize.STRING
    },
    password: {
      type : Sequelize.STRING
    },
    isDeleted: {
      type : Sequelize.BOOLEAN
    },
    isActive: {
      type : Sequelize.BOOLEAN
    },
    createdAt: {
      type : Sequelize.DATE
    },
    updatedAt: {
      type : Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  module.exports = user;