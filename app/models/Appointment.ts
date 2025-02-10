import mongoose, { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  userId: String,
  date: Date,
  time: String,
  status: String,
});

const Appointment = models.Appointment || model("Appointment", AppointmentSchema);
export default Appointment;
