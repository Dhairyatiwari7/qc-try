import mongoose, { Schema, model, models } from "mongoose";

const DoctorSchema = new Schema({
  name: String,
  speciality: String,
  fees: Number,
  availability: String,
  rating: Number,
});

const Doctor = models.doctors || model("doctors", DoctorSchema);
export default Doctor;
