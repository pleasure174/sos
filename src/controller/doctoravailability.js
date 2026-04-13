import DoctorAvailability from "../database/models/doctoravailability.js";
import User from "../database/models/user.js";

export const createAvailability = async (req, res) => {
  try {
    const { availableDate, startTime, endTime } = req.body;
    const doctorId = req.user.id;

    // Check if user is a doctor
    if (req.user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can set availability" });
    }

    const availability = await DoctorAvailability.create({
      doctorId,
      availableDate,
      startTime,
      endTime,
    });

    res.status(201).json({ message: "Availability created", availability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailabilities = async (req, res) => {
  try {
    let availabilities;
    if (req.user.role === "doctor") {
      availabilities = await DoctorAvailability.findAll({
        where: { doctorId: req.user.id },
      });
    } else {
      // Patients can view all availabilities or filter by doctor
      const { doctorId } = req.query;
      const where = doctorId ? { doctorId } : {};
      availabilities = await DoctorAvailability.findAll({ where });
    }
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    if (String(availability.doctorId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this availability" });
    }
    const { availableDate, startTime, endTime } = req.body;
    await availability.update({ availableDate, startTime, endTime });
    res.status(200).json({ message: "Availability updated", availability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    if (String(availability.doctorId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this availability" });
    }
    await availability.destroy();
    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
