import sequelize from "../../config/db.js";
import User from "./user.js";
import DoctorAvailability from "./doctoravailability.js";
import Notification from "./notification.js";
import Appointment from "./appointment.js";

const db = {
  User,
  Notification,
  Appointment,
  DoctorAvailability,
};

// Associations
db.User.hasMany(db.DoctorAvailability, {
  foreignKey: "doctorId",
  as: "availabilities",
});
db.DoctorAvailability.belongsTo(db.User, {
  foreignKey: "doctorId",
  as: "doctor",
});
db.User.hasMany(db.Notification, {
  foreignKey: "userId",
  as: "notifications",
});
db.Notification.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

// Appointment associations
db.User.hasMany(db.Appointment, {
  foreignKey: "patientId",
  as: "patientAppointments",
});
db.User.hasMany(db.Appointment, {
  foreignKey: "doctorId",
  as: "doctorAppointments",
});
db.Appointment.belongsTo(db.User, {
  foreignKey: "patientId",
  as: "patient",
});
db.Appointment.belongsTo(db.User, {
  foreignKey: "doctorId",
  as: "doctor",
});

export default db;
