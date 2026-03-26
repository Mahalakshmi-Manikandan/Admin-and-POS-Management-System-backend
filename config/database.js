import { Sequelize } from "sequelize";
import "dotenv/config";

/* =======================================================
      MAIN AUTH DATABASE
======================================================= */
export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

/* =======================================================
      POS DATABASE
======================================================= */
export const posDB = new Sequelize(
  process.env.POS_DATABASE_NAME,
  process.env.POS_DATABASE_USER,
  process.env.POS_DATABASE_PASS,
  {
    host: process.env.POS_DATABASE_HOST,
    port: process.env.POS_DATABASE_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

/* =======================================================
      DATABASE AUTHENTICATION
======================================================= */
export async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Main DB connected successfully");

    await posDB.authenticate();
    console.log("POS DB connected successfully");
  } catch (err) {
    console.error("Database Connection Error:", err);
    throw err;
  }
}

/* =======================================================
      SYNC DATABASES (IMPORT MODELS FIRST)
======================================================= */
export async function sync(options = {}) {
  try {
   

    await sequelize.sync(options);
    console.log("Main DB synced successfully");

    await posDB.sync(options);
    console.log("POS DB synced successfully");
  } catch (err) {
    console.error("Database sync error:", err);
    throw err;
  }
}