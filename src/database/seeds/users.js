import User from "../models/user.js";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  const hashPassword = await bcrypt.hash("defaultPassword123", 10);
  const users = [
    {
      FullName: "SHEMA",
      email: "shema@gmail.com",
      phonenumber: "0788888888",
      gender: "male",
      role: "patient",
      status: "active",
      date_of_birth: "1990-01-01",
      location: "Kigali",
      emergency_contact: "0788888888",
      password: hashPassword,
    },

    {
      FullName: "ganza",
      email: "ganza@gmail.com",
      phonenumber: "0788888889",
      gender: "male",
      role: "patient",
      status: "active",
      date_of_birth: "1999-07-04",
      location: "Muhanga",
      emergency_contact: "0788288088",
      password: hashPassword,
    },

    {
      FullName: "Admin User",
      email: "admin@example.com",
      phonenumber: "0780000000",
      gender: "male",
      role: "admin",
      status: "active",
      date_of_birth: "1990-01-01",
      location: "Kigali",
      emergency_contact: "0780000000",
      password: hashPassword,
    },
  ];
  await User.bulkCreate(users, { ignoreDuplicates: true });
};
