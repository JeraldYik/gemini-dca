"use strict";

const { startOfDay } = require("date-fns");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      createdForDay: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true,
        defaultValue: startOfDay(new Date()),
      },
      fiatDepositInSgd: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pricePerCoinInSgd: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      coinAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
