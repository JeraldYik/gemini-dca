import { DataTypes, ModelDefined } from "sequelize";

import { sequelize } from "../../../utils/setup";
import { startOfDay } from "date-fns";

type OrderAttributes = {
  createdForDay: Date;
  fiatDepositInSgd: number;
  pricePerCoinInSgd: number;
  coinAmount: number;
};

type OrderCreationAttributes = Omit<OrderAttributes, "createdForDay">;

export const Order: ModelDefined<OrderAttributes, OrderCreationAttributes> =
  sequelize.define("Order", {
    createdForDay: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
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
  });
