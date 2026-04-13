import Appointment from "../database/models/appointment.js";
import User from "../database/models/user.js";
import Notification from "../database/models/notification.js";
import DoctorAvailability from "../database/models/doctoravailability.js";

export const requestAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId, appointmentDate, reason, notes } = req.body;

    if (!doctorId || !appointmentDate) {
      return res
        .status(400)
        .json({ message: "doctorId and appointmentDate are required" });
    }

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check availability
    const appointmentDateObj = new Date(appointmentDate);
    const dateStr = appointmentDateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = appointmentDateObj.toTimeString().split(" ")[0]; // HH:MM:SS

    const availability = await DoctorAvailability.findOne({
      where: {
        doctorId,
        availableDate: dateStr,
        startTime: { [require("sequelize").Op.lte]: timeStr },
        endTime: { [require("sequelize").Op.gte]: timeStr },
        isBooked: false,
      },
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "Doctor is not available at this time" });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      reason,
      notes,
      status: "scheduled",
    });

    // Optionally mark availability as booked
    // await availability.update({ isBooked: true });

    await Notification.create({
      userId: patientId,
      title: "Appointment requested",
      message: `Your appointment with Dr. ${doctor.FullName || "Doctor"} is requested for ${new Date(
        appointmentDate,
      ).toLocaleString()}.`,
      type: "appointment",
    });

    res.status(201).json({ message: "Appointment requested", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "admin") {
      appointments = await Appointment.findAll();
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.findAll({
        where: { doctorId: req.user.id },
      });
    } else {
      appointments = await Appointment.findAll({
        where: { patientId: req.user.id },
      });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(appointment.patientId) !== String(req.user.id) &&
      String(appointment.doctorId) !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this appointment" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(appointment.patientId) !== String(req.user.id) &&
      String(appointment.doctorId) !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await Notification.create({
      userId: appointment.patientId,
      title: "Appointment cancelled",
      message: `Your appointment scheduled for ${new Date(
        appointment.appointmentDate,
      ).toLocaleString()} has been cancelled.`,
      type: "appointment",
    });

    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
