import sequelize from "../../config/db.js";
import User from "./user.js";

const db={
    sequelize,
    User
}
export default db;