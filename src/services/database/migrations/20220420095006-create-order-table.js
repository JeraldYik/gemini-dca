"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Orders",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ticker: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdForDay: {
          type: Sequelize.DATE,
          allowNull: false,
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
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ["ticker", "createdForDay"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
