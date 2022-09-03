import { DataTypes, Model, ModelDefined } from "sequelize";

import { elephantSqlSequelize } from "../../../setup/database";
import { startOfDay } from "date-fns";

export type OrderAttributes = {
  ticker: string;
  createdForDay: Date;
  fiatDepositInSgd: number;
  pricePerCoinInSgd: number;
  coinAmount: number;
};

export type OrderModel = Model<OrderAttributes, OrderAttributes>;

type OrderModelDefined = ModelDefined<OrderAttributes, OrderAttributes>;

const Order: OrderModelDefined = elephantSqlSequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ticker: {
      type: DataTypes.STRING, // could've been an enum, however there's no need for a migration in order to support future tickers
      allowNull: false,
    },
    createdForDay: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: startOfDay(new Date()),
    },
    fiatDepositInSgd: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pricePerCoinInSgd: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    coinAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["ticker", "createdForDay"],
      },
    ],
  }
);

export default Order;
