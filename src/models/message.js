'use strict';
const {Sequelize, Model} = require('sequelize');
const sequelize = require('../config/db');

  class message extends Model {}
  
  message.init({
    conversation_id: {
      type : Sequelize.INTEGER,
      references : {
        model : 'conversations',
        key : 'id'
      }
    },
    user_id: {
      type : Sequelize.INTEGER,
      references : {
        model : 'users',
        key : 'id'
      }
    },
    text: Sequelize.TEXT,
  }, {
    sequelize,
    modelName: 'message',
  });
  

  module.exports = message;