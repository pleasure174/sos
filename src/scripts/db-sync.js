import sequelize from "../config/db.js";
import User from "../database/models/user.js";
import "../database/index.js";
import { createUserTable } from "../database/migration/user.js";
import { seedUsers } from "../database/seeds/users.js";

const syncDatabase = async () => {
  try {
    console.log("Systarting database");
    await sequelize.authenticate();
    console.log("Database connection established successfully");
    await createUserTable();
    await sequelize.sync({ alter: true, logging: false });
    await seedUsers();
    console.log("Database synced successfully");
    process.exit(0);
  } catch (error) {
    console.error("error syncing database:", error);
    process.exit(1);
  }
};
syncDatabase();
