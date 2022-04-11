'use strict';
const User = require('./user');
const Conversation = require('./conversation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(Conversation, { through: message, foreignKey: 'user_id' });
      Conversation.belongsToMany(User, { through: message, foreignKey: 'conversation_id' });
    }
  }
  message.init({
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
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'message',
  });
  return message;
};