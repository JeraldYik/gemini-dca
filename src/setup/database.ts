import {
  elephantSqlDbHost,
  elephantSqlDbName,
  elephantSqlDbPassword,
  elephantSqlDbUsername,
} from "../utils/config";

import { Sequelize } from "sequelize";

export const elephantSqlSequelize = new Sequelize({
  database: elephantSqlDbName,
  username: elephantSqlDbUsername,
  password: elephantSqlDbPassword,
  host: elephantSqlDbHost,
  dialect: "postgres",
  timezone: "+08:00",
});
