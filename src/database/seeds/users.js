import User from "../models/user.js";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  const hashPassword = await bcrypt.hash("defaultPassword123", 10);
  const users = [
    {
      fullname: "SHEMA",
      email: "shema@gmail.com",
      phonenumber: "0788888888",
      gender: "male",
      role: "patient",
      status: "active",
      data_of_birth: "1990-01-01",
      location: "Kigali",
      emergency_contact: "0788888888",
      password: hashPassword,
    },

    {
      fullname: "ganza",
      email: "ganza@gmail.com",
      phonenumber: "0788888889",
      gender: "male",
      role: "patient",
      status: "active",
      data_of_birth: "1999-07-04",
      location: "Muhanga",
      emergency_contact: "0788288088",
      password: hashPassword,
    },
  ];
  await User.bulkCreate(users);
};
