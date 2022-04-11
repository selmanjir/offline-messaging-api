'use strict';
const User = require('./user');
const Conversation = require('./conversation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class participants extends Model {

    static associate(models) {
      User.belongsToMany(Conversation, { through: participants, foreignKey: 'user_id' });
      Conversation.belongsToMany(User, { through: participants, foreignKey: 'conversation_id' });
    }
  
  }
  
  participants.init({
    conversation_id: {
      DataTypes : INTEGER,
      references : {
        model : 'conversations',
        key : 'id'
      }
    },
    user_id: {
      DataTypes : INTEGER,
      references : {
        model : 'users',
        key : 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'participants',
  });
  return participants;
};