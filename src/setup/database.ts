import { dbHost, dbName, dbPassword, dbUsername } from "../utils/config";

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  database: dbName,
  username: dbUsername,
  password: dbPassword,
  host: dbHost,
  dialect: "postgres",
  timezone: "+08:00",
});
