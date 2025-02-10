import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true }, // Save date as a string (ISO format)
  time: { type: String, required: true },
  status: { type: String, default: "upcoming" },
});

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
