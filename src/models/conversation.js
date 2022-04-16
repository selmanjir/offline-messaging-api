'use strict';
const { Model } = require('sequelize');
const sequelize = require('../config/db');


  class conversation extends Model {}
  
  conversation.init({
  }, {
    sequelize,
    modelName: 'conversation',
  });


  module.exports = conversation;