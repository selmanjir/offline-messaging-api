'use strict';

const { Sequelize, Model } = require('sequelize');
const sequelize = require('../config/db');

  class participants extends Model {}
  
  participants.init({
    conversation_id: {
      type : Sequelize.INTEGER,
      references : {
        model : 'conversations',
        key : 'id'
      }
    },
    participant_user_id: {
      type : Sequelize.INTEGER,
      references : {
        model : 'users',
        key : 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'participants',
  });

module.exports = participants;