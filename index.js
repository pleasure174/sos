import express from "express";
import "dotenv/config";
import sequelize from "./src/config/db.js";
import userRoutes from "./src/routes/index.js";
import authRoutes from "./src/routes/auth.js";
import appointmentRoutes from "./src/routes/appointments.js";
import notificationRoutes from "./src/routes/notifications.js";
import doctorAvailabilityRoutes from "./src/routes/doctoravailability.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", notificationRoutes);
app.use("/api", doctorAvailabilityRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Your database is running");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
