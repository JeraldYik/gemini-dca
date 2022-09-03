import {
  elephantSqlDbHost,
  elephantSqlDbName,
  elephantSqlDbPassword,
  elephantSqlDbUsername,
  herokuDbHost,
  herokuDbName,
  herokuDbPassword,
  herokuDbUsername,
} from "../utils/config";

import { Sequelize } from "sequelize";

export const herokuSequelize = new Sequelize({
  database: herokuDbName,
  username: herokuDbUsername,
  password: herokuDbPassword,
  host: herokuDbHost,
  dialect: "postgres",
  timezone: "+08:00",
});

export const elephantSqlSequelize = new Sequelize({
  database: elephantSqlDbName,
  username: elephantSqlDbUsername,
  password: elephantSqlDbPassword,
  host: elephantSqlDbHost,
  dialect: "postgres",
  timezone: "+08:00",
});
