import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./user.js";

class DoctorAvailability extends Model {}

DoctorAvailability.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Assuming the table name is 'Users'
        key: 'id',
      },
    },
    availableDate: {
      type: DataTypes.DATEONLY, // DATEONLY for date without time
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DoctorAvailability",
  }
);

// Associations
DoctorAvailability.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

export default DoctorAvailability;
