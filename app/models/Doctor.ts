import mongoose, { Schema, model, models } from "mongoose";

const DoctorSchema = new Schema({
  name: String,
  username: String,
  pass: String,
  speciality: String,
  fees: Number,
  availability: String,
  rating: Number,
  image: String,
});

const Doctor = models.doctors || model("doctors", DoctorSchema);
export default Doctor;
