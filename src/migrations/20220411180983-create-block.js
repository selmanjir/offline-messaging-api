'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      block_by: {
        type: Sequelize.INTEGER,
        references : { model: 'users', key : 'id'}
      },
      block_to: {
        type: Sequelize.INTEGER,
        referances : { model: 'users', key : 'id'}
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blocks');
  }
};